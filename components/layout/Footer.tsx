import Link from "next/link";

const columns = [
  {
    title: "Serviços",
    links: [
      { href: "/servicos", label: "Sistemas sob medida" },
      { href: "/servicos", label: "MVPs" },
      { href: "/servicos", label: "Automação com IA" },
      { href: "/servicos", label: "Integrações e APIs" },
      { href: "/servicos", label: "Consultoria técnica" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/sobre", label: "Sobre nós" },
      { href: "/cases", label: "Cases" },
      { href: "/blog", label: "Blog" },
      { href: "/contato", label: "Contato" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { href: "/blog", label: "Artigos técnicos" },
      { href: "/contato", label: "Diagnóstico gratuito" },
      { href: "/contato", label: "Suporte" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative bg-navy text-gray-400">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="font-display text-xl font-bold text-white">
              Nex<span className="text-teal-light">Cript</span>.
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              De MVP à escala — arquitetura limpa, código que dura.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-semibold text-white">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-teal-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-white/10 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} NexCript. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
