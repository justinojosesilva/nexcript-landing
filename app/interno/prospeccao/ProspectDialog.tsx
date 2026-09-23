import { contactChannels, currentStep, formatDay } from "@/lib/prospects/cadence";
import { conversationScript } from "@/lib/prospects/conversation";
import { prospectOwners, prospectStatuses, type Prospect } from "@/lib/prospects/db";
import { formatWhatsapp } from "@/lib/leads/origin";
import { isMobile } from "@/lib/prospects/maps";
import { buildMessage, visitScript, whatsappLink } from "@/lib/prospects/messages";
import { findNiche } from "@/lib/prospects/niches";
import { registerContactAction, saveProspect } from "./actions";
import { CloseOnEscape } from "../_components/CloseOnEscape";
import { DialogTabs } from "../_components/DialogTabs";
import styles from "../panel.module.css";

function hostOf(url: string) {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

/**
 * Detalhe do prospect, aberto por ?id= na URL: pode ser compartilhado entre
 * Justino e Andréia e fecha com Esc ou pelo link. As seções ficam em abas.
 */
export function ProspectDialog({
  prospect: p,
  closeHref,
}: {
  prospect: Prospect;
  closeHref: string;
}) {
  const step = currentStep(p.contactAttempts);
  const sender = p.owner ?? "Justino";
  const message = step ? buildMessage(p, step, sender) : null;
  const mobile = p.phone ? isMobile(p.phone) : false;
  const closed = ["ganho", "perdido", "descartado"].includes(p.status);

  const nextContact = (
    <>
      <h3>{step && !closed ? step.label : "Cadência encerrada"}</h3>
      {message && !closed ? (
        <>
          <p className={styles.messageBox}>{message}</p>
          <div className={styles.actions}>
            {p.phone && (
              <a
                className={styles.primary}
                href={whatsappLink(p.phone, message)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir no WhatsApp com a mensagem
              </a>
            )}
            <form action={registerContactAction} className={styles.inline}>
              <input type="hidden" name="id" value={p.id} />
              <input type="hidden" name="by" value={sender} />
              <select
                name="channel"
                defaultValue={p.visitable && p.owner === "Andréia" ? "Visita" : "WhatsApp"}
                aria-label="Canal usado"
              >
                {contactChannels.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <button type="submit">Registrar contato feito</button>
            </form>
          </div>
          <p className={styles.hint}>
            Revise a mensagem no WhatsApp antes de enviar e só registre depois de enviar. O registro
            agenda o próximo contato e anota o histórico.
            {!mobile && p.phone && " Telefone fixo: prefira ligar ou visitar."}
          </p>
        </>
      ) : (
        <p className={styles.hint}>
          {closed
            ? `Status "${p.status}". Para retomar, mude o status na aba Acompanhamento.`
            : "Todas as etapas foram registradas."}
        </p>
      )}
    </>
  );

  const talk = conversationScript(p, sender);
  const waButton = (text: string) =>
    p.phone && (
      <a
        className={styles.secondary}
        href={whatsappLink(p.phone, text)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Abrir no WhatsApp
      </a>
    );

  const conversation = (
    <>
      <h3>Quando responderem</h3>
      <p className={styles.hint}>
        Abra a situação que aconteceu, revise a resposta e envie. Objetivo da conversa: marcar os 20
        minutos de diagnóstico, não vender por mensagem.
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
      <p className={styles.hint}>
        Use quando a conversa abrir, uma de cada vez. Anote as respostas no Acompanhamento.
      </p>
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
          Mude o status para <strong>respondeu</strong> ou <strong>diagnóstico agendado</strong> no
          Acompanhamento. Isso para a cadência automática.
        </li>
        <li>Anote o nome do responsável, as respostas das perguntas e a data combinada.</li>
        <li>
          No diagnóstico, guarde para o final (sem vender agora): {talk.automationHint}. É a porta
          para a automação depois do site.
        </li>
      </ul>
    </>
  );

  const visit = (
    <ol className={styles.script}>
      {visitScript(p, p.owner === "Justino" ? "Justino" : "Andréia").map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ol>
  );

  const followUp = (
    <>
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
            rows={4}
            defaultValue={p.notes ?? ""}
            placeholder="Nome do responsável, o que foi conversado, próxima ação..."
          />
        </label>
        <button type="submit">Salvar</button>
      </form>
    </>
  );

  return (
    <div className={styles.overlay}>
      <CloseOnEscape href={closeHref} />
      <a href={closeHref} className={styles.backdrop} aria-label="Fechar detalhe" tabIndex={-1} />
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="prospect-title"
      >
        <header className={styles.dialogHead}>
          <div>
            <p className={styles.eyebrow}>
              {findNiche(p.niche)?.label ?? p.niche}
              {p.category && ` · ${p.category}`}
            </p>
            <h2 id="prospect-title">{p.name}</h2>
          </div>
          <a href={closeHref} className={styles.close} autoFocus>
            Fechar ✕
          </a>
        </header>

        <div className={styles.dialogBody}>
          <div className={styles.scoreRow}>
            <span className={styles.score}>{p.score}</span>
            <p className={styles.reasons}>{p.scoreReasons}</p>
          </div>

          <dl className={styles.detailList}>
            <div>
              <dt>Telefone</dt>
              <dd>
                {p.phone ? (
                  <>
                    <a href={`tel:+${p.phone}`}>{formatWhatsapp(p.phone)}</a>{" "}
                    {mobile ? "(celular)" : "(fixo: pode não ter WhatsApp)"}
                  </>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div>
              <dt>Endereço</dt>
              <dd>
                {p.address ?? ([p.neighborhood, p.city, p.state].filter(Boolean).join(", ") || "—")}
              </dd>
            </div>
            <div>
              <dt>Google</dt>
              <dd>
                {p.rating !== null ? `★ ${p.rating.toFixed(1)}` : "sem nota"} · {p.reviews ?? 0}{" "}
                avaliações
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
              <dt>Presença</dt>
              <dd>
                {p.website ? (
                  <a href={p.website} target="_blank" rel="noopener noreferrer">
                    só rede social ({hostOf(p.website)})
                  </a>
                ) : (
                  "sem site"
                )}
              </dd>
            </div>
            <div>
              <dt>Contato</dt>
              <dd>{p.visitable ? "Visitável (cidade de São Paulo)" : "Remoto"}</dd>
            </div>
            <div>
              <dt>Cadência</dt>
              <dd>
                {p.contactAttempts} contato(s)
                {p.lastContactAt && ` · último em ${dateTime.format(new Date(p.lastContactAt))}`}
                {p.nextActionAt && ` · próximo em ${formatDay(p.nextActionAt)}`}
              </dd>
            </div>
            <div>
              <dt>Coletado</dt>
              <dd>
                {dateTime.format(new Date(p.createdAt))} ·{" "}
                {p.source === "maps" ? "Google Maps" : "CNPJ"}
              </dd>
            </div>
          </dl>

          <DialogTabs
            // Encerrados abrem direto no acompanhamento, onde se retoma o status.
            initial={closed ? "acompanhamento" : "contato"}
            tabs={[
              { id: "contato", label: "Próximo contato", content: nextContact },
              ...(!closed
                ? [{ id: "conversa", label: "Roteiro de conversa", content: conversation }]
                : []),
              ...(p.visitable && !closed
                ? [{ id: "visita", label: "Roteiro de visita", content: visit }]
                : []),
              { id: "acompanhamento", label: "Acompanhamento", content: followUp },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
