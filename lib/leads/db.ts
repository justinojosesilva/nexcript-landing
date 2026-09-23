import { createClient, type Client } from "@libsql/client";

// Status usados no acompanhamento interno, na ordem do funil.
export const leadStatuses = [
  "novo",
  "em contato",
  "diagnóstico agendado",
  "proposta enviada",
  "ganho",
  "perdido",
  "descartado",
] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export type NewLead = {
  name: string;
  company: string;
  whatsapp: string;
  email: string | null;
  interest: string;
  message: string;
  source: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrer: string | null;
  landingPath: string | null;
};

export type Lead = {
  id: number;
  createdAt: string;
  name: string;
  company: string;
  whatsapp: string;
  email: string | null;
  interest: string;
  message: string;
  source: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrer: string | null;
  status: LeadStatus;
  notes: string | null;
};

const schema = `
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  interest TEXT NOT NULL,
  message TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'site',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  landing_path TEXT,
  status TEXT NOT NULL DEFAULT 'novo',
  notes TEXT
)`;

let client: Client | null = null;
let ready: Promise<unknown> | null = null;

/**
 * Turso em produção (TURSO_DATABASE_URL + TURSO_AUTH_TOKEN).
 * Em desenvolvimento, sem variáveis, usa um arquivo SQLite local.
 */
async function db(): Promise<Client> {
  if (!client) {
    const url =
      process.env.TURSO_DATABASE_URL ??
      (process.env.NODE_ENV === "production" ? undefined : "file:.data/leads.db");
    if (!url) throw new Error("TURSO_DATABASE_URL não configurada.");
    client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  }
  ready ??= client
    .batch(
      [
        schema,
        "CREATE INDEX IF NOT EXISTS leads_created_at ON leads (created_at)",
        "CREATE INDEX IF NOT EXISTS leads_whatsapp ON leads (whatsapp)",
      ],
      "write",
    )
    .catch((error) => {
      ready = null;
      throw error;
    });
  await ready;
  return client;
}

/** Evita registros duplicados quando a pessoa envia duas vezes seguidas. */
export async function hasRecentLead(whatsapp: string, minutes = 10) {
  const result = await (await db()).execute({
    sql: `SELECT 1 FROM leads
          WHERE whatsapp = ? AND created_at >= strftime('%Y-%m-%dT%H:%M:%fZ', 'now', ?)
          LIMIT 1`,
    args: [whatsapp, `-${minutes} minutes`],
  });
  return result.rows.length > 0;
}

export async function insertLead(lead: NewLead) {
  const result = await (await db()).execute({
    sql: `INSERT INTO leads (name, company, whatsapp, email, interest, message, source,
            utm_source, utm_medium, utm_campaign, referrer, landing_path)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      lead.name,
      lead.company,
      lead.whatsapp,
      lead.email,
      lead.interest,
      lead.message,
      lead.source,
      lead.utmSource,
      lead.utmMedium,
      lead.utmCampaign,
      lead.referrer,
      lead.landingPath,
    ],
  });
  return Number(result.lastInsertRowid);
}

export async function listLeads(status?: LeadStatus) {
  const result = await (await db()).execute({
    sql: `SELECT id, created_at, name, company, whatsapp, email, interest, message, source,
            utm_source, utm_medium, utm_campaign, referrer, status, notes
          FROM leads ${status ? "WHERE status = ?" : ""}
          ORDER BY created_at DESC LIMIT 500`,
    args: status ? [status] : [],
  });
  return result.rows.map(
    (row): Lead => ({
      id: Number(row.id),
      createdAt: String(row.created_at),
      name: String(row.name),
      company: String(row.company),
      whatsapp: String(row.whatsapp),
      email: row.email ? String(row.email) : null,
      interest: String(row.interest),
      message: String(row.message),
      source: String(row.source),
      utmSource: row.utm_source ? String(row.utm_source) : null,
      utmMedium: row.utm_medium ? String(row.utm_medium) : null,
      utmCampaign: row.utm_campaign ? String(row.utm_campaign) : null,
      referrer: row.referrer ? String(row.referrer) : null,
      status: String(row.status) as LeadStatus,
      notes: row.notes ? String(row.notes) : null,
    }),
  );
}

export async function countLeadsByStatus() {
  const result = await (await db()).execute(
    "SELECT status, COUNT(*) AS total FROM leads GROUP BY status",
  );
  return Object.fromEntries(
    result.rows.map((row) => [String(row.status), Number(row.total)]),
  ) as Partial<Record<LeadStatus, number>>;
}

export async function updateLead(id: number, status: LeadStatus, notes: string | null) {
  await (await db()).execute({
    sql: `UPDATE leads SET status = ?, notes = ?,
            updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
          WHERE id = ?`,
    args: [status, notes, id],
  });
}
