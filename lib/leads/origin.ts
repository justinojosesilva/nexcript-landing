const knownHosts: [RegExp, string][] = [
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)facebook\.com$|(^|\.)fb\.com$/, "Facebook"],
  [/(^|\.)google\./, "Google"],
  [/(^|\.)bing\.com$/, "Bing"],
  [/(^|\.)linkedin\.com$|(^|\.)lnkd\.in$/, "LinkedIn"],
  [/(^|\.)whatsapp\.com$|^wa\.me$/, "WhatsApp"],
];

/** Nome legível da origem: UTM primeiro, depois o site de onde a pessoa veio. */
export function originLabel(utmSource: string | null, referrer: string | null) {
  if (utmSource) return utmSource.charAt(0).toUpperCase() + utmSource.slice(1);
  if (!referrer) return "Direto";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    return knownHosts.find(([pattern]) => pattern.test(host))?.[1] ?? host;
  } catch {
    return "Direto";
  }
}

export function formatWhatsapp(digits: string) {
  const local = digits.startsWith("55") ? digits.slice(2) : digits;
  const match = local.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : digits;
}
