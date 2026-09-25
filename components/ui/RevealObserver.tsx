"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __nxRevealFallback?: number;
  }
}

/**
 * Revela os elementos com data-reveal quando entram na tela (uma vez só).
 * O script do layout raiz marca <html class="nx-js"> antes da pintura, para o
 * conteúdo não piscar; se este componente não rodar, o fallback daquele
 * script devolve tudo à tela em 3 s.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    window.clearTimeout(window.__nxRevealFallback);
    if (!root.classList.contains("nx-js")) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
      // Já acima da tela (ex.: abriu direto em #diagnostico): aparece sem animar.
      if (el.getBoundingClientRect().bottom < 0) el.classList.add("is-visible", "no-anim");
      else io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return null;
}
