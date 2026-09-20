// Public contact settings. Never put secrets in NEXT_PUBLIC_* variables.
const number = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511970452495"
).replace(/\D/g, "");
export const whatsappNumber = /^[1-9]\d{9,14}$/.test(number) ? number : "";
export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";
export function whatsappUrl(
  message = "Olá! Quero um diagnóstico da presença digital da minha empresa.",
) {
  return whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    : "";
}
