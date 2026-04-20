import Link from "next/link";
import {
  AlertTriangle,
  Rocket,
  Bot,
  Code2,
  Zap,
  Users,
  CalendarClock,
  ArrowRight,
  Quote,
  Blocks,
  BrainCircuit,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import { Counter } from "@/components/ui/Counter";
import { HeroAnimation } from "./HeroAnimation";

/* ─── DATA ──────────────────────────────────────────── */

const problems = [
  {
    icon: AlertTriangle,
    title: "Sistema legado travando crescimento",
    description:
      "Reescrita estratégica que moderniza sem parar a operação. Migramos monólitos para arquiteturas escaláveis com zero downtime.",
  },
  {
    icon: Rocket,
    title: "MVP que precisa sair rápido e certo",
    description:
      "Arquitetura pensada para crescer desde o dia 1, com entrega funcional em 6–10 semanas. Nada de retrabalho depois.",
  },
  {
    icon: Bot,
    title: "Processo manual que vira gargalo",
    description:
      "Automação inteligente com IA que elimina tarefas repetitivas e libera seu time para o que realmente importa.",
  },
];

const services = [
  {
    icon: Code2,
    title: "Desenvolvimento de sistemas sob medida",
    description:
      "Plataformas, painéis, ERPs e apps construídos do zero com stack moderna e arquitetura limpa.",
  },
  {
    icon: Rocket,
    title: "MVPs em 6–10 semanas",
    description:
      "Validação rápida com código de produção. Sem protótipos descartáveis — seu MVP já nasce escalável.",
  },
  {
    icon: BrainCircuit,
    title: "Automação com IA",
    description:
      "Chatbots, processamento de documentos e workflows inteligentes integrados ao seu sistema.",
  },
  {
    icon: Blocks,
    title: "Integrações e APIs",
    description:
      "Conectamos ERPs, gateways de pagamento, CRMs e qualquer serviço externo via APIs robustas.",
  },
  {
    icon: Users,
    title: "Consultoria técnica",
    description:
      "Code review, auditoria de arquitetura e mentoria para times internos que querem evoluir.",
  },
  {
    icon: CalendarClock,
    title: "Retainer mensal",
    description:
      "Horas dedicadas todo mês para evolução contínua, correções e novas features sob demanda.",
  },
];

const stats = [
  { value: 14, suffix: "+", label: "anos de experiência" },
  { value: 50, suffix: "+", label: "projetos entregues" },
  { value: 100, suffix: "%", label: "código documentado" },
  { value: 30, suffix: "", label: "dias de garantia" },
];

const cases = [
  {
    badge: "Fintech",
    title: "Plataforma de crédito consignado",
    stack: "Next.js · Node.js · PostgreSQL · AWS",
    result: "3x mais velocidade na aprovação de contratos",
  },
  {
    badge: "SaaS",
    title: "Sistema de gestão para clínicas",
    stack: "React · NestJS · MongoDB · Docker",
    result: "Redução de 70% no tempo de agendamento",
  },
  {
    badge: "E-commerce",
    title: "Motor de recomendação com IA",
    stack: "Python · FastAPI · React · Redis",
    result: "+42% no ticket médio em 3 meses",
  },
  {
    badge: "Logística",
    title: "Automação de roteirização de entregas",
    stack: "Java · Spring Boot · React · AWS",
    result: "Economia de R$ 180k/mês em combustível",
  },
];

const testimonial = {
  quote:
    "A NexCript não é uma fábrica de software — são parceiros técnicos de verdade. Entenderam nosso problema, propuseram uma arquitetura que fez sentido e entregaram no prazo. Nosso sistema hoje roda com metade dos custos de infra.",
  name: "Mariana Oliveira",
  role: "CTO",
  company: "CrediFácil",
};

const techLogos = ["React", "Node.js", "Java", "NestJS", "AWS"];

/* ─── PAGE ──────────────────────────────────────────── */

export default function Home() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────── */}
      <section
        className="relative flex min-h-dvh items-center overflow-hidden bg-navy pt-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(13,27,42,0.97), rgba(13,27,42,0.97)),
            linear-gradient(rgba(13,115,119,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13,115,119,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 60px 60px, 60px 60px",
        }}
      >
        {/* Ambient glow orbs */}
        <div
          className="pointer-events-none absolute left-[15%] top-[30%] h-[520px] w-[520px] -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(13,115,119,0.55) 0%, transparent 65%)",
            opacity: 0.22,
          }}
        />
        <div
          className="pointer-events-none absolute bottom-[8%] right-[8%] h-[360px] w-[360px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(20,160,133,0.6) 0%, transparent 65%)",
            opacity: 0.12,
          }}
        />

        <div className="mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
          <HeroAnimation>
            {/* Badge with pulsing dot */}
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-4 py-1.5 text-sm font-medium text-teal-light">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-light opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-light" />
              </span>
              Consultoria em tecnologia
            </span>

            <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              De MVP à escala — arquitetura limpa, código que dura.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-400">
              Desenvolvemos sistemas, automações e produtos digitais sob medida
              para startups e empresas em crescimento.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/servicos"
                className="group inline-flex items-center gap-2 rounded-lg bg-teal px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:gap-3 hover:bg-teal-light hover:shadow-[0_0_28px_rgba(13,115,119,0.45)]"
              >
                Ver serviços
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/cases"
                className="rounded-lg border border-white/20 px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5"
              >
                Cases reais
              </Link>
            </div>

            {/* Tech stack */}
            <div className="mt-20 flex flex-wrap items-center gap-x-8 gap-y-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-600">
                Stack
              </span>
              {techLogos.map((name) => (
                <span
                  key={name}
                  className="font-mono text-sm font-medium tracking-wider text-gray-500 transition-colors duration-300 hover:text-teal-light"
                >
                  {name}
                </span>
              ))}
            </div>
          </HeroAnimation>
        </div>
      </section>

      {/* ── PROBLEMA ──────────────────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <div className="mb-5 flex justify-center">
              <span className="h-1 w-10 rounded-full bg-linear-to-r from-teal to-teal-light" />
            </div>
            <h2 className="text-center font-display text-3xl font-bold text-text md:text-4xl">
              Você já perdeu tempo e dinheiro com tecnologia errada?
            </h2>
          </FadeIn>

          <StaggerContainer className="mt-16 grid gap-8 md:grid-cols-3">
            {problems.map((item) => (
              <StaggerItem key={item.title}>
                <div className="rounded-2xl border border-gray-100 bg-white p-8 transition-all duration-300 hover:border-teal/15 hover:shadow-[0_8px_40px_rgba(13,115,119,0.07)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-teal/20 to-teal/5 text-teal ring-1 ring-teal/15">
                    <item.icon size={22} />
                  </div>
                  <h3 className="mt-6 font-display text-lg font-bold text-text">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── SERVIÇOS ──────────────────────────────── */}
      <section className="bg-gray-soft py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <div className="mb-5 flex justify-center">
              <span className="h-1 w-10 rounded-full bg-linear-to-r from-teal to-teal-light" />
            </div>
            <h2 className="text-center font-display text-3xl font-bold text-text md:text-4xl">
              Como podemos ajudar
            </h2>
          </FadeIn>

          <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((item) => (
              <StaggerItem key={item.title}>
                <div className="rounded-2xl bg-white p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(13,115,119,0.07)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-teal/20 to-teal/5 text-teal ring-1 ring-teal/15">
                    <item.icon size={22} />
                  </div>
                  <h3 className="mt-6 font-display text-lg font-bold text-text">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn className="mt-12 text-center">
            <Link
              href="/servicos"
              className="group inline-flex items-center gap-2 font-semibold text-teal transition-all duration-200 hover:gap-3 hover:text-teal-light"
            >
              Ver todos os serviços
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── NÚMEROS ───────────────────────────────── */}
      <section className="bg-navy py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <StaggerContainer className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <StaggerItem key={stat.label} className="text-center">
                <p className="font-display text-4xl font-bold md:text-5xl">
                  <span className="bg-linear-to-b from-white to-teal-light bg-clip-text text-transparent">
                    <Counter target={stat.value} suffix={stat.suffix} />
                  </span>
                </p>
                <p className="mt-3 text-sm text-gray-400">{stat.label}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── CASES ─────────────────────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <div className="mb-5 flex justify-center">
              <span className="h-1 w-10 rounded-full bg-linear-to-r from-teal to-teal-light" />
            </div>
            <h2 className="text-center font-display text-3xl font-bold text-text md:text-4xl">
              Problemas reais, soluções concretas
            </h2>
          </FadeIn>

          <StaggerContainer className="mt-16 grid gap-6 md:grid-cols-2">
            {cases.map((item) => (
              <StaggerItem key={item.title}>
                <div className="rounded-2xl border border-gray-100 bg-white p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal/20 hover:shadow-[0_8px_40px_rgba(13,115,119,0.07)]">
                  <span className="inline-block rounded-full bg-teal-bg px-3 py-1 text-xs font-semibold text-teal">
                    {item.badge}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-text">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-mono text-xs text-text-secondary">
                    {item.stack}
                  </p>
                  <div className="mt-5 flex items-center gap-2 rounded-xl bg-teal-bg/70 px-4 py-2.5">
                    <Zap size={15} className="shrink-0 text-teal" />
                    <p className="text-sm font-semibold text-teal">
                      {item.result}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn className="mt-12 text-center">
            <Link
              href="/cases"
              className="group inline-flex items-center gap-2 font-semibold text-teal transition-all duration-200 hover:gap-3 hover:text-teal-light"
            >
              Ver todos os cases
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── DEPOIMENTO ────────────────────────────── */}
      <section className="bg-gray-soft py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <FadeIn>
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute h-16 w-16 rounded-full bg-teal/10" />
              <Quote size={40} className="relative text-teal/50" />
            </div>
            <blockquote className="mt-8 font-display text-xl font-medium leading-relaxed text-text md:text-2xl">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <div className="mt-10 flex flex-col items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-teal to-teal-light text-lg font-bold text-white shadow-[0_0_20px_rgba(13,115,119,0.3)]">
                {testimonial.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="font-semibold text-text">{testimonial.name}</p>
                <p className="text-sm text-text-secondary">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy py-24 md:py-32">
        {/* Top gradient line */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-teal/50 to-transparent" />
        {/* Bottom radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 110%, rgba(13,115,119,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Pronto para construir algo que dura?
            </h2>
            <p className="mt-6 text-lg text-gray-400">
              Agende uma conversa de 30 min. Sem compromisso.
            </p>
            <Link
              href="/contato"
              className="group mt-10 inline-flex items-center gap-2 rounded-xl bg-accent px-10 py-4 text-lg font-bold text-white transition-all duration-300 hover:gap-3 hover:bg-accent-hover hover:shadow-[0_0_32px_rgba(230,126,34,0.35)]"
            >
              Agendar diagnóstico gratuito
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
