import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isAuthorized } from "@/lib/internal/auth";
import { formatDay, todaySP } from "@/lib/prospects/cadence";
import {
  getProspect,
  listProspects,
  prospectOwners,
  prospectStatuses,
  prospectSummary,
  type Prospect,
  type ProspectFilters,
  type ProspectOwner,
  type ProspectStatus,
} from "@/lib/prospects/db";
import { shortName } from "@/lib/prospects/messages";
import { findNiche, niches } from "@/lib/prospects/niches";
import { ProspectDialog } from "./ProspectDialog";
import styles from "../panel.module.css";

export const metadata: Metadata = {
  title: "Prospecção | Nexcript interno",
};

const PAGE_SIZE = 24;

type Search = {
  tipo?: string;
  nicho?: string;
  status?: string;
  responsavel?: string;
  pagina?: string;
  id?: string;
};

function hrefWith(current: Search, change: Partial<Search>) {
  const params = new URLSearchParams(
    Object.entries({ ...current, ...change }).filter(([, v]) => v) as [string, string][],
  );
  const query = params.toString();
  return `/interno/prospeccao${query ? `?${query}` : ""}`;
}

function nextAction(p: Prospect) {
  if (!p.nextActionAt) return null;
  const today = todaySP();
  if (p.nextActionAt < today) return { label: `Atrasado · ${formatDay(p.nextActionAt)}`, tone: "late" };
  if (p.nextActionAt === today) return { label: "Contato hoje", tone: "today" };
  return { label: `Próximo · ${formatDay(p.nextActionAt)}`, tone: "later" };
}

export default async function ProspectingPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  if (!isAuthorized((await headers()).get("authorization"))) notFound();

  const search = await searchParams;
  const filters: ProspectFilters = {
    visitable: search.tipo === "visitavel" ? true : search.tipo === "remoto" ? false : undefined,
    due: search.tipo === "hoje",
    niche: findNiche(search.nicho ?? "")?.id,
    status: prospectStatuses.find((s) => s === search.status) as ProspectStatus | undefined,
    owner:
      search.responsavel === "sem responsável"
        ? "sem responsável"
        : (prospectOwners.find((o) => o === search.responsavel) as ProspectOwner | undefined),
  };
  const page = Math.max(1, Number.parseInt(search.pagina ?? "1", 10) || 1);
  const detailId = Number(search.id);

  const [{ prospects, total }, summary, detail] = await Promise.all([
    listProspects(filters, page, PAGE_SIZE),
    prospectSummary(),
    Number.isInteger(detailId) && detailId > 0 ? getProspect(detailId) : null,
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Mudar de aba ou filtro volta para a página 1 e fecha o detalhe.
  const listSearch: Search = { ...search, id: undefined };
  const tabs = [
    { tipo: undefined, label: "Todos", count: summary.total },
    { tipo: "hoje", label: "Para hoje", count: summary.due },
    { tipo: "visitavel", label: "Visitáveis (São Paulo)", count: summary.visitable },
    { tipo: "remoto", label: "Remotos", count: summary.remote },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>NEXCRIPT · ÁREA INTERNA</p>
          <h1>Prospecção</h1>
        </div>
        <p className={styles.summary}>
          {total} {total === 1 ? "empresa" : "empresas"} neste filtro ·{" "}
          {search.tipo === "hoje" ? "mais atrasados primeiro" : "ordenadas pelo score"}
        </p>
      </header>

      <nav className={styles.filters} aria-label="Tipo de contato">
        {tabs.map((tab) => (
          <a
            key={tab.label}
            href={hrefWith(listSearch, { tipo: tab.tipo, pagina: undefined })}
            aria-current={search.tipo === tab.tipo ? "page" : undefined}
            data-alert={tab.tipo === "hoje" && tab.count > 0 ? "" : undefined}
          >
            {tab.label} <span>{tab.count}</span>
          </a>
        ))}
      </nav>

      <form className={styles.toolbar} method="get">
        {search.tipo && <input type="hidden" name="tipo" value={search.tipo} />}
        <label>
          Nicho
          <select name="nicho" defaultValue={filters.niche ?? ""}>
            <option value="">Todos os nichos</option>
            {niches.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label} ({summary.byNiche[n.id] ?? 0})
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select name="status" defaultValue={filters.status ?? ""}>
            <option value="">Em aberto</option>
            {prospectStatuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Responsável
          <select name="responsavel" defaultValue={search.responsavel ?? ""}>
            <option value="">Todos</option>
            <option>sem responsável</option>
            {prospectOwners.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <button type="submit">Filtrar</button>
      </form>

      {prospects.length === 0 ? (
        <p className={styles.empty}>
          {search.tipo === "hoje"
            ? "Nenhum contato agendado para hoje."
            : "Nenhuma empresa com esses filtros. Rode pnpm prospectar para coletar."}
        </p>
      ) : (
        <ul className={styles.grid}>
          {prospects.map((p) => {
            const action = nextAction(p);
            return (
              <li key={p.id}>
                <a
                  href={hrefWith(search, { id: String(p.id) })}
                  className={styles.compact}
                  aria-current={detail?.id === p.id ? "true" : undefined}
                >
                  <div className={styles.compactHead}>
                    <h2 title={p.name}>{shortName(p.name)}</h2>
                    <span className={styles.scoreSmall}>{p.score}</span>
                  </div>
                  <p className={styles.compactMeta}>
                    {findNiche(p.niche)?.label ?? p.niche} · {p.neighborhood ?? p.city ?? "—"}
                  </p>
                  <p className={styles.compactMeta}>
                    {p.rating !== null ? `★ ${p.rating.toFixed(1)}` : "sem nota"} · {p.reviews ?? 0}{" "}
                    avaliações
                  </p>
                  <div className={styles.chips}>
                    <span className={styles.chip} data-status={p.status}>
                      {p.status}
                    </span>
                    {p.owner && <span className={styles.chip}>{p.owner}</span>}
                    {action && (
                      <span className={styles.chip} data-tone={action.tone}>
                        {action.label}
                      </span>
                    )}
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      )}

      {pages > 1 && (
        <nav className={styles.pagination} aria-label="Páginas">
          {page > 1 ? (
            <a href={hrefWith(listSearch, { pagina: String(page - 1) })}>← Anterior</a>
          ) : (
            <span aria-disabled="true">← Anterior</span>
          )}
          <span>
            Página {page} de {pages}
          </span>
          {page < pages ? (
            <a href={hrefWith(listSearch, { pagina: String(page + 1) })}>Próxima →</a>
          ) : (
            <span aria-disabled="true">Próxima →</span>
          )}
        </nav>
      )}

      {detail && <ProspectDialog prospect={detail} closeHref={hrefWith(search, { id: undefined })} />}
    </div>
  );
}
