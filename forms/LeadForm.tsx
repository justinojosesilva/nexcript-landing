"use client";

import { FormEvent, useState } from "react";
import { track } from "@/analytics/events";
import { whatsappLink } from "@/integrations/whatsapp";

type LeadFormProps = {
  whatsapp?: string;
  email?: string;
  subject?: string;
};

export function LeadForm({ whatsapp, email, subject = "Novo contato pelo site" }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "invalid">("idle");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !message || (!whatsapp && !email)) {
      setStatus("invalid");
      return;
    }

    track("lead_submitted", { channel: whatsapp ? "whatsapp" : "email" });
    const body = `${subject}\n\nNome: ${name}\nMensagem: ${message}`;
    const href = whatsapp
      ? whatsappLink(whatsapp, body)
      : `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="nx-lead-form" onSubmit={submit} onFocus={() => track("lead_started")}>
      <label>Nome<input name="name" autoComplete="name" required /></label>
      <label>Como podemos ajudar?<textarea name="message" required rows={4} /></label>
      {status === "invalid" && <p role="alert">Preencha os campos e configure um canal de contato.</p>}
      <button className="nx-button" type="submit">Enviar mensagem</button>
    </form>
  );
}
