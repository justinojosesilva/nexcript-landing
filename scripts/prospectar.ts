/**
 * Coleta empresas no Google Maps (via Apify), filtra e grava na prospecção.
 *
 *   pnpm prospectar --nicho odontologia --cidade "Campinas, SP"
 *   pnpm prospectar --nicho todos --cidade "São Paulo, SP" --limite 20
 *   pnpm prospectar --nicho odontologia --arquivo exemplo.json --simular
 *
 * Opções:
 *   --nicho            id do nicho (ver lib/prospects/niches.ts) ou "todos"
 *   --cidade           cidade/região da busca no Google Maps
 *   --limite           máximo de lugares por termo de busca (padrão 20)
 *   --min-avaliacoes   mínimo de avaliações para contar como ativo (padrão 10)
 *   --incluir-redes    busca também quem tem "site"; mantém quem só tem rede social
 *   --arquivo          lê lugares de um JSON local em vez de chamar o Apify
 *   --simular          mostra o resultado sem gravar no banco
 *
 * Variáveis (.env.local): APIFY_TOKEN, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN.
 */
import { readFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { searchMaps } from "../lib/prospects/apify";
import { insertProspects, type NewProspect } from "../lib/prospects/db";
import { toProspect, type MapsPlace, type RejectReason } from "../lib/prospects/maps";
import { findNiche, niches } from "../lib/prospects/niches";

// Chaves locais (APIFY_TOKEN e Turso). Sem o arquivo, usa o SQLite de desenvolvimento.
try {
  process.loadEnvFile(".env.local");
} catch {}

const { values } = parseArgs({
  options: {
    nicho: { type: "string" },
    cidade: { type: "string" },
    limite: { type: "string", default: "20" },
    "min-avaliacoes": { type: "string", default: "10" },
    "incluir-redes": { type: "boolean", default: false },
    arquivo: { type: "string" },
    simular: { type: "boolean", default: false },
  },
});

function fail(message: string): never {
  console.error(`\n✖ ${message}\n`);
  console.error(`Nichos disponíveis: ${niches.map((n) => n.id).join(", ")}, todos`);
  process.exit(1);
}

async function main() {
  if (!values.nicho) fail("Informe --nicho.");
  const selected = values.nicho === "todos" ? niches : [findNiche(values.nicho)];
  if (selected.some((n) => !n)) fail(`Nicho "${values.nicho}" não existe.`);
  if (!values.arquivo && !values.cidade) fail("Informe --cidade (ou --arquivo para teste).");

  const limit = Number(values.limite);
  const minReviews = Number(values["min-avaliacoes"]);
  const found: NewProspect[] = [];
  const rejected: Partial<Record<RejectReason, number>> = {};
  let totalPlaces = 0;
  let totalCost = 0;

  for (const niche of selected as NonNullable<(typeof selected)[number]>[]) {
    let places: MapsPlace[];
    if (values.arquivo) {
      places = JSON.parse(await readFile(values.arquivo, "utf8")) as MapsPlace[];
      console.log(`• ${niche.label}: ${places.length} lugares lidos de ${values.arquivo}`);
    } else {
      console.log(`• ${niche.label}: buscando "${niche.searches.join('", "')}" em ${values.cidade}...`);
      const result = await searchMaps(
        {
          searches: niche.searches,
          location: values.cidade!,
          maxPerSearch: limit,
          includeWithWebsite: values["incluir-redes"],
        },
        (status) => process.stdout.write(`  ${status}...\r`),
      );
      places = result.places;
      totalCost += result.costUsd ?? 0;
      console.log(`  ${places.length} lugares retornados (execução ${result.runId})`);
    }

    totalPlaces += places.length;
    for (const place of places) {
      const outcome = toProspect(place, niche, minReviews);
      if ("prospect" in outcome) found.push(outcome.prospect);
      else rejected[outcome.rejected] = (rejected[outcome.rejected] ?? 0) + 1;
    }
  }

  // O mesmo lugar pode aparecer em dois termos de busca do mesmo nicho.
  const unique = [...new Map(found.map((p) => [p.externalId, p])).values()].sort(
    (a, b) => b.score - a.score,
  );

  console.log(`\nLugares analisados: ${totalPlaces}`);
  console.log(`Qualificados: ${unique.length}`);
  for (const [reason, count] of Object.entries(rejected)) {
    console.log(`Descartados (${reason}): ${count}`);
  }
  if (!values.arquivo) console.log(`Custo Apify: US$ ${totalCost.toFixed(3)}`);

  console.table(
    unique.slice(0, 15).map((p) => ({
      score: p.score,
      nome: p.name.slice(0, 40),
      nicho: p.niche,
      cidade: p.city,
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

main().catch((error) => {
  console.error(`\n✖ ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
