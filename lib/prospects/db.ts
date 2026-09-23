import { schemaOnce } from "../db";

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

// Quem cuida do contato: remoto (Justino) ou visitas em São Paulo (esposa).
export const prospectOwners = ["Justino", "Esposa"] as const;
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
};

export type Prospect = NewProspect & {
  id: number;
  createdAt: string;
  status: ProspectStatus;
  owner: ProspectOwner | null;
  notes: string | null;
};

const db = schemaOnce([
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
]);

/**
 * Grava sem duplicar: o mesmo lugar (external_id) ou o mesmo telefone já
 * cadastrado por outra fonte são ignorados. Devolve quantos entraram.
 */
export async function insertProspects(prospects: NewProspect[]) {
  const client = await db();
  let inserted = 0;
  for (const p of prospects) {
    const result = await client.execute({
      sql: `INSERT INTO prospects (source, external_id, name, niche, category, phone, website,
              address, neighborhood, city, state, visitable, rating, reviews, opened_at,
              maps_url, score, score_reasons)
            SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            WHERE NOT EXISTS (
              SELECT 1 FROM prospects WHERE external_id = ? OR (? IS NOT NULL AND phone = ?)
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
        p.externalId,
        p.phone,
        p.phone,
      ],
    });
    inserted += result.rowsAffected;
  }
  return inserted;
}

export type ProspectFilters = {
  visitable?: boolean;
  niche?: string;
  status?: ProspectStatus;
  owner?: ProspectOwner | "sem responsável";
};

export async function listProspects(filters: ProspectFilters, limit = 200) {
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
    where.push("status NOT IN ('ganho', 'perdido', 'descartado')");
  }
  if (filters.owner === "sem responsável") {
    where.push("owner IS NULL");
  } else if (filters.owner) {
    where.push("owner = ?");
    args.push(filters.owner);
  }

  const result = await (await db()).execute({
    sql: `SELECT * FROM prospects ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
          ORDER BY score DESC, reviews DESC LIMIT ${limit}`,
    args,
  });
  return result.rows.map(
    (row): Prospect => ({
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
    }),
  );
}

/** Totais para os filtros do painel (somente prospects em aberto). */
export async function prospectSummary() {
  const result = await (await db()).execute(
    `SELECT niche, visitable, COUNT(*) AS total FROM prospects
     WHERE status NOT IN ('ganho', 'perdido', 'descartado')
     GROUP BY niche, visitable`,
  );
  const byNiche: Record<string, number> = {};
  let visitable = 0;
  let remote = 0;
  for (const row of result.rows) {
    const total = Number(row.total);
    byNiche[String(row.niche)] = (byNiche[String(row.niche)] ?? 0) + total;
    if (Number(row.visitable) === 1) visitable += total;
    else remote += total;
  }
  return { byNiche, visitable, remote, total: visitable + remote };
}

export async function updateProspect(
  id: number,
  status: ProspectStatus,
  owner: ProspectOwner | null,
  notes: string | null,
) {
  await (await db()).execute({
    sql: `UPDATE prospects SET status = ?, owner = ?, notes = ?,
            updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
          WHERE id = ?`,
    args: [status, owner, notes, id],
  });
}
