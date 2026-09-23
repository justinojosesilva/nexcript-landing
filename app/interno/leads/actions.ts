"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { isAuthorized } from "@/lib/internal/auth";
import { leadStatuses, updateLead, type LeadStatus } from "@/lib/leads/db";

export async function saveLead(formData: FormData) {
  // Server Functions podem ser chamadas de qualquer URL, fora do matcher do
  // proxy. Por isso a autenticação é conferida aqui também.
  if (!isAuthorized((await headers()).get("authorization"))) {
    throw new Error("Não autorizado.");
  }

  const id = Number(formData.get("id"));
  const status = formData.get("status") as LeadStatus;
  const notes = String(formData.get("notes") ?? "").trim().slice(0, 2000) || null;
  if (!Number.isInteger(id) || !leadStatuses.includes(status)) return;

  await updateLead(id, status, notes);
  revalidatePath("/interno/leads");
}
