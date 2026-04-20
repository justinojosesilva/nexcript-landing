export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  featured?: boolean;
  content: string;
};

export const posts: Post[] = [
  {
    slug: "clean-architecture-java-spring-boot",
    title: "Clean Architecture com Java e Spring Boot: guia prático",
    excerpt:
      "Como estruturar um projeto Spring Boot usando os princípios de Clean Architecture — separação de camadas, inversão de dependência e testabilidade desde o primeiro dia.",
    category: "Arquitetura",
    date: "2026-04-02",
    readingTime: "12 min",
    featured: true,
    content: `A maioria dos projetos Spring Boot começa organizada — controllers, services, repositories — mas em poucos meses vira um monólito onde tudo depende de tudo. A raiz do problema não é o framework, é a falta de uma arquitetura que proteja as regras de negócio.

## O que é Clean Architecture

Clean Architecture, proposta por Robert C. Martin, organiza o código em camadas concêntricas onde **a dependência sempre aponta para dentro** — das camadas externas (frameworks, banco de dados) para as internas (regras de negócio).

As camadas principais são:

- **Entities** — objetos de domínio com regras de negócio puras
- **Use Cases** — orquestram o fluxo de dados entre entities e interfaces externas
- **Interface Adapters** — controllers, presenters, gateways
- **Frameworks & Drivers** — Spring, JPA, HTTP, banco de dados

## Estrutura de pastas recomendada

\`\`\`
src/main/java/com/example/
├── domain/
│   ├── entity/
│   │   └── Order.java
│   ├── gateway/
│   │   └── OrderGateway.java
│   └── usecase/
│       └── CreateOrderUseCase.java
├── infra/
│   ├── persistence/
│   │   ├── OrderJpaEntity.java
│   │   ├── OrderRepository.java
│   │   └── OrderGatewayImpl.java
│   └── config/
│       └── BeanConfig.java
└── api/
    ├── controller/
    │   └── OrderController.java
    └── dto/
        └── CreateOrderRequest.java
\`\`\`

O ponto-chave: a pasta \`domain\` **não importa nada do Spring**. Ela é pura Java.

## Use Case na prática

\`\`\`java
public class CreateOrderUseCase {
    private final OrderGateway orderGateway;

    public CreateOrderUseCase(OrderGateway orderGateway) {
        this.orderGateway = orderGateway;
    }

    public Order execute(String customerId, List<Item> items) {
        var order = Order.create(customerId, items);
        return orderGateway.save(order);
    }
}
\`\`\`

Repare que \`OrderGateway\` é uma interface definida no domínio. A implementação concreta (\`OrderGatewayImpl\`) fica na camada de infra e usa JPA — mas o use case não sabe disso.

## Benefícios concretos

1. **Testes unitários rápidos** — o domínio roda sem Spring Context
2. **Troca de banco sem dor** — mude de PostgreSQL para MongoDB alterando apenas a camada de infra
3. **Onboarding mais rápido** — devs novos entendem onde cada coisa vive
4. **Menos acoplamento** — mudanças no controller não quebram o domínio

## Quando não usar

Clean Architecture adiciona complexidade. Para CRUDs simples ou MVPs com 2-3 entidades, o padrão MVC do Spring Boot é mais do que suficiente. Use Clean Architecture quando o domínio é complexo o bastante para justificar a separação.

---

*Na NexCript, usamos Clean Architecture em todo projeto Java que tenha mais de 5 entidades de domínio. É o investimento que mais se paga em médio prazo.*`,
  },
  {
    slug: "mvp-quanto-custa-quanto-tempo",
    title: "MVP: quanto custa e quanto tempo leva em 2026",
    excerpt:
      "Desmistificamos os números: quanto realmente custa construir um MVP no Brasil, quais fatores influenciam o preço e como otimizar seu investimento.",
    category: "Negócios",
    date: "2026-03-25",
    readingTime: "8 min",
    content: `"Quanto custa um MVP?" é a pergunta que mais recebemos. A resposta honesta é: depende. Mas "depende" não ajuda ninguém a planejar, então vamos aos números reais.

## Faixas de investimento

| Complexidade | Prazo | Investimento |
|---|---|---|
| MVP simples (landing + formulário + admin básico) | 4-6 semanas | R$ 15-30k |
| MVP médio (autenticação, dashboard, integrações) | 8-12 semanas | R$ 30-60k |
| MVP complexo (pagamentos, real-time, IA) | 12-16 semanas | R$ 60-120k |

Esses valores consideram uma consultoria sênior com time enxuto. Fábricas de software costumam cobrar menos por hora, mas levam mais tempo e entregam mais retrabalho.

## O que influencia o preço

**1. Número de integrações** — cada API externa (pagamento, e-mail, CRM) adiciona complexidade. Um MVP com Stripe + SendGrid + Google Calendar pode custar 30% mais que um sem integrações.

**2. Autenticação e permissões** — login social é simples. Roles, multi-tenancy e SSO são outra história.

**3. Real-time** — chat, notificações push, dashboards ao vivo exigem WebSockets ou SSE e infraestrutura diferente.

**4. Design** — usar um design system pronto (Tailwind UI, Shadcn) vs. design custom impacta entre 15-25% do orçamento.

## Como otimizar seu investimento

1. **Defina o problema, não a solução** — deixe o time técnico propor a arquitetura
2. **Corte features sem dó** — se não é essencial para validar a hipótese, fica para a v2
3. **Use tecnologias maduras** — Next.js, NestJS, PostgreSQL. Não é hora de experimentar
4. **Invista em arquitetura** — código bem estruturado na v1 reduz o custo da v2 em até 60%

## O erro mais caro

O erro mais caro não é gastar muito no MVP — é gastar pouco em arquitetura e ter que jogar tudo fora em 12 meses. Já vimos startups gastarem R$ 200k reescrevendo um sistema que custou R$ 40k porque o código original não escalava.

---

*Na NexCript, nosso processo de Descoberta existe justamente para evitar isso. Antes de escrever código, entendemos profundamente o problema e desenhamos uma arquitetura que suporta o crescimento.*`,
  },
  {
    slug: "nextjs-vs-react-spa-quando-usar-cada",
    title: "Next.js vs React SPA: quando usar cada um",
    excerpt:
      "Server Components, SSR, SSG, SPA — a decisão não é só técnica. Entenda os trade-offs reais e escolha a arquitetura certa para seu projeto.",
    category: "Tecnologia",
    date: "2026-03-18",
    readingTime: "10 min",
    content: `A escolha entre Next.js e um React SPA puro afeta performance, SEO, custo de infra e velocidade de desenvolvimento. Não existe resposta universal — existe a resposta certa para o seu caso.

## Quando usar Next.js

Next.js brilha quando você precisa de:

- **SEO** — páginas de marketing, blog, e-commerce, landing pages
- **Performance inicial** — Server Components reduzem o JavaScript enviado ao cliente
- **Conteúdo dinâmico com cache** — ISR permite páginas estáticas que se atualizam sem rebuild
- **Full-stack leve** — Route Handlers e Server Actions eliminam a necessidade de um backend separado para operações simples

## Quando usar React SPA

Um SPA com Vite + React Router faz mais sentido para:

- **Dashboards internos** — SEO não importa, e a interatividade é constante
- **Aplicações atrás de login** — todo conteúdo é privado, SSR não agrega valor
- **Offline-first** — PWAs que precisam funcionar sem internet
- **Integração com backend existente** — quando o backend já está pronto e o front é apenas um cliente

## Os trade-offs que ninguém fala

### Complexidade de deploy

Next.js com features avançadas (middleware, ISR, Server Actions) precisa de um runtime Node.js. Não é mais "só jogar no S3". Você vai precisar de Vercel, AWS com containers, ou self-hosting com cuidado.

Um SPA é um diretório de arquivos estáticos. Deploy em qualquer CDN.

### Modelo mental

Server Components mudam fundamentalmente como você pensa sobre React. Componentes podem ser async, podem acessar banco de dados diretamente, mas não podem usar useState. A curva de aprendizado é real.

### Custo de infra

\`\`\`
SPA (Vite):        CDN = ~$0-20/mês
Next.js (Vercel):  ~$20-150/mês dependendo do tráfego
Next.js (self):    Container + CDN = ~$30-100/mês
\`\`\`

## Nossa recomendação

| Cenário | Escolha |
|---|---|
| Site institucional + blog | Next.js |
| SaaS com landing page pública | Next.js |
| Dashboard interno | React SPA |
| MVP rápido full-stack | Next.js |
| App mobile-first (PWA) | React SPA |

---

*Na NexCript, usamos Next.js para 80% dos projetos. A combinação de Server Components + Server Actions simplifica muito a arquitetura quando você precisa de front e back no mesmo projeto.*`,
  },
  {
    slug: "automatizar-processos-ia-n8n-python",
    title: "Automatizando processos empresariais com IA, n8n e Python",
    excerpt:
      "Como usar IA generativa e ferramentas no-code para eliminar trabalho manual repetitivo — com exemplos reais de automações que implementamos.",
    category: "IA",
    date: "2026-03-10",
    readingTime: "9 min",
    content: `Toda empresa tem processos que consomem horas de trabalho manual: classificar e-mails, extrair dados de documentos, gerar relatórios, responder perguntas frequentes. A combinação de IA generativa com ferramentas de automação resolve isso de forma surpreendentemente rápida.

## O stack de automação

Nossa stack padrão para automações empresariais:

- **n8n** — orquestrador de workflows (self-hosted, sem limites de execução)
- **Python + FastAPI** — para processamento pesado e modelos de IA
- **OpenAI API** — GPT-4 para classificação, extração e geração de texto
- **PostgreSQL** — armazenamento de resultados e histórico

## Exemplo real: classificação de e-mails

Um escritório de advocacia recebia 200+ e-mails por dia e gastava 2 horas classificando-os manualmente entre 8 categorias.

### O workflow

\`\`\`
E-mail recebido (IMAP)
  → n8n extrai assunto + corpo
  → Envia para API Python
  → GPT-4 classifica em categoria
  → n8n move para pasta correta
  → Notifica responsável no Slack
\`\`\`

### O prompt de classificação

\`\`\`python
def classify_email(subject: str, body: str) -> str:
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": """Classifique o e-mail em UMA das categorias:
                - NOVO_PROCESSO
                - ANDAMENTO_PROCESSUAL
                - FINANCEIRO
                - AGENDAMENTO
                - DOCUMENTO
                - MARKETING
                - SPAM
                - OUTROS
                Responda APENAS com o nome da categoria."""
            },
            {
                "role": "user",
                "content": f"Assunto: {subject}\\nCorpo: {body[:2000]}"
            }
        ],
        temperature=0
    )
    return response.choices[0].message.content.strip()
\`\`\`

### Resultado

- **Tempo de classificação**: de 2 horas para 0 (automático)
- **Precisão**: 94% de acerto (os 6% restantes são revisados manualmente)
- **ROI**: investimento se pagou em 6 semanas

## Quando automatizar vs. quando não

**Automatize quando:**
- A tarefa é repetitiva e baseada em regras (mesmo que complexas)
- O volume justifica o investimento (50+ execuções por semana)
- Erros humanos são frequentes e custosos

**Não automatize quando:**
- A tarefa exige julgamento humano complexo
- O volume é baixo (5 vezes por mês)
- O processo muda frequentemente

---

*Automações são o serviço com ROI mais rápido que oferecemos na NexCript. A maioria se paga em menos de 3 meses.*`,
  },
  {
    slug: "postgresql-performance-queries-lentas",
    title: "PostgreSQL: como identificar e corrigir queries lentas",
    excerpt:
      "Um guia prático para diagnosticar problemas de performance no PostgreSQL — desde EXPLAIN ANALYZE até índices compostos e materialização.",
    category: "Tecnologia",
    date: "2026-03-03",
    readingTime: "11 min",
    content: `Query lenta é sintoma, não doença. Antes de "jogar um índice" no problema, você precisa entender o que o PostgreSQL está fazendo de fato. Este guia mostra como investigar.

## Passo 1: identifique as queries lentas

Habilite o log de queries lentas no \`postgresql.conf\`:

\`\`\`sql
-- Loga queries que levam mais de 200ms
ALTER SYSTEM SET log_min_duration_statement = 200;
SELECT pg_reload_conf();
\`\`\`

Ou use a extensão \`pg_stat_statements\`:

\`\`\`sql
CREATE EXTENSION pg_stat_statements;

SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;
\`\`\`

## Passo 2: EXPLAIN ANALYZE

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT o.id, o.total, c.name
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'pending'
  AND o.created_at > NOW() - INTERVAL '30 days'
ORDER BY o.created_at DESC
LIMIT 50;
\`\`\`

O que procurar no resultado:

- **Seq Scan em tabelas grandes** — provavelmente falta um índice
- **Nested Loop com tabela grande no inner** — considere Hash Join
- **Sort com alto custo** — índice na coluna de ordenação pode ajudar
- **Buffers shared read alto** — dados não estão em cache

## Passo 3: crie o índice certo

Não crie índices genéricos. Crie índices que atendam à query específica:

\`\`\`sql
-- Índice composto para a query acima
CREATE INDEX idx_orders_status_created
ON orders (status, created_at DESC)
WHERE status = 'pending';
\`\`\`

O índice parcial (\`WHERE status = 'pending'\`) é menor e mais rápido porque ignora registros que não importam para essa query.

## Passo 4: monitore

Após aplicar a correção, compare:

\`\`\`sql
-- Antes: Seq Scan, 450ms
-- Depois: Index Scan, 3ms
\`\`\`

## Erros comuns

1. **Índice em coluna de baixa cardinalidade** — um índice na coluna \`status\` com 3 valores distintos raramente ajuda
2. **Muitos índices** — cada índice torna INSERTs e UPDATEs mais lentos
3. **Não rodar ANALYZE** — o planner usa estatísticas desatualizadas
4. **Ignorar o BUFFERS** — a query pode ser rápida mas consumir muita memória

---

*Performance de banco é uma das áreas onde vemos mais desperdício. Na NexCript, incluímos auditoria de queries em todo projeto que envolve PostgreSQL.*`,
  },
  {
    slug: "como-escolher-consultoria-tecnologia",
    title: "Como escolher uma consultoria de tecnologia (sem cair em armadilhas)",
    excerpt:
      "Os 7 sinais de uma boa consultoria técnica — e os red flags que indicam que você vai ter problemas. Guia baseado em anos dos dois lados da mesa.",
    category: "Negócios",
    date: "2026-02-24",
    readingTime: "7 min",
    content: `Contratar uma consultoria de tecnologia é uma das decisões mais impactantes que uma empresa pode tomar. Acerte, e você ganha meses. Erre, e você perde meses — e dinheiro.

## 7 sinais de uma boa consultoria

### 1. Faz perguntas antes de dar respostas

Uma consultoria séria não aceita um projeto sem antes entender o problema. Se na primeira reunião já estão propondo stack e cronograma, desconfie.

### 2. Mostra trabalho real

Cases com números concretos (redução de X%, entrega em Y semanas) valem mais que portfólios bonitos. Peça referências de clientes anteriores.

### 3. Documenta a arquitetura antes de codar

O documento de arquitetura é o contrato técnico. Se a consultoria pula essa etapa, você não tem como validar o que está sendo construído.

### 4. Entrega incrementalmente

Sprints semanais com demos ao vivo. Você precisa ver progresso real, não relatórios de status.

### 5. Transfere conhecimento

Ao final do projeto, sua equipe (ou você) precisa ser capaz de manter o sistema. Documentação, treinamento e code review fazem parte da entrega.

### 6. Tem opinião técnica

Uma boa consultoria diz "não" quando a decisão técnica é ruim — mesmo que o cliente peça. Dizer sim para tudo é sinal de quem quer faturar, não de quem quer entregar.

### 7. Oferece garantia

30 dias de garantia após a entrega é o mínimo. Bugs encontrados nesse período são corrigidos sem custo adicional.

## 5 red flags

1. **Proposta em 24h sem reunião de descoberta** — não entenderam o problema
2. **Preço muito abaixo do mercado** — vão usar devs júnior ou offshore sem supervisão
3. **Sem contrato claro de escopo** — mudanças de escopo sem controle = orçamento estourado
4. **Código sem testes** — se não testam, não têm confiança no que entregam
5. **Sem acesso ao repositório** — o código é seu. Se não te dão acesso ao repo, o código é refém

---

*Esses critérios são exatamente o que praticamos na NexCript. Se quiser validar, converse com nossos clientes anteriores — ficaremos felizes em conectá-los.*`,
  },
  {
    slug: "nestjs-api-rest-producao",
    title: "NestJS: construindo uma API REST pronta para produção",
    excerpt:
      "Do setup ao deploy: validação, autenticação JWT, rate limiting, logging estruturado e testes — tudo que sua API precisa antes de ir ao ar.",
    category: "Tecnologia",
    date: "2026-02-17",
    readingTime: "14 min",
    content: `NestJS é o framework Node.js que mais se aproxima de uma experiência "enterprise" — com injeção de dependência, módulos, e uma arquitetura que escala. Mas um \`nest new\` está longe de estar pronto para produção. Veja o que falta.

## 1. Validação com class-validator

\`\`\`typescript
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  password: string;
}
\`\`\`

Habilite a validação global no \`main.ts\`:

\`\`\`typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,        // remove campos não declarados
  forbidNonWhitelisted: true,  // retorna erro se enviar campo extra
  transform: true,        // converte tipos automaticamente
}));
\`\`\`

## 2. Autenticação JWT

\`\`\`typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
\`\`\`

## 3. Rate limiting

\`\`\`typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 100 }],
    }),
  ],
})
export class AppModule {}
\`\`\`

## 4. Logging estruturado

Use Pino para logs em JSON (muito mais fácil de parsear no CloudWatch/Datadog):

\`\`\`typescript
import { LoggerModule } from 'nestjs-pino';

LoggerModule.forRoot({
  pinoHttp: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty' }
      : undefined,
  },
})
\`\`\`

## 5. Testes

\`\`\`typescript
describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockUser]),
            create: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    controller = module.get(UsersController);
    service = module.get(UsersService);
  });

  it('should return all users', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockUser]);
  });
});
\`\`\`

## Checklist de produção

- [ ] Validação global com whitelist
- [ ] Autenticação JWT + refresh tokens
- [ ] Rate limiting por IP e por usuário
- [ ] CORS configurado (não use \`*\` em produção)
- [ ] Helmet para headers de segurança
- [ ] Logging estruturado em JSON
- [ ] Health check endpoint (\`/health\`)
- [ ] Graceful shutdown
- [ ] Testes unitários + e2e
- [ ] Variáveis de ambiente validadas (usando \`@nestjs/config\` + Joi)

---

*NestJS é nossa escolha padrão para APIs Node.js na NexCript. A estrutura modular permite que novos devs sejam produtivos rapidamente — e que o código se mantenha organizado conforme o projeto cresce.*`,
  },
  {
    slug: "ia-generativa-pequenas-empresas-casos-reais",
    title: "IA generativa para pequenas empresas: 5 casos de uso reais",
    excerpt:
      "Esqueça os hypes — veja como PMEs estão usando IA generativa hoje para economizar tempo e dinheiro, com exemplos práticos e ROI mensurável.",
    category: "IA",
    date: "2026-02-10",
    readingTime: "8 min",
    content: `IA generativa não é só para big techs. Pequenas e médias empresas já estão usando GPT-4, Claude e modelos open-source para resolver problemas reais — com investimento acessível e retorno rápido.

## 1. Atendimento ao cliente inteligente

**Empresa:** E-commerce de moda (50 funcionários)

**Problema:** 60% das mensagens no WhatsApp eram perguntas repetitivas (prazo de entrega, troca, rastreamento).

**Solução:** Chatbot com RAG (Retrieval-Augmented Generation) que busca informações na base de conhecimento da empresa e responde em linguagem natural.

**Resultado:** 45% das conversas resolvidas sem intervenção humana. Tempo médio de resposta caiu de 4 horas para 30 segundos.

## 2. Geração de conteúdo para marketing

**Empresa:** Agência de marketing digital (15 pessoas)

**Problema:** Produzir 40+ posts por semana para redes sociais de 8 clientes diferentes.

**Solução:** Pipeline que recebe briefing, gera rascunhos com tom de voz específico de cada cliente, e apresenta para aprovação humana.

**Resultado:** Tempo de criação de conteúdo reduzido em 70%. A equipe foca em estratégia e aprovação, não em redação.

## 3. Análise de contratos

**Empresa:** Escritório de advocacia (8 advogados)

**Problema:** Revisão de contratos de locação levava 2-3 horas por documento.

**Solução:** Sistema que extrai cláusulas-chave, identifica riscos e gera um resumo estruturado com pontos de atenção.

**Resultado:** Revisão inicial reduzida para 20 minutos. Advogados focam nos pontos críticos identificados pela IA.

## 4. Classificação de documentos fiscais

**Empresa:** Escritório de contabilidade (12 pessoas)

**Problema:** Classificação manual de 500+ notas fiscais por mês entre 15 categorias contábeis.

**Solução:** OCR + GPT-4 para extrair dados e classificar automaticamente. Resultados são revisados por amostragem.

**Resultado:** Processamento 10x mais rápido. Taxa de erro caiu de 8% (humano) para 3% (IA + revisão).

## 5. Transcrição e resumo de reuniões

**Empresa:** Consultoria de gestão (20 pessoas)

**Problema:** Ninguém fazia atas de reunião. Decisões se perdiam.

**Solução:** Gravação automática via Zoom + transcrição com Whisper + resumo estruturado com GPT-4 (decisões, próximos passos, responsáveis).

**Resultado:** 100% das reuniões documentadas. Tempo gasto em atas: zero.

## O padrão

Note que todos os casos têm algo em comum:

1. **Tarefa repetitiva** com padrões identificáveis
2. **Volume alto** que justifica automação
3. **Humano no loop** — IA faz o trabalho pesado, humano valida
4. **ROI claro** — economia de tempo mensurável

---

*Se sua empresa tem processos que se encaixam nesse padrão, provavelmente existe uma automação com IA que faz sentido. Na NexCript, fazemos um diagnóstico gratuito para identificar essas oportunidades.*`,
  },
];

export const categories = [
  "Todos",
  "Tecnologia",
  "Arquitetura",
  "IA",
  "Negócios",
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
