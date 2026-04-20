import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight, Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { posts, getPostBySlug, formatDate } from "../data";
import { ShareButtons } from "./ShareButtons";

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post não encontrado — NexCript" };

  return {
    title: `${post.title} — NexCript Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Related posts (same category, excluding current)
  const related = posts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  // Simple markdown-like rendering: split by paragraphs, handle headings, code blocks, lists, tables
  const contentSections = parseContent(post.content);

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
                <li>
                  <Link
                    href="/blog"
                    className="transition-colors hover:text-teal-light"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <ChevronRight size={14} className="text-gray-600" />
                </li>
                <li className="text-teal-light line-clamp-1">{post.title}</li>
              </ol>
            </nav>

            <span className="inline-block rounded-full bg-teal-bg px-3 py-1 text-xs font-semibold text-teal">
              {post.category}
            </span>

            <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {post.readingTime} de leitura
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CONTENT ───────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-[1fr_300px]">
            {/* Article */}
            <FadeIn>
              <article className="prose-nexcript">
                {contentSections.map((section, i) => (
                  <ContentBlock key={i} block={section} />
                ))}
              </article>

              {/* Share + back */}
              <div className="mt-12 flex flex-col gap-6 border-t border-gray-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <ShareButtons title={post.title} />
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal transition-colors hover:text-teal-light"
                >
                  <ArrowLeft size={16} />
                  Voltar ao blog
                </Link>
              </div>
            </FadeIn>

            {/* Sidebar */}
            <FadeIn delay={0.15}>
              <aside className="space-y-10 lg:sticky lg:top-28 lg:self-start">
                {/* Author */}
                <div className="rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal text-lg font-bold text-white">
                      JS
                    </div>
                    <div>
                      <p className="font-display text-sm font-bold text-text">
                        Justino Silva
                      </p>
                      <p className="text-xs text-text-secondary">
                        Fundador &amp; Consultor Sênior
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                    14 anos construindo software de missão crítica. Especialista
                    em Clean Architecture, Java e IA aplicada.
                  </p>
                </div>

                {/* Related posts */}
                {related.length > 0 && (
                  <div>
                    <h3 className="font-display text-sm font-bold text-text">
                      Artigos relacionados
                    </h3>
                    <div className="mt-4 space-y-4">
                      {related.map((rp) => (
                        <Link
                          key={rp.slug}
                          href={`/blog/${rp.slug}`}
                          className="group block rounded-xl border border-gray-100 p-4 transition-shadow hover:shadow-md"
                        >
                          <p className="text-sm font-semibold text-text group-hover:text-teal transition-colors line-clamp-2">
                            {rp.title}
                          </p>
                          <p className="mt-1.5 text-xs text-text-secondary">
                            {rp.readingTime} · {formatDate(rp.date)}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA box */}
                <div className="rounded-2xl bg-navy p-6 text-center">
                  <p className="font-display text-lg font-bold text-white">
                    Precisa de ajuda?
                  </p>
                  <p className="mt-2 text-sm text-gray-400">
                    Agende um diagnóstico gratuito de 30 min.
                  </p>
                  <Link
                    href="/contato"
                    className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                  >
                    Falar com consultor
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </aside>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── Content parsing ─────────────────────────────── */

type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "hr" };

function parseContent(content: string): Block[] {
  const blocks: Block[] = [];
  const lines = content.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Horizontal rule
    if (/^---\s*$/.test(line)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: "code", lang, code: codeLines.join("\n") });
      i++; // skip closing ```
      continue;
    }

    // Heading
    if (line.startsWith("### ")) {
      blocks.push({ type: "heading", level: 3, text: line.slice(4) });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "heading", level: 2, text: line.slice(3) });
      i++;
      continue;
    }

    // Table
    if (line.includes("|") && i + 1 < lines.length && /^\|?[\s-|]+\|?$/.test(lines[i + 1])) {
      const parseRow = (r: string) =>
        r
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean);
      const headers = parseRow(line);
      i += 2; // skip header + separator
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|")) {
        rows.push(parseRow(lines[i]));
        i++;
      }
      blocks.push({ type: "table", headers, rows });
      continue;
    }

    // Unordered list
    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(lines[i].replace(/^[-*] /, ""));
        i++;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s*/, ""));
        i++;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    // Checkbox list
    if (/^- \[[ x]\] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^- \[[ x]\] /.test(lines[i])) {
        items.push(lines[i].replace(/^- \[[ x]\] /, ""));
        i++;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    // Paragraph (skip empty lines)
    if (line.trim()) {
      blocks.push({ type: "paragraph", text: line });
    }
    i++;
  }

  return blocks;
}

function renderInline(text: string): React.ReactNode {
  // Handle bold (**text**), inline code (`code`), and italic (*text*)
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*)|(`(.+?)`)|(\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      parts.push(
        <strong key={match.index} className="font-semibold text-text">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      parts.push(
        <code
          key={match.index}
          className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-teal"
        >
          {match[4]}
        </code>
      );
    } else if (match[5]) {
      parts.push(<em key={match.index}>{match[6]}</em>);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}

function ContentBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "heading":
      return block.level === 2 ? (
        <h2 className="mt-12 mb-4 font-display text-2xl font-bold text-text">
          {block.text}
        </h2>
      ) : (
        <h3 className="mt-8 mb-3 font-display text-lg font-bold text-text">
          {block.text}
        </h3>
      );

    case "paragraph":
      return (
        <p className="mb-5 text-base leading-relaxed text-text-secondary">
          {renderInline(block.text)}
        </p>
      );

    case "code":
      return (
        <div className="my-6 overflow-x-auto rounded-xl bg-navy p-5">
          <pre className="font-mono text-sm leading-relaxed text-gray-300">
            <code>{block.code}</code>
          </pre>
        </div>
      );

    case "list":
      return (
        <ul className="mb-5 space-y-2 pl-5">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="list-disc text-base leading-relaxed text-text-secondary marker:text-teal"
            >
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );

    case "table":
      return (
        <div className="my-6 overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-soft">
                {block.headers.map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left font-semibold text-text"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-t border-gray-100">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="px-4 py-3 text-text-secondary"
                    >
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "hr":
      return <hr className="my-10 border-gray-200" />;
  }
}
