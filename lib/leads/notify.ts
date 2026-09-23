import type { NewLead } from "./db";
import { formatWhatsapp, originLabel } from "./origin";

const RESEND_URL = "https://api.resend.com/emails";

function escape(value: string) {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

async function sendEmail(email: {
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
  idempotencyKey: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info(`[leads] RESEND_API_KEY ausente; e-mail não enviado: ${email.subject}`);
    return;
  }
  const response = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": email.idempotencyKey,
    },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL ?? "Nexcript <onboarding@resend.dev>",
      to: email.to,
      subject: email.subject,
      html: email.html,
      ...(email.replyTo && { reply_to: email.replyTo }),
    }),
  });
  if (!response.ok) {
    console.error(`[leads] Resend respondeu ${response.status}: ${await response.text()}`);
  }
}

/** Aviso interno para quem atende os leads (LEAD_NOTIFY_EMAIL, separado por vírgula). */
export async function notifyTeam(id: number, lead: NewLead) {
  const to = (process.env.LEAD_NOTIFY_EMAIL ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  if (to.length === 0) return;

  const origin = originLabel(lead.utmSource, lead.referrer);
  const whatsappLink = `https://wa.me/${lead.whatsapp}`;
  const rows: [string, string][] = [
    ["Nome", escape(lead.name)],
    ["Empresa", escape(lead.company)],
    ["WhatsApp", `<a href="${whatsappLink}">${formatWhatsapp(lead.whatsapp)}</a>`],
    ["E-mail", lead.email ? escape(lead.email) : "—"],
    ["Interesse", escape(lead.interest)],
    ["Origem", escape(origin + (lead.utmCampaign ? ` / ${lead.utmCampaign}` : ""))],
    ["Desafio", escape(lead.message).replace(/\n/g, "<br>")],
  ];
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nexcript.com.br";

  await sendEmail({
    to,
    subject: `Novo lead: ${lead.company} — ${lead.interest}`,
    replyTo: lead.email ?? undefined,
    idempotencyKey: `lead-${id}-team`,
    html: `<div style="font-family:Arial,sans-serif;font-size:15px;color:#111">
      <p><strong>Novo lead #${id} pelo site.</strong> Meta: responder em até 4 horas úteis.</p>
      <table cellpadding="6" style="border-collapse:collapse">
        ${rows.map(([label, value]) => `<tr><td style="color:#666;vertical-align:top">${label}</td><td>${value}</td></tr>`).join("")}
      </table>
      <p><a href="${whatsappLink}">Responder no WhatsApp</a> · <a href="${site}/interno/leads">Abrir painel de leads</a></p>
    </div>`,
  });
}

/**
 * Confirmação para o visitante. Só liga com domínio verificado no Resend
 * (LEAD_CONFIRMATION_ENABLED=true e LEAD_FROM_EMAIL no domínio da Nexcript).
 */
export async function confirmToVisitor(id: number, lead: NewLead) {
  if (process.env.LEAD_CONFIRMATION_ENABLED !== "true" || !lead.email) return;
  const firstName = escape(lead.name.split(" ")[0]);

  await sendEmail({
    to: [lead.email],
    subject: "Recebemos seu pedido de diagnóstico — Nexcript",
    idempotencyKey: `lead-${id}-visitor`,
    html: `<div style="font-family:Arial,sans-serif;font-size:15px;color:#111">
      <p>Olá, ${firstName}.</p>
      <p>Recebemos seu pedido de diagnóstico para <strong>${escape(lead.company)}</strong>.
      Vamos analisar a presença digital da empresa e responder pelo WhatsApp informado em até 4 horas úteis.</p>
      <p>Se preferir adiantar a conversa, é só responder este e-mail.</p>
      <p>Equipe Nexcript</p>
    </div>`,
  });
}
