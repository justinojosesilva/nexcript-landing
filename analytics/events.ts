"use client";

export type AnalyticsEvent =
  | "cta_clicked"
  | "lead_started"
  | "lead_submitted"
  | "external_contact_opened";

type EventProperties = Record<string, string | number | boolean | undefined>;

/**
 * Ponto único para analytics. Sem provider configurado, não coleta nada.
 * Conecte GA4, Plausible ou outra ferramenta aqui, após o consentimento.
 */
export function track(event: AnalyticsEvent, properties: EventProperties = {}) {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true") return;

  window.dispatchEvent(
    new CustomEvent("nexcript:analytics", { detail: { event, properties } }),
  );
}
