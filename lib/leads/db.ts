import type { Row } from "@libsql/client";
import { schemaOnce } from "../db";
import {
  currentStep,
  historyLine,
  leadCadenceSteps,
  todaySP,
  type ContactChannel,
} from "../prospects/cadence";
import { prospectOwners, type ProspectOwner } from "../prospects/db";

// Mesma dupla da prospecção: quem cuida de cada lead.
export const leadOwners = prospectOwners;
export type LeadOwner = ProspectOwner;

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
  landingPath: string | null;
  status: LeadStatus;
  owner: LeadOwner | null;
  notes: string | null;
  contactAttempts: number;
  lastContactAt: string | null;
  nextActionAt: string | null;
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

export type LeadFilters = {
  status?: LeadStatus;
  /** Só os que têm contato agendado para hoje ou atrasado. */
  due?: boolean;
};

const OPEN = "status NOT IN ('ganho', 'perdido', 'descartado')";
// Para hoje: follow-up vencido ou lead novo ainda sem nenhuma resposta.
const DUE = `${OPEN} AND ((next_action_at IS NOT NULL AND next_action_at <= ?)
  OR (status = 'novo' AND contact_attempts = 0))`;

function whereClause(filters: LeadFilters) {
  const where: string[] = [];
  const args: string[] = [];
  if (filters.status) {
    where.push("status = ?");
    args.push(filters.status);
  }
  if (filters.due) {
    where.push(DUE);
    args.push(todaySP());
  }
  return { sql: where.length ? `WHERE ${where.join(" AND ")}` : "", args };
}

function toLead(row: Row): Lead {
  return {
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
    landingPath: row.landing_path ? String(row.landing_path) : null,
    status: String(row.status) as LeadStatus,
    owner: row.owner ? (String(row.owner) as LeadOwner) : null,
    notes: row.notes ? String(row.notes) : null,
    contactAttempts: Number(row.contact_attempts ?? 0),
    lastContactAt: row.last_contact_at ? String(row.last_contact_at) : null,
    nextActionAt: row.next_action_at ? String(row.next_action_at) : null,
  };
}

export async function listLeads(filters: LeadFilters, page = 1, pageSize = 24) {
  const where = whereClause(filters);
  const client = await db();
  const [rows, count] = await Promise.all([
    client.execute({
      // Na aba "Para hoje", os mais atrasados primeiro; nas demais, os mais recentes.
      sql: `SELECT * FROM leads ${where.sql}
            ORDER BY ${filters.due ? "COALESCE(next_action_at, substr(created_at, 1, 10)) ASC, created_at ASC" : "created_at DESC"}
            LIMIT ? OFFSET ?`,
      args: [...where.args, pageSize, (page - 1) * pageSize],
    }),
    client.execute({ sql: `SELECT COUNT(*) AS total FROM leads ${where.sql}`, args: where.args }),
  ]);
  return { leads: rows.rows.map(toLead), total: Number(count.rows[0].total) };
}

export async function getLead(id: number) {
  const result = await (
    await db()
  ).execute({ sql: "SELECT * FROM leads WHERE id = ?", args: [id] });
  return result.rows[0] ? toLead(result.rows[0]) : null;
}

export async function countLeadsByStatus() {
  const client = await db();
  const [result, due] = await Promise.all([
    client.execute("SELECT status, COUNT(*) AS total FROM leads GROUP BY status"),
    client.execute({
      sql: `SELECT COUNT(*) AS total FROM leads WHERE ${DUE}`,
      args: [todaySP()],
    }),
  ]);
  return {
    byStatus: Object.fromEntries(
      result.rows.map((row) => [String(row.status), Number(row.total)]),
    ) as Partial<Record<LeadStatus, number>>,
    due: Number(due.rows[0].total),
  };
}

export async function updateLead(
  id: number,
  status: LeadStatus,
  owner: LeadOwner | null,
  notes: string | null,
) {
  // Depois do agendamento (ou do encerramento), a cadência automática para.
  const keepCadence = status === "novo" || status === "em contato";
  await (
    await db()
  ).execute({
    sql: `UPDATE leads SET status = ?, owner = ?, notes = ?,
            next_action_at = CASE WHEN ? THEN next_action_at ELSE NULL END,
            updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
          WHERE id = ?`,
    args: [status, owner, notes, keepCadence ? 1 : 0, id],
  });
}

/**
 * Registra um contato feito com o lead: avança a cadência curta dos leads,
 * agenda o próximo e anota o histórico. Na última etapa, encerra como perdido.
 */
export async function registerLeadContact(id: number, channel: ContactChannel, by: string) {
  const lead = await getLead(id);
  if (!lead) return;
  const step = currentStep(lead.contactAttempts, leadCadenceSteps);
  if (!step) return;

  const isLast = step.key === leadCadenceSteps[leadCadenceSteps.length - 1].key;
  const next = step.daysToNext === null ? null : todaySP(step.daysToNext);
  const notes = [lead.notes, historyLine(channel, step, by)].filter(Boolean).join("\n");
  const status: LeadStatus = isLast
    ? "perdido"
    : lead.status === "novo"
      ? "em contato"
      : lead.status;

  await (
    await db()
  ).execute({
    sql: `UPDATE leads SET contact_attempts = contact_attempts + 1,
            last_contact_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
            next_action_at = ?, status = ?, notes = ?,
            updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
          WHERE id = ?`,
    args: [next, status, isLast ? `${notes}\nSem resposta após a cadência.` : notes, id],
  });
}
