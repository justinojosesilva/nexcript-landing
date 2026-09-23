import type { CadenceStep } from "./cadence";
import type { Prospect } from "./db";
import { hasKeywordName } from "./maps";
import { findNiche, type Niche } from "./niches";

/**
 * Mensagens da cadência (Playbook, seções 10 e 15), montadas com o "momento"
 * de cada prospect: avaliações, presença só em rede social, nome trabalhado
 * no Google. Sem link no primeiro contato e sempre com saída respeitosa.
 */

const byGroup: Record<Niche["group"], { details: string; impact: string; conversion: string }> = {
  Saúde: {
    details: "especialidades, equipe e localização",
    impact:
      "acaba decidindo só pelo Google e pelo WhatsApp, sem ver especialidades, equipe e como agendar",
    conversion: "agendamentos",
  },
  "Serviços locais": {
    details: "serviços, área atendida e trabalhos feitos",
    impact:
      "acaba comparando só pelo preço no WhatsApp, sem ver serviços, área atendida e trabalhos feitos",
    conversion: "pedidos de orçamento",
  },
  Extras: {
    details: "serviços, horários e localização",
    impact: "não encontra serviços, horários e como agendar num só lugar",
    conversion: "clientes agendados",
  },
};

/** "Clínica Dr. Heliton - Dentista em Itaquera" → "Clínica Dr. Heliton". */
export function shortName(name: string) {
  const cut = name.split(/\s+[|–—-]\s+|\s*[|–—]\s*|-\s+/)[0].trim();
  return (cut.length >= 3 ? cut : name).replace(/\s+(ltda|me|epp|eireli)\.?$/i, "");
}

const months = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

/** Nome descritivo do coletor de CNPJ (sem nome fantasia): não serve de saudação. */
export function isPlaceholderName(name: string) {
  return name.startsWith("Nova empresa de ");
}

/** Empresa encontrada no cadastro de CNPJ: o "momento" é a abertura recente. */
export function isNewCompany(p: Prospect) {
  return p.source === "cnpj" && Boolean(p.openedAt);
}

function context(p: Prospect) {
  const niche = findNiche(p.niche);
  const group = byGroup[niche?.group ?? "Saúde"];
  return {
    name: shortName(p.name),
    greeting: isPlaceholderName(p.name) ? "Olá!" : `Olá, ${shortName(p.name)}!`,
    // "agora em setembro" para quem abriu há até 30 dias; "em julho" para os demais.
    openedMonth: p.openedAt
      ? `${Date.now() - Date.parse(p.openedAt) <= 30 * 86_400_000 ? "agora em " : "em "}${months[Number(p.openedAt.slice(5, 7)) - 1]}`
      : "",
    term: niche?.searches[0] ?? "empresas",
    place: p.neighborhood ?? p.city ?? "sua região",
    group,
    reviews: p.reviews ?? 0,
    rating: p.rating?.toFixed(1).replace(".", ","),
  };
}

function observation(p: Prospect) {
  const c = context(p);
  if (isNewCompany(p)) {
    return `vi no cadastro público de empresas que vocês abriram ${c.openedMonth}, e ainda não encontrei um site de vocês`;
  }
  if (p.website) {
    return "vi que o link de vocês no Google leva direto para uma rede social, mas não encontrei um site próprio";
  }
  if (c.reviews >= 40) {
    return `vi que vocês têm ${c.reviews} avaliações no Google, com nota ${c.rating}, mas não encontrei um site próprio`;
  }
  return "vi vocês no Google Maps, mas não achei um site próprio";
}

export function buildMessage(p: Prospect, step: CadenceStep, sender: string) {
  const c = context(p);
  switch (step.key) {
    case "d0":
      if (isNewCompany(p)) {
        return (
          `${c.greeting} Sou ${sender}, da Nexcript. Parabéns pela abertura! ${capitalize(observation(p))}. ` +
          `O começo é o melhor momento para quem pesquisa ${c.term} em ${c.place} já encontrar vocês com ${c.group.details} num lugar só. ` +
          `Posso te enviar duas sugestões rápidas para esse início? Se não for prioridade agora, sem problema.`
        );
      }
      return (
        `${c.greeting} Sou ${sender}, da Nexcript. Pesquisando ${c.term} em ${c.place}, ${observation(p)}. ` +
        `Quem procura vocês ${c.group.impact}. ` +
        `Posso te enviar duas sugestões rápidas para organizar isso? Se não for prioridade agora, sem problema.`
      );
    case "d2":
      return (
        `Olá! Retomando a mensagem sobre a presença digital de vocês: a observação é bem específica para a realidade daí. ` +
        `Se fizer sentido, te mando os dois pontos por aqui. Se não for prioridade, tudo bem.`
      );
    case "d5": {
      const insight = isNewCompany(p)
        ? `Nos primeiros meses, quase todo cliente vem de indicação. Um site com ${c.group.details}, junto com o perfil no Google Maps, faz quem ouviu falar de vocês encontrar e confiar logo de cara.`
        : hasKeywordName(p.name)
          ? `Vi que vocês já trabalham o nome no Google para aparecer nas buscas da região, o que é ótimo. Falta um endereço próprio para onde levar esse público, com ${c.group.details} e o botão de contato.`
          : c.reviews >= 40
            ? `As ${c.reviews} avaliações de vocês hoje só aparecem dentro do Google Maps. Um site pode mostrá-las junto com ${c.group.details}, e isso pesa muito para quem ainda não conhece vocês.`
            : `Uma página simples com ${c.group.details} e um botão de WhatsApp já faz o cliente chegar decidido, em vez de perguntar tudo no atendimento.`;
      return `Olá! Pensei em mais um ponto sobre a presença digital de vocês. ${insight} Vale uma conversa de 15 minutos para eu mostrar como ficaria?`;
    }
    case "d9":
      return (
        `Olá! Enviei algumas mensagens sobre a presença digital de vocês, mas talvez este não seja o melhor canal. ` +
        `Resumindo: ${observation(p)}. Esse assunto é com você ou existe outra pessoa responsável?`
      );
    case "d14":
      return (
        `Olá! Vou encerrar minhas tentativas para não ser inconveniente. A ideia era ajudar vocês a transformar ` +
        `quem encontra vocês no Google em ${c.group.conversion}. Se isso virar prioridade, fico à disposição. Obrigado!`
      );
  }
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function whatsappLink(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** Roteiro de visita presencial (cidade de São Paulo). */
export function visitScript(p: Prospect, visitor: string) {
  const c = context(p);
  return [
    `Na recepção: "Oi, tudo bem? Sou ${visitor}, da Nexcript, aqui da região. Posso falar rapidinho com o responsável por aqui? São dois minutos."`,
    `Com o responsável: "${observation(p).replace(/^./, (l) => l.toUpperCase())}. Quem procura vocês ${c.group.impact}. Trouxe no celular um exemplo de como poderia ficar."`,
    `Próximo passo: "Posso marcar 20 minutos para um diagnóstico gratuito? Sem compromisso."`,
    `Se o responsável não estiver: deixe o cartão com o QR code (nexcript.com.br/?utm_source=visita) e anote o nome dele e o melhor horário ou WhatsApp.`,
    `Depois: registre a visita aqui no painel (canal "Visita"), com o nome do responsável nas anotações.`,
  ];
}
