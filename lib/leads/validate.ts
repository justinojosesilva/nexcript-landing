import type { NewLead } from "./db";

export const interestOptions = [
  "Ainda não sei",
  "Landing Page",
  "Site Essencial",
  "Site Business",
  "Nexcript Care",
  "Automação ou sistema",
] as const;

// Dados de spam (honeypot e tempo de preenchimento) chegam junto do lead.
export type LeadPayload = {
  name?: unknown;
  company?: unknown;
  whatsapp?: unknown;
  email?: unknown;
  interest?: unknown;
  message?: unknown;
  website?: unknown;
  startedAt?: unknown;
  origin?: {
    utmSource?: unknown;
    utmMedium?: unknown;
    utmCampaign?: unknown;
    referrer?: unknown;
    landingPath?: unknown;
  };
};

const MIN_FILL_MS = 3000;

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

function optional(value: unknown, max: number) {
  return text(value, max) || null;
}

/** Aceita número com ou sem DDI e devolve somente dígitos, com 55 no início. */
export function normalizeWhatsapp(value: unknown) {
  const digits = typeof value === "string" ? value.replace(/\D/g, "") : "";
  const local = digits.startsWith("55") && digits.length >= 12 ? digits.slice(2) : digits;
  return /^[1-9]{2}9?\d{8}$/.test(local) ? `55${local}` : null;
}

export function looksLikeBot(payload: LeadPayload) {
  if (text(payload.website, 200)) return true;
  const startedAt = Number(payload.startedAt);
  return !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS;
}

export function parseLead(
  payload: LeadPayload,
): { lead: NewLead } | { error: string } {
  const name = text(payload.name, 100);
  const company = text(payload.company, 150);
  const message =
    typeof payload.message === "string" ? payload.message.trim().slice(0, 1200) : "";
  const whatsapp = normalizeWhatsapp(payload.whatsapp);
  const email = optional(payload.email, 150)?.toLowerCase() ?? null;
  const interest = interestOptions.find((option) => option === payload.interest);

  if (!name || !company) return { error: "Informe seu nome e o nome da empresa." };
  if (!whatsapp) return { error: "Informe um WhatsApp válido com DDD." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { error: "Confira o e-mail informado." };
  }
  if (message.length < 10) return { error: "Conte um pouco mais sobre o seu desafio." };

  const origin = payload.origin ?? {};
  return {
    lead: {
      name,
      company,
      whatsapp,
      email,
      interest: interest ?? "Ainda não sei",
      message,
      source: "site",
      utmSource: optional(origin.utmSource, 100),
      utmMedium: optional(origin.utmMedium, 100),
      utmCampaign: optional(origin.utmCampaign, 100),
      referrer: optional(origin.referrer, 300),
      landingPath: optional(origin.landingPath, 300),
    },
  };
}
