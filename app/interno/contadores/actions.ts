"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { isAuthorized } from "@/lib/internal/auth";
import {
  accountantStatuses,
  updateAccountant,
  type AccountantStatus,
} from "@/lib/prospects/accountants";

export async function saveAccountant(formData: FormData) {
  // Server Functions podem ser chamadas de qualquer URL, fora do matcher do
  // proxy. Por isso a autenticação é conferida aqui também.
  if (!isAuthorized((await headers()).get("authorization"))) {
    throw new Error("Não autorizado.");
  }

  const phone = String(formData.get("phone") ?? "");
  const status = formData.get("status") as AccountantStatus;
  const notes =
    String(formData.get("notes") ?? "")
      .trim()
      .slice(0, 2000) || null;
  if (!/^55\d{10,11}$/.test(phone) || !accountantStatuses.includes(status)) return;

  await updateAccountant(phone, status, notes);
  revalidatePath("/interno/contadores");
}
