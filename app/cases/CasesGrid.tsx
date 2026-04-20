"use client";

import { useState } from "react";
import { ArrowRight, Clock, Zap } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Case = {
  category: string;
  segment: string;
  mainTech: string;
  title: string;
  problem: string;
  solution: string;
  timeline: string;
  result: string;
  stack: string[];
};

const cases: Case[] = [
  {
    category: "Fintech",
    segment: "Fintech",
    mainTech: "NestJS",
    title: "Plataforma de cobranças automatizada",
    problem:
      "Processamento manual de 3.000+ boletos por mês gerava atrasos e erros de conciliação.",
    solution:
      "Sistema de cobranças com emissão automática, conciliação bancária em tempo real e painel de inadimplência.",
    timeline: "10 semanas",
    result: "92% de redução no tempo de processamento de cobranças",
    stack: ["NestJS", "PostgreSQL", "Redis", "AWS Lambda", "React"],
  },
  {
    category: "SaaS",
    segment: "SaaS · RH",
    mainTech: "React",
    title: "MVP de gestão de equipes remotas",
    problem:
      "Startup sem produto técnico precisava validar o modelo com early adopters em menos de 3 meses.",
    solution:
      "MVP com check-ins assíncronos, OKRs, dashboards de produtividade e integrações com Slack e Google Calendar.",
    timeline: "8 semanas",
    result: "200+ usuários ativos no primeiro mês após o lançamento",
    stack: ["React", "Node.js", "MongoDB", "Socket.io", "Vercel"],
  },
  {
    category: "Automação",
    segment: "Contabilidade",
    mainTech: "Python",
    title: "Automação de relatórios fiscais com IA",
    problem:
      "Equipe de 5 contadores gastava 3 dias/mês compilando relatórios fiscais manualmente.",
    solution:
      "Pipeline de IA que extrai dados de notas fiscais, classifica automaticamente e gera relatórios no formato SPED.",
    timeline: "6 semanas",
    result: "Relatórios que levavam 3 dias agora ficam prontos em 2 horas",
    stack: ["Python", "OpenAI", "FastAPI", "PostgreSQL", "n8n"],
  },
  {
    category: "SaaS",
    segment: "LegalTech",
    mainTech: "Next.js",
    title: "Portal de clientes para escritório jurídico",
    problem:
      "Clientes não tinham visibilidade sobre o andamento dos processos e sobrecarregavam a equipe com ligações.",
    solution:
      "Portal self-service com timeline de processos, upload de documentos, chat com advogado e notificações automáticas.",
    timeline: "12 semanas",
    result: "60% menos ligações de acompanhamento ao escritório",
    stack: ["Next.js", "Prisma", "PostgreSQL", "AWS S3", "Tailwind"],
  },
  {
    category: "Integração",
    segment: "Varejo",
    mainTech: "Java",
    title: "Integração ERP + e-commerce",
    problem:
      "Estoque desatualizado entre loja física e e-commerce causava vendas de produtos indisponíveis.",
    solution:
      "Middleware de integração bidirecional entre TOTVS e Shopify com sincronização a cada 5 minutos.",
    timeline: "7 semanas",
    result: "Zero vendas de produtos sem estoque após a integração",
    stack: ["Java", "Spring Boot", "REST APIs", "RabbitMQ", "Docker"],
  },
  {
    category: "SaaS",
    segment: "Logística",
    mainTech: "React",
    title: "Dashboard de BI para operações logísticas",
    problem:
      "Decisões operacionais eram baseadas em planilhas defasadas e sem visão consolidada em tempo real.",
    solution:
      "Dashboard interativo com KPIs de frota, entregas, custos e alertas automatizados por desvio de meta.",
    timeline: "9 semanas",
    result: "40% de redução no tempo de tomada de decisão operacional",
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
                </div>

                {/* Title */}
                <h3 className="mt-5 font-display text-xl font-bold text-text">
                  {item.title}
                </h3>

                {/* Problem & Solution */}
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-text-secondary">
                  <p>
                    <span className="font-semibold text-text">Problema:</span>{" "}
                    {item.problem}
                  </p>
                  <p>
                    <span className="font-semibold text-text">Solução:</span>{" "}
                    {item.solution}
                  </p>
                </div>

                {/* Timeline */}
                <div className="mt-5 flex items-center gap-2 text-xs text-text-secondary">
                  <Clock size={14} />
                  Entrega em {item.timeline}
                </div>

                {/* Result */}
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-teal-bg p-4">
                  <Zap size={16} className="mt-0.5 shrink-0 text-teal" />
                  <p className="text-sm font-semibold text-teal">
                    {item.result}
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
                  Ver detalhes
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
