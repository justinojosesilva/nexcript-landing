"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { isAuthorized } from "@/lib/internal/auth";
import { contactChannels, type ContactChannel } from "@/lib/prospects/cadence";
import {
  prospectOwners,
  prospectStatuses,
  registerContact,
  updateProspect,
  type ProspectOwner,
  type ProspectStatus,
} from "@/lib/prospects/db";

export async function saveProspect(formData: FormData) {
  // Server Functions podem ser chamadas de qualquer URL, fora do matcher do
  // proxy. Por isso a autenticação é conferida aqui também.
  if (!isAuthorized((await headers()).get("authorization"))) {
    throw new Error("Não autorizado.");
  }

  const id = Number(formData.get("id"));
  const status = formData.get("status") as ProspectStatus;
  const ownerValue = String(formData.get("owner") ?? "");
  const owner = prospectOwners.includes(ownerValue as ProspectOwner)
    ? (ownerValue as ProspectOwner)
    : null;
  const notes = String(formData.get("notes") ?? "").trim().slice(0, 2000) || null;
  if (!Number.isInteger(id) || !prospectStatuses.includes(status)) return;

  await updateProspect(id, status, owner, notes);
  revalidatePath("/interno/prospeccao");
}

export async function registerContactAction(formData: FormData) {
  if (!isAuthorized((await headers()).get("authorization"))) {
    throw new Error("Não autorizado.");
  }

  const id = Number(formData.get("id"));
  const channel = formData.get("channel") as ContactChannel;
  const by = String(formData.get("by") ?? "").slice(0, 40);
  if (!Number.isInteger(id) || !contactChannels.includes(channel)) return;

  await registerContact(id, channel, by);
  revalidatePath("/interno/prospeccao");
}
