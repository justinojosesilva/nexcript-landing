"use client";

import { ArrowUpRight, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { track } from "@/analytics/events";
import { whatsappUrl } from "@/lib/contact";

/**
 * Celular: atalho fixo para o diagnóstico e o WhatsApp. Aparece depois que o
 * botão do topo sai da tela e some quando o formulário está visível (não
 * duplica a chamada). Fora da tela fica `inert`, fora do Tab.
 */
export function MobileCta() {
  const [heroGone, setHeroGone] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const whatsapp = whatsappUrl();

  useEffect(() => {
    const hero = document.querySelector(".nx-hero .nx-actions");
    const form = document.getElementById("diagnostico");
    if (!hero || !form) return;
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) setHeroGone(!entry.isIntersecting && entry.boundingClientRect.top < 0);
        else setFormVisible(entry.isIntersecting);
      }
    });
    io.observe(hero);
    io.observe(form);
    return () => io.disconnect();
  }, []);

  const shown = heroGone && !formVisible;

  return (
    <nav
      className={`nx-mobile-cta${shown ? " is-shown" : ""}`}
      aria-label="Contato rápido"
      inert={!shown}
      aria-hidden={!shown}
    >
      <a className="nx-button" href="#diagnostico" onClick={() => track("cta_clicked", { location: "mobile_bar" })}>
        Diagnóstico gratuito <ArrowUpRight size={16} />
      </a>
      {whatsapp && (
        <a
          className="nx-mobile-cta-whatsapp"
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Conversar pelo WhatsApp"
          onClick={() => track("external_contact_opened", { channel: "whatsapp", location: "mobile_bar" })}
        >
          <MessageCircle size={22} />
        </a>
      )}
    </nav>
  );
}
