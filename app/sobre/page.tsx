import Link from "next/link";
import type { Metadata } from "next";
import {
  ChevronRight,
  Lightbulb,
  ShieldCheck,
  Handshake,
  Search,
  PenTool,
  Code2,
  PackageCheck,
  RefreshCw,

} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "Sobre — NexCript",
  description:
    "Consultoria boutique de tecnologia. 14+ anos de experiência construindo sistemas que duram para startups e PMEs.",
};

/* ─── DATA ──────────────────────────────────────────── */

const values = [
  {
    icon: Lightbulb,
    title: "Clareza antes do código",
    description:
      "Não escrevemos uma linha antes de entender profundamente o problema. Diagnóstico primeiro, solução depois.",
  },
  {
    icon: ShieldCheck,
    title: "Qualidade não é opcional",
    description:
      "Clean Code, cobertura de testes, documentação técnica e revisão de código são padrão em todo projeto.",
  },
  {
    icon: Handshake,
    title: "Parceria de longo prazo",
    description:
      "Não somos fornecedores — somos sócios técnicos. O sucesso do seu produto é o nosso sucesso.",
  },
];

const methodology = [
  {
    icon: Search,
    step: "01",
    title: "Descoberta",
    description:
      "Entendemos o problema, o contexto de negócio e os objetivos antes de propor qualquer solução técnica.",
  },
  {
    icon: PenTool,
    step: "02",
    title: "Arquitetura",
    description:
      "Documentada e aprovada por você antes de qualquer código. Sem surpresas, sem retrabalho.",
  },
  {
    icon: Code2,
    step: "03",
    title: "Desenvolvimento",
    description:
      "Sprints semanais com entregas visíveis, demos ao vivo e reuniões de alinhamento.",
  },
  {
    icon: PackageCheck,
    step: "04",
    title: "Entrega",
    description:
      "Deploy em produção, documentação completa, treinamento da equipe e 30 dias de garantia.",
  },
  {
    icon: RefreshCw,
    step: "05",
    title: "Evolução",
    description:
      "Parceria contínua via retainer mensal. Seu produto não para — ele cresce com o negócio.",
  },
];

const techGroups = [
  {
    label: "Back-end",
    techs: ["Java", "Spring Boot", "Node.js", "NestJS", "Python", "FastAPI"],
  },
  {
    label: "Front-end",
    techs: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    label: "Cloud",
    techs: ["AWS", "Docker", "Vercel", "PostgreSQL", "MongoDB", "Redis"],
  },
  {
    label: "IA e automação",
    techs: ["OpenAI", "LangChain", "n8n", "Python ML", "RAG"],
  },
];

const specialties = [
  "Java",
  "Node.js",
  "React",
  "Clean Architecture",
  "IA",
];

/* ─── PAGE ──────────────────────────────────────────── */

export default function SobrePage() {
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
                <li className="text-teal-light">Sobre</li>
              </ol>
            </nav>

            <h1 className="max-w-3xl font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              Consultoria boutique. Resultado real.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-400">
              Não somos uma fábrica de software. Somos um time enxuto e sênior
              que entrega tecnologia com propósito — do diagnóstico à evolução
              contínua.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── HISTÓRIA E MISSÃO ─────────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-text md:text-4xl">
              Por que a NexCript existe
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-text-secondary">
              <p>
                Depois de mais de uma década construindo software em empresas de
                todos os tamanhos, uma coisa ficou clara: a maioria dos projetos
                não falha por falta de tecnologia — falha por falta de
                arquitetura, por decisões técnicas apressadas e por fornecedores
                que vendem escopo sem entender o problema.
              </p>
              <p>
                A NexCript nasceu da frustração de ver empresas pagarem caro por
                código que não escala, não tem testes e precisa ser reescrito em
                12 meses. Acreditamos que uma arquitetura bem pensada desde o
                início economiza 10x o investimento depois — em manutenção, em
                retrabalho e em oportunidades perdidas.
              </p>
              <p>
                Por isso, nosso compromisso é ser parceiro, não fornecedor.
                Tratamos cada projeto como se fosse nosso, porque o resultado que
                entregamos define quem somos.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FUNDADOR ──────────────────────────────── */}
      <section className="bg-gray-soft py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <div className="flex flex-col items-center gap-12 md:flex-row md:items-start">
              {/* Avatar */}
              <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full bg-teal text-5xl font-bold text-white md:h-48 md:w-48">
                JS
              </div>

              {/* Bio */}
              <div className="text-center md:text-left">
                <h2 className="font-display text-2xl font-bold text-text md:text-3xl">
                  Justino Silva
                </h2>
                <p className="mt-1 text-teal">
                  Fundador &amp; Consultor Sênior
                </p>

                <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
                  <p>
                    14 anos de experiência construindo sistemas de missão
                    crítica para fintechs, SaaS e empresas de logística.
                    Especialista em arquitetura de software, com domínio
                    profundo em Java, JavaScript/TypeScript e ecossistema
                    cloud.
                  </p>
                  <p>
                    Apaixonado por Clean Architecture, Domain-Driven Design e
                    por transformar problemas complexos em soluções elegantes.
                    Nos últimos anos, mergulhou em IA aplicada para
                    automação de processos empresariais.
                  </p>
                </div>

                {/* Specialty tags */}
                <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
                  {specialties.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-teal-bg px-3.5 py-1.5 text-xs font-semibold text-teal"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Social links */}
                <div className="mt-6 flex justify-center gap-3 md:justify-start">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn de Justino Silva"
                    className="flex h-10 items-center gap-2 rounded-lg bg-white px-3.5 text-sm font-medium text-text-secondary transition-colors hover:bg-teal-bg hover:text-teal"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub de André Justino"
                    className="flex h-10 items-center gap-2 rounded-lg bg-white px-3.5 text-sm font-medium text-text-secondary transition-colors hover:bg-teal-bg hover:text-teal"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── VALORES ───────────────────────────────── */}
      <section className="bg-navy py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <h2 className="text-center font-display text-3xl font-bold text-white md:text-4xl">
              O que nos guia
            </h2>
          </FadeIn>

          <StaggerContainer className="mt-16 grid gap-8 md:grid-cols-3">
            {values.map((item) => (
              <StaggerItem key={item.title}>
                <div className="rounded-2xl border border-white/10 bg-navy-light p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal/15 text-teal-light">
                    <item.icon size={24} />
                  </div>
                  <h3 className="mt-6 font-display text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── COMO TRABALHAMOS ──────────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <FadeIn>
            <h2 className="text-center font-display text-3xl font-bold text-text md:text-4xl">
              Nossa metodologia
            </h2>
          </FadeIn>

          <div className="mt-16 space-y-0">
            {methodology.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.08}>
                <div className="relative flex gap-6 pb-12 last:pb-0">
                  {/* Vertical line */}
                  {i < methodology.length - 1 && (
                    <div className="absolute left-[23px] top-12 bottom-0 w-px bg-gray-200" />
                  )}

                  {/* Step icon */}
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-bg text-teal">
                    <step.icon size={22} />
                  </div>

                  {/* Content */}
                  <div className="pt-1">
                    <span className="font-mono text-xs text-text-secondary">
                      Etapa {step.step}
                    </span>
                    <h3 className="mt-1 font-display text-lg font-bold text-text">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {step.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECNOLOGIAS ──────────────────────────── */}
      <section className="bg-gray-soft py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <h2 className="text-center font-display text-3xl font-bold text-text md:text-4xl">
              Tecnologias que dominamos
            </h2>
          </FadeIn>

          <StaggerContainer className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {techGroups.map((group) => (
              <StaggerItem key={group.label}>
                <div>
                  <h3 className="mb-4 font-display text-sm font-bold text-text">
                    {group.label}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.techs.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg bg-white px-3 py-2 font-mono text-xs text-text-secondary shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────── */}
      <section className="border-t-4 border-teal bg-navy py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Quer conhecer melhor antes de contratar?
            </h2>
            <p className="mt-6 text-lg text-gray-400">
              Agende uma conversa de 30 min. Sem compromisso, sem pitch de
              vendas.
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
