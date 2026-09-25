"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
const links = [
  ["solucoes", "Soluções"],
  ["care", "Nexcript Care"],
  ["processo", "Como funciona"],
  ["demonstracoes", "Demonstrações"],
];
/** Seção visível agora (para destacar no menu) e se a página já rolou. */
function useScrollState() {
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = links
      .map(([id]) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    // Faixa no meio da tela: a seção que a cruza é a atual.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
          else setActive((cur) => (cur === entry.target.id ? null : cur));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((el) => io.observe(el));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return { active, scrolled };
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { active, scrolled } = useScrollState();
  return (
    <header className={`nx-header${scrolled ? " nx-header-scrolled" : ""}`}>
      <a className="nx-skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <nav
        className="nx-container nx-nav"
        aria-label="Navegação principal"
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      >
        <Link className="nx-logo" href="/" onClick={() => setOpen(false)}>
          <span className="nx-mark" aria-hidden="true">
            <Image
              src="/nexcript-mark.svg"
              alt=""
              width={38}
              height={38}
              priority
            />
          </span>
          nexcript<span className="nx-logo-dot">.</span>
        </Link>
        <div className="nx-desktop-links">
          {links.map(([id, text]) => (
            <Link key={id} href={`/#${id}`} aria-current={active === id ? "location" : undefined}>
              {text}
            </Link>
          ))}
        </div>
        <Link
          className="nx-button nx-button-small nx-nav-cta"
          href="/#diagnostico"
        >
          Vamos conversar <ArrowUpRight size={16} />
        </Link>
        <button
          className="nx-menu-toggle"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        {open && (
          <div id="mobile-nav" className="nx-mobile-nav">
            {links.map(([id, text]) => (
              <Link
                onClick={() => setOpen(false)}
                key={id}
                href={`/#${id}`}
                aria-current={active === id ? "location" : undefined}
              >
                {text}
              </Link>
            ))}
            <Link onClick={() => setOpen(false)} href="/#diagnostico">
              Agendar diagnóstico ↗
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
