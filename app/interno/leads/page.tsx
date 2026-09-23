import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isAuthorized } from "@/lib/internal/auth";
import {
  countLeadsByStatus,
  getLead,
  leadStatuses,
  listLeads,
  type Lead,
  type LeadStatus,
} from "@/lib/leads/db";
import { originLabel } from "@/lib/leads/origin";
import { formatDay, todaySP } from "@/lib/prospects/cadence";
import { LeadDialog } from "./LeadDialog";
import styles from "../panel.module.css";

export const metadata: Metadata = {
  title: "Leads | Nexcript interno",
};

const PAGE_SIZE = 24;
// Meta do Playbook para responder um lead novo.
const SLA_HOURS = 4;

type Search = { status?: string; tipo?: string; pagina?: string; id?: string };

function hrefWith(current: Search, change: Partial<Search>) {
  const params = new URLSearchParams(
    Object.entries({ ...current, ...change }).filter(([, v]) => v) as [string, string][],
  );
  const query = params.toString();
  return `/interno/leads${query ? `?${query}` : ""}`;
}

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

/** Etiqueta de urgência: lead sem resposta (meta de 4 h) ou próximo follow-up. */
function nextAction(lead: Lead) {
  if (lead.status === "novo" && lead.contactAttempts === 0) {
    const hours = Math.floor((Date.now() - new Date(lead.createdAt).getTime()) / 3_600_000);
    const age =
      hours < 1
        ? "há menos de 1 h"
        : hours < 48
          ? `há ${hours} h`
          : `há ${Math.floor(hours / 24)} dias`;
    return hours >= SLA_HOURS
      ? { label: `Sem resposta ${age}`, tone: "late" }
      : { label: `Responder · chegou ${age}`, tone: "today" };
  }
  if (!lead.nextActionAt) return null;
  const today = todaySP();
  if (lead.nextActionAt < today) {
    return { label: `Atrasado · ${formatDay(lead.nextActionAt)}`, tone: "late" };
  }
  if (lead.nextActionAt === today) return { label: "Contato hoje", tone: "today" };
  return { label: `Próximo · ${formatDay(lead.nextActionAt)}`, tone: "later" };
}

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Search> }) {
  if (!isAuthorized((await headers()).get("authorization"))) notFound();

  const search = await searchParams;
  const status = leadStatuses.find((s) => s === search.status) as LeadStatus | undefined;
  const due = search.tipo === "hoje";
  const page = Math.max(1, Number.parseInt(search.pagina ?? "1", 10) || 1);
  const detailId = Number(search.id);

  const [{ leads, total }, counts, detail] = await Promise.all([
    listLeads({ status: due ? undefined : status, due }, page, PAGE_SIZE),
    countLeadsByStatus(),
    Number.isInteger(detailId) && detailId > 0 ? getLead(detailId) : null,
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const all = Object.values(counts.byStatus).reduce((sum, n) => sum + (n ?? 0), 0);

  // Trocar de filtro volta para a página 1 e fecha o detalhe.
  const filters = [
    { href: hrefWith({}, {}), label: "Todos", count: all, current: !status && !due, alert: false },
    {
      href: hrefWith({}, { tipo: "hoje" }),
      label: "Para hoje",
      count: counts.due,
      current: due,
      alert: counts.due > 0,
    },
    ...leadStatuses.map((s) => ({
      href: hrefWith({}, { status: s }),
      label: s,
      count: counts.byStatus[s] ?? 0,
      current: !due && status === s,
      alert: false,
    })),
  ];
  const listSearch: Search = { ...search, id: undefined };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>NEXCRIPT · ÁREA INTERNA</p>
          <h1>Leads do site</h1>
        </div>
        <p className={styles.summary}>
          {all} no total · {counts.byStatus.novo ?? 0} aguardando primeiro contato
        </p>
      </header>

      <nav className={styles.filters} aria-label="Filtrar leads">
        {filters.map((f) => (
          <a
            key={f.label}
            href={f.href}
            aria-current={f.current ? "page" : undefined}
            data-alert={f.alert ? "" : undefined}
          >
            {f.label} <span>{f.count}</span>
          </a>
        ))}
      </nav>

      {leads.length === 0 ? (
        <p className={styles.empty}>
          {due
            ? "Nenhum lead para responder hoje."
            : `Nenhum lead ${status ? `com status “${status}”` : "ainda"}.`}
        </p>
      ) : (
        <ul className={styles.grid}>
          {leads.map((lead) => {
            const action = nextAction(lead);
            return (
              <li key={lead.id}>
                <a
                  href={hrefWith(search, { id: String(lead.id) })}
                  className={styles.compact}
                  aria-current={detail?.id === lead.id ? "true" : undefined}
                >
                  <div className={styles.compactHead}>
                    <h2 title={lead.company}>{lead.company}</h2>
                  </div>
                  <p className={styles.compactMeta}>
                    {lead.name} · {dateFormat.format(new Date(lead.createdAt))}
                  </p>
                  <p className={styles.compactMeta}>
                    {lead.interest} · {originLabel(lead.utmSource, lead.referrer)}
                  </p>
                  <div className={styles.chips}>
                    <span className={styles.chip} data-status={lead.status}>
                      {lead.status}
                    </span>
                    {lead.owner && <span className={styles.chip}>{lead.owner}</span>}
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

      {detail && <LeadDialog lead={detail} closeHref={hrefWith(search, { id: undefined })} />}
    </div>
  );
}
