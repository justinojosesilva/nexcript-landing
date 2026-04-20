"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

const projectTypes = [
  "MVP",
  "Sistema web",
  "Automação",
  "Integração",
  "Consultoria",
  "Outro",
];

const budgetRanges = [
  "Até R$ 15k",
  "R$ 15–50k",
  "R$ 50–100k",
  "Acima de R$ 100k",
  "Retainer",
];

const sources = [
  "Google",
  "LinkedIn",
  "Indicação",
  "Evento / meetup",
  "Outro",
];

type Errors = Record<string, string>;

const inputBase =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-text outline-none transition-colors placeholder:text-gray-400 focus:border-teal focus:ring-2 focus:ring-teal/20";
const selectBase =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-text outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/20 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [errors, setErrors] = useState<Errors>({});

  function validate(form: FormData): Errors {
    const errs: Errors = {};
    const name = form.get("name") as string;
    const email = form.get("email") as string;

    if (!name?.trim()) errs.name = "Nome é obrigatório";
    if (!email?.trim()) {
      errs.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "E-mail inválido";
    }

    return errs;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const errs = validate(form);

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Focus first invalid field
      const firstKey = Object.keys(errs)[0];
      const el = document.querySelector<HTMLElement>(`[name="${firstKey}"]`);
      el?.focus();
      return;
    }

    setErrors({});
    setStatus("loading");

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-2xl bg-teal-bg px-8 py-16 text-center"
      >
        <CheckCircle2 size={48} className="text-teal" />
        <h3 className="mt-4 font-display text-xl font-bold text-text">
          Mensagem enviada!
        </h3>
        <p className="mt-2 max-w-sm text-text-secondary">
          Recebemos sua mensagem e vamos responder em até 24h úteis com um link
          para agendar nossa primeira conversa.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Nome */}
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text">
          Nome completo <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          autoComplete="name"
          required
          className={`${inputBase} ${errors.name ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
          placeholder="Seu nome"
        />
        <AnimatePresence>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              role="alert"
              className="mt-1.5 text-sm text-red-500"
            >
              {errors.name}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text">
          E-mail <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          required
          className={`${inputBase} ${errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
          placeholder="seu@email.com"
        />
        <AnimatePresence>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              role="alert"
              className="mt-1.5 text-sm text-red-500"
            >
              {errors.email}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Empresa */}
      <div>
        <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-text">
          Empresa
        </label>
        <input
          type="text"
          id="company"
          name="company"
          autoComplete="organization"
          className={inputBase}
          placeholder="Nome da empresa (opcional)"
        />
      </div>

      {/* Tipo de projeto + Orçamento — 2 cols */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="projectType" className="mb-1.5 block text-sm font-medium text-text">
            Tipo de projeto
          </label>
          <select id="projectType" name="projectType" className={selectBase}>
            <option value="">Selecione</option>
            {projectTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="budget" className="mb-1.5 block text-sm font-medium text-text">
            Orçamento estimado
          </label>
          <select id="budget" name="budget" className={selectBase}>
            <option value="">Selecione</option>
            {budgetRanges.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mensagem */}
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-text">
          Conte sobre seu projeto
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={`${inputBase} resize-none`}
          placeholder="Descreva brevemente o que você precisa..."
        />
      </div>

      {/* Como nos encontrou */}
      <div>
        <label htmlFor="source" className="mb-1.5 block text-sm font-medium text-text">
          Como nos encontrou?
        </label>
        <select id="source" name="source" className={selectBase}>
          <option value="">Selecione (opcional)</option>
          {sources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal px-6 py-3.5 font-semibold text-white transition-colors hover:bg-teal-light disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar mensagem"
        )}
      </button>

      <p className="text-center text-xs text-text-secondary">
        Ao enviar, você concorda com nossa política de privacidade.
      </p>
    </form>
  );
}
