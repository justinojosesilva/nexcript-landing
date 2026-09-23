/**
 * Cadência de 14 dias do Playbook de Prospecção (seção 15). A etapa atual de
 * cada prospect é o número de contatos já registrados.
 */
export const cadenceSteps = [
  { key: "d0", label: "1ª mensagem", daysToNext: 2 },
  { key: "d2", label: "Follow-up D+2", daysToNext: 3 },
  { key: "d5", label: "Follow-up D+5 · nova observação", daysToNext: 4 },
  { key: "d9", label: "D+9 · falar com o decisor", daysToNext: 5 },
  { key: "d14", label: "Encerramento D+14", daysToNext: null },
] as const;
export type CadenceStep = (typeof cadenceSteps)[number];

export const contactChannels = ["WhatsApp", "Visita", "Ligação", "Instagram", "E-mail"] as const;
export type ContactChannel = (typeof contactChannels)[number];

/** Próxima etapa da cadência, ou null quando ela já terminou. */
export function currentStep(attempts: number): CadenceStep | null {
  return cadenceSteps[attempts] ?? null;
}

/** Data de hoje (AAAA-MM-DD) no fuso de São Paulo. */
export function todaySP(offsetDays = 0) {
  const date = new Date(Date.now() + offsetDays * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(date);
}

export function formatDay(isoDay: string) {
  const [year, month, day] = isoDay.slice(0, 10).split("-");
  return `${day}/${month}${year === todaySP().slice(0, 4) ? "" : `/${year}`}`;
}
