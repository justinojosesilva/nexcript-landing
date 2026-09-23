"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Fecha o diálogo de detalhe com a tecla Esc, voltando para a lista. */
export function CloseOnEscape({ href }: { href: string }) {
  const router = useRouter();
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") router.push(href, { scroll: false });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [href, router]);
  return null;
}
