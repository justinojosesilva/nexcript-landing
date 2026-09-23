"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { track } from "@/analytics/events";
import { captureOrigin, type VisitOrigin } from "@/analytics/origin";
import { whatsappNumber, whatsappUrl } from "@/lib/contact";
import { interestOptions } from "@/lib/leads/validate";

type Status = "idle" | "sending" | "sent" | "failed";

function buildMessage(form: FormData) {
  const field = (name: string) => String(form.get(name) ?? "").trim();
  return `Olá! Quero solicitar um diagnóstico.\n\nNome: ${field("name")}\nEmpresa: ${field("company")}\nInteresse: ${field("interest")}\nDesafio: ${field("message")}`;
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const startedAt = useRef(0);
  const origin = useRef<VisitOrigin>({});

  useEffect(() => {
    startedAt.current = Date.now();
    origin.current = captureOrigin();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = new FormData(event.currentTarget);
    setWhatsappMessage(buildMessage(form));
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(form),
          startedAt: startedAt.current,
          origin: origin.current,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (response.status === 422) {
        setError(result.error ?? "Confira os campos do formulário.");
        setStatus("idle");
        return;
      }
      if (!response.ok || !result.ok) throw new Error(result.error);
      track("lead_submitted", { channel: "form" });
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  const whatsappLink = whatsappNumber ? whatsappUrl(whatsappMessage) : "";

  if (status === "sent" || status === "failed") {
    const sent = status === "sent";
    return (
      <div className="nx-form nx-form-result" role="status">
        {sent && <CheckCircle2 size={36} strokeWidth={1.5} />}
        <h3>{sent ? "Pedido recebido." : "Não conseguimos registrar agora."}</h3>
        <p>
          {sent
            ? "Vamos analisar a presença digital da sua empresa e responder pelo WhatsApp informado em até 4 horas úteis."
            : "Tivemos uma falha no envio. Para não perder seu pedido, continue pelo WhatsApp com a mensagem já preenchida."}
        </p>
        {whatsappLink && (
          <a
            className={`nx-button ${sent ? "nx-button-outline" : ""}`}
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("external_contact_opened", { channel: "whatsapp" })}
          >
            {sent ? "Quer adiantar? Fale no WhatsApp" : "Continuar no WhatsApp"}
            <ArrowUpRight size={18} />
          </a>
        )}
      </div>
    );
  }

  return (
    <form
      className="nx-form"
      onSubmit={handleSubmit}
      onFocus={() => track("lead_started")}
    >
      <h3>Conte um pouco sobre seu negócio.</h3>
      <p>Vamos entender seu momento e indicar o próximo passo.</p>
      <div className="nx-form-row">
        <label htmlFor="name">
          Seu nome{" "}
          <input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Como podemos chamar você?"
            required
            maxLength={100}
            pattern=".*\S.*"
          />
        </label>
        <label htmlFor="whatsapp">
          WhatsApp{" "}
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(11) 90000-0000"
            required
            maxLength={20}
            pattern="\D*(\d\D*){10,13}"
            title="Informe o número com DDD."
          />
        </label>
      </div>
      <div className="nx-form-row">
        <label htmlFor="company">
          Nome da empresa{" "}
          <input
            id="company"
            name="company"
            autoComplete="organization"
            placeholder="Sua empresa ou projeto"
            required
            maxLength={150}
            pattern=".*\S.*"
          />
        </label>
        <label htmlFor="email">
          E-mail <span className="nx-optional">(opcional)</span>{" "}
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voce@empresa.com.br"
            maxLength={150}
          />
        </label>
      </div>
      <label htmlFor="interest">
        O que você precisa hoje?{" "}
        <select id="interest" name="interest" defaultValue="Ainda não sei">
          {interestOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <label htmlFor="message">
        Qual é seu principal desafio?{" "}
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Ex.: recebo visitas no Instagram, mas poucos pedidos de orçamento."
          required
          maxLength={1200}
          minLength={10}
        />
      </label>
      {/* Campo invisível: só robôs preenchem. */}
      <label className="nx-hp" aria-hidden="true">
        Site
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <p className="nx-form-note">
        Usamos esses dados apenas para responder a esta solicitação, sem
        compartilhá-los. Para pedir a exclusão, fale com a gente pelo WhatsApp.
        Evite incluir dados sensíveis.
      </p>
      {error && (
        <p className="nx-form-note nx-form-error" role="alert">
          {error}
        </p>
      )}
      <button className="nx-button" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Enviando..." : "Solicitar diagnóstico"}
        <ArrowUpRight size={18} />
      </button>
    </form>
  );
}
