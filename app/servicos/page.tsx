import Link from "next/link";
import type { Metadata } from "next";
import {
  Stethoscope,
  Network,
  Map,
  Rocket,
  Monitor,
  BrainCircuit,
  Blocks,
  Search,
  PenTool,
  Code2,
  PackageCheck,
  Handshake,
  ArrowRight,
  Check,
  ChevronRight,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "Serviços — NexCript",
  description:
    "Soluções sob medida para cada fase do seu negócio. Diagnóstico, MVP, sistemas, automação com IA e retainer mensal.",
};

/* ─── DATA ──────────────────────────────────────────── */

const entryServices = [
  {
    icon: Stethoscope,
    title: "Diagnóstico tecnológico",
    description:
      "Sessão de 2–4h para mapear gargalos, avaliar stack atual e definir prioridades técnicas com base no seu contexto de negócio.",
    duration: "2–4 horas",
    price: "R$ 1.500 – R$ 4.000",
  },
  {
    icon: Network,
    title: "Revisão de arquitetura",
    description:
      "Análise profunda da sua base de código, infraestrutura e fluxos de dados. Você recebe um relatório com recomendações acionáveis.",
    duration: "1–2 semanas",
    price: "R$ 2.000 – R$ 6.000",
  },
  {
    icon: Map,
    title: "Planejamento de MVP",
    description:
      "Definimos escopo, prioridades, wireframes e roadmap técnico para que seu MVP saia do papel com clareza e sem desperdício.",
    duration: "1–2 semanas",
    price: "R$ 2.500 – R$ 5.000",
  },
];

const mainServices = [
  {
    icon: Rocket,
    title: "MVP completo",
    description:
      "Do conceito ao produto funcional em 6–10 semanas. Arquitetura escalável desde o dia 1, design system básico e deploy pronto.",
    techs: "Next.js · React · Node.js · PostgreSQL · AWS",
    price: "R$ 15.000 – R$ 35.000",
    included:
      "Escopo fechado: entrega do produto acordado, com 30 dias de garantia. Evolução e novas features após a entrega seguem no modelo de retainer.",
  },
  {
    icon: Monitor,
    title: "Sistema web sob medida",
    description:
      "Plataformas, painéis administrativos, ERPs e portais construídos do zero com código limpo, testes e documentação completa.",
    techs: "React · NestJS · Java · Spring Boot · Docker",
    price: "R$ 25.000 – R$ 80.000",
    included:
      "Preço por escopo definido em conjunto no diagnóstico. Não inclui manutenção contínua nem mudanças de escopo — essas entram via retainer ou novo orçamento.",
  },
  {
    icon: BrainCircuit,
    title: "Automação com IA",
    description:
      "Chatbots, extração de dados, classificação de documentos e workflows inteligentes integrados ao seu sistema existente.",
    techs: "Python · OpenAI · LangChain · FastAPI · n8n",
    price: "R$ 10.000 – R$ 40.000",
    included:
      "Inclui a automação entregue e integrada ao seu sistema. Custos de API/modelo e o ajuste fino contínuo após a entrega são acompanhados via retainer.",
  },
  {
    icon: Blocks,
    title: "Integrações e APIs",
    description:
      "Conectamos seu sistema a ERPs, gateways de pagamento, CRMs e serviços externos com APIs robustas e documentadas.",
    techs: "REST · GraphQL · Webhooks · Node.js · Java",
    price: "R$ 8.000 – R$ 25.000",
    included:
      "Cobre as integrações do escopo acordado, testadas e documentadas. Monitoramento e adaptações a mudanças de terceiros ao longo do tempo ficam no retainer.",
  },
];

const retainerPlans = [
  {
    name: "Light",
    hours: "8h/mês",
    price: "R$ 3.000 – R$ 4.500",
    highlighted: false,
  },
  {
    name: "Standard",
    hours: "20h/mês",
    price: "R$ 5.000 – R$ 8.000",
    highlighted: true,
  },
  {
    name: "Full",
    hours: "40h/mês",
    price: "R$ 9.000 – R$ 12.000",
    highlighted: false,
  },
];

const retainerFeatures = [
  "Suporte prioritário via Slack ou e-mail",
  "Reunião de alinhamento mensal",
  "Correções e melhorias contínuas",
  "Prioridade no backlog de desenvolvimento",
  "Relatório mensal de horas e entregas",
  "Sem multa por cancelamento",
];

const processSteps = [
  {
    icon: Search,
    title: "Descoberta",
    description: "Entendemos o problema, o contexto e os objetivos de negócio.",
  },
  {
    icon: PenTool,
    title: "Arquitetura",
    description: "Desenhamos a solução técnica, stack e cronograma detalhado.",
  },
  {
    icon: Code2,
    title: "Desenvolvimento",
    description: "Sprints semanais com entregas incrementais e demos ao vivo.",
  },
  {
    icon: PackageCheck,
    title: "Entrega",
    description: "Deploy, documentação, treinamento e 30 dias de garantia.",
  },
  {
    icon: Handshake,
    title: "Parceria",
    description: "Suporte contínuo, evolução do produto e novas features.",
  },
];

/* ─── PAGE ──────────────────────────────────────────── */

export default function ServicosPage() {
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
                <li className="text-teal-light">Serviços</li>
              </ol>
            </nav>

            <h1 className="max-w-3xl font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              Soluções sob medida para cada fase do seu negócio
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-400">
              Abordagem consultiva: primeiro entendemos o problema, depois
              propomos a solução certa — sem overselling, sem escopo inflado.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── SERVIÇOS DE ENTRADA ───────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-text md:text-4xl">
              Por onde começar
            </h2>
            <p className="mt-4 max-w-2xl text-text-secondary leading-relaxed">
              Para quem ainda não sabe por onde começar ou quer validar uma
              decisão técnica antes de investir.
            </p>
          </FadeIn>

          <StaggerContainer className="mt-14 grid gap-6 lg:grid-cols-3">
            {entryServices.map((service) => (
              <StaggerItem key={service.title}>
                <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-8 transition-shadow hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-bg text-teal">
                    <service.icon size={24} />
                  </div>
                  <h3 className="mt-6 font-display text-lg font-bold text-text">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
                    {service.description}
                  </p>
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <p className="text-xs text-text-secondary">{service.duration}</p>
                    <p className="mt-1 font-display text-lg font-bold text-text">
                      {service.price}
                    </p>
                  </div>
                  <Link
                    href="/contato"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal transition-colors hover:text-teal-light"
                  >
                    Solicitar
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn className="mt-10">
            <div className="rounded-xl bg-teal-bg px-6 py-4 text-sm text-teal">
              <strong>Bom saber:</strong> O valor do diagnóstico é deduzido do
              projeto caso o cliente avance para a contratação.
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── SERVIÇOS PRINCIPAIS ───────────────────── */}
      <section className="bg-gray-soft py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-text md:text-4xl">
              Desenvolvimento e entrega
            </h2>
            <p className="mt-4 max-w-2xl text-text-secondary leading-relaxed">
              Projeto fechado é preço por escopo definido — você paga pela
              entrega combinada, não por hora. Por isso a conta por hora parece
              menor que a do retainer: no retainer você contrata disponibilidade
              sênior contínua e prioridade, não um escopo pronto. São modelos
              para momentos diferentes, não substitutos.
            </p>
          </FadeIn>

          <StaggerContainer className="mt-14 grid gap-6 md:grid-cols-2">
            {mainServices.map((service) => (
              <StaggerItem key={service.title}>
                <div className="flex h-full flex-col rounded-2xl bg-white p-8 transition-shadow hover:shadow-lg md:p-10">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-bg text-teal">
                      <service.icon size={24} />
                    </div>
                    <span className="rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white">
                      Projeto fechado
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-xl font-bold text-text">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
                    {service.description}
                  </p>
                  <p className="mt-5 font-mono text-xs text-text-secondary">
                    {service.techs}
                  </p>
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <p className="font-display text-xl font-bold text-text">
                      {service.price}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                      {service.included}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── RETAINER ──────────────────────────────── */}
      <section className="bg-navy py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <h2 className="text-center font-display text-3xl font-bold text-white md:text-4xl">
              Parceria contínua
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-gray-400 leading-relaxed">
              Previsibilidade de custo e evolução constante. Seu produto não
              para depois da entrega — ele cresce com o negócio.
            </p>
          </FadeIn>

          <StaggerContainer className="mt-14 grid gap-6 lg:grid-cols-3">
            {retainerPlans.map((plan) => (
              <StaggerItem key={plan.name}>
                <div
                  className={`relative flex h-full flex-col rounded-2xl p-8 md:p-10 ${
                    plan.highlighted
                      ? "border-2 border-teal bg-navy-light"
                      : "border border-white/10 bg-navy-light"
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-teal px-4 py-1 text-xs font-bold text-white">
                      Mais escolhido
                    </span>
                  )}
                  <h3 className="font-display text-xl font-bold text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">{plan.hours}</p>
                  <p className="mt-6 font-display text-2xl font-bold text-white">
                    {plan.price}
                    <span className="text-base font-normal text-gray-400">
                      /mês
                    </span>
                  </p>

                  <ul className="mt-8 flex-1 space-y-3">
                    {retainerFeatures.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-gray-300"
                      >
                        <Check
                          size={16}
                          className="mt-0.5 shrink-0 text-teal-light"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contato"
                    className={`mt-8 block rounded-lg py-3.5 text-center font-semibold transition-colors ${
                      plan.highlighted
                        ? "bg-teal text-white hover:bg-teal-light"
                        : "border border-white/20 text-white hover:border-white/40 hover:bg-white/5"
                    }`}
                  >
                    Contratar {plan.name}
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── COMO FUNCIONA ─────────────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <h2 className="text-center font-display text-3xl font-bold text-text md:text-4xl">
              Do problema à entrega
            </h2>
          </FadeIn>

          <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, i) => (
              <StaggerItem key={step.title}>
                <div className="relative text-center">
                  {/* Connector line — hidden on the last item and on mobile */}
                  {i < processSteps.length - 1 && (
                    <div className="absolute top-6 left-[calc(50%+28px)] hidden h-0.5 w-[calc(100%-56px)] bg-gray-200 lg:block" />
                  )}
                  <div className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-bg text-teal">
                    <step.icon size={22} />
                  </div>
                  <h3 className="mt-5 font-display text-sm font-bold text-text">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                    {step.description}
                  </p>
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
              Pronto para construir algo que dura?
            </h2>
            <p className="mt-6 text-lg text-gray-400">
              Agende uma conversa de 30 min. Sem compromisso.
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
