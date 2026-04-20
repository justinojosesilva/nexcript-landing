"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.href)
      : "";

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-xs font-medium text-text-secondary">
        <Share2 size={14} className="inline -mt-0.5" /> Compartilhar
      </span>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no LinkedIn"
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-text-secondary transition-colors hover:bg-teal-bg hover:text-teal"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
        </svg>
      </a>

      {/* X / Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no X"
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-text-secondary transition-colors hover:bg-teal-bg hover:text-teal"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>

      {/* Copy link */}
      <button
        onClick={handleCopy}
        aria-label="Copiar link"
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-text-secondary transition-colors hover:bg-teal-bg hover:text-teal"
      >
        {copied ? <Check size={16} className="text-teal" /> : <Copy size={16} />}
      </button>
    </div>
  );
}
