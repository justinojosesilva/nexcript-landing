import type { Row } from "@libsql/client";
import { schemaOnce } from "../db";

/**
 * Prováveis escritórios de contabilidade: telefones que aparecem em várias
 * empresas recém-abertas. Base da Frente 2 (parcerias de indicação).
 */
export const accountantStatuses = [
  "novo",
  "contatado",
  "respondeu",
  "parceiro",
  "não é contador",
  "sem interesse",
] as const;
export type AccountantStatus = (typeof accountantStatuses)[number];

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

export type Accountant = Omit<AccountantInput, "month"> & {
  updatedMonth: string;
  status: AccountantStatus;
  notes: string | null;
};

const db = schemaOnce([
  `CREATE TABLE IF NOT EXISTS accountants (
    phone TEXT PRIMARY KEY,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT,
    companies INTEGER NOT NULL,
    cities TEXT,
    niches TEXT,
    sample TEXT,
    updated_month TEXT,
    status TEXT NOT NULL DEFAULT 'novo',
    notes TEXT
  )`,
  "CREATE INDEX IF NOT EXISTS accountants_companies ON accountants (companies DESC)",
]);

/** Grava ou atualiza os números; status e anotações da equipe são preservados. */
export async function upsertAccountants(list: AccountantInput[]) {
  const client = await db();
  for (let i = 0; i < list.length; i += 100) {
    await client.batch(
      list.slice(i, i + 100).map((a) => ({
        sql: `INSERT INTO accountants (phone, companies, cities, niches, sample, updated_month)
              VALUES (?, ?, ?, ?, ?, ?)
              ON CONFLICT (phone) DO UPDATE SET
                companies = excluded.companies, cities = excluded.cities,
                niches = excluded.niches, sample = excluded.sample,
                updated_month = excluded.updated_month,
                updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`,
        args: [
          a.phone,
          a.companies,
          a.cities.join(", "),
          a.niches.join(", "),
          a.sample.join(" · "),
          a.month,
        ],
      })),
      "write",
    );
  }
}

function toAccountant(row: Row): Accountant {
  const list = (value: unknown, sep: string) => (value ? String(value).split(sep) : []);
  return {
    phone: String(row.phone),
    companies: Number(row.companies),
    cities: list(row.cities, ", "),
    niches: list(row.niches, ", "),
    sample: list(row.sample, " · "),
    updatedMonth: String(row.updated_month ?? ""),
    status: String(row.status) as AccountantStatus,
    notes: row.notes ? String(row.notes) : null,
  };
}

export async function listAccountants(status?: AccountantStatus, page = 1, pageSize = 24) {
  const where = status ? "WHERE status = ?" : "";
  const args = status ? [status] : [];
  const client = await db();
  const [rows, count, byStatus] = await Promise.all([
    client.execute({
      sql: `SELECT * FROM accountants ${where} ORDER BY companies DESC LIMIT ? OFFSET ?`,
      args: [...args, pageSize, (page - 1) * pageSize],
    }),
    client.execute({ sql: `SELECT COUNT(*) AS total FROM accountants ${where}`, args }),
    client.execute("SELECT status, COUNT(*) AS total FROM accountants GROUP BY status"),
  ]);
  return {
    accountants: rows.rows.map(toAccountant),
    total: Number(count.rows[0].total),
    byStatus: Object.fromEntries(
      byStatus.rows.map((r) => [String(r.status), Number(r.total)]),
    ) as Partial<Record<AccountantStatus, number>>,
  };
}

export async function updateAccountant(
  phone: string,
  status: AccountantStatus,
  notes: string | null,
) {
  await (
    await db()
  ).execute({
    sql: `UPDATE accountants SET status = ?, notes = ?,
            updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
          WHERE phone = ?`,
    args: [status, notes, phone],
  });
}

/**
 * Mensagem de parceria: confirma se é mesmo contabilidade e oferece o site do
 * escritório como contrapartida pelas indicações (decisão de 23/09/2026).
 */
export function partnershipMessage(a: Accountant, sender: string) {
  return (
    `Olá! Sou ${sender}, da Nexcript. Vi que este número aparece no cadastro de várias empresas ` +
    `abertas recentemente${a.cities[0] ? ` em ${a.cities[0].split("/")[0]}` : ""}. Imagino que seja de um escritório de contabilidade, certo? ` +
    `A gente cria sites para empresas que estão começando, e muitos clientes precisam disso logo na abertura. ` +
    `A ideia é uma parceria: vocês indicam a Nexcript para os clientes que estão abrindo empresa, e em troca a gente faz o site do escritório de vocês. ` +
    `Posso explicar em 10 minutos?`
  );
}
