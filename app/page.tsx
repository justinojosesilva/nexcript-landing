import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  Globe2,
  MessageCircle,
  MousePointer2,
  MoveUpRight,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { ContactForm } from "./contato/ContactForm";
import { whatsappUrl } from "@/lib/contact";

const plans = [
  {
    name: "Landing Page",
    tag: "UMA OFERTA. UM OBJETIVO.",
    price: "790",
    description:
      "Uma página focada em transformar o interesse em uma conversa.",
    time: "4–7 dias úteis",
    items: [
      "Página única com até 7 seções",
      "WhatsApp, formulário e mapa ou rede social",
      "SEO técnico e analytics básicos",
      "1 rodada de ajustes + 15 dias de suporte",
    ],
  },
  {
    name: "Site Essencial",
    tag: "A BASE DO SEU NEGÓCIO DIGITAL",
    price: "1.390",
    description:
      "Sua empresa bem apresentada, com espaço para mostrar o que faz de melhor.",
    time: "8–10 dias úteis",
    items: [
      "Até 5 páginas ou equivalência em seções",
      "Serviços, empresa, contato e conteúdo complementar",
      "WhatsApp, formulário, mapa e SEO por página",
      "2 rodadas de ajustes + 30 dias de suporte",
    ],
  },
  {
    name: "Site Business",
    tag: "MAIS SERVIÇOS. MAIS POSSIBILIDADES.",
    description:
      "Estrutura para organizar seus serviços e acompanhar as oportunidades.",
    time: "12–20 dias úteis",
    items: [
      "Até 10 páginas e área de conteúdo",
      "Formulários segmentados e eventos de conversão",
      "Integração simples, sujeita à validação",
      "2 rodadas de ajustes + 30 dias de suporte",
    ],
  },
];
const faqs = [
  [
    "Qual solução faz sentido para a minha empresa?",
    "A Landing Page apresenta uma oferta específica. O Site Essencial organiza a presença da empresa em até 5 páginas. O Business atende negócios com mais serviços e necessidades de captação. No diagnóstico, entendemos seu momento antes de recomendar um pacote.",
  ],
  [
    "O que preciso enviar para começar?",
    "Logo e identidade visual que você já utiliza, informações dos serviços, contatos, fotos e acessos necessários. O prazo começa após contrato, pagamento inicial e recebimento dos materiais. Se precisar de textos ou outros materiais, podemos orçar esse trabalho à parte.",
  ],
  [
    "O site vai funcionar no celular e aparecer no Google?",
    "Sim, os pacotes incluem layout responsivo e SEO técnico básico. Isso prepara o site para navegação e indexação, mas não garante uma posição no Google ou um volume de vendas. Conteúdo, divulgação e atendimento também influenciam os resultados.",
  ],
  [
    "O Nexcript Care está incluído no valor do site?",
    "Não. O projeto tem investimento próprio e o Care é uma contratação mensal separada para hospedagem e acompanhamento técnico. Apresentamos as opções antes da publicação. Domínio, licenças e ferramentas externas são tratados na proposta.",
  ],
  [
    "Posso pedir alterações depois da entrega?",
    "Sim. Cada projeto inclui rodadas de ajustes e suporte corretivo pelo período indicado. Depois, o Care Plus contempla até 1 hora mensal de pequenas alterações e o Business até 3 horas no total. As horas não acumulam; novas páginas, funcionalidades e integrações recebem orçamento separado.",
  ],
  [
    "Vocês também fazem automações e sistemas?",
    "Sim. Conforme seu negócio evolui, podemos avaliar integração de ferramentas, tarefas repetitivas e sistemas sob medida. Esses projetos têm diagnóstico, escopo e orçamento próprios, conforme a necessidade da operação.",
  ],
  [
    "Como funciona o pagamento?",
    "Para Landing Page e Site Essencial, 50% na contratação e 50% antes da publicação. Para o Business, 40% na contratação, 30% na aprovação visual e 30% antes da publicação. Escopo, condições e custos externos ficam registrados na proposta.",
  ],
];
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="nx-eyebrow">
      <span /> {children}
    </p>
  );
}

export default function Home() {
  const whatsapp = whatsappUrl();
  return (
    <div className="nx-landing" id="conteudo">
      <section className="nx-hero">
        <div className="nx-container nx-hero-grid">
          <div className="nx-hero-copy">
            <Label>TECNOLOGIA PARA O SEU PRÓXIMO PASSO</Label>
            <h1>
              Seu negócio
              <br />é bom.
              <br />
              Seu site precisa
              <br />
              <span>mostrar isso.</span>
            </h1>
            <p>
              Criamos sites que apresentam sua empresa, facilitam novos contatos
              e abrem caminho para crescer. Da primeira página às próximas
              automações.
            </p>
            <div className="nx-actions">
              <a className="nx-button" href="#diagnostico">
                Quero um diagnóstico gratuito <ArrowUpRight size={18} />
              </a>
              <a className="nx-text-link" href="#solucoes">
                Conhecer soluções <ArrowRight size={17} />
              </a>
            </div>
            <div className="nx-hero-note">
              <span className="nx-status-dot" />
              Conversa de 25 minutos. Sem compromisso.
            </div>
          </div>
          <div
            className="nx-hero-art"
            aria-label="Ilustração de como um site conecta sua empresa a novos contatos"
          >
            <div className="nx-orbit nx-orbit-one" />
            <div className="nx-orbit nx-orbit-two" />
            <div className="nx-art-caption">
              SUA PRESENÇA DIGITAL, CONECTADA.
            </div>
            <div className="nx-browser">
              <div className="nx-browser-bar">
                <i />
                <i />
                <i />
                <span>suaempresa.com.br</span>
                <Globe2 size={13} />
              </div>
              <div className="nx-site-preview">
                <div className="nx-preview-brand">
                  <span className="nx-mini-mark">s.</span>sua empresa{" "}
                  <span>Menu ≡</span>
                </div>
                <div className="nx-preview-body">
                  <div>
                    <span className="nx-mini-label">
                      FEITO PARA QUEM QUER IR ALÉM
                    </span>
                    <strong>
                      Um bom negócio.
                      <br />
                      Uma nova
                      <br />
                      <em>possibilidade.</em>
                    </strong>
                    <div className="nx-preview-lines">
                      <i />
                      <i />
                    </div>
                    <span className="nx-preview-button">
                      Vamos conversar <ArrowUpRight size={12} />
                    </span>
                  </div>
                  <div className="nx-sculpture">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className="nx-preview-bottom">
                  <span>01 / CONFIANÇA</span>
                  <span>02 / CONEXÃO</span>
                  <span>03 / CRESCIMENTO</span>
                </div>
              </div>
            </div>
            <div className="nx-contact-notice">
              <span className="nx-notice-icon">
                <MessageCircle size={21} />
              </span>
              <div>
                <strong>Um novo contato começa aqui.</strong>
                <span>“Olá! Quero saber mais sobre seu serviço.”</span>
              </div>
              <CheckCheck size={17} />
            </div>
            <div className="nx-care-notice">
              <ShieldCheck size={18} />
              <span>Seu site bem cuidado.</span>
              <span className="nx-status-dot" />
            </div>
            <div className="nx-art-bottom">
              <span>Site → Contato → Oportunidade</span>
              <MousePointer2 size={19} />
            </div>
          </div>
        </div>
        <div className="nx-container nx-audience">
          <span>PENSADO PARA NEGÓCIOS COMO O SEU</span>
          <p>Clínicas & consultórios</p>
          <span className="nx-plus">+</span>
          <p>Prestadores de serviços</p>
          <span className="nx-plus">+</span>
          <p>Pequenas empresas</p>
        </div>
      </section>

      <section className="nx-section nx-problem" id="problema">
        <div className="nx-container">
          <div className="nx-section-heading">
            <div>
              <Label>O PROBLEMA NÃO É O SEU SERVIÇO</Label>
              <h2>
                Quem chega até você
                <br />
                entende o seu valor?
              </h2>
            </div>
            <p>
              Entre descobrir sua empresa e pedir um orçamento, seu cliente
              precisa encontrar clareza, confiança e um caminho simples.
            </p>
          </div>
          <div className="nx-problem-grid">
            {[
              [
                "01",
                "Seu negócio vive só nas redes?",
                "Posts passam. Um site reúne seus serviços, diferenciais e contatos em um endereço próprio.",
              ],
              [
                "02",
                "Seu site ficou para trás?",
                "Uma experiência confusa no celular dificulta a escolha. Organizamos as informações para facilitar o próximo passo.",
              ],
              [
                "03",
                "Toda conversa começa do zero?",
                "Formulários e chamadas claras ajudam o cliente a explicar o que precisa antes de chegar ao seu atendimento.",
              ],
            ].map(([n, t, d]) => (
              <article key={n}>
                <span className="nx-number">{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
                <ArrowUpRight size={22} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="nx-section nx-solutions" id="solucoes">
        <div className="nx-container">
          <div className="nx-section-heading">
            <div>
              <Label>SOLUÇÕES NA MEDIDA DO SEU MOMENTO</Label>
              <h2>
                Comece com o que precisa.
                <br />
                <span className="nx-muted">Evolua quando fizer sentido.</span>
              </h2>
            </div>
            <p>
              Escopo claro, investimento definido e uma base pronta para receber
              seus próximos clientes.
            </p>
          </div>
          <div className="nx-plans">
            {plans.map((plan, i) => (
              <article
                className={`nx-plan ${i === 1 ? "nx-plan-featured" : ""}`}
                key={plan.name}
              >
                {i === 1 && (
                  <span className="nx-recommended">
                    <Sparkles size={13} /> NOSSO PONTO DE PARTIDA RECOMENDADO
                  </span>
                )}
                <span className="nx-plan-tag">{plan.tag}</span>
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
                <div
                  className={`nx-price ${plan.price ? "" : "nx-price-placeholder"}`}
                >
                  {plan.price && (
                    <>
                      <span>a partir de</span>
                      <strong>
                        <small>R$</small> {plan.price}
                      </strong>
                      <span>investimento no projeto</span>
                    </>
                  )}
                  {!plan.price && (
                    <>
                      <span>ORÇAMENTO PERSONALIZADO</span>
                      <strong className="nx-price-custom-message">
                        Uma solução sob medida para o seu negócio.
                      </strong>
                      <span>Escopo e investimento definidos no diagnóstico</span>
                    </>
                  )}
                </div>
                <a
                  href="#diagnostico"
                  className={`nx-button ${i !== 1 ? "nx-button-outline" : ""}`}
                >
                  Conversar sobre esta solução <ArrowUpRight size={16} />
                </a>
                <ul>
                  {plan.items.map((item) => (
                    <li key={item}>
                      <Check size={16} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="nx-plan-time">
                  Prazo estimado <strong>{plan.time}</strong>
                </div>
              </article>
            ))}
          </div>
          <p className="nx-fine-print">
            Todos os pacotes incluem layout responsivo e configuração de domínio
            e publicação. Prazos após contrato, entrada e materiais completos.
            Domínio, Care e ferramentas externas são contratados separadamente.
            Escopo final confirmado em proposta.
          </p>
        </div>
      </section>

      <section className="nx-section nx-care" id="care">
        <div className="nx-container">
          <div className="nx-care-heading">
            <div>
              <Label>NEXCRIPT CARE</Label>
              <h2>
                O site vai ao ar.
                <br />
                <span>O cuidado continua.</span>
              </h2>
            </div>
            <div>
              <ShieldCheck size={40} strokeWidth={1.3} />
              <p>
                Hospedagem, SSL, monitoramento, backup e suporte corretivo. Você
                cuida do negócio. Nós acompanhamos a parte técnica.
              </p>
            </div>
          </div>
          <div className="nx-care-plans">
            {[
              [
                "Base",
                "79",
                "Para manter a base bem cuidada.",
                "Hospedagem gerenciada, SSL, monitoramento, backup e suporte corretivo.",
              ],
              [
                "Plus",
                "149",
                "Para quem atualiza e acompanha.",
                "Tudo do Base + até 1 hora/mês de pequenas alterações e relatório trimestral.",
              ],
              [
                "Business",
                "299",
                "Para uma operação mais ativa.",
                "Tudo do Plus, com até 3 horas/mês no total, prioridade e reunião trimestral.",
              ],
            ].map(([n, p, d, f]) => (
              <article key={n}>
                <div>
                  <h3>Care {n}</h3>
                  <p>{d}</p>
                </div>
                <div className="nx-care-price">
                  R$ {p}
                  <span>/mês</span>
                </div>
                <p>{f}</p>
                <a href="#diagnostico">
                  Quero conhecer o Care <ArrowUpRight size={17} />
                </a>
              </article>
            ))}
          </div>
          <p className="nx-fine-print">
            Contratação separada do site. Horas não acumulam. Novas páginas,
            funcionalidades e licenças externas são orçadas à parte. Condições e
            prazos de atendimento definidos em contrato.
          </p>
        </div>
      </section>

      <section className="nx-section" id="processo">
        <div className="nx-container">
          <div className="nx-section-heading">
            <div>
              <Label>PROXIMIDADE EM CADA ETAPA</Label>
              <h2>
                Você sabe o que acontece.
                <br />
                Do primeiro “oi” à publicação.
              </h2>
            </div>
            <p>
              Um processo simples, com aprovações combinadas e espaço para suas
              dúvidas.
            </p>
          </div>
          <div className="nx-steps">
            {[
              [
                "01",
                "Entendemos",
                "Em 25 minutos, conversamos sobre seu negócio, seus clientes e o que está travando os contatos.",
              ],
              [
                "02",
                "Planejamos",
                "Você recebe a recomendação de solução, escopo, investimento e prazo antes de decidir.",
              ],
              [
                "03",
                "Construímos",
                "Organizamos conteúdo e design, desenvolvemos e apresentamos para sua revisão.",
              ],
              [
                "04",
                "Publicamos e cuidamos",
                "Validamos o site, formulários e links. Depois da aprovação, publicamos e iniciamos o acompanhamento contratado.",
              ],
            ].map(([n, t, d]) => (
              <article key={n}>
                <div className="nx-step-line">
                  <span>{n}</span>
                  <ArrowRight size={18} />
                </div>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="nx-section nx-demos" id="demonstracoes">
        <div className="nx-container">
          <div className="nx-section-heading">
            <div>
              <Label>POSSIBILIDADES NA PRÁTICA</Label>
              <h2>
                Projetos reais e ideias
                <br />
                para o seu negócio.
              </h2>
            </div>
            <p>
              Conheça um projeto institucional, um produto SaaS em desenvolvimento
              e dois conceitos visuais para os nichos que atendemos.
            </p>
          </div>
          <article className="nx-real-case">
            <div className="nx-gfr-preview" aria-hidden="true">
              <div className="nx-gfr-topbar">
                <div className="nx-gfr-brand">
                  <span className="nx-gfr-mark">↗</span>
                  <span>
                    <strong>GFR</strong>
                    <small>Energy Quality</small>
                  </span>
                </div>
                <span>Home &nbsp; Empresa &nbsp; Serviços &nbsp; Produtos</span>
              </div>
              <div className="nx-gfr-hero">
                <div>
                  <span>SOLUÇÕES PARA A SUA OPERAÇÃO</span>
                  <strong>
                    Soluções Elétricas
                    <br />
                    e Automação
                  </strong>
                  <i>Solicitar orçamento ↗</i>
                </div>
                <div className="nx-gfr-energy">
                  <span className="nx-gfr-lightning">ϟ</span>
                  <span className="nx-gfr-line nx-gfr-line-one" />
                  <span className="nx-gfr-line nx-gfr-line-two" />
                  <span className="nx-gfr-pylon nx-gfr-pylon-one" />
                  <span className="nx-gfr-pylon nx-gfr-pylon-two" />
                </div>
              </div>
              <div className="nx-gfr-bottom">
                <span>EXPERTISE TÉCNICA</span>
                <span>PONTUALIDADE</span>
                <span>ATENDIMENTO PERSONALIZADO</span>
              </div>
            </div>
            <div className="nx-real-case-content">
              <span className="nx-case-label">
                <i /> CASE REAL / GFR SYSTEM
              </span>
              <h3>G.F.R. Serviços e Instalações Elétricas</h3>
              <p>
                Site institucional para apresentar soluções elétricas e
                automação, organizar serviços e produtos, e captar pedidos de
                orçamento em todo o Brasil.
              </p>
              <ul>
                <li>Site institucional</li>
                <li>Serviços e catálogo de produtos</li>
                <li>Formulário de orçamento</li>
              </ul>
              <a
                href="https://gfr-system.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visitar o projeto <ArrowUpRight size={18} />
              </a>
            </div>
          </article>
          <article className="nx-real-case nx-latis-case">
            <div className="nx-latis-preview" aria-hidden="true">
              <div className="nx-latis-ruler" />
              <div className="nx-latis-topbar">
                <div className="nx-latis-brand">
                  <span>●</span> Latis Skills
                </div>
                <span>Entrar</span>
              </div>
              <div className="nx-latis-hero">
                <span>GESTÃO DE ESTUDO · POR MEDIÇÃO</span>
                <strong>
                  Um instrumento
                  <br />
                  de estudo. <em>Não um</em>
                  <br />
                  <em>app de motivação.</em>
                </strong>
                <p>
                  Horas, retenção e constância a partir de um registro que nunca
                  é reescrito.
                </p>
                <div>
                  <i>Entrar</i>
                  <i>Pedir acesso</i>
                </div>
              </div>
            </div>
            <div className="nx-real-case-content">
              <span className="nx-case-label">
                <i /> PRODUTO SAAS / LATIS SKILLS
              </span>
              <h3>Gestão de estudo baseada em medição</h3>
              <p>
                Produto em desenvolvimento para registrar sessões de estudo e
                transformar horas, retenção e constância em dados que façam
                sentido na prática.
              </p>
              <ul>
                <li>Registro de estudo imutável</li>
                <li>Revisão espaçada</li>
                <li>Agenda baseada em disponibilidade</li>
              </ul>
              <a
                href="https://latisskills.com.br/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Conhecer o produto <ArrowUpRight size={18} />
              </a>
            </div>
          </article>
          <p className="nx-demo-note">
            Os dois cards abaixo são estudos visuais ilustrativos e não
            representam clientes atendidos ou resultados obtidos.
          </p>
          <div className="nx-demo-grid">
            <article>
              <div className="nx-demo-window nx-demo-clinic">
                <div className="nx-demo-nav">
                  aurora<span>SAÚDE & BEM-ESTAR</span>
                  <span>↗</span>
                </div>
                <div className="nx-demo-content">
                  <div>
                    <span className="nx-mini-label">
                      ESPAÇO PARA CUIDAR DE VOCÊ
                    </span>
                    <h3>
                      Seu bem-estar
                      <br />
                      merece tempo
                      <br />
                      <em>e atenção.</em>
                    </h3>
                    <span className="nx-demo-fake-button">
                      Conheça nossas especialidades ↗
                    </span>
                  </div>
                  <div className="nx-plant" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
                <div className="nx-demo-foot">
                  ACOLHIMENTO · CUIDADO · PROXIMIDADE
                </div>
              </div>
              <div className="nx-demo-description">
                <div>
                  <span>CONCEITO / CLÍNICAS E CONSULTÓRIOS</span>
                  <h3>Confiança antes do agendamento.</h3>
                  <p>
                    Especialidades, equipe e localização organizadas para
                    facilitar o primeiro contato.
                  </p>
                </div>
                <a
                  href="#diagnostico"
                  aria-label="Conversar sobre um site para clínicas"
                >
                  <ArrowUpRight />
                </a>
              </div>
            </article>
            <article>
              <div className="nx-demo-window nx-demo-service">
                <div className="nx-demo-nav">
                  PRUMO<span>INSTALAÇÃO & MANUTENÇÃO</span>
                  <span>↗</span>
                </div>
                <div className="nx-demo-content">
                  <div>
                    <span className="nx-mini-label">
                      QUEM RESOLVE, FAZ BEM-FEITO.
                    </span>
                    <h3>
                      Sua próxima
                      <br />
                      obra começa
                      <br />
                      <em>com confiança.</em>
                    </h3>
                    <span className="nx-demo-fake-button">
                      Solicite seu orçamento ↗
                    </span>
                  </div>
                  <div className="nx-building" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
                <div className="nx-demo-foot">
                  SERVIÇOS · PROJETOS · ÁREA DE ATENDIMENTO
                </div>
              </div>
              <div className="nx-demo-description">
                <div>
                  <span>CONCEITO / PRESTADORES DE SERVIÇOS</span>
                  <h3>Do serviço ao pedido de orçamento.</h3>
                  <p>
                    Portfólio, região atendida e informações que ajudam a
                    qualificar cada solicitação.
                  </p>
                </div>
                <a
                  href="#diagnostico"
                  aria-label="Conversar sobre um site para prestadores de serviços"
                >
                  <ArrowUpRight />
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="nx-evolution">
        <div className="nx-container">
          <Workflow size={34} />
          <div>
            <Label>UMA BASE PARA O QUE VEM DEPOIS</Label>
            <h2>Hoje, um site. Amanhã, uma operação mais simples.</h2>
            <p>
              Quando tarefas repetitivas começarem a tomar seu tempo, avaliamos
              automações, integrações e sistemas sob medida para o seu negócio.
            </p>
          </div>
          <a className="nx-text-link" href="#diagnostico">
            Conversar sobre meu desafio <MoveUpRight size={18} />
          </a>
        </div>
      </section>

      <section className="nx-section" id="duvidas">
        <div className="nx-container nx-faq-grid">
          <div>
            <Label>SEM PONTAS SOLTAS</Label>
            <h2>
              Boas perguntas.
              <br />
              Respostas claras.
            </h2>
            <p>
              Ainda ficou alguma dúvida?
              <br />
              <a className="nx-text-link" href="#diagnostico">
                Vamos conversar <ArrowUpRight size={17} />
              </a>
            </p>
          </div>
          <div className="nx-faq-list">
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="nx-section nx-contact" id="diagnostico">
        <div className="nx-container nx-contact-grid">
          <div>
            <Label>VAMOS DAR O PRÓXIMO PASSO?</Label>
            <h2>
              Seu negócio tem
              <br />
              uma história.
              <br />
              <span>
                Vamos colocar
                <br />
                ela no mundo.
              </span>
            </h2>
            <p>
              Agende um diagnóstico gratuito de 25 minutos. Vamos entender sua
              presença digital e indicar um caminho adequado ao seu momento.
            </p>
            <ul className="nx-diagnostic-list">
              <li>
                <Check size={17} /> Entenda o que pode melhorar hoje
              </li>
              <li>
                <Check size={17} /> Conheça a solução que faz sentido
              </li>
              <li>
                <Check size={17} /> Sem compromisso de contratação
              </li>
            </ul>
            {whatsapp && (
              <a
                className="nx-whatsapp"
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={20} />
                Prefere conversar pelo WhatsApp?
                <ArrowUpRight size={18} />
              </a>
            )}
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
