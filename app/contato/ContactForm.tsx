"use client";
import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { contactEmail, whatsappNumber, whatsappUrl } from "@/lib/contact";
export function ContactForm() {
  const [prepared, setPrepared] = useState(false);
  const available = Boolean(whatsappNumber || contactEmail);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!available) return;
    const form = new FormData(event.currentTarget);
    const message = `Olá! Quero solicitar um diagnóstico.\n\nNome: ${String(form.get("name")).trim()}\nE-mail: ${form.get("email")}\nEmpresa: ${String(form.get("company")).trim()}\nInteresse: ${form.get("interest")}\nDesafio: ${String(form.get("message")).trim()}`;
    const url = whatsappNumber
      ? whatsappUrl(message)
      : `mailto:${contactEmail}?subject=${encodeURIComponent("Diagnóstico Nexcript")}&body=${encodeURIComponent(message)}`;
    window.location.assign(url);
    setPrepared(true);
  }
  return (
    <form className="nx-form" onSubmit={handleSubmit}>
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
        <label htmlFor="email">
          E-mail{" "}
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voce@empresa.com.br"
            required
            maxLength={150}
          />
        </label>
      </div>
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
      <label htmlFor="interest">
        O que você precisa hoje?{" "}
        <select id="interest" name="interest" defaultValue="Ainda não sei">
          <option>Ainda não sei</option>
          <option>Landing Page</option>
          <option>Site Essencial</option>
          <option>Site Business</option>
          <option>Nexcript Care</option>
          <option>Automação ou sistema</option>
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
      <p className="nx-form-note">
        Usaremos essas informações para conversar sobre sua solicitação. Evite
        incluir dados sensíveis.
      </p>
      <button className="nx-button" type="submit" disabled={!available}>
        {whatsappNumber
          ? "Continuar no WhatsApp"
          : contactEmail
            ? "Preparar e-mail de diagnóstico"
            : "Contato em configuração"}
        <ArrowUpRight size={18} />
      </button>
      <p className="nx-form-note" role="status">
        {prepared
          ? "Mensagem preparada. Conclua o envio no aplicativo que foi aberto; sua solicitação ainda não foi confirmada."
          : available
            ? `Você revisa e envia a mensagem no ${whatsappNumber ? "WhatsApp" : "seu aplicativo de e-mail"}.`
            : "Estamos preparando nosso canal de atendimento. Em breve você poderá solicitar seu diagnóstico por aqui."}
      </p>
    </form>
  );
}
