import { todaySP } from "./cadence";
import type { Prospect, ProspectStatus } from "./db";
import { hasKeywordName } from "./maps";
import { findNiche, type Niche } from "./niches";

/**
 * Roteiro de conversa depois que o prospect responde (Playbook, seções 14,
 * 16 e 17): respostas para as reações mais comuns, as duas sugestões
 * prometidas na 1ª mensagem, perguntas de qualificação e o convite para o
 * diagnóstico. Tudo montado com os dados do prospect.
 */

export type Reply = {
  /** O que o prospect disse. */
  trigger: string;
  /** O que responder (pronto para o WhatsApp). */
  answer: string;
  /** Orientação para quem conduz a conversa. */
  tip: string;
  /** Status sugerido depois dessa troca. */
  status: ProspectStatus;
};

const groupDetails: Record<Niche["group"], { what: string; action: string; automation: string }> = {
  Saúde: {
    what: "especialidades, equipe, convênios e localização",
    action: "agendar",
    automation: "confirmação automática de consultas pelo WhatsApp, que reduz faltas",
  },
  "Serviços locais": {
    what: "serviços, área atendida e fotos de trabalhos feitos",
    action: "pedir orçamento já informando serviço e bairro",
    automation: "um formulário de orçamento que já chega organizado no WhatsApp",
  },
  Extras: {
    what: "serviços, horários, preços de referência e localização",
    action: "agendar",
    automation: "lembretes automáticos de retorno e de agendamento",
  },
};

const weekdays = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

/** Próximos dois dias úteis, às 10h e às 15h, para o convite do diagnóstico. */
export function suggestedSlots() {
  const slots: string[] = [];
  for (let offset = 1; slots.length < 2 && offset < 10; offset++) {
    const iso = todaySP(offset);
    const weekday = new Date(`${iso}T12:00:00Z`).getUTCDay();
    if (weekday === 0 || weekday === 6) continue;
    const [, month, day] = iso.split("-");
    slots.push(`${weekdays[weekday]} (${day}/${month}) às ${slots.length === 0 ? "10h" : "15h"}`);
  }
  return slots as [string, string];
}

/** As duas sugestões prometidas na 1ª mensagem, conforme o que o coletor viu. */
export function twoSuggestions(p: Prospect) {
  const g = groupDetails[findNiche(p.niche)?.group ?? "Saúde"];
  const reviews = p.reviews ?? 0;

  const first = `Um site próprio, simples e rápido no celular, com ${g.what} e um botão de WhatsApp com mensagem pronta. Quem chega pelo Google entende o que vocês fazem e já chega pronto para ${g.action}.`;

  const second = p.website
    ? "Trocar o link do Google, que hoje leva para a rede social, por esse endereço próprio. A rede social continua na bio e no site, mas quem pesquisa no Google encontra tudo organizado num lugar só."
    : hasKeywordName(p.name)
      ? "Aproveitar o trabalho que vocês já fazem no nome do Google: uma página para cada serviço principal ajuda a aparecer nas buscas da região e leva esse público para o lugar certo."
      : reviews >= 20
        ? `Levar as ${reviews} avaliações do Google para dentro do site, com as melhores em destaque. Hoje elas só aparecem no Maps, e é a prova que mais convence quem ainda não conhece vocês.`
        : "Organizar o perfil do Google (fotos, horários e descrição) apontando para o site, para quem pesquisa na região encontrar vocês mais fácil.";

  return [first, second] as const;
}

export function conversationScript(p: Prospect, sender: string) {
  const g = groupDetails[findNiche(p.niche)?.group ?? "Saúde"];
  const [first, second] = twoSuggestions(p);
  const [slotA, slotB] = suggestedSlots();
  const goodReputation = (p.rating ?? 0) >= 4.5 && (p.reviews ?? 0) >= 20;
  const invite = `Para ver se faz sentido para vocês, proponho uma conversa de 20 minutos: entendo como os clientes chegam hoje e digo com sinceridade se vale a pena. Pode ser ${slotA} ou ${slotB}?`;

  const replies: Reply[] = [
    {
      trigger: "“Pode mandar as sugestões.”",
      answer: `Claro! São duas:\n\n1. ${first}\n\n2. ${second}\n\n${invite}`,
      tip: "Não mande preço nem proposta aqui. O objetivo é marcar a conversa.",
      status: "respondeu",
    },
    {
      trigger: "“Quanto custa?”",
      answer: `Depende do que vocês precisam: uma página única começa em R$ 790, e o site completo, que é o mais indicado para ${findNiche(p.niche)?.label.toLowerCase() ?? "o seu caso"}, parte de R$ 1.390. Antes de indicar um pacote, prefiro entender o momento de vocês para não propor algo maior ou menor do que precisam. ${invite}`,
      tip: "Preço de referência sim, orçamento fechado não. Volte sempre para a conversa de 20 minutos.",
      status: "respondeu",
    },
    {
      trigger: "“Quem é você? Como achou a gente?”",
      answer: `Sou ${sender}, da Nexcript. A gente cria sites para pequenas empresas, em São Paulo e em outras cidades. Encontrei vocês pesquisando no Google Maps e reparei que ${goodReputation ? "vocês têm ótimas avaliações, mas" : "vocês"} ainda não têm um site próprio para levar esse público. Posso te mandar duas ideias rápidas?`,
      tip: "Seja transparente sobre como encontrou a empresa. Isso gera confiança.",
      status: "respondeu",
    },
    {
      trigger: "“O Instagram já é suficiente.”",
      answer: `Faz sentido, o Instagram ajuda muito a serem descobertos. A ideia não é substituir, é somar: o site dá um endereço próprio para quem pesquisa no Google, com ${g.what} num lugar só, e o Instagram continua fazendo o trabalho dele. Posso te mostrar um exemplo de como os dois funcionam juntos?`,
      tip: "Nunca critique o Instagram deles. Mostre o site como complemento.",
      status: "respondeu",
    },
    {
      trigger: "“Já temos alguém que cuida disso.”",
      answer:
        "Perfeito, não quero atrapalhar uma parceria que funciona. Minha observação foi só sobre não ter um site próprio no Google. Se já estiver nos planos de vocês, ótimo! Posso deixar a sugestão registrada e encerrar por aqui.",
      tip: "Encerre com elegância. Anote quem cuida e retome em 3 meses se nada mudar.",
      status: "perdido",
    },
    {
      trigger: "“Agora não é o momento.”",
      answer:
        "Sem problema! Tem algum período melhor para eu retomar, como o mês que vem ou o próximo trimestre? Ou prefere que eu encerre o contato?",
      tip: "Anote a data que disserem nas anotações e agende o retorno.",
      status: "respondeu",
    },
    {
      trigger: "“Meu sobrinho / um conhecido faz mais barato.”",
      answer:
        "Pode ser uma boa opção, depende do objetivo. O nosso trabalho inclui o planejamento da página, a publicação, a configuração do domínio e o suporte depois que o site vai ao ar. Se quiser, te mando o que está incluído para vocês compararem com a mesma base.",
      tip: "Sem desmerecer a outra opção. Compare entregas, não preço.",
      status: "respondeu",
    },
    {
      trigger: "“Manda uma proposta.”",
      answer: `Mando sim! Para a proposta sair com escopo e valor certos, preciso confirmar alguns pontos rápidos sobre o que vocês querem destacar, prazo e quem aprova. ${invite} Se preferir, pode ser por áudio aqui mesmo.`,
      tip: "Proposta sem conversa vira comparação só por preço. Troque por 20 minutos.",
      status: "respondeu",
    },
    {
      trigger: "“Não tenho interesse.”",
      answer:
        "Entendido, obrigado por responder! Vou encerrar o contato por aqui. Sucesso para vocês.",
      tip: "Encerre na hora. Marque como perdido e não contate de novo.",
      status: "perdido",
    },
  ];

  const qualifying = [
    "Hoje, como a maioria dos clientes novos chega até vocês: Google, Instagram ou indicação?",
    "Qual serviço vocês mais querem que cresça nos próximos meses?",
    "Quando alguém chama no WhatsApp, quais perguntas se repetem sempre?",
    "Quem decide sobre esse tipo de investimento, você ou mais alguém?",
  ];

  const confirmation = `Combinado: ${slotA}, por chamada de vídeo ou ligação, como preferir. Vou dar uma olhada na presença de vocês antes para a conversa render. Se precisar mudar, é só avisar!`;

  return {
    replies,
    suggestions: [first, second],
    qualifying,
    invite,
    confirmation,
    // Assunto para plantar a automação no diagnóstico, sem vender agora.
    automationHint: g.automation,
  };
}
