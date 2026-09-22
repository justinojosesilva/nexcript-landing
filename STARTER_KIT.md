# Nexcript Starter Kit Técnico

Base para sites institucionais e comerciais de até cinco páginas. A proposta é repetir decisões técnicas, não repetir uma identidade visual: cada novo projeto recebe conteúdo, marca e composição próprios.

## Estrutura

| Diretório | Responsabilidade |
| --- | --- |
| `components/` | blocos pequenos e reutilizáveis de interface |
| `sections/` | seções completas, compostas por componentes |
| `layouts/` | estrutura global de páginas |
| `forms/` | captação, validação e encaminhamento de leads |
| `analytics/` | eventos neutros, sem fornecedor acoplado |
| `seo/` | metadata, canonical e dados estruturados |
| `themes/` | tokens mínimos de tema |
| `integrations/` | adaptadores para serviços externos |

## Começar um Site Essencial

1. Copie `.env.example` para `.env.local` e defina URL e canal de contato.
2. Atualize `starter.config.ts` com a empresa, descrição e redes sociais.
3. Use `createMetadata(siteConfig, { ... })` em cada página e `OrganizationJsonLd` no layout.
4. Monte a página com `sections/` e `components/`; não duplique markup entre páginas.
5. Conecte um fornecedor de analytics somente após definir consentimento e política de privacidade. O starter não coleta dados por padrão.

## Cadência recomendada (12–15 dias úteis)

- Dias 1–2: briefing, conteúdo, mapa do site e materiais.
- Dias 3–5: direção visual e página inicial.
- Dias 6–8: páginas internas, formulário e responsividade.
- Dias 9–10: SEO técnico, métricas, revisão de conteúdo e QA.
- Dias 11–15: ajustes do cliente, publicação e janela de suporte.

## Limites intencionais

Este kit não inclui CMS, autenticação, banco de dados, biblioteca ampla de componentes ou automações de marketing. Acrescente esses itens somente quando forem parte do escopo aprovado.
