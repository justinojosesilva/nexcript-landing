import type { MapsPlace } from "./maps";

const API = "https://api.apify.com/v2";
const ACTOR = "compass~crawler-google-places";
const FINISHED = new Set(["SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"]);

type Run = {
  id: string;
  status: string;
  defaultDatasetId: string;
};

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const token = process.env.APIFY_TOKEN;
  if (!token) throw new Error("APIFY_TOKEN não configurado no .env.local.");
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`Apify respondeu ${response.status}: ${await response.text()}`);
  }
  return response.json() as Promise<T>;
}

export type MapsSearch = {
  searches: string[];
  location: string;
  maxPerSearch: number;
  /** false: o próprio Apify já descarta quem tem site (mais barato). */
  includeWithWebsite: boolean;
};

/**
 * Roda o Google Maps Scraper e devolve os lugares encontrados. Sem a página
 * de detalhes, reviews ou imagens, cobra só pelos lugares listados.
 */
export async function searchMaps(search: MapsSearch, onStatus?: (status: string) => void) {
  const { data: started } = await call<{ data: Run }>(`/acts/${ACTOR}/runs`, {
    method: "POST",
    body: JSON.stringify({
      searchStringsArray: search.searches,
      locationQuery: search.location,
      maxCrawledPlacesPerSearch: search.maxPerSearch,
      language: "pt-BR",
      // Cada filtro do Apify é cobrado por lugar. Fechados são descartados
      // localmente (maps.ts); "sem site" fica no Apify porque evita pagar
      // por lugares que seriam descartados.
      website: search.includeWithWebsite ? "allPlaces" : "withoutWebsite",
      scrapePlaceDetailPage: false,
      maxReviews: 0,
      maxImages: 0,
    }),
  });

  let run = started;
  while (!FINISHED.has(run.status)) {
    onStatus?.(run.status);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    run = (await call<{ data: Run }>(`/actor-runs/${run.id}`)).data;
  }
  if (run.status !== "SUCCEEDED") {
    throw new Error(`Execução ${run.id} terminou como ${run.status}.`);
  }

  const places = await call<MapsPlace[]>(
    `/datasets/${run.defaultDatasetId}/items?clean=true&format=json`,
  );
  return { places, runId: run.id };
}

/**
 * Consumo do mês na conta Apify. O valor por execução só fecha alguns
 * minutos depois, então a comparação antes/depois é a medida mais fiel.
 */
export async function monthlyUsage() {
  const { data } = await call<{
    data: { limits: { maxMonthlyUsageUsd: number }; current: { monthlyUsageUsd: number } };
  }>("/users/me/limits");
  return { usedUsd: data.current.monthlyUsageUsd, limitUsd: data.limits.maxMonthlyUsageUsd };
}
