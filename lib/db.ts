import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;

/**
 * Turso em produção (TURSO_DATABASE_URL + TURSO_AUTH_TOKEN).
 * Em desenvolvimento, sem variáveis, usa um arquivo SQLite local.
 */
export function getClient(): Client {
  if (!client) {
    const url =
      process.env.TURSO_DATABASE_URL ??
      (process.env.NODE_ENV === "production" ? undefined : "file:.data/leads.db");
    if (!url) throw new Error("TURSO_DATABASE_URL não configurada.");
    client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  }
  return client;
}

/**
 * Cria as tabelas uma única vez por instância; tenta de novo se falhar.
 * `columns` adiciona colunas novas a tabelas que já existem em produção.
 */
export function schemaOnce(
  statements: string[],
  columns: { table: string; name: string; definition: string }[] = [],
) {
  let ready: Promise<unknown> | null = null;
  return async (): Promise<Client> => {
    const db = getClient();
    ready ??= (async () => {
      await db.batch(statements, "write");
      for (const table of new Set(columns.map((c) => c.table))) {
        const info = await db.execute(`PRAGMA table_info(${table})`);
        const existing = new Set(info.rows.map((row) => String(row.name)));
        for (const column of columns.filter((c) => c.table === table && !existing.has(c.name))) {
          await db.execute(`ALTER TABLE ${table} ADD COLUMN ${column.name} ${column.definition}`);
        }
      }
    })().catch((error) => {
      ready = null;
      throw error;
    });
    await ready;
    return db;
  };
}
