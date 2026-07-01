"use client";

import { useState } from "react";
import { ArrowRight, Clock, Zap } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Case = {
  // "real" = projeto próprio / portfólio · "ilustrativo" = cenário de capacidade técnica
  kind: "real" | "ilustrativo";
  category: string;
  segment: string;
  mainTech: string;
  title: string;
  problem: string;
  approach: string;
  timeline: string;
  goal: string;
  stack: string[];
};

const cases: Case[] = [
  {
    kind: "real",
    category: "Fintech",
    segment: "Projeto próprio · Gestão financeira",
    mainTech: "NestJS",
    title: "FinFlow — motor de projeção de fluxo de caixa",
    problem:
      "Pequenos negócios decidem no escuro: sem projeção de fluxo de caixa, é difícil antecipar aperto de caixa ou planejar investimento com segurança.",
    approach:
      "Sistema de gestão financeira com motor de projeção de fluxo de caixa, construído em Clean Architecture com NestJS. As regras de projeção ficam isoladas em uma camada de domínio, independentes de banco e framework — o que as mantém testáveis e fáceis de evoluir.",
    timeline: "",
    goal:
      "Projeto próprio de portfólio — não é um projeto de cliente pago. Serve para demonstrar, com código real, domínio de Clean Architecture e modelagem de domínio financeiro.",
    stack: ["NestJS", "TypeScript", "Clean Architecture"],
  },
  {
    kind: "ilustrativo",
    category: "Fintech",
    segment: "Fintech",
    mainTech: "NestJS",
    title: "Plataforma de cobranças automatizada",
    problem:
      "Processamento manual de milhares de boletos por mês gera atrasos e erros de conciliação.",
    approach:
      "Sistema de cobranças com emissão automática, conciliação bancária e painel de inadimplência — desenhado para eliminar o processamento manual e reduzir erros de conciliação.",
    timeline: "10 semanas",
    goal:
      "Eliminar o trabalho manual de processar boletos em escala e reduzir erros de conciliação.",
    stack: ["NestJS", "PostgreSQL", "Redis", "AWS Lambda", "React"],
  },
  {
    kind: "ilustrativo",
    category: "SaaS",
    segment: "SaaS · RH",
    mainTech: "React",
    title: "MVP de gestão de equipes remotas",
    problem:
      "Startup sem produto técnico precisa validar o modelo com early adopters em poucos meses.",
    approach:
      "MVP com check-ins assíncronos, OKRs, dashboards de produtividade e integrações com Slack e Google Calendar — o suficiente para validar o modelo sem inflar escopo.",
    timeline: "8 semanas",
    goal:
      "Colocar um MVP validável nas mãos de early adopters em poucas semanas, priorizando o que gera aprendizado.",
    stack: ["React", "Node.js", "MongoDB", "Socket.io", "Vercel"],
  },
  {
    kind: "ilustrativo",
    category: "Automação",
    segment: "Contabilidade",
    mainTech: "Python",
    title: "Automação de relatórios fiscais com IA",
    problem:
      "Equipe de contadores gasta dias por mês compilando relatórios fiscais manualmente.",
    approach:
      "Pipeline de IA que extrai dados de notas fiscais, classifica automaticamente e gera relatórios no formato SPED.",
    timeline: "6 semanas",
    goal:
      "Transformar dias de compilação manual em um processo automatizado de poucas horas.",
    stack: ["Python", "OpenAI", "FastAPI", "PostgreSQL", "n8n"],
  },
  {
    kind: "ilustrativo",
    category: "SaaS",
    segment: "LegalTech",
    mainTech: "Next.js",
    title: "Portal de clientes para escritório jurídico",
    problem:
      "Clientes não têm visibilidade sobre o andamento dos processos e sobrecarregam a equipe com ligações.",
    approach:
      "Portal self-service com timeline de processos, upload de documentos, chat com advogado e notificações automáticas.",
    timeline: "12 semanas",
    goal:
      "Dar visibilidade do andamento dos processos ao cliente e reduzir a sobrecarga de ligações de acompanhamento.",
    stack: ["Next.js", "Prisma", "PostgreSQL", "AWS S3", "Tailwind"],
  },
  {
    kind: "ilustrativo",
    category: "Integração",
    segment: "Varejo",
    mainTech: "Java",
    title: "Integração ERP + e-commerce",
    problem:
      "Estoque desatualizado entre loja física e e-commerce causa vendas de produtos indisponíveis.",
    approach:
      "Middleware de integração bidirecional entre ERP (ex.: TOTVS) e e-commerce (ex.: Shopify), com sincronização frequente de estoque.",
    timeline: "7 semanas",
    goal:
      "Manter o estoque consistente entre canais e evitar vendas de produtos sem disponibilidade.",
    stack: ["Java", "Spring Boot", "REST APIs", "RabbitMQ", "Docker"],
  },
  {
    kind: "ilustrativo",
    category: "SaaS",
    segment: "Logística",
    mainTech: "React",
    title: "Dashboard de BI para operações logísticas",
    problem:
      "Decisões operacionais são baseadas em planilhas defasadas e sem visão consolidada em tempo real.",
    approach:
      "Dashboard interativo com KPIs de frota, entregas, custos e alertas automáticos por desvio de meta.",
    timeline: "9 semanas",
    goal:
      "Substituir planilhas defasadas por uma visão operacional consolidada e em tempo real.",
    stack: ["React", "D3.js", "Node.js", "PostgreSQL", "Metabase"],
  },
];

const filters = ["Todos", "MVP", "SaaS", "Automação", "Integração", "Fintech"];

function matchFilter(c: Case, filter: string): boolean {
  if (filter === "Todos") return true;
  if (filter === "MVP") return c.title.toLowerCase().includes("mvp");
  return c.category === filter;
}

export function CasesGrid() {
  const [active, setActive] = useState("Todos");
  const filtered = cases.filter((c) => matchFilter(c, active));

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              active === f
                ? "bg-teal text-white"
                : "bg-gray-100 text-text-secondary hover:bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <motion.div
              key={item.title}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-8 transition-shadow hover:shadow-lg">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-teal-bg px-3 py-1 text-xs font-semibold text-teal">
                    {item.segment}
                  </span>
                  <span className="rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white">
                    {item.mainTech}
                  </span>
                  {/* Honesty badge: distingue projeto próprio de cenário ilustrativo */}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.kind === "real"
                        ? "bg-teal text-white"
                        : "border border-gray-200 bg-gray-50 text-text-secondary"
                    }`}
                  >
                    {item.kind === "real"
                      ? "Projeto próprio"
                      : "Cenário ilustrativo"}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-5 font-display text-xl font-bold text-text">
                  {item.title}
                </h3>

                {/* Problem & Approach */}
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-text-secondary">
                  <p>
                    <span className="font-semibold text-text">Problema:</span>{" "}
                    {item.problem}
                  </p>
                  <p>
                    <span className="font-semibold text-text">
                      {item.kind === "real"
                        ? "Solução:"
                        : "Como abordaríamos:"}
                    </span>{" "}
                    {item.approach}
                  </p>
                </div>

                {/* Timeline */}
                {item.timeline && (
                  <div className="mt-5 flex items-center gap-2 text-xs text-text-secondary">
                    <Clock size={14} />
                    {item.kind === "real"
                      ? item.timeline
                      : `Prazo estimado: ${item.timeline}`}
                  </div>
                )}

                {/* Goal / nature of the project */}
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-teal-bg p-4">
                  <Zap size={16} className="mt-0.5 shrink-0 text-teal" />
                  <p className="text-sm font-semibold text-teal">
                    {item.kind === "real" ? item.goal : `Objetivo: ${item.goal}`}
                  </p>
                </div>

                {/* Stack tags */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {item.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs text-text-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Link */}
                <Link
                  href="/contato"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal transition-colors hover:text-teal-light"
                >
                  {item.kind === "real"
                    ? "Conversar sobre este tipo de projeto"
                    : "Discutir um caso parecido"}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
