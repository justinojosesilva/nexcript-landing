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
    "Cidade Dutra",
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

/**
 * Cidades do coletor de CNPJs (opção "a" do brainstorming): a cidade de São
 * Paulo, as capitais e as maiores cidades do país. Nomes como na tabela de
 * municípios da Receita (maiúsculas, sem acento) + UF.
 */
export const cnpjCities: [string, string][] = [
  // Capitais
  ["SAO PAULO", "SP"], ["RIO DE JANEIRO", "RJ"], ["BELO HORIZONTE", "MG"], ["BRASILIA", "DF"],
  ["SALVADOR", "BA"], ["FORTALEZA", "CE"], ["RECIFE", "PE"], ["PORTO ALEGRE", "RS"],
  ["CURITIBA", "PR"], ["MANAUS", "AM"], ["BELEM", "PA"], ["GOIANIA", "GO"],
  ["FLORIANOPOLIS", "SC"], ["VITORIA", "ES"], ["NATAL", "RN"], ["JOAO PESSOA", "PB"],
  ["MACEIO", "AL"], ["TERESINA", "PI"], ["SAO LUIS", "MA"], ["CAMPO GRANDE", "MS"],
  ["CUIABA", "MT"], ["ARACAJU", "SE"], ["PORTO VELHO", "RO"], ["MACAPA", "AP"],
  ["BOA VISTA", "RR"], ["RIO BRANCO", "AC"], ["PALMAS", "TO"],
  // Grandes cidades (acima de ~400 mil habitantes)
  ["GUARULHOS", "SP"], ["CAMPINAS", "SP"], ["SAO BERNARDO DO CAMPO", "SP"], ["SANTO ANDRE", "SP"],
  ["OSASCO", "SP"], ["SAO JOSE DOS CAMPOS", "SP"], ["RIBEIRAO PRETO", "SP"], ["SOROCABA", "SP"],
  ["SANTOS", "SP"], ["MAUA", "SP"], ["SAO JOSE DO RIO PRETO", "SP"], ["MOGI DAS CRUZES", "SP"],
  ["JUNDIAI", "SP"], ["PIRACICABA", "SP"], ["CARAPICUIBA", "SP"],
  ["SAO GONCALO", "RJ"], ["DUQUE DE CAXIAS", "RJ"], ["NOVA IGUACU", "RJ"], ["NITEROI", "RJ"],
  ["CAMPOS DOS GOYTACAZES", "RJ"],
  ["UBERLANDIA", "MG"], ["CONTAGEM", "MG"], ["JUIZ DE FORA", "MG"], ["BETIM", "MG"],
  ["MONTES CLAROS", "MG"],
  ["JOINVILLE", "SC"], ["LONDRINA", "PR"], ["MARINGA", "PR"], ["CAXIAS DO SUL", "RS"],
  ["APARECIDA DE GOIANIA", "GO"], ["FEIRA DE SANTANA", "BA"], ["JABOATAO DOS GUARARAPES", "PE"],
  ["ANANINDEUA", "PA"], ["SERRA", "ES"], ["VILA VELHA", "ES"],
];
