/**
 * Combo de nichos da prospecção. Para testar outro nicho, adicione um item;
 * para cortar um nicho que não responde, remova-o. O painel agrupa por `id`.
 *
 * - `searches`: termos buscados no Google Maps (um termo = uma busca no Apify).
 * - `cnaes`: códigos usados pelo coletor de CNPJs recém-abertos.
 * - `weight`: ajuste de score pelo ticket e pela aderência à oferta (0 a 10).
 */
export type Niche = {
  id: string;
  label: string;
  group: "Saúde" | "Serviços locais" | "Extras";
  searches: string[];
  cnaes: string[];
  weight: number;
};

export const niches: Niche[] = [
  {
    id: "odontologia",
    label: "Odontologia",
    group: "Saúde",
    searches: ["dentista", "clínica odontológica"],
    cnaes: ["8630504"],
    weight: 10,
  },
  {
    id: "psicologia",
    label: "Psicologia",
    group: "Saúde",
    searches: ["psicólogo", "consultório de psicologia"],
    cnaes: ["8650003"],
    weight: 8,
  },
  {
    id: "fisioterapia",
    label: "Fisioterapia",
    group: "Saúde",
    searches: ["fisioterapia", "clínica de fisioterapia"],
    cnaes: ["8650004"],
    weight: 9,
  },
  {
    id: "nutricao",
    label: "Nutrição",
    group: "Saúde",
    searches: ["nutricionista"],
    cnaes: ["8650002"],
    weight: 7,
  },
  {
    id: "estetica",
    label: "Estética",
    group: "Saúde",
    searches: ["clínica de estética", "estética facial e corporal"],
    cnaes: ["9602502"],
    weight: 9,
  },
  {
    id: "ar-condicionado",
    label: "Ar-condicionado",
    group: "Serviços locais",
    searches: ["instalação de ar condicionado", "manutenção de ar condicionado"],
    cnaes: ["4322302", "3314707"],
    weight: 9,
  },
  {
    id: "eletrica-manutencao",
    label: "Elétrica e manutenção",
    group: "Serviços locais",
    searches: ["eletricista", "manutenção predial"],
    cnaes: ["4321500", "8111700"],
    weight: 7,
  },
  {
    id: "oficina-mecanica",
    label: "Oficina mecânica",
    group: "Serviços locais",
    searches: ["oficina mecânica", "auto center"],
    cnaes: ["4520001"],
    weight: 8,
  },
  {
    id: "assistencia-tecnica",
    label: "Assistência técnica",
    group: "Serviços locais",
    searches: ["assistência técnica de celular", "assistência técnica de eletrodomésticos"],
    cnaes: ["9512600", "9521500"],
    weight: 6,
  },
  {
    id: "reformas",
    label: "Reformas",
    group: "Serviços locais",
    searches: ["empresa de reformas", "marcenaria"],
    cnaes: ["4399103", "4330404", "3101200"],
    weight: 8,
  },
  {
    id: "veterinaria-pet",
    label: "Veterinária e pet",
    group: "Extras",
    searches: ["clínica veterinária", "pet shop banho e tosa"],
    cnaes: ["7500100", "9609208"],
    weight: 8,
  },
  {
    id: "pilates-academia",
    label: "Pilates e academias",
    group: "Extras",
    searches: ["estúdio de pilates", "academia"],
    cnaes: ["9313100"],
    weight: 7,
  },
];

export function findNiche(id: string) {
  return niches.find((niche) => niche.id === id);
}
