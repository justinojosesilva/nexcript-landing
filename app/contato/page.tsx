import Link from "next/link";
import type { Metadata } from "next";
import {
  ChevronRight,
  MessageCircle,
  Mail,
  Send,
  CalendarCheck,
  Clock,
} from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contato — NexCript",
  description:
    "Fale com a NexCript. Resposta em até 24h. Primeira conversa sem compromisso.",
};

const channels = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+55 (11) 97045-2495",
    note: "Resposta mais rápida",
    href: "https://wa.me/5511970452495",
  },
  {
    icon: Mail,
    label: "E-mail",
    value: "contato@nexcript.com.br",
    note: null,
    href: "mailto:contato@nexcript.com.br",
  },
  {
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
      </svg>
    ),
    label: "LinkedIn",
    value: "/company/nexcript",
    note: null,
    href: "https://www.linkedin.com/company/nexcript/",
  },
];

const timeline = [
  {
    icon: Send,
    step: "1",
    title: "Você envia o formulário",
    description: "Com as informações básicas do seu projeto.",
  },
  {
    icon: Clock,
    step: "2",
    title: "Resposta em 24h",
    description: "Você recebe um e-mail com link de agendamento.",
  },
  {
    icon: CalendarCheck,
    step: "3",
    title: "Reunião de 30 min",
    description: "Conversamos para entender seu projeto a fundo.",
  },
];

export default function ContatoPage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────── */}
      <section className="bg-navy pt-32 pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-gray-400">
                <li>
                  <Link href="/" className="transition-colors hover:text-teal-light">
                    Home
                  </Link>
                </li>
                <li>
                  <ChevronRight size={14} className="text-gray-600" />
                </li>
                <li className="text-teal-light">Contato</li>
              </ol>
            </nav>

            <h1 className="max-w-3xl font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              Vamos construir algo juntos
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-400">
              Resposta em até 24h úteis. Primeira conversa sem compromisso.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── CORPO ─────────────────────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-[3fr_2fr]">
            {/* Form */}
            <FadeIn>
              <ContactForm />
            </FadeIn>

            {/* Sidebar */}
            <FadeIn delay={0.15}>
              <div className="space-y-10">
                {/* Channels */}
                <div>
                  <h2 className="font-display text-lg font-bold text-text">
                    Outros canais
                  </h2>
                  <div className="mt-5 space-y-4">
                    {channels.map((ch) => (
                      <a
                        key={ch.label}
                        href={ch.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-4 rounded-xl border border-gray-100 p-4 transition-shadow hover:shadow-md"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-bg text-teal">
                          <ch.icon />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text">
                            {ch.label}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {ch.value}
                          </p>
                          {ch.note && (
                            <p className="mt-0.5 text-xs text-teal">
                              {ch.note}
                            </p>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-100" />

                {/* After timeline */}
                <div>
                  <h2 className="font-display text-lg font-bold text-text">
                    O que acontece depois
                  </h2>
                  <div className="mt-5 space-y-0">
                    {timeline.map((step, i) => (
                      <div key={step.step} className="relative flex gap-4 pb-8 last:pb-0">
                        {/* Vertical line */}
                        {i < timeline.length - 1 && (
                          <div className="absolute left-[19px] top-10 bottom-0 w-px bg-gray-200" />
                        )}
                        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-bg text-teal">
                          <step.icon size={18} />
                        </div>
                        <div className="pt-1">
                          <p className="text-sm font-semibold text-text">
                            {step.title}
                          </p>
                          <p className="mt-0.5 text-xs text-text-secondary">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
