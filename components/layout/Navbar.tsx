"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
const links = [
  ["solucoes", "Soluções"],
  ["care", "Nexcript Care"],
  ["processo", "Como funciona"],
  ["demonstracoes", "Demonstrações"],
];
export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nx-header">
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
            <Link key={id} href={`/#${id}`}>
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
              <Link onClick={() => setOpen(false)} key={id} href={`/#${id}`}>
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
