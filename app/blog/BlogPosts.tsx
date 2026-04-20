"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { type Post, categories, formatDate } from "./data";

export function BlogPosts({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState("Todos");

  const filtered =
    active === "Todos" ? posts : posts.filter((p) => p.category === active);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              active === cat
                ? "bg-teal text-white"
                : "bg-gray-100 text-text-secondary hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((post) => (
            <motion.div
              key={post.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-8 transition-shadow hover:shadow-lg"
              >
                {/* Category badge */}
                <span className="w-fit rounded-full bg-teal-bg px-3 py-1 text-xs font-semibold text-teal">
                  {post.category}
                </span>

                {/* Title */}
                <h3 className="mt-4 font-display text-lg font-bold text-text group-hover:text-teal transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="mt-3 text-sm leading-relaxed text-text-secondary line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="mt-auto flex items-center gap-4 pt-6 text-xs text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {formatDate(post.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    {post.readingTime}
                  </span>
                </div>

                {/* Read more */}
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal transition-colors group-hover:text-teal-light">
                  Ler artigo
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
