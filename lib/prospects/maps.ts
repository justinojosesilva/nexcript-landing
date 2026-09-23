import type { NewProspect } from "./db";
import type { Niche } from "./niches";

/** Campos do item do Google Maps Scraper (compass/crawler-google-places) usados aqui. */
export type MapsPlace = {
  placeId?: string;
  title?: string;
  categoryName?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  countryCode?: string;
  phone?: string;
  phoneUnformatted?: string;
  website?: string;
  totalScore?: number;
  reviewsCount?: number;
  url?: string;
  permanentlyClosed?: boolean;
  temporarilyClosed?: boolean;
};

export type RejectReason = "fechado" | "tem site" | "sem telefone" | "poucas avaliações" | "incompleto";

// "Site" que é só rede social ou link de WhatsApp não conta como site próprio.
const socialOnly =
  /(^|\.)(instagram\.com|facebook\.com|fb\.com|wa\.me|whatsapp\.com|linktr\.ee|linkr\.bio|beacons\.ai|bio\.link|tiktok\.com)$/i;

export function isOwnWebsite(website?: string) {
  if (!website) return false;
  try {
    const host = new URL(website.startsWith("http") ? website : `https://${website}`).hostname;
    return !socialOnly.test(host.replace(/^www\./, ""));
  } catch {
    return false;
  }
}

/** Telefone só com dígitos e DDI 55; null se não parecer um número brasileiro. */
export function normalizePhone(place: MapsPlace) {
  const digits = (place.phoneUnformatted ?? place.phone ?? "").replace(/\D/g, "");
  const local = digits.startsWith("55") && digits.length >= 12 ? digits.slice(2) : digits;
  return /^[1-9]{2}9?\d{8}$/.test(local) ? `55${local}` : null;
}

export function isMobile(phone: string) {
  return /^55\d{2}9\d{8}$/.test(phone);
}

const plain = (value?: string) =>
  (value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();

/** Visitável = cidade de São Paulo (capital), onde as visitas presenciais acontecem. */
export function isVisitable(city?: string, state?: string) {
  const st = plain(state);
  return plain(city) === "sao paulo" && (st === "sp" || st === "sao paulo" || st === "");
}

export type ScoreInput = {
  reviews: number | null;
  rating: number | null;
  phone: string | null;
  website: string | null;
  niche: Niche;
};

/**
 * Score de 0 a 100, em faixas largas para separar bem os primeiros da fila:
 * negócio ativo (avaliações, até 35), reputação (nota, até 20), contato
 * (celular = WhatsApp provável, até 20), nicho (até 15) e presença só em
 * rede social (10). Também serve para recalcular prospects já gravados.
 */
export function scoreProspect({ reviews, rating, phone, website, niche }: ScoreInput) {
  const reasons: string[] = [];
  let score = 0;
  const add = (points: number, reason: string) => {
    score += points;
    reasons.push(`${reason} (+${points})`);
  };

  const r = reviews ?? 0;
  add(
    r >= 300 ? 35 : r >= 150 ? 30 : r >= 80 ? 25 : r >= 40 ? 20 : r >= 20 ? 14 : r >= 10 ? 9 : 4,
    `${r} avaliações`,
  );

  const n = rating ?? 0;
  add(n >= 4.8 ? 20 : n >= 4.5 ? 16 : n >= 4.2 ? 12 : n >= 4 ? 8 : 0, `nota ${n.toFixed(1)}`);

  if (phone) add(isMobile(phone) ? 20 : 8, isMobile(phone) ? "celular" : "telefone fixo");

  add(Math.round(niche.weight * 1.5), `nicho ${niche.label}`);

  // Ativo nas redes, mas sem um endereço próprio para onde levar o cliente.
  if (website) add(10, "só rede social");

  return { score: Math.min(100, score), reasons: reasons.join(" · ") };
}

/**
 * Nome do Google com palavra-chave ("Dentista em Itaquera", "| Clínica"):
 * alguém já trabalha o Google dessa empresa. Não muda o score, só é exibido.
 */
export function hasKeywordName(name: string) {
  // Sufixos societários ("Ltda - ME") não contam como palavra-chave.
  const clean = name.replace(/\s*-?\s*\b(ltda|me|epp|eireli|s\/?a)\b\.?/gi, "");
  return /\s*[|–—]\s*|\s-\s?|\S-\s|\bem\s+\p{L}/iu.test(clean);
}

export function toProspect(
  place: MapsPlace,
  niche: Niche,
  minReviews: number,
): { prospect: NewProspect } | { rejected: RejectReason } {
  if (!place.placeId || !place.title) return { rejected: "incompleto" };
  if (place.permanentlyClosed || place.temporarilyClosed) return { rejected: "fechado" };
  if (isOwnWebsite(place.website)) return { rejected: "tem site" };
  const phone = normalizePhone(place);
  if (!phone) return { rejected: "sem telefone" };
  if ((place.reviewsCount ?? 0) < minReviews) return { rejected: "poucas avaliações" };

  const { score, reasons } = scoreProspect({
    reviews: place.reviewsCount ?? null,
    rating: place.totalScore ?? null,
    phone,
    website: place.website ?? null,
    niche,
  });
  return {
    prospect: {
      source: "maps",
      externalId: `maps:${place.placeId}`,
      name: place.title,
      niche: niche.id,
      category: place.categoryName ?? null,
      phone,
      website: place.website ?? null,
      address: place.address ?? null,
      neighborhood: place.neighborhood ?? null,
      city: place.city ?? null,
      state: place.state ?? null,
      visitable: isVisitable(place.city, place.state),
      rating: place.totalScore ?? null,
      reviews: place.reviewsCount ?? null,
      openedAt: null,
      mapsUrl: place.url ?? null,
      score,
      scoreReasons: reasons,
    },
  };
}
