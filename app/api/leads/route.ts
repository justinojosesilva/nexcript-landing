import { after } from "next/server";
import { hasRecentLead, insertLead } from "@/lib/leads/db";
import { confirmToVisitor, notifyTeam } from "@/lib/leads/notify";
import { looksLikeBot, parseLead, type LeadPayload } from "@/lib/leads/validate";
import { crmConfigured, crmLeadUrl, sendSiteLead } from "@/lib/nexcrm";

export async function POST(request: Request) {
  let payload: LeadPayload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Requisição inválida." }, { status: 400 });
  }

  // Robôs recebem sucesso para não aprenderem a contornar o filtro.
  if (looksLikeBot(payload)) return Response.json({ ok: true });

  const parsed = parseLead(payload);
  if ("error" in parsed) {
    return Response.json({ ok: false, error: parsed.error }, { status: 422 });
  }
  const { lead } = parsed;
  const key = crypto.randomUUID();

  // O lead vai para o NexCRM. Se o CRM falhar, fica no Turso para não se
  // perder, e o e-mail avisa a equipe para cadastrar à mão.
  if (crmConfigured()) {
    try {
      const { leadId, created } = await sendSiteLead({ ...lead, externalId: key });
      if (created && leadId) {
        after(async () => {
          await Promise.allSettled([
            notifyTeam(key, lead, crmLeadUrl(leadId)),
            confirmToVisitor(key, lead),
          ]);
        });
      }
      return Response.json({ ok: true });
    } catch (error) {
      console.error("[leads] NexCRM indisponível; gravando no Turso", error);
    }
  }

  try {
    if (await hasRecentLead(lead.whatsapp)) return Response.json({ ok: true });
    await insertLead(lead);
    after(async () => {
      await Promise.allSettled([notifyTeam(key, lead, null), confirmToVisitor(key, lead)]);
    });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[leads] Falha ao registrar lead", error);
    return Response.json(
      { ok: false, error: "Não conseguimos registrar agora." },
      { status: 503 },
    );
  }
}
