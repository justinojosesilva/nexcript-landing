import type { Metadata } from "next";
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
      className={`${manrope.variable} ${syne.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-dvh flex flex-col">
        <OrganizationJsonLd site={siteConfig} />
        {children}
      </body>
    </html>
  );
}
