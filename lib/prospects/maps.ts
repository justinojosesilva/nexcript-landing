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
  (value ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();

/** Visitável = cidade de São Paulo (capital), onde as visitas presenciais acontecem. */
export function isVisitable(city?: string, state?: string) {
  const st = plain(state);
  return plain(city) === "sao paulo" && (st === "sp" || st === "sao paulo" || st === "");
}

/**
 * Score de 0 a 100: negócio ativo (avaliações), reputação (nota),
 * facilidade de contato (celular = WhatsApp provável) e peso do nicho.
 */
export function scorePlace(place: MapsPlace, phone: string, niche: Niche) {
  const reasons: string[] = [];
  let score = 0;

  const reviews = place.reviewsCount ?? 0;
  const reviewPoints =
    reviews >= 100 ? 30 : reviews >= 50 ? 25 : reviews >= 20 ? 18 : reviews >= 10 ? 12 : 5;
  score += reviewPoints;
  reasons.push(`${reviews} avaliações (+${reviewPoints})`);

  const rating = place.totalScore ?? 0;
  const ratingPoints = rating >= 4.7 ? 20 : rating >= 4.3 ? 15 : rating >= 4 ? 10 : 0;
  score += ratingPoints;
  reasons.push(`nota ${rating.toFixed(1)} (+${ratingPoints})`);

  const phonePoints = isMobile(phone) ? 20 : 8;
  score += phonePoints;
  reasons.push(`${isMobile(phone) ? "celular" : "telefone fixo"} (+${phonePoints})`);

  const nichePoints = niche.weight * 3;
  score += nichePoints;
  reasons.push(`nicho ${niche.label} (+${nichePoints})`);

  if (place.website) reasons.push("site é só rede social");
  return { score: Math.min(100, score), reasons: reasons.join(" · ") };
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

  const { score, reasons } = scorePlace(place, phone, niche);
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
