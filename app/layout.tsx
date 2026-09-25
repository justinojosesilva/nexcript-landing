import type { Metadata } from "next";
import Script from "next/script";
import { Manrope, Syne, JetBrains_Mono } from "next/font/google";
import { OrganizationJsonLd } from "@/seo/JsonLd";
import { createMetadata } from "@/seo/metadata";
import { siteConfig } from "@/starter.config";
import "./globals.css";
import "@/themes/essential.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = createMetadata(siteConfig, {
  description:
    "Sites profissionais para pequenas empresas: Landing Page, Site Essencial e Site Business. Conheça o Nexcript Care e solicite seu diagnóstico gratuito.",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      // O script "nx-reveal" acrescenta a classe nx-js antes da hidratação.
      suppressHydrationWarning
      className={`${manrope.variable} ${syne.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-dvh flex flex-col">
        {/* Animações de entrada: marca a página antes da pintura (sem piscar). Sem JS ou com
            "reduzir movimento", nada é escondido; se o observador não rodar, tudo volta em 3 s. */}
        <Script id="nx-reveal" strategy="beforeInteractive">
          {`if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&"IntersectionObserver"in window){var d=document.documentElement;d.classList.add("nx-js");window.__nxRevealFallback=setTimeout(function(){d.classList.remove("nx-js")},3000)}`}
        </Script>
        <OrganizationJsonLd site={siteConfig} />
        {children}
      </body>
    </html>
  );
}
