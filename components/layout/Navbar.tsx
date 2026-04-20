"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/servicos", label: "Serviços" },
  { href: "/cases", label: "Cases" },
  { href: "/sobre", label: "Sobre" },
  { href: "/blog", label: "Blog" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on outside click
  const handleOverlayClick = useCallback(() => setOpen(false), []);

  // Navbar is transparent only on Home when not scrolled
  const isTransparent = isHome && !scrolled && !open;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent backdrop-blur-sm"
          : "border-b border-white/5 bg-navy/95 shadow-[0_1px_20px_rgba(0,0,0,0.3)] backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-xl font-bold text-white"
        >
          Nex<span className="text-teal-light">Cript</span>.
        </Link>

        {/* Desktop links — center */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link relative text-sm transition-colors ${
                  isActive
                    ? "text-teal-light"
                    : "text-gray-300 hover:text-teal-light"
                }`}
              >
                {link.label}
                {/* Underline grow animation */}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-teal-light transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                  style={{ width: isActive ? "100%" : undefined }}
                />
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA — right */}
        <div className="hidden md:block">
          <Link
            href="/contato"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Falar com consultor
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 items-center justify-center text-white md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 top-[60px] z-40 bg-black/40 md:hidden"
            onClick={handleOverlayClick}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <div className="relative z-50 animate-slide-down border-t border-white/10 bg-navy px-6 pb-8 pt-2 md:hidden">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block py-3.5 text-lg transition-colors ${
                    isActive ? "text-teal-light font-semibold" : "text-gray-300 hover:text-teal-light"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/contato"
              onClick={() => setOpen(false)}
              className="mt-4 block rounded-xl bg-accent px-5 py-3.5 text-center text-lg font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Falar com consultor
            </Link>
          </div>
        </>
      )}
    </header>
  );
}
