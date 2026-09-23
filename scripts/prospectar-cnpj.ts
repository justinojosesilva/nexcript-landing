/**
 * Coleta empresas recém-abertas nos dados abertos de CNPJ da Receita Federal
 * e grava na prospecção (origem "cnpj"). Lê os arquivos em streaming: cerca
 * de 5,4 GB passam pela rede por mês, mas nada é gravado em disco.
 *
 *   pnpm prospectar:cnpj
 *   pnpm prospectar:cnpj --dias 30 --nicho odontologia
 *   pnpm prospectar:cnpj --cidades "SAO PAULO/SP" --arquivos 1 --simular
 *
 * Opções:
 *   --mes        pasta da Receita (AAAA-MM); padrão: a mais recente
 *   --dias       abertas nos últimos N dias (padrão 60)
 *   --nicho      id do nicho ou "todos" (padrão)
 *   --cidades    "grandes" (padrão: São Paulo, capitais e grandes cidades)
 *                ou lista "NOME/UF" separada por vírgula, como na Receita
 *   --arquivos   quais Estabelecimentos ler, ex.: "0-9" (padrão) ou "1,2"
 *   --paralelo   arquivos baixados ao mesmo tempo (padrão 3)
 *   --incluir-sem-nome  grava também empresas sem nome fantasia (quase sempre MEI,
 *                cuja razão social é o nome e o CPF da pessoa: não é guardada;
 *                o prospect recebe um nome descritivo)
 *   --simular    mostra o resultado sem gravar no banco
 */
import { parseArgs } from "node:util";
import { upsertAccountants, type AccountantInput } from "../lib/prospects/accountants";
import {
  latestMonth,
  loadMunicipalities,
  recentPhones,
  scoreNewCompany,
  streamZipCsv,
  toCnpjProspect,
  type CnpjReject,
} from "../lib/prospects/cnpj";
import {
  ACCOUNTANT_THRESHOLD,
  insertProspects,
  updateSharedPhones,
  type NewProspect,
} from "../lib/prospects/db";
import { findNiche, niches, type Niche } from "../lib/prospects/niches";
import { cnpjCities } from "../lib/prospects/regions";

try {
  process.loadEnvFile(".env.local");
} catch {}

const { values } = parseArgs({
  options: {
    mes: { type: "string" },
    dias: { type: "string", default: "60" },
    nicho: { type: "string", default: "todos" },
    cidades: { type: "string", default: "grandes" },
    arquivos: { type: "string", default: "0-9" },
    paralelo: { type: "string", default: "3" },
    "incluir-sem-nome": { type: "boolean", default: false },
    simular: { type: "boolean", default: false },
  },
});

function fail(message: string): never {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

function fileIndexes(spec: string) {
  const range = spec.match(/^(\d)-(\d)$/);
  if (range) {
    return Array.from(
      { length: Number(range[2]) - Number(range[1]) + 1 },
      (_, i) => Number(range[1]) + i,
    );
  }
  return spec.split(",").map((n) => Number(n.trim()));
}

async function main() {
  const selected = values.nicho === "todos" ? niches : [findNiche(values.nicho)];
  if (selected.some((n) => !n)) fail(`Nicho "${values.nicho}" não existe.`);
  const cnaes = new Map<string, Niche>();
  for (const niche of selected as Niche[]) for (const code of niche.cnaes) cnaes.set(code, niche);

  const month = values.mes ?? (await latestMonth());
  const days = Number(values.dias);
  const sinceIso = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
  const since = sinceIso.replaceAll("-", "");

  // Municípios da Receita → só as cidades escolhidas (a UF é conferida linha
  // a linha, porque há cidades homônimas em estados diferentes).
  const wanted =
    values.cidades === "grandes"
      ? cnpjCities
      : values.cidades.split(",").map((c) => c.trim().toUpperCase().split("/") as [string, string]);
  const municipalities = await loadMunicipalities(month);
  const wantedNames = new Set(wanted.map(([name]) => name));
  const cities = new Map([...municipalities].filter(([, name]) => wantedNames.has(name)));
  const wantedPairs = new Set(wanted.map(([name, uf]) => `${name}/${uf}`));

  const files = fileIndexes(values.arquivos).map((i) => `Estabelecimentos${i}.zip`);
  console.log(
    `Receita ${month} · abertas desde ${sinceIso} · ${cnaes.size} CNAEs · ${wanted.length} cidades · ${files.length} arquivo(s)`,
  );

  const found: NewProspect[] = [];
  const withoutName: NewProspect[] = [];
  const rejected: Partial<Record<CnpjReject, number>> = {};
  let rows = 0;
  const started = Date.now();
  // Telefone → empresas abertas no período (todo o Brasil, qualquer atividade).
  const phoneCounts = new Map<string, number>();

  async function readFile(file: string) {
    let fileRows = 0;
    let fileFound = 0;
    await streamZipCsv(month, file, (fields) => {
      fileRows++;
      for (const phone of recentPhones(fields, since)) {
        phoneCounts.set(phone, (phoneCounts.get(phone) ?? 0) + 1);
      }
      const outcome = toCnpjProspect(fields, { cnaes, cities, pairs: wantedPairs, since });
      if ("rejected" in outcome) {
        if (outcome.rejected !== "fora do filtro") {
          rejected[outcome.rejected] = (rejected[outcome.rejected] ?? 0) + 1;
        }
        return;
      }
      fileFound++;
      (outcome.tradeName ? found : withoutName).push(outcome.prospect);
    });
    rows += fileRows;
    const minutes = ((Date.now() - started) / 60_000).toFixed(1);
    console.log(
      `  ✔ ${file}: ${fileRows.toLocaleString("pt-BR")} linhas · ${fileFound} selecionadas · ${minutes} min`,
    );
  }

  // Alguns arquivos ao mesmo tempo, sem sobrecarregar o servidor da Receita.
  const queue = [...files];
  const parallel = Math.max(1, Number(values.paralelo));
  await Promise.all(
    Array.from({ length: parallel }, async () => {
      for (let file = queue.shift(); file; file = queue.shift()) {
        console.log(`  ↓ ${file}...`);
        await readFile(file);
      }
    }),
  );

  // Sem nome fantasia (quase sempre MEI): a razão social é nome + CPF de pessoa
  // física e não é guardada. Só entra com --incluir-sem-nome, com nome descritivo.
  const includeUnnamed = values["incluir-sem-nome"];
  for (const p of withoutName) {
    p.name = `Nova empresa de ${findNiche(p.niche)?.label.toLowerCase()} · ${p.neighborhood ?? p.city}`;
  }

  // Telefones compartilhados: marca o prospect (sem pontos de contato) e
  // monta a lista de prováveis contadores para a Frente 2.
  const accountants = new Map<string, AccountantInput>();
  for (const p of [...found, ...withoutName]) {
    const shared = p.phone ? (phoneCounts.get(p.phone) ?? 1) : 0;
    if (shared < ACCOUNTANT_THRESHOLD) continue;
    p.sharedPhone = shared;
    const niche = findNiche(p.niche)!;
    const rescored = scoreNewCompany({
      openedAt: p.openedAt!,
      phone: p.phone,
      niche,
      tradeName: !p.name.startsWith("Nova empresa de "),
      sharedPhone: shared,
    });
    p.score = rescored.score;
    p.scoreReasons = rescored.reasons;

    const entry = accountants.get(p.phone!) ?? {
      phone: p.phone!,
      companies: shared,
      cities: [],
      niches: [],
      sample: [],
      month,
    };
    const place = `${p.city}/${p.state}`;
    if (!entry.cities.includes(place)) entry.cities.push(place);
    if (!entry.niches.includes(niche.label)) entry.niches.push(niche.label);
    if (!p.name.startsWith("Nova empresa de ") && entry.sample.length < 3)
      entry.sample.push(p.name);
    accountants.set(p.phone!, entry);
  }

  const all = [...found, ...(includeUnnamed ? withoutName : [])].sort((a, b) => b.score - a.score);
  const byNiche = new Map<string, number>();
  for (const p of all) byNiche.set(p.niche, (byNiche.get(p.niche) ?? 0) + 1);

  console.log(`\nLinhas lidas: ${rows.toLocaleString("pt-BR")}`);
  console.log(
    `Selecionadas: ${all.length} (${all.filter((p) => p.visitable).length} visitáveis em SP)`,
  );
  console.log(
    `Sem nome fantasia: ${withoutName.length} ${includeUnnamed ? "(incluídas)" : "(fora; use --incluir-sem-nome)"}`,
  );
  for (const [reason, count] of Object.entries(rejected))
    console.log(`Descartadas (${reason}): ${count}`);
  const flagged = all.filter((p) => p.sharedPhone >= ACCOUNTANT_THRESHOLD).length;
  console.log(
    `Telefone de provável contador: ${flagged} empresas · ${accountants.size} números (em ${ACCOUNTANT_THRESHOLD}+ empresas novas)`,
  );
  console.log(`Por nicho: ${[...byNiche].map(([n, c]) => `${n} ${c}`).join(" · ")}`);

  console.table(
    all.slice(0, 15).map((p) => ({
      score: p.score,
      nome: p.name.slice(0, 38),
      nicho: p.niche,
      cidade: `${p.city}/${p.state}`,
      aberta: p.openedAt,
    })),
  );

  if (values.simular) {
    console.log("\nModo --simular: nada foi gravado.");
    return;
  }
  const inserted = await insertProspects(all);
  // Empresas já gravadas em coletas anteriores recebem a marcação atualizada.
  const updated = await updateSharedPhones(
    all.map((p) => ({
      externalId: p.externalId,
      sharedPhone: p.sharedPhone,
      score: p.score,
      reasons: p.scoreReasons,
    })),
  );
  await upsertAccountants([...accountants.values()]);
  console.log(`\n✔ ${inserted} novas gravadas · ${all.length - inserted} já existiam no banco.`);
  console.log(`✔ ${updated} já gravadas tiveram a marcação de telefone atualizada.`);
  console.log(`✔ ${accountants.size} prováveis contadores na lista (/interno/contadores).`);
}

main().catch((error) => {
  console.error(`\n✖ ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
