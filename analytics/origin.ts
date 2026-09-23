"use client";

export type VisitOrigin = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  landingPath?: string;
};

const KEY = "nexcript:origin";

/**
 * Guarda a primeira origem da visita (UTM e site de referência) na sessão,
 * para que ela não se perca quando o visitante navega pelas seções.
 */
export function captureOrigin(): VisitOrigin {
  try {
    const saved = sessionStorage.getItem(KEY);
    if (saved) return JSON.parse(saved) as VisitOrigin;
  } catch {
    // Armazenamento indisponível: segue só com a página atual.
  }

  const params = new URLSearchParams(window.location.search);
  const referrer =
    document.referrer && new URL(document.referrer).origin !== window.location.origin
      ? document.referrer
      : undefined;
  const origin: VisitOrigin = {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    referrer,
    landingPath: window.location.pathname + window.location.search,
  };

  try {
    sessionStorage.setItem(KEY, JSON.stringify(origin));
  } catch {
    // Ignorado de propósito.
  }
  return origin;
}
