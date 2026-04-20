"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Mail } from "lucide-react";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3"
      >
        <CheckCircle2 size={40} className="text-white" />
        <p className="text-lg font-semibold text-white">Inscrito com sucesso!</p>
        <p className="text-sm text-teal-bg">
          Você receberá nossos próximos artigos no seu e-mail.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 sm:flex-row sm:items-stretch">
      <div className="relative w-full max-w-md">
        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="email"
          name="email"
          required
          placeholder="seu@email.com"
          className="w-full rounded-xl border-0 bg-white/10 py-3.5 pl-11 pr-4 text-white placeholder:text-white/50 outline-none ring-1 ring-white/20 transition-all focus:bg-white/15 focus:ring-2 focus:ring-teal-light"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3.5 font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Enviando...
          </>
        ) : (
          "Inscrever-se"
        )}
      </button>
    </form>
  );
}
