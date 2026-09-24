import type { AccountantInput, NewProspect } from "./prospects/types";

/**
 * Integração com o NexCRM (crm.nexcript.com.br), onde a equipe acompanha
 * leads e prospecção: o formulário do site e os coletores gravam lá pela API
 * de ingestão. Variáveis: NEXCRM_URL e NEXCRM_TOKEN (criado com
 * `pnpm token:criar` no repositório do NexCRM).
 */

export function crmConfigured() {
  return Boolean(process.env.NEXCRM_URL && process.env.NEXCRM_TOKEN);
}

export function crmLeadUrl(leadId: string) {
  return `${process.env.NEXCRM_URL}/leads/${leadId}`;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  if (!crmConfigured()) throw new Error("NEXCRM_URL e NEXCRM_TOKEN não configurados.");
  const response = await fetch(`${process.env.NEXCRM_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXCRM_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60_000),
  });
  const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (!response.ok || !data.ok) {
    throw new Error(`NexCRM respondeu ${response.status}: ${data.error ?? "sem detalhes"}`);
  }
  return data as T;
}

/* ───────────────────────── Formulário do site ───────────────────────── */

export type CrmSiteLead = {
  externalId: string;
  name: string;
  company: string;
  whatsapp: string;
  email: string | null;
  interest: string;
  message: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrer: string | null;
  landingPath: string | null;
};

export function sendSiteLead(lead: CrmSiteLead) {
  return post<{ leadId: string | null; created: boolean }>("/api/ingest/site-lead", lead);
}

/* ───────────────────────── Coletores ───────────────────────── */

type IngestItem = Record<string, unknown> & { externalId: string; sourceKey: string; name: string };
export type IngestReport = { inserted: number; updated: number; skipped: number };

export function prospectItem(p: NewProspect): IngestItem {
  return {
    externalId: p.externalId,
    sourceKey: p.source === "cnpj" ? "prospeccao-cnpj" : "prospeccao-maps",
    name: p.name,
    phone: p.phone,
    website: p.website,
    industry: p.niche,
    category: p.category,
    address: p.address,
    neighborhood: p.neighborhood,
    city: p.city,
    state: p.state,
    rating: p.rating,
    reviews: p.reviews,
    openedAt: p.openedAt,
    mapsUrl: p.mapsUrl,
    sharedPhone: p.sharedPhone,
    score: p.score,
    scoreReasons: p.scoreReasons,
  };
}

/** Mesmo formato da migração do Turso (lead de parceria, pipeline Parcerias). */
export function accountantItem(a: AccountantInput): IngestItem {
  const pretty = a.phone.replace(/^55/, "").replace(/^(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3");
  const [city, state] = (a.cities[0] ?? "").split("/");
  return {
    externalId: `accountant:${a.phone}`,
    sourceKey: "parceria-contador",
    kind: "PARTNER",
    name: `Provável contabilidade · ${pretty}`,
    phone: a.phone,
    industry: "contabilidade",
    city: city || null,
    state: state || null,
    sharedPhone: a.companies,
    notes: [
      `${a.companies} empresas abertas recentemente com este número (Receita ${a.month}).`,
      a.cities.length && `Cidades: ${a.cities.join(", ")}`,
      a.niches.length && `Nichos: ${a.niches.join(", ")}`,
      a.sample.length && `Exemplos: ${a.sample.join(" · ")}`,
    ]
      .filter(Boolean)
      .join("\n"),
    score: Math.min(100, a.companies),
    scoreReasons: `${a.companies} empresas novas com este telefone`,
  };
}

/** Envia em lotes de 1.000 e soma o resultado. */
export async function sendToCrm(items: IngestItem[]): Promise<IngestReport> {
  const total: IngestReport = { inserted: 0, updated: 0, skipped: 0 };
  for (let i = 0; i < items.length; i += 1000) {
    const r = await post<IngestReport>("/api/ingest/leads", { items: items.slice(i, i + 1000) });
    total.inserted += r.inserted;
    total.updated += r.updated;
    total.skipped += r.skipped;
    if (items.length > 1000) process.stdout.write(`  enviados ${Math.min(i + 1000, items.length)}/${items.length}\r`);
  }
  return total;
}
