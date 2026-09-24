/**
 * Formatos dos coletores (pnpm prospectar e prospectar:cnpj). Os dados vão
 * para o NexCRM pela API de ingestão (lib/nexcrm.ts).
 */

/**
 * Telefone que aparece em 3 ou mais empresas abertas no período costuma ser
 * do escritório de contabilidade que registrou os CNPJs, e não do dono.
 */
export const ACCOUNTANT_THRESHOLD = 3;

export type NewProspect = {
  source: "maps" | "cnpj";
  externalId: string;
  name: string;
  niche: string;
  category: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  visitable: boolean;
  rating: number | null;
  reviews: number | null;
  openedAt: string | null;
  mapsUrl: string | null;
  score: number;
  scoreReasons: string;
  /** Em quantas empresas novas o telefone aparece (3+ = provável contador). */
  sharedPhone: number;
};

/** Provável escritório de contabilidade (Frente 2, parcerias de indicação). */
export type AccountantInput = {
  phone: string;
  /** Empresas novas (todo o Brasil, qualquer atividade) com esse telefone. */
  companies: number;
  cities: string[];
  niches: string[];
  /** Alguns nomes fantasia de empresas abertas por esse número. */
  sample: string[];
  month: string;
};
