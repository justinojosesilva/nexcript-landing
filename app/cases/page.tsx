import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { CasesGrid } from "./CasesGrid";

export const metadata: Metadata = {
  title: "Cases — NexCript",
  description:
    "Problemas reais, soluções concretas. Conheça os projetos que entregamos para fintechs, SaaS, varejo e mais.",
};

export default function CasesPage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────── */}
      <section className="bg-navy pt-32 pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-gray-400">
                <li>
                  <Link
                    href="/"
                    className="transition-colors hover:text-teal-light"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <ChevronRight size={14} className="text-gray-600" />
                </li>
                <li className="text-teal-light">Cases</li>
              </ol>
            </nav>

            <h1 className="max-w-3xl font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              Problemas reais. Soluções concretas.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-400">
              Cada projeto começa com um problema de negócio, não com uma lista
              de tecnologias.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── CASES ─────────────────────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <CasesGrid />
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────── */}
      <section className="border-t-4 border-teal bg-navy py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Seu projeto pode ser o próximo
            </h2>
            <p className="mt-6 text-lg text-gray-400">
              Conte o que você precisa. Respondemos em até 24h.
            </p>
            <Link
              href="/contato"
              className="mt-10 inline-block rounded-xl bg-accent px-10 py-4 text-lg font-bold text-white transition-colors hover:bg-accent-hover"
            >
              Agendar diagnóstico gratuito
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
