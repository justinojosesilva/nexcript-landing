import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isAuthorized } from "@/lib/internal/auth";
import { formatWhatsapp } from "@/lib/leads/origin";
import {
  accountantStatuses,
  listAccountants,
  partnershipMessage,
  type AccountantStatus,
} from "@/lib/prospects/accountants";
import { whatsappLink } from "@/lib/prospects/messages";
import { saveAccountant } from "./actions";
import styles from "../panel.module.css";

export const metadata: Metadata = {
  title: "Contadores | Nexcript interno",
};

const PAGE_SIZE = 24;
// Acima disso, o número é de contabilidade online ou rede nacional.
const NATIONAL_PLATFORM = 100;

type Search = { status?: string; pagina?: string };

function hrefWith(current: Search, change: Partial<Search>) {
  const params = new URLSearchParams(
    Object.entries({ ...current, ...change }).filter(([, v]) => v) as [string, string][],
  );
  const query = params.toString();
  return `/interno/contadores${query ? `?${query}` : ""}`;
}

/**
 * Frente 2: telefones que aparecem em várias empresas recém-abertas, quase
 * sempre de escritórios de contabilidade. A lista é gerada pelo
 * `pnpm prospectar:cnpj`; aqui a equipe acompanha a conversa de parceria.
 */
export default async function AccountantsPage({ searchParams }: { searchParams: Promise<Search> }) {
  if (!isAuthorized((await headers()).get("authorization"))) notFound();

  const search = await searchParams;
  const status = accountantStatuses.find((s) => s === search.status) as
    AccountantStatus | undefined;
  const page = Math.max(1, Number.parseInt(search.pagina ?? "1", 10) || 1);
  const { accountants, total, byStatus } = await listAccountants(status, page, PAGE_SIZE);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const all = Object.values(byStatus).reduce((sum, n) => sum + (n ?? 0), 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>NEXCRIPT · ÁREA INTERNA · FRENTE 2</p>
          <h1>Contadores</h1>
        </div>
        <p className={styles.summary}>
          Números que aparecem em 3 ou mais empresas recém-abertas · mais empresas primeiro
        </p>
      </header>

      <nav className={styles.filters} aria-label="Filtrar por status">
        <a href={hrefWith({}, {})} aria-current={!status ? "page" : undefined}>
          Todos <span>{all}</span>
        </a>
        {accountantStatuses.map((s) => (
          <a
            key={s}
            href={hrefWith({}, { status: s })}
            aria-current={status === s ? "page" : undefined}
          >
            {s} <span>{byStatus[s] ?? 0}</span>
          </a>
        ))}
      </nav>

      <p className={styles.hint}>
        A mensagem confirma primeiro se o número é mesmo de contabilidade e oferece o site do
        escritório em troca das indicações. As regras da parceria estão em
        Parceria_Contadores_Nexcript.md (documentos).
      </p>

      {accountants.length === 0 ? (
        <p className={styles.empty}>
          Nenhum número ainda. Rode <code>pnpm prospectar:cnpj</code> para gerar a lista.
        </p>
      ) : (
        <ul className={styles.list}>
          {accountants.map((a) => {
            const message = partnershipMessage(a, "Justino");
            return (
              <li key={a.phone} className={styles.card}>
                <div className={styles.cardHead}>
                  <div>
                    <h2>{formatWhatsapp(a.phone)}</h2>
                    <p>
                      {a.companies} empresas abertas recentemente com este número ·{" "}
                      {a.cities.map((c) => c.split("/")[0]).join(", ")}
                    </p>
                  </div>
                  {a.companies >= NATIONAL_PLATFORM && (
                    <span
                      className={styles.chip}
                      data-tone="warn"
                      title="Número em centenas de empresas: contabilidade online ou rede nacional, não escritório local"
                    >
                      plataforma nacional
                    </span>
                  )}
                  <span className={styles.badge} data-status={a.status}>
                    {a.status}
                  </span>
                </div>

                <dl className={styles.details}>
                  <div>
                    <dt>Nichos</dt>
                    <dd>{a.niches.join(", ") || "—"}</dd>
                  </div>
                  <div>
                    <dt>Exemplos de empresas</dt>
                    <dd>{a.sample.join(" · ") || "—"}</dd>
                  </div>
                  <div>
                    <dt>Atualizado</dt>
                    <dd>Receita {a.updatedMonth}</dd>
                  </div>
                </dl>

                <div className={styles.accordion}>
                  <details>
                    <summary>Mensagem de parceria</summary>
                    <p className={styles.messageBox}>{message}</p>
                    <div className={styles.actions}>
                      <a
                        className={styles.secondary}
                        href={whatsappLink(a.phone, message)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Abrir no WhatsApp
                      </a>
                    </div>
                  </details>
                </div>

                <form
                  key={`${a.status}-${a.notes ?? ""}`}
                  action={saveAccountant}
                  className={styles.form}
                >
                  <input type="hidden" name="phone" value={a.phone} />
                  <label>
                    Status
                    <select name="status" defaultValue={a.status}>
                      {accountantStatuses.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.notes}>
                    Anotações
                    <textarea
                      name="notes"
                      rows={2}
                      defaultValue={a.notes ?? ""}
                      placeholder="Nome do escritório, responsável, o que foi combinado..."
                    />
                  </label>
                  <button type="submit">Salvar</button>
                </form>
              </li>
            );
          })}
        </ul>
      )}

      {pages > 1 && (
        <nav className={styles.pagination} aria-label="Páginas">
          {page > 1 ? (
            <a href={hrefWith(search, { pagina: String(page - 1) })}>← Anterior</a>
          ) : (
            <span aria-disabled="true">← Anterior</span>
          )}
          <span>
            Página {page} de {pages}
          </span>
          {page < pages ? (
            <a href={hrefWith(search, { pagina: String(page + 1) })}>Próxima →</a>
          ) : (
            <span aria-disabled="true">Próxima →</span>
          )}
        </nav>
      )}
    </div>
  );
}
