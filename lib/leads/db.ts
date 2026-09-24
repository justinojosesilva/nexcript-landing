import { schemaOnce } from "../db";

/**
 * Reserva do formulário do site: os leads vão para o NexCRM (lib/nexcrm.ts) e
 * só caem aqui, no Turso, se o CRM estiver fora do ar. O e-mail da equipe
 * avisa quando isso acontece, para cadastrar o lead à mão no CRM.
 */

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

const db = schemaOnce(
  [
    schema,
    "CREATE INDEX IF NOT EXISTS leads_created_at ON leads (created_at)",
    "CREATE INDEX IF NOT EXISTS leads_whatsapp ON leads (whatsapp)",
  ],
  [
    // Responsável e cadência de contato, adicionadas depois da tabela existir.
    { table: "leads", name: "owner", definition: "TEXT" },
    { table: "leads", name: "contact_attempts", definition: "INTEGER NOT NULL DEFAULT 0" },
    { table: "leads", name: "last_contact_at", definition: "TEXT" },
    { table: "leads", name: "next_action_at", definition: "TEXT" },
  ],
);

/** Evita registros duplicados quando a pessoa envia duas vezes seguidas. */
export async function hasRecentLead(whatsapp: string, minutes = 10) {
  const result = await (
    await db()
  ).execute({
    sql: `SELECT 1 FROM leads
          WHERE whatsapp = ? AND created_at >= strftime('%Y-%m-%dT%H:%M:%fZ', 'now', ?)
          LIMIT 1`,
    args: [whatsapp, `-${minutes} minutes`],
  });
  return result.rows.length > 0;
}

export async function insertLead(lead: NewLead) {
  const result = await (
    await db()
  ).execute({
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
