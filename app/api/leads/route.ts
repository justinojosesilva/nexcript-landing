import { after } from "next/server";
import { hasRecentLead, insertLead } from "@/lib/leads/db";
import { confirmToVisitor, notifyTeam } from "@/lib/leads/notify";
import { looksLikeBot, parseLead, type LeadPayload } from "@/lib/leads/validate";

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

  try {
    const { lead } = parsed;
    if (await hasRecentLead(lead.whatsapp)) return Response.json({ ok: true });

    const id = await insertLead(lead);
    after(async () => {
      await Promise.allSettled([notifyTeam(id, lead), confirmToVisitor(id, lead)]);
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
