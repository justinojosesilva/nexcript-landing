/**
 * Bairros da cidade de São Paulo por região, para cobrir a cidade inteira.
 * Uma busca por "São Paulo" sozinha devolve só um pedaço da cidade.
 * Ajuste a lista conforme as regiões que a equipe consegue visitar.
 */
export const saoPauloRegions: Record<string, string[]> = {
  "zona-sul": [
    "Santo Amaro",
    "Moema",
    "Vila Mariana",
    "Saúde",
    "Jabaquara",
    "Campo Belo",
    "Brooklin",
    "Ipiranga",
    "Campo Limpo",
    "Interlagos",
    "Cidade Ademar",
    "Vila Andrade",
  ],
  "zona-oeste": ["Pinheiros", "Lapa", "Butantã", "Perdizes", "Vila Leopoldina", "Jaguaré"],
  "zona-norte": ["Santana", "Tucuruvi", "Casa Verde", "Vila Maria", "Freguesia do Ó", "Pirituba"],
  "zona-leste": [
    "Tatuapé",
    "Mooca",
    "Penha",
    "Itaquera",
    "São Miguel Paulista",
    "Vila Prudente",
    "Aricanduva",
  ],
  centro: ["Bela Vista", "Consolação", "República", "Liberdade"],
};

/**
 * Aceita uma região ("zona-sul"), "todas" ou bairros separados por vírgula
 * ("Moema, Brooklin"). Devolve buscas no formato "Bairro, São Paulo, SP".
 */
export function resolveNeighborhoods(value: string) {
  const key = value.trim().toLowerCase();
  const names =
    key === "todas"
      ? Object.values(saoPauloRegions).flat()
      : (saoPauloRegions[key] ??
        value
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean));
  return names.map((name) => `${name}, São Paulo, SP`);
}
