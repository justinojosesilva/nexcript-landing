import type { CadenceStep } from "../prospects/cadence";
import { suggestedSlots, type Reply } from "../prospects/conversation";
import type { Lead } from "./db";

/**
 * Mensagens e roteiro para leads do site. Diferente da prospecção, a pessoa
 * já pediu o diagnóstico: a 1ª resposta agradece, cita o que ela escreveu e
 * convida direto para os 20 minutos (meta do Playbook: até 4 horas úteis).
 */

function firstName(lead: Lead) {
  return lead.name.trim().split(/\s+/)[0];
}

/** Trecho do desafio que a pessoa escreveu, cortado em palavra inteira. */
function excerpt(message: string, max = 140) {
  // Sem pontuação final: a frase continua depois das aspas.
  const clean = message.replace(/\s+/g, " ").trim().replace(/[.!?;,]+$/, "");
  if (clean.length <= max) return clean;
  return `${clean.slice(0, clean.lastIndexOf(" ", max))}…`;
}

function interestLine(lead: Lead) {
  switch (lead.interest) {
    case "Ainda não sei":
      return "Na conversa eu te ajudo a entender qual caminho faz mais sentido.";
    case "Automação ou sistema":
      return "Vi que o interesse é em automação ou sistema, então quero entender o processo de vocês antes de sugerir qualquer coisa.";
    default: {
      const article = lead.interest === "Landing Page" ? "na" : "no";
      return `Vi que o interesse é ${article} ${lead.interest}. Na conversa eu confirmo se é mesmo o melhor caminho para o momento de vocês.`;
    }
  }
}

export function leadMessage(lead: Lead, step: CadenceStep, sender: string) {
  const name = firstName(lead);
  const [slotA, slotB] = suggestedSlots();
  switch (step.key) {
    case "l0":
      return (
        `Olá, ${name}! Aqui é ${sender}, da Nexcript. Recebi seu pedido de diagnóstico pelo site, obrigado! ` +
        `Você comentou: "${excerpt(lead.message)}". ${interestLine(lead)} ` +
        `Podemos conversar 20 minutos? Pode ser ${slotA} ou ${slotB}, por chamada de vídeo ou ligação.`
      );
    case "l1":
      return `Olá, ${name}! Passando para saber se algum desses horários funciona para a nossa conversa. Se preferir, me diga o melhor dia e horário para você.`;
    case "l3":
      return `Olá, ${name}! Imagino que a rotina esteja corrida. Se ficar mais prático, posso te mandar 3 perguntas rápidas por aqui e já adiantar o diagnóstico. Pode ser?`;
    case "l7":
      return `Olá, ${name}! Como não conseguimos conversar, vou encerrar por aqui para não incomodar. Quando quiser retomar o diagnóstico, é só responder esta mensagem. Sucesso!`;
    default:
      return "";
  }
}

export function leadConversationScript(lead: Lead) {
  const [slotA, slotB] = suggestedSlots();
  const invite = `Proponho uma conversa de 20 minutos: entendo como os clientes chegam hoje e te digo com sinceridade qual caminho faz sentido. Pode ser ${slotA} ou ${slotB}?`;

  const qualifying = [
    "Hoje, como a maioria dos clientes novos chega até vocês: Google, Instagram ou indicação?",
    "Qual serviço vocês mais querem que cresça nos próximos meses?",
    "Quando alguém chama no WhatsApp, quais perguntas se repetem sempre?",
    "Vocês já têm logo, fotos e textos, ou seria preciso criar?",
    "Existe alguma data importante, como inauguração ou campanha?",
    "Quem decide sobre esse investimento, você ou mais alguém?",
  ];

  const replies: Reply[] = [
    {
      trigger: "“Pode ser por mensagem mesmo.”",
      answer: `Claro! Então me conta, quando puder:\n\n${qualifying
        .slice(0, 4)
        .map((q, i) => `${i + 1}. ${q}`)
        .join("\n")}\n\nCom isso já consigo te indicar o caminho certo.`,
      tip: "Com as respostas, monte a recomendação e ofereça a proposta.",
      status: "em contato",
    },
    {
      trigger: "“Quanto custa?”",
      answer: `Depende do que vocês precisam: uma página única começa em R$ 790, e o site completo parte de R$ 1.390. A manutenção (Nexcript Care) é opcional, a partir de R$ 79/mês. Antes de indicar um pacote, prefiro entender o momento de vocês para não propor algo maior ou menor do que precisam. ${invite}`,
      tip: "Lead do site já tem interesse: dê a referência de preço e volte para a conversa.",
      status: "em contato",
    },
    {
      trigger: "“Manda uma proposta.”",
      answer: `Mando sim! Para a proposta sair com escopo e valor certos, preciso confirmar alguns pontos rápidos sobre o que vocês querem destacar, prazo e quem aprova. ${invite} Se preferir, pode ser por áudio aqui mesmo.`,
      tip: "Proposta sem conversa vira comparação só por preço. Troque por 20 minutos.",
      status: "em contato",
    },
    {
      trigger: "“Vocês fazem redes sociais / anúncios / loja virtual?”",
      answer:
        "Hoje a Nexcript faz sites, manutenção e automações. Gestão de redes sociais e anúncios não fazemos, mas o site funciona junto com eles, como o destino de quem clica. Loja virtual completa também fica fora do nosso foco agora. Quer que eu te explique como o site ajudaria no seu caso?",
      tip: "Seja honesto sobre o escopo. Se o pedido for só isso, desqualifique com educação.",
      status: "em contato",
    },
    {
      trigger: "“Agora não / depois eu vejo.”",
      answer:
        "Sem problema! Tem algum período melhor para eu retomar, como o mês que vem? Ou prefere me chamar quando for a hora?",
      tip: "Anote a data que disserem nas anotações.",
      status: "em contato",
    },
    {
      trigger: "“Já resolvi / não preciso mais.”",
      answer:
        "Que bom que resolveu! Se puder me contar o que vocês escolheram, ajuda a gente a melhorar. Se precisar de algo no futuro, é só chamar. Sucesso!",
      tip: "Marque como perdido e anote o motivo.",
      status: "perdido",
    },
  ];

  const confirmation = `Combinado: ${slotA}, por chamada de vídeo ou ligação, como preferir. Vou dar uma olhada na presença de vocês antes para a conversa render. Se precisar mudar, é só avisar!`;

  return {
    replies,
    qualifying,
    invite,
    confirmation,
    automation: lead.interest === "Automação ou sistema",
  };
}
