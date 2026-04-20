import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, ArrowRight, Calendar, Clock } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { BlogPosts } from "./BlogPosts";
import { NewsletterForm } from "./NewsletterForm";
import { posts, formatDate } from "./data";

export const metadata: Metadata = {
  title: "Blog — NexCript",
  description:
    "Artigos sobre arquitetura de software, IA aplicada, desenvolvimento e negócios. Conteúdo técnico e prático da NexCript.",
};

export default function BlogPage() {
  const featuredPost = posts.find((p) => p.featured) ?? posts[0];
  const otherPosts = posts.filter((p) => p.slug !== featuredPost.slug);

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
                <li className="text-teal-light">Blog</li>
              </ol>
            </nav>

            <h1 className="max-w-3xl font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              Artigos, guias e insights técnicos
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-400">
              Conteúdo prático sobre arquitetura, desenvolvimento, IA e negócios
              — direto de quem constrói.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── FEATURED POST ────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group flex flex-col gap-8 rounded-2xl border border-gray-100 bg-gray-soft p-8 transition-shadow hover:shadow-lg md:flex-row md:items-center md:p-10"
            >
              {/* Decorative block */}
              <div className="flex h-48 w-full shrink-0 items-center justify-center rounded-xl bg-navy md:h-56 md:w-72">
                <span className="font-mono text-5xl font-bold text-teal-light opacity-30">
                  {"{ }"}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-teal px-3 py-1 text-xs font-semibold text-white">
                    Destaque
                  </span>
                  <span className="rounded-full bg-teal-bg px-3 py-1 text-xs font-semibold text-teal">
                    {featuredPost.category}
                  </span>
                </div>

                <h2 className="mt-4 font-display text-2xl font-bold text-text group-hover:text-teal transition-colors md:text-3xl">
                  {featuredPost.title}
                </h2>

                <p className="mt-3 text-text-secondary leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="mt-6 flex items-center gap-4 text-sm text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {formatDate(featuredPost.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {featuredPost.readingTime}
                  </span>
                </div>

                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal group-hover:text-teal-light transition-colors">
                  Ler artigo completo
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── ALL POSTS ─────────────────────────────── */}
      <section className="bg-white pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <h2 className="font-display text-2xl font-bold text-text md:text-3xl">
              Todos os artigos
            </h2>
          </FadeIn>

          <div className="mt-8">
            <BlogPosts posts={otherPosts} />
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ────────────────────────────── */}
      <section className="bg-teal py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              Receba nossos artigos por e-mail
            </h2>
            <p className="mt-4 text-lg text-teal-bg">
              Um artigo por semana. Sem spam, sem enrolação. Cancele quando
              quiser.
            </p>
            <div className="mt-10">
              <NewsletterForm />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────── */}
      <section className="border-t-4 border-teal bg-navy py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Precisa de ajuda com seu projeto?
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
