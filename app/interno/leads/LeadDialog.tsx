import { leadConversationScript, leadMessage } from "@/lib/leads/conversation";
import { leadOwners, leadStatuses, type Lead } from "@/lib/leads/db";
import { formatWhatsapp, originLabel } from "@/lib/leads/origin";
import { contactChannels, currentStep, formatDay, leadCadenceSteps } from "@/lib/prospects/cadence";
import { whatsappLink } from "@/lib/prospects/messages";
import { CloseOnEscape } from "../_components/CloseOnEscape";
import { DialogTabs } from "../_components/DialogTabs";
import { registerLeadContactAction, saveLead } from "./actions";
import styles from "../panel.module.css";

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

/**
 * Detalhe do lead do site, aberto por ?id= na URL. Mesma estrutura do
 * detalhe da prospecção, com mensagens para quem já pediu o diagnóstico.
 */
export function LeadDialog({ lead, closeHref }: { lead: Lead; closeHref: string }) {
  const step = currentStep(lead.contactAttempts, leadCadenceSteps);
  const sender = lead.owner ?? "Justino";
  const message = step ? leadMessage(lead, step, sender) : null;
  const closed = ["ganho", "perdido", "descartado"].includes(lead.status);
  const talk = leadConversationScript(lead);

  const waButton = (text: string, primary = false) => (
    <a
      className={primary ? styles.primary : styles.secondary}
      href={whatsappLink(lead.whatsapp, text)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {primary ? "Abrir no WhatsApp com a mensagem" : "Abrir no WhatsApp"}
    </a>
  );

  const nextContact = (
    <>
      <h3>{step && !closed ? step.label : "Cadência encerrada"}</h3>
      {message && !closed ? (
        <>
          <p className={styles.messageBox}>{message}</p>
          <div className={styles.actions}>
            {waButton(message, true)}
            <form action={registerLeadContactAction} className={styles.inline}>
              <input type="hidden" name="id" value={lead.id} />
              <input type="hidden" name="by" value={sender} />
              <select name="channel" defaultValue="WhatsApp" aria-label="Canal usado">
                {contactChannels.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <button type="submit">Registrar contato feito</button>
            </form>
          </div>
          <p className={styles.hint}>
            {lead.contactAttempts === 0 && "Meta: responder em até 4 horas úteis. "}
            Revise a mensagem no WhatsApp antes de enviar e só registre depois de enviar. O registro
            agenda o próximo contato e anota o histórico.
          </p>
        </>
      ) : (
        <p className={styles.hint}>
          {closed
            ? `Status "${lead.status}". Para retomar, mude o status na aba Acompanhamento.`
            : "Todas as etapas foram registradas."}
        </p>
      )}
    </>
  );

  const conversation = (
    <>
      <h3>Quando responderem</h3>
      <p className={styles.hint}>
        Esse contato já pediu o diagnóstico. Objetivo: marcar os 20 minutos, ou colher as respostas
        por mensagem se a pessoa preferir.
      </p>
      <div className={styles.accordion}>
        {talk.replies.map((reply) => (
          <details key={reply.trigger}>
            <summary>{reply.trigger}</summary>
            <p className={styles.messageBox}>{reply.answer}</p>
            <div className={styles.actions}>
              {waButton(reply.answer)}
              <span className={styles.hint}>
                {reply.tip} Status depois: <strong>{reply.status}</strong>.
              </span>
            </div>
          </details>
        ))}
      </div>

      <h3>Perguntas para entender o negócio</h3>
      <ol className={styles.script}>
        {talk.qualifying.map((question) => (
          <li key={question}>{question}</li>
        ))}
      </ol>

      <h3>Convite para o diagnóstico</h3>
      <p className={styles.messageBox}>{talk.invite}</p>
      <div className={styles.actions}>{waButton(talk.invite)}</div>

      <h3>Confirmação depois do aceite</h3>
      <p className={styles.messageBox}>{talk.confirmation}</p>
      <div className={styles.actions}>{waButton(talk.confirmation)}</div>

      <h3>Depois da conversa</h3>
      <ul className={styles.script}>
        <li>
          Mude o status para <strong>em contato</strong> ou <strong>diagnóstico agendado</strong> no
          Acompanhamento. Agendado para a cadência automática.
        </li>
        <li>Anote as respostas das perguntas e a data combinada.</li>
        {talk.automation && (
          <li>
            O interesse é em automação ou sistema: use o roteiro da Oferta de Automação para
            Clínicas (documentos) no diagnóstico.
          </li>
        )}
      </ul>
    </>
  );

  const followUp = (
    // A key recria o formulário após salvar, com os valores atualizados.
    <form
      key={`${lead.status}-${lead.owner ?? ""}-${lead.notes ?? ""}`}
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
      <label>
        Responsável
        <select name="owner" defaultValue={lead.owner ?? ""}>
          <option value="">—</option>
          {leadOwners.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
      <label className={styles.notes}>
        Anotações
        <textarea
          name="notes"
          rows={4}
          defaultValue={lead.notes ?? ""}
          placeholder="O que foi conversado, próxima ação, data..."
        />
      </label>
      <button type="submit">Salvar</button>
    </form>
  );

  return (
    <div className={styles.overlay}>
      <CloseOnEscape href={closeHref} />
      <a href={closeHref} className={styles.backdrop} aria-label="Fechar detalhe" tabIndex={-1} />
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-title"
      >
        <header className={styles.dialogHead}>
          <div>
            <p className={styles.eyebrow}>LEAD DO SITE · {lead.interest}</p>
            <h2 id="lead-title">{lead.company}</h2>
          </div>
          <a href={closeHref} className={styles.close} autoFocus>
            Fechar ✕
          </a>
        </header>

        <div className={styles.dialogBody}>
          <dl className={styles.detailList}>
            <div>
              <dt>Nome</dt>
              <dd>{lead.name}</dd>
            </div>
            <div>
              <dt>WhatsApp</dt>
              <dd>
                <a
                  href={`https://wa.me/${lead.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formatWhatsapp(lead.whatsapp)}
                </a>
              </dd>
            </div>
            <div>
              <dt>E-mail</dt>
              <dd>{lead.email ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : "—"}</dd>
            </div>
            <div>
              <dt>Origem</dt>
              <dd>
                {originLabel(lead.utmSource, lead.referrer)}
                {lead.utmCampaign && ` / ${lead.utmCampaign}`}
                {lead.utmMedium && ` · ${lead.utmMedium}`}
              </dd>
            </div>
            <div>
              <dt>Chegou em</dt>
              <dd>{dateTime.format(new Date(lead.createdAt))}</dd>
            </div>
            <div>
              <dt>Cadência</dt>
              <dd>
                {lead.contactAttempts} contato(s)
                {lead.lastContactAt &&
                  ` · último em ${dateTime.format(new Date(lead.lastContactAt))}`}
                {lead.nextActionAt && ` · próximo em ${formatDay(lead.nextActionAt)}`}
              </dd>
            </div>
          </dl>

          <div>
            <p className={styles.eyebrow}>DESAFIO QUE A PESSOA ESCREVEU</p>
            <p className={styles.message}>{lead.message}</p>
          </div>

          <DialogTabs
            // Encerrados abrem direto no acompanhamento, onde se retoma o status.
            initial={closed ? "acompanhamento" : "contato"}
            tabs={[
              { id: "contato", label: "Próximo contato", content: nextContact },
              ...(!closed
                ? [{ id: "conversa", label: "Roteiro de conversa", content: conversation }]
                : []),
              { id: "acompanhamento", label: "Acompanhamento", content: followUp },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
