import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { Readable } from "node:stream";
import type { ReadableStream as WebReadableStream } from "node:stream/web";
import { todaySP } from "./cadence";
import { ACCOUNTANT_THRESHOLD, type NewProspect } from "./db";
import { isChain, isMobile, toBrazilianPhone } from "./maps";
import type { Niche } from "./niches";

/**
 * Dados abertos de CNPJ da Receita Federal, publicados mensalmente num
 * compartilhamento público do SERPRO (Nextcloud). Os arquivos são lidos em
 * streaming: baixa, descompacta e filtra linha a linha, sem gravar o zip.
 * Layout dos campos: https://www.gov.br/receitafederal/dados/cnpj-metadados.pdf
 */
const SHARE_TOKEN = "YggdBLfdninEJX9";
const WEBDAV = "https://arquivos.receitafederal.gov.br/public.php/webdav";
const AUTH = `Basic ${Buffer.from(`${SHARE_TOKEN}:`).toString("base64")}`;

/** Pasta mais recente publicada (formato AAAA-MM). */
export async function latestMonth() {
  const response = await fetch(`${WEBDAV}/`, {
    method: "PROPFIND",
    headers: { Authorization: AUTH, Depth: "1" },
  });
  if (!response.ok) throw new Error(`Receita respondeu ${response.status} ao listar as pastas.`);
  const months = [...(await response.text()).matchAll(/webdav\/(\d{4}-\d{2})\//g)].map((m) => m[1]);
  if (months.length === 0) throw new Error("Nenhuma pasta mensal encontrada no compartilhamento.");
  return months.sort().at(-1)!;
}

/** Lê um CSV de dentro de um zip remoto, entregando cada linha já separada em campos. */
export async function streamZipCsv(month: string, file: string, onRow: (fields: string[]) => void) {
  const response = await fetch(`${WEBDAV}/${month}/${file}`, { headers: { Authorization: AUTH } });
  if (!response.ok || !response.body) {
    throw new Error(`Receita respondeu ${response.status} para ${file}.`);
  }

  // bsdtar (nativo no macOS) descompacta zip lendo da entrada padrão.
  const unzip = spawn("bsdtar", ["-xOf", "-"], { stdio: ["pipe", "pipe", "pipe"] });
  const finished = new Promise<void>((resolve, reject) => {
    unzip.on("error", reject);
    unzip.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`Falha ao descompactar ${file} (código ${code}).`)),
    );
  });
  Readable.fromWeb(response.body as unknown as WebReadableStream).pipe(unzip.stdin);

  // Os arquivos da Receita são ISO-8859-1 (latin1).
  unzip.stdout.setEncoding("latin1");
  const lines = createInterface({ input: unzip.stdout, crlfDelay: Infinity });
  for await (const line of lines) {
    if (line) onRow(line.slice(1, -1).split('";"'));
  }
  await finished;
}

/** Tabela de municípios: código da Receita → nome. */
export async function loadMunicipalities(month: string) {
  const map = new Map<string, string>();
  await streamZipCsv(month, "Municipios.zip", ([code, name]) => map.set(code, name));
  return map;
}

// Posições dos campos em Estabelecimentos*.csv (metadados da Receita).
const F = {
  basic: 0,
  order: 1,
  dv: 2,
  headOffice: 3,
  tradeName: 4,
  status: 5,
  openedAt: 10,
  cnae: 11,
  streetType: 13,
  street: 14,
  number: 15,
  district: 17,
  uf: 19,
  city: 20,
  ddd1: 21,
  phone1: 22,
  ddd2: 23,
  phone2: 24,
} as const;

export type CnpjReject = "fora do filtro" | "rede/franquia" | "sem telefone";

export type CnpjContext = {
  /** CNAE → nicho do combo. */
  cnaes: Map<string, Niche>;
  /** Código do município → nome, só das cidades escolhidas. */
  cities: Map<string, string>;
  /** "NOME/UF" aceitos: há cidades homônimas em estados diferentes. */
  pairs: Set<string>;
  /** Data mínima de abertura (AAAAMMDD). */
  since: string;
};

const pad = (value: string) => value.trim();

/**
 * Telefones de qualquer empresa ativa aberta no período (todo o Brasil,
 * qualquer atividade): base para contar números compartilhados.
 */
export function recentPhones(f: string[], since: string) {
  if (f[F.openedAt] < since || Number(f[F.status]) !== 2) return [];
  const phones = [phoneFrom(f[F.ddd1], f[F.phone1]), phoneFrom(f[F.ddd2], f[F.phone2])];
  return [...new Set(phones.filter((p): p is string => Boolean(p)))];
}

function phoneFrom(ddd: string, number: string) {
  return toBrazilianPhone(`${ddd}${number}`.replace(/\D/g, "").replace(/^0+/, ""));
}

const title = (value: string) =>
  value
    .toLowerCase()
    .replace(/(^|[\s/-])(\p{L})/gu, (_, sep, letter) => sep + letter.toUpperCase());

/**
 * Filtro rápido e montagem do prospect. A ordem dos testes começa pelos mais
 * baratos, porque roda em dezenas de milhões de linhas.
 */
export function toCnpjProspect(
  f: string[],
  ctx: CnpjContext,
): { prospect: NewProspect; tradeName: boolean } | { rejected: CnpjReject } {
  if (f[F.openedAt] < ctx.since || Number(f[F.status]) !== 2) return { rejected: "fora do filtro" };
  const niche = ctx.cnaes.get(f[F.cnae]);
  const cityName = niche && ctx.cities.get(f[F.city]);
  if (!niche || !cityName || !ctx.pairs.has(`${cityName}/${f[F.uf]}`)) {
    return { rejected: "fora do filtro" };
  }

  const tradeName = pad(f[F.tradeName]);
  if (tradeName && isChain(tradeName)) return { rejected: "rede/franquia" };

  // Prefere celular (WhatsApp provável) entre os dois telefones cadastrados.
  const phones = [phoneFrom(f[F.ddd1], f[F.phone1]), phoneFrom(f[F.ddd2], f[F.phone2])].filter(
    (p): p is string => Boolean(p),
  );
  const phone = phones.find(isMobile) ?? phones[0];
  if (!phone) return { rejected: "sem telefone" };

  const cnpj = `${f[F.basic]}${f[F.order]}${f[F.dv]}`;
  const opened = f[F.openedAt];
  const openedAt = `${opened.slice(0, 4)}-${opened.slice(4, 6)}-${opened.slice(6, 8)}`;
  const street = [pad(f[F.streetType]), pad(f[F.street])].filter(Boolean).join(" ");
  const city = title(cityName);
  // O telefone compartilhado é conferido depois, quando todos os arquivos forem lidos.
  const { score, reasons } = scoreNewCompany({
    openedAt,
    phone,
    niche,
    tradeName: !!tradeName,
    sharedPhone: 0,
  });

  return {
    tradeName: !!tradeName,
    prospect: {
      source: "cnpj",
      externalId: `cnpj:${cnpj}`,
      // Sem nome fantasia, o script decide (a razão social de MEI não é usada).
      name: tradeName ? title(tradeName) : "",
      niche: niche.id,
      category: null,
      phone,
      website: null,
      address: street ? title(`${street}, ${pad(f[F.number])}`) : null,
      neighborhood: pad(f[F.district]) ? title(pad(f[F.district])) : null,
      city,
      state: f[F.uf],
      visitable: cityName === "SAO PAULO" && f[F.uf] === "SP",
      rating: null,
      reviews: null,
      openedAt,
      mapsUrl: null,
      score,
      scoreReasons: reasons,
      sharedPhone: 0,
    },
  };
}

/**
 * Score de empresas recém-abertas (0 a 90): quanto mais nova, melhor o momento
 * (até 45), contato por celular (20, zero se o número é de contador), nicho
 * (até 15) e nome fantasia, sinal de marca própria (10).
 */
export function scoreNewCompany(input: {
  openedAt: string;
  phone: string | null;
  niche: Niche;
  tradeName: boolean;
  /** Em quantas empresas novas o telefone aparece (0 = não conferido). */
  sharedPhone: number;
}) {
  const reasons: string[] = [];
  let score = 0;
  const add = (points: number, reason: string) => {
    score += points;
    reasons.push(`${reason} (+${points})`);
  };

  const days = Math.max(
    0,
    Math.round((Date.parse(todaySP()) - Date.parse(input.openedAt)) / 86_400_000),
  );
  add(
    days <= 7 ? 45 : days <= 15 ? 40 : days <= 30 ? 30 : days <= 45 ? 20 : 12,
    `aberta há ${days} dias`,
  );
  if (input.sharedPhone >= ACCOUNTANT_THRESHOLD) {
    // Provavelmente é da contabilidade: não conta como contato direto.
    add(0, `telefone em ${input.sharedPhone} empresas novas, provável contador`);
  } else if (input.phone) {
    add(isMobile(input.phone) ? 20 : 8, isMobile(input.phone) ? "celular" : "telefone fixo");
  }
  add(Math.round(input.niche.weight * 1.5), `nicho ${input.niche.label}`);
  if (input.tradeName) add(10, "tem nome fantasia");
  return { score, reasons: reasons.join(" · ") };
}
