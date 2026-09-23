/**
 * Coleta empresas no Google Maps (via Apify), filtra e grava na prospecção.
 *
 *   pnpm prospectar --nicho odontologia --cidade "Campinas, SP"
 *   pnpm prospectar --nicho odontologia --bairros zona-sul --limite 10
 *   pnpm prospectar --nicho todos --bairros "Moema, Brooklin" --limite 5
 *   pnpm prospectar --recalcular
 *   pnpm prospectar --nicho odontologia --arquivo exemplo.json --simular
 *
 * Opções:
 *   --nicho            id do nicho (ver lib/prospects/niches.ts) ou "todos"
 *   --cidade           cidade/região da busca no Google Maps
 *   --bairros          bairros de São Paulo: região (zona-sul, zona-oeste, zona-norte,
 *                      zona-leste, centro), "todas" ou lista separada por vírgula
 *   --limite           máximo de lugares por termo de busca (padrão 20)
 *   --min-avaliacoes   mínimo de avaliações para contar como ativo (padrão 10)
 *   --incluir-redes    busca também quem tem "site"; mantém quem só tem rede social
 *   --confirmar        necessário quando a estimativa de custo passa de US$ 0,50
 *   --recalcular       recalcula o score de tudo o que foi gravado e descarta redes/franquias
 *   --arquivo          lê lugares de um JSON local em vez de chamar o Apify
 *   --simular          mostra o resultado sem gravar no banco
 *
 * Variáveis (.env.local): APIFY_TOKEN, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN.
 */
import { readFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { monthlyUsage, searchMaps } from "../lib/prospects/apify";
import {
  discardProspects,
  insertProspects,
  listForRescore,
  updateScores,
  type NewProspect,
} from "../lib/prospects/db";
import {
  isChain,
  scoreProspect,
  toProspect,
  type MapsPlace,
  type RejectReason,
} from "../lib/prospects/maps";
import { scoreNewCompany } from "../lib/prospects/cnpj";
import { isPlaceholderName } from "../lib/prospects/messages";
import { findNiche, niches, type Niche } from "../lib/prospects/niches";
import { resolveNeighborhoods } from "../lib/prospects/regions";

// Chaves locais (APIFY_TOKEN e Turso). Sem o arquivo, usa o SQLite de desenvolvimento.
try {
  process.loadEnvFile(".env.local");
} catch {}

// Custo real no plano gratuito: US$ 0,004 por lugar + US$ 0,001 pelo filtro "sem site".
const USD_PER_PLACE = 0.005;
const CONFIRM_ABOVE_USD = 0.5;

const { values } = parseArgs({
  options: {
    nicho: { type: "string" },
    cidade: { type: "string" },
    bairros: { type: "string" },
    limite: { type: "string", default: "20" },
    "min-avaliacoes": { type: "string", default: "10" },
    "incluir-redes": { type: "boolean", default: false },
    confirmar: { type: "boolean", default: false },
    recalcular: { type: "boolean", default: false },
    arquivo: { type: "string" },
    simular: { type: "boolean", default: false },
  },
});

function fail(message: string): never {
  console.error(`\n✖ ${message}\n`);
  console.error(`Nichos disponíveis: ${niches.map((n) => n.id).join(", ")}, todos`);
  process.exit(1);
}

async function rescore() {
  const rows = await listForRescore();
  const updates = rows.flatMap((row) => {
    const niche = findNiche(row.niche);
    if (!niche) return [];
    // Empresas do CNPJ têm score próprio, que cai conforme a abertura fica antiga.
    const { score, reasons } =
      row.source === "cnpj" && row.openedAt
        ? scoreNewCompany({
            openedAt: row.openedAt,
            phone: row.phone,
            niche,
            tradeName: !isPlaceholderName(row.name),
          })
        : scoreProspect({ ...row, niche });
    return [{ id: row.id, score, reasons, before: row.score }];
  });
  await updateScores(updates);
  const changed = updates.filter((u) => u.score !== u.before).length;
  console.log(`✔ Score recalculado em ${updates.length} prospects (${changed} mudaram).`);

  // Regras de descarte novas valem também para o que já foi coletado.
  const chains = rows.filter((row) => row.status === "novo" && isChain(row.name));
  await discardProspects(
    chains.map((row) => row.id),
    "Rede/franquia: descartado automaticamente.",
  );
  if (chains.length) {
    console.log(
      `✔ ${chains.length} redes/franquias descartadas: ${chains.map((c) => c.name).join("; ")}`,
    );
  }
}

async function collect() {
  if (!values.nicho) fail("Informe --nicho.");
  const selected = values.nicho === "todos" ? niches : [findNiche(values.nicho)];
  if (selected.some((n) => !n)) fail(`Nicho "${values.nicho}" não existe.`);
  const selectedNiches = selected as Niche[];

  const locations = values.bairros
    ? resolveNeighborhoods(values.bairros)
    : values.cidade
      ? [values.cidade]
      : [];
  if (!values.arquivo && locations.length === 0) {
    fail("Informe --cidade ou --bairros (ou --arquivo para teste).");
  }

  const limit = Number(values.limite);
  const minReviews = Number(values["min-avaliacoes"]);

  if (!values.arquivo) {
    const searches = selectedNiches.reduce((sum, n) => sum + n.searches.length, 0);
    const maxPlaces = searches * locations.length * limit;
    const estimate = maxPlaces * USD_PER_PLACE;
    console.log(
      `Plano: ${selectedNiches.length} nicho(s) × ${locations.length} local(is) · até ${maxPlaces} lugares · custo máximo estimado US$ ${estimate.toFixed(2)}`,
    );
    if (estimate > CONFIRM_ABOVE_USD && !values.confirmar) {
      fail(
        `Estimativa acima de US$ ${CONFIRM_ABOVE_USD.toFixed(2)}. Repita com --confirmar para rodar.`,
      );
    }
  }

  const found: NewProspect[] = [];
  const rejected: Partial<Record<RejectReason, number>> = {};
  let totalPlaces = 0;
  const usageBefore = values.arquivo ? null : await monthlyUsage();

  for (const niche of selectedNiches) {
    if (values.arquivo) {
      const places = JSON.parse(await readFile(values.arquivo, "utf8")) as MapsPlace[];
      console.log(`• ${niche.label}: ${places.length} lugares lidos de ${values.arquivo}`);
      classify(places, niche);
      continue;
    }
    for (const location of locations) {
      console.log(`• ${niche.label} em ${location}...`);
      try {
        const result = await searchMaps(
          {
            searches: niche.searches,
            location,
            maxPerSearch: limit,
            includeWithWebsite: values["incluir-redes"],
          },
          (status) => process.stdout.write(`  ${status}...\r`),
        );
        console.log(`  ${result.places.length} lugares retornados`);
        classify(result.places, niche);
      } catch (error) {
        // Uma busca com problema não derruba as demais.
        console.error(`  ✖ ${error instanceof Error ? error.message : error}`);
      }
    }
  }

  function classify(places: MapsPlace[], niche: Niche) {
    totalPlaces += places.length;
    for (const place of places) {
      const outcome = toProspect(place, niche, minReviews);
      if ("prospect" in outcome) found.push(outcome.prospect);
      else rejected[outcome.rejected] = (rejected[outcome.rejected] ?? 0) + 1;
    }
  }

  // O mesmo lugar pode aparecer em mais de um termo ou bairro.
  const unique = [...new Map(found.map((p) => [p.externalId, p])).values()].sort(
    (a, b) => b.score - a.score,
  );

  console.log(`\nLugares analisados: ${totalPlaces}`);
  console.log(`Qualificados: ${unique.length}`);
  for (const [reason, count] of Object.entries(rejected)) {
    console.log(`Descartados (${reason}): ${count}`);
  }
  if (usageBefore) {
    const after = await monthlyUsage();
    console.log(
      `Consumo Apify no mês: US$ ${after.usedUsd.toFixed(2)} de US$ ${after.limitUsd.toFixed(2)} ` +
        `(+US$ ${(after.usedUsd - usageBefore.usedUsd).toFixed(2)} nesta coleta; o valor final fecha em alguns minutos)`,
    );
  }

  console.table(
    unique.slice(0, 15).map((p) => ({
      score: p.score,
      nome: p.name.slice(0, 40),
      nicho: p.niche,
      bairro: p.neighborhood ?? p.city,
      avaliações: p.reviews,
      nota: p.rating,
      visitável: p.visitable ? "sim" : "",
    })),
  );

  if (values.simular) {
    console.log("\nModo --simular: nada foi gravado.");
    return;
  }
  const inserted = await insertProspects(unique);
  console.log(`\n✔ ${inserted} novos gravados · ${unique.length - inserted} já existiam no banco.`);
}

(values.recalcular ? rescore() : collect()).catch((error) => {
  console.error(`\n✖ ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
