import type { SiteConfig } from "@/seo/types";

/**
 * Arquivo de personalização por cliente.
 * Copie-o para um novo projeto e altere somente os dados abaixo antes de
 * começar a construir as seções.
 */
export const siteConfig: SiteConfig = {
  name: "Nexcript",
  description: "Sites, automações e software para empresas.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexcript.com.br",
  locale: "pt_BR",
  contact: {
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511970452495",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  },
  social: {},
};
