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

/**
 * Cadência dos leads do site: a pessoa já pediu o diagnóstico, então a
 * resposta sai no mesmo dia e o ciclo é mais curto.
 */
export const leadCadenceSteps = [
  { key: "l0", label: "1ª resposta", daysToNext: 1 },
  { key: "l1", label: "Follow-up D+1", daysToNext: 2 },
  { key: "l3", label: "Follow-up D+3", daysToNext: 4 },
  { key: "l7", label: "Encerramento D+7", daysToNext: null },
] as const;

export type CadenceStep = (typeof cadenceSteps)[number] | (typeof leadCadenceSteps)[number];

export const contactChannels = ["WhatsApp", "Visita", "Ligação", "Instagram", "E-mail"] as const;
export type ContactChannel = (typeof contactChannels)[number];

/** Próxima etapa da cadência, ou null quando ela já terminou. */
export function currentStep<T extends CadenceStep>(
  attempts: number,
  steps: readonly T[] = cadenceSteps as readonly CadenceStep[] as readonly T[],
): T | null {
  return steps[attempts] ?? null;
}

/** Linha de histórico acrescentada às anotações a cada contato registrado. */
export function historyLine(channel: string, step: CadenceStep, by: string) {
  const [year, month, day] = todaySP().split("-");
  return `${day}/${month}/${year} · ${channel} · ${step.label}${by ? ` · ${by}` : ""}`;
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
