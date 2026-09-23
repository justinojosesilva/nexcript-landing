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

/** Cria as tabelas uma única vez por instância; tenta de novo se falhar. */
export function schemaOnce(statements: string[]) {
  let ready: Promise<unknown> | null = null;
  return async (): Promise<Client> => {
    const db = getClient();
    ready ??= db.batch(statements, "write").catch((error) => {
      ready = null;
      throw error;
    });
    await ready;
    return db;
  };
}
