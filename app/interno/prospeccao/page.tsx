import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isAuthorized } from "@/lib/internal/auth";
import { formatWhatsapp } from "@/lib/leads/origin";
import {
  listProspects,
  prospectOwners,
  prospectStatuses,
  prospectSummary,
  type ProspectFilters,
  type ProspectOwner,
  type ProspectStatus,
} from "@/lib/prospects/db";
import { hasKeywordName } from "@/lib/prospects/maps";
import { findNiche, niches } from "@/lib/prospects/niches";
import { saveProspect } from "./actions";
import styles from "../panel.module.css";

export const metadata: Metadata = {
  title: "Prospecção | Nexcript interno",
};

type Search = { tipo?: string; nicho?: string; status?: string; responsavel?: string };

function hrefWith(current: Search, change: Partial<Search>) {
  const params = new URLSearchParams(
    Object.entries({ ...current, ...change }).filter(([, v]) => v) as [string, string][],
  );
  const query = params.toString();
  return `/interno/prospeccao${query ? `?${query}` : ""}`;
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
    niche: findNiche(search.nicho ?? "")?.id,
    status: prospectStatuses.find((s) => s === search.status) as ProspectStatus | undefined,
    owner:
      search.responsavel === "sem responsável"
        ? "sem responsável"
        : (prospectOwners.find((o) => o === search.responsavel) as ProspectOwner | undefined),
  };
  const [prospects, summary] = await Promise.all([listProspects(filters), prospectSummary()]);

  const tabs = [
    { tipo: undefined, label: "Todos", count: summary.total },
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
          {summary.total} empresas em aberto · ordenadas pelo score
        </p>
      </header>

      <nav className={styles.filters} aria-label="Tipo de contato">
        {tabs.map((tab) => (
          <a
            key={tab.label}
            href={hrefWith(search, { tipo: tab.tipo })}
            aria-current={search.tipo === tab.tipo ? "page" : undefined}
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
          Nenhuma empresa com esses filtros. Rode <code>pnpm prospectar</code> para coletar.
        </p>
      ) : (
        <ul className={styles.list}>
          {prospects.map((p) => (
            <li key={p.id} className={styles.card}>
              <div className={styles.cardHead}>
                <div>
                  <h2>{p.name}</h2>
                  {hasKeywordName(p.name) && (
                    <span
                      className={styles.flag}
                      title="O nome no Google tem palavra-chave: alguém já trabalha o Google dessa empresa."
                    >
                      nome com palavra-chave
                    </span>
                  )}
                  <p>
                    {findNiche(p.niche)?.label ?? p.niche}
                    {p.category && ` · ${p.category}`} ·{" "}
                    {[p.neighborhood, p.city, p.state].filter(Boolean).join(", ")}
                  </p>
                </div>
                <span className={styles.score} title={p.scoreReasons}>
                  {p.score}
                </span>
              </div>

              <dl className={styles.details}>
                <div>
                  <dt>Telefone</dt>
                  <dd>
                    {p.phone ? (
                      <a href={`https://wa.me/${p.phone}`} target="_blank" rel="noopener noreferrer">
                        {formatWhatsapp(p.phone)}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Google</dt>
                  <dd>
                    {p.rating !== null ? `★ ${p.rating.toFixed(1)}` : "—"} · {p.reviews ?? 0} avaliações
                  </dd>
                </div>
                <div>
                  <dt>Presença</dt>
                  <dd>
                    {p.website ? (
                      <a href={p.website} target="_blank" rel="noopener noreferrer">
                        só rede social
                      </a>
                    ) : (
                      "sem site"
                    )}
                    {p.mapsUrl && (
                      <>
                        {" · "}
                        <a href={p.mapsUrl} target="_blank" rel="noopener noreferrer">
                          ver no Maps
                        </a>
                      </>
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Contato</dt>
                  <dd>{p.visitable ? "Visitável (SP)" : "Remoto"}</dd>
                </div>
              </dl>

              <p className={styles.reasons}>{p.scoreReasons}</p>

              {/* A key recria o formulário após salvar, com os valores atualizados. */}
              <form
                key={`${p.status}-${p.owner ?? ""}-${p.notes ?? ""}`}
                action={saveProspect}
                className={styles.form}
              >
                <input type="hidden" name="id" value={p.id} />
                <label>
                  Status
                  <select name="status" defaultValue={p.status}>
                    {prospectStatuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Responsável
                  <select name="owner" defaultValue={p.owner ?? ""}>
                    <option value="">—</option>
                    {prospectOwners.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </label>
                <label className={styles.notes}>
                  Anotações
                  <textarea
                    name="notes"
                    rows={2}
                    defaultValue={p.notes ?? ""}
                    placeholder="Observação específica, próxima ação, data..."
                  />
                </label>
                <button type="submit">Salvar</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
