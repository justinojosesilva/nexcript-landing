import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isAuthorized } from "@/lib/internal/auth";
import { countLeadsByStatus, leadStatuses, listLeads, type LeadStatus } from "@/lib/leads/db";
import { formatWhatsapp, originLabel } from "@/lib/leads/origin";
import { saveLead } from "./actions";
import styles from "./leads.module.css";

export const metadata: Metadata = {
  title: "Leads | Nexcript interno",
};

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  if (!isAuthorized((await headers()).get("authorization"))) notFound();

  const { status: requested } = await searchParams;
  const status = leadStatuses.find((s) => s === requested) as LeadStatus | undefined;
  const [leads, counts] = await Promise.all([listLeads(status), countLeadsByStatus()]);
  const total = Object.values(counts).reduce((sum, n) => sum + (n ?? 0), 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>NEXCRIPT · ÁREA INTERNA</p>
          <h1>Leads do site</h1>
        </div>
        <p className={styles.summary}>
          {total} no total · {counts.novo ?? 0} aguardando primeiro contato
        </p>
      </header>

      <nav className={styles.filters} aria-label="Filtrar por status">
        <a href="/interno/leads" aria-current={!status ? "page" : undefined}>
          Todos <span>{total}</span>
        </a>
        {leadStatuses.map((s) => (
          <a
            key={s}
            href={`/interno/leads?status=${encodeURIComponent(s)}`}
            aria-current={status === s ? "page" : undefined}
          >
            {s} <span>{counts[s] ?? 0}</span>
          </a>
        ))}
      </nav>

      {leads.length === 0 ? (
        <p className={styles.empty}>Nenhum lead {status ? `com status “${status}”` : "ainda"}.</p>
      ) : (
        <ul className={styles.list}>
          {leads.map((lead) => (
            <li key={lead.id} className={styles.card}>
              <div className={styles.cardHead}>
                <div>
                  <h2>{lead.company}</h2>
                  <p>
                    {lead.name} · {dateFormat.format(new Date(lead.createdAt))}
                  </p>
                </div>
                <span className={styles.badge} data-status={lead.status}>
                  {lead.status}
                </span>
              </div>

              <dl className={styles.details}>
                <div>
                  <dt>WhatsApp</dt>
                  <dd>
                    <a href={`https://wa.me/${lead.whatsapp}`} target="_blank" rel="noopener noreferrer">
                      {formatWhatsapp(lead.whatsapp)}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>E-mail</dt>
                  <dd>{lead.email ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : "—"}</dd>
                </div>
                <div>
                  <dt>Interesse</dt>
                  <dd>{lead.interest}</dd>
                </div>
                <div>
                  <dt>Origem</dt>
                  <dd>
                    {originLabel(lead.utmSource, lead.referrer)}
                    {lead.utmCampaign && ` / ${lead.utmCampaign}`}
                  </dd>
                </div>
              </dl>

              <p className={styles.message}>{lead.message}</p>

              {/* A key recria o formulário após salvar, com os valores atualizados. */}
              <form
                key={`${lead.status}-${lead.notes ?? ""}`}
                action={saveLead}
                className={styles.form}
              >
                <input type="hidden" name="id" value={lead.id} />
                <label>
                  Status
                  <select name="status" defaultValue={lead.status}>
                    {leadStatuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label className={styles.notes}>
                  Anotações
                  <textarea
                    name="notes"
                    rows={2}
                    defaultValue={lead.notes ?? ""}
                    placeholder="Próxima ação, data, o que foi conversado..."
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
