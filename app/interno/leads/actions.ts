"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { isAuthorized } from "@/lib/internal/auth";
import {
  leadOwners,
  leadStatuses,
  registerLeadContact,
  updateLead,
  type LeadOwner,
  type LeadStatus,
} from "@/lib/leads/db";
import { contactChannels, type ContactChannel } from "@/lib/prospects/cadence";

// Server Functions podem ser chamadas de qualquer URL, fora do matcher do
// proxy. Por isso a autenticação é conferida aqui também.
async function assertAuthorized() {
  if (!isAuthorized((await headers()).get("authorization"))) {
    throw new Error("Não autorizado.");
  }
}

export async function saveLead(formData: FormData) {
  await assertAuthorized();

  const id = Number(formData.get("id"));
  const status = formData.get("status") as LeadStatus;
  const ownerValue = String(formData.get("owner") ?? "");
  const owner = leadOwners.includes(ownerValue as LeadOwner) ? (ownerValue as LeadOwner) : null;
  const notes =
    String(formData.get("notes") ?? "")
      .trim()
      .slice(0, 2000) || null;
  if (!Number.isInteger(id) || !leadStatuses.includes(status)) return;

  await updateLead(id, status, owner, notes);
  revalidatePath("/interno/leads");
}

export async function registerLeadContactAction(formData: FormData) {
  await assertAuthorized();

  const id = Number(formData.get("id"));
  const channel = formData.get("channel") as ContactChannel;
  const by = String(formData.get("by") ?? "").slice(0, 40);
  if (!Number.isInteger(id) || !contactChannels.includes(channel)) return;

  await registerLeadContact(id, channel, by);
  revalidatePath("/interno/leads");
}
