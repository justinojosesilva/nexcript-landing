import type { Row } from "@libsql/client";
import { schemaOnce } from "../db";
import { cadenceSteps, currentStep, historyLine, todaySP, type ContactChannel } from "./cadence";

/**
 * Telefone que aparece em 3 ou mais empresas abertas no período costuma ser
 * do escritório de contabilidade que registrou os CNPJs, e não do dono.
 */
export const ACCOUNTANT_THRESHOLD = 3;

// Funil da prospecção ativa (diferente dos leads que chegam pelo site).
export const prospectStatuses = [
  "novo",
  "contatado",
  "respondeu",
  "diagnóstico agendado",
  "proposta enviada",
  "ganho",
  "perdido",
  "descartado",
] as const;
export type ProspectStatus = (typeof prospectStatuses)[number];

// Quem cuida do contato: remoto (Justino) ou visitas em São Paulo (Andréia).
export const prospectOwners = ["Justino", "Andréia"] as const;
export type ProspectOwner = (typeof prospectOwners)[number];

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

export type Prospect = NewProspect & {
  id: number;
  createdAt: string;
  status: ProspectStatus;
  owner: ProspectOwner | null;
  notes: string | null;
  contactAttempts: number;
  lastContactAt: string | null;
  nextActionAt: string | null;
};

const db = schemaOnce(
  [
    `CREATE TABLE IF NOT EXISTS prospects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT,
    source TEXT NOT NULL,
    external_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    niche TEXT NOT NULL,
    category TEXT,
    phone TEXT,
    website TEXT,
    address TEXT,
    neighborhood TEXT,
    city TEXT,
    state TEXT,
    visitable INTEGER NOT NULL DEFAULT 0,
    rating REAL,
    reviews INTEGER,
    opened_at TEXT,
    maps_url TEXT,
    score INTEGER NOT NULL DEFAULT 0,
    score_reasons TEXT,
    status TEXT NOT NULL DEFAULT 'novo',
    owner TEXT,
    notes TEXT
  )`,
    "CREATE INDEX IF NOT EXISTS prospects_score ON prospects (score DESC)",
    "CREATE INDEX IF NOT EXISTS prospects_phone ON prospects (phone)",
  ],
  [
    // Cadência de contato (Frente 3), adicionadas depois da tabela existir.
    { table: "prospects", name: "contact_attempts", definition: "INTEGER NOT NULL DEFAULT 0" },
    { table: "prospects", name: "last_contact_at", definition: "TEXT" },
    { table: "prospects", name: "next_action_at", definition: "TEXT" },
    // Telefone compartilhado entre empresas novas (provável contador).
    { table: "prospects", name: "shared_phone", definition: "INTEGER NOT NULL DEFAULT 0" },
  ],
);

/**
 * Grava sem duplicar: o mesmo lugar (external_id) ou o mesmo telefone já
 * cadastrado por outra fonte são ignorados. Devolve quantos entraram.
 */
export async function insertProspects(prospects: NewProspect[]) {
  const client = await db();
  let inserted = 0;
  // Em lotes: uma coleta de CNPJ pode trazer milhares de linhas.
  for (let i = 0; i < prospects.length; i += 100) {
    const results = await client.batch(
      prospects.slice(i, i + 100).map((p) => ({
        // O mesmo telefone não entra duas vezes, exceto o de contador, que é
        // compartilhado por empresas diferentes.
        sql: `INSERT INTO prospects (source, external_id, name, niche, category, phone, website,
                address, neighborhood, city, state, visitable, rating, reviews, opened_at,
                maps_url, score, score_reasons, shared_phone)
              SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
              WHERE NOT EXISTS (
                SELECT 1 FROM prospects
                WHERE external_id = ? OR (? IS NOT NULL AND ? < ${ACCOUNTANT_THRESHOLD} AND phone = ?)
              )`,
        args: [
          p.source,
          p.externalId,
          p.name,
          p.niche,
          p.category,
          p.phone,
          p.website,
          p.address,
          p.neighborhood,
          p.city,
          p.state,
          p.visitable ? 1 : 0,
          p.rating,
          p.reviews,
          p.openedAt,
          p.mapsUrl,
          p.score,
          p.scoreReasons,
          p.sharedPhone,
          p.externalId,
          p.phone,
          p.sharedPhone,
          p.phone,
        ],
      })),
      "write",
    );
    inserted += results.reduce((sum, r) => sum + r.rowsAffected, 0);
  }
  return inserted;
}

export type ProspectFilters = {
  visitable?: boolean;
  niche?: string;
  status?: ProspectStatus;
  owner?: ProspectOwner | "sem responsável";
  source?: NewProspect["source"];
  /** Só os que têm contato agendado para hoje ou atrasado. */
  due?: boolean;
};

const OPEN = "status NOT IN ('ganho', 'perdido', 'descartado')";

function whereClause(filters: ProspectFilters) {
  const where: string[] = [];
  const args: (string | number)[] = [];
  if (filters.visitable !== undefined) {
    where.push("visitable = ?");
    args.push(filters.visitable ? 1 : 0);
  }
  if (filters.niche) {
    where.push("niche = ?");
    args.push(filters.niche);
  }
  if (filters.status) {
    where.push("status = ?");
    args.push(filters.status);
  } else {
    // Sem filtro de status, esconde o que já foi encerrado.
    where.push(OPEN);
  }
  if (filters.owner === "sem responsável") {
    where.push("owner IS NULL");
  } else if (filters.owner) {
    where.push("owner = ?");
    args.push(filters.owner);
  }
  if (filters.source) {
    where.push("source = ?");
    args.push(filters.source);
  }
  if (filters.due) {
    where.push("next_action_at IS NOT NULL AND next_action_at <= ?");
    args.push(todaySP());
  }
  return { sql: where.length ? `WHERE ${where.join(" AND ")}` : "", args };
}

function toProspectRow(row: Row): Prospect {
  return {
    id: Number(row.id),
    createdAt: String(row.created_at),
    source: String(row.source) as Prospect["source"],
    externalId: String(row.external_id),
    name: String(row.name),
    niche: String(row.niche),
    category: row.category ? String(row.category) : null,
    phone: row.phone ? String(row.phone) : null,
    website: row.website ? String(row.website) : null,
    address: row.address ? String(row.address) : null,
    neighborhood: row.neighborhood ? String(row.neighborhood) : null,
    city: row.city ? String(row.city) : null,
    state: row.state ? String(row.state) : null,
    visitable: Number(row.visitable) === 1,
    rating: row.rating === null ? null : Number(row.rating),
    reviews: row.reviews === null ? null : Number(row.reviews),
    openedAt: row.opened_at ? String(row.opened_at) : null,
    mapsUrl: row.maps_url ? String(row.maps_url) : null,
    score: Number(row.score),
    scoreReasons: row.score_reasons ? String(row.score_reasons) : "",
    status: String(row.status) as ProspectStatus,
    owner: row.owner ? (String(row.owner) as ProspectOwner) : null,
    notes: row.notes ? String(row.notes) : null,
    contactAttempts: Number(row.contact_attempts ?? 0),
    lastContactAt: row.last_contact_at ? String(row.last_contact_at) : null,
    nextActionAt: row.next_action_at ? String(row.next_action_at) : null,
    sharedPhone: Number(row.shared_phone ?? 0),
  };
}

export async function listProspects(filters: ProspectFilters, page = 1, pageSize = 24) {
  const where = whereClause(filters);
  const client = await db();
  const [rows, count] = await Promise.all([
    client.execute({
      // Na aba "Para hoje", os mais atrasados primeiro; nas demais, o score.
      sql: `SELECT * FROM prospects ${where.sql}
            ORDER BY ${filters.due ? "next_action_at ASC, " : ""}score DESC, reviews DESC
            LIMIT ? OFFSET ?`,
      args: [...where.args, pageSize, (page - 1) * pageSize],
    }),
    client.execute({
      sql: `SELECT COUNT(*) AS total FROM prospects ${where.sql}`,
      args: where.args,
    }),
  ]);
  return { prospects: rows.rows.map(toProspectRow), total: Number(count.rows[0].total) };
}

export async function getProspect(id: number) {
  const result = await (
    await db()
  ).execute({
    sql: "SELECT * FROM prospects WHERE id = ?",
    args: [id],
  });
  return result.rows[0] ? toProspectRow(result.rows[0]) : null;
}

/** Totais para os filtros do painel (somente prospects em aberto). */
export async function prospectSummary() {
  const client = await db();
  const [result, due] = await Promise.all([
    client.execute(
      `SELECT niche, visitable, COUNT(*) AS total FROM prospects WHERE ${OPEN} GROUP BY niche, visitable`,
    ),
    client.execute({
      sql: `SELECT COUNT(*) AS total FROM prospects
            WHERE ${OPEN} AND next_action_at IS NOT NULL AND next_action_at <= ?`,
      args: [todaySP()],
    }),
  ]);
  const byNiche: Record<string, number> = {};
  let visitable = 0;
  let remote = 0;
  for (const row of result.rows) {
    const total = Number(row.total);
    byNiche[String(row.niche)] = (byNiche[String(row.niche)] ?? 0) + total;
    if (Number(row.visitable) === 1) visitable += total;
    else remote += total;
  }
  return { byNiche, visitable, remote, total: visitable + remote, due: Number(due.rows[0].total) };
}

export async function updateProspect(
  id: number,
  status: ProspectStatus,
  owner: ProspectOwner | null,
  notes: string | null,
) {
  // Depois da resposta (ou do encerramento), a cadência automática para.
  const keepCadence = status === "novo" || status === "contatado";
  await (
    await db()
  ).execute({
    sql: `UPDATE prospects SET status = ?, owner = ?, notes = ?,
            next_action_at = CASE WHEN ? THEN next_action_at ELSE NULL END,
            updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
          WHERE id = ?`,
    args: [status, owner, notes, keepCadence ? 1 : 0, id],
  });
}

/**
 * Registra um contato feito: avança a etapa da cadência, agenda o próximo
 * contato e acrescenta uma linha de histórico às anotações. Na última etapa,
 * encerra como "perdido" (sem resposta), conforme o Playbook.
 */
export async function registerContact(id: number, channel: ContactChannel, by: string) {
  const prospect = await getProspect(id);
  if (!prospect) return;
  const step = currentStep(prospect.contactAttempts);
  if (!step) return;

  const isLast = step.key === cadenceSteps[cadenceSteps.length - 1].key;
  const next = step.daysToNext === null ? null : todaySP(step.daysToNext);
  const notes = [prospect.notes, historyLine(channel, step, by)].filter(Boolean).join("\n");
  const status: ProspectStatus = isLast
    ? "perdido"
    : prospect.status === "novo"
      ? "contatado"
      : prospect.status;

  await (
    await db()
  ).execute({
    sql: `UPDATE prospects SET contact_attempts = contact_attempts + 1,
            last_contact_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
            next_action_at = ?, status = ?, notes = ?,
            updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
          WHERE id = ?`,
    args: [next, status, isLast ? `${notes}\nSem resposta após a cadência.` : notes, id],
  });
}

/** Dados usados no score, para recalcular sem nova coleta. */
export async function listForRescore() {
  const result = await (
    await db()
  ).execute(
    "SELECT id, source, name, status, niche, reviews, rating, phone, website, opened_at, shared_phone, score FROM prospects",
  );
  return result.rows.map((row) => ({
    id: Number(row.id),
    source: String(row.source) as NewProspect["source"],
    openedAt: row.opened_at ? String(row.opened_at) : null,
    sharedPhone: Number(row.shared_phone ?? 0),
    name: String(row.name),
    status: String(row.status) as ProspectStatus,
    niche: String(row.niche),
    reviews: row.reviews === null ? null : Number(row.reviews),
    rating: row.rating === null ? null : Number(row.rating),
    phone: row.phone ? String(row.phone) : null,
    website: row.website ? String(row.website) : null,
    score: Number(row.score),
  }));
}

export async function updateScores(scores: { id: number; score: number; reasons: string }[]) {
  if (scores.length === 0) return;
  await (
    await db()
  ).batch(
    scores.map(({ id, score, reasons }) => ({
      sql: "UPDATE prospects SET score = ?, score_reasons = ? WHERE id = ?",
      args: [score, reasons, id],
    })),
    "write",
  );
}

/** Descarta prospects ainda não trabalhados, registrando o motivo nas anotações. */
export async function discardProspects(ids: number[], reason: string) {
  if (ids.length === 0) return;
  await (
    await db()
  ).batch(
    ids.map((id) => ({
      sql: `UPDATE prospects SET status = 'descartado', notes = ?,
              updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
            WHERE id = ? AND status = 'novo'`,
      args: [reason, id],
    })),
    "write",
  );
}

/**
 * Atualiza a marcação de telefone compartilhado (e o score) de empresas do
 * CNPJ já gravadas, quando uma nova leitura da Receita conta os números.
 */
export async function updateSharedPhones(
  updates: { externalId: string; sharedPhone: number; score: number; reasons: string }[],
) {
  const client = await db();
  let changed = 0;
  for (let i = 0; i < updates.length; i += 100) {
    const results = await client.batch(
      updates.slice(i, i + 100).map((u) => ({
        sql: `UPDATE prospects SET shared_phone = ?, score = ?, score_reasons = ?
              WHERE external_id = ? AND source = 'cnpj' AND shared_phone <> ?`,
        args: [u.sharedPhone, u.score, u.reasons, u.externalId, u.sharedPhone],
      })),
      "write",
    );
    changed += results.reduce((sum, r) => sum + r.rowsAffected, 0);
  }
  return changed;
}
