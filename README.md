# Nexcript — landing page comercial

Site em Next.js 16, React 19 e Tailwind CSS 4. A página inicial apresenta a oferta do MVP comercial: sites para pequenas empresas, Nexcript Care e evolução para automação e software.

## Executar

```sh
pnpm install
pnpm dev
```

## Verificar

```sh
pnpm lint
pnpm build
```

O build usa `next/font/google` (Manrope, Syne e JetBrains Mono) e precisa de acesso ao Google Fonts na primeira compilação. As fontes são servidas pelo próprio Next.js após o build.

## Contato

O WhatsApp oficial informado pelo responsável está em `lib/contact.ts`: `5511970452495`. Pode ser substituído por `NEXT_PUBLIC_WHATSAPP_NUMBER` no ambiente de build; veja `.env.example`.

O formulário valida os campos e abre uma mensagem preenchida no WhatsApp. O visitante precisa concluir o envio no aplicativo. Não há envio automático, API de e-mail, banco de leads ou integração ao CRM. Não é exibida uma confirmação falsa de recebimento.

Para usar e-mail como alternativa, configure `NEXT_PUBLIC_CONTACT_EMAIL` e deixe `NEXT_PUBLIC_WHATSAPP_NUMBER` vazio. O formulário abrirá o aplicativo de e-mail do visitante. Não configure segredos nessas variáveis públicas. Reinicie o servidor/recompile após alterá-las.

## Conteúdo

## Starter Kit técnico

Há uma base reutilizável para novos projetos em [`STARTER_KIT.md`](STARTER_KIT.md). Ela concentra configuração por cliente (`starter.config.ts`), SEO, eventos, integrações de contato, formulário, seções e tokens de tema. A estrutura foi dimensionada para um Site Essencial em 12–15 dias úteis, sem incorporar CMS ou um design system grande antes de haver necessidade.

- Ofertas, preços e prazos: `app/page.tsx`, baseados em `../documentos/MVP_Comercial_Nexcript.md`.
- Visual e responsividade: `app/globals.css` (classes `nx-*`).
- Cabeçalho e rodapé: `components/layout/`.
- Formulário: `app/contato/ContactForm.tsx`.
- `/contato` redireciona para `/#diagnostico`.
- Aurora e Prumo são conceitos ilustrativos, não cases de clientes.

As páginas do site anterior (`/servicos`, `/cases`, `/sobre` e `/blog`) foram removidas e redirecionam permanentemente para a home (`next.config.ts`).

Não houve publicação em produção. Antes de publicar, definir domínio/hosting e decidir se haverá captura independente de leads, analytics e política de privacidade específica para essas ferramentas.

## Prospecção

Coleta empresas no Google Maps (Apify), filtra (aberta, sem site próprio, com telefone e avaliações) e grava na tabela `prospects` do Turso. O resultado aparece em `/interno/prospeccao`, separado em visitáveis (cidade de São Paulo) e remotos.

```bash
pnpm prospectar --nicho odontologia --cidade "Campinas, SP"
pnpm prospectar --nicho todos --cidade "São Paulo, SP" --limite 10 --simular
```

- Nichos e termos de busca: `lib/prospects/niches.ts`.
- Regras de filtro e score: `lib/prospects/maps.ts`.
- Teste sem Apify: `pnpm prospectar --nicho odontologia --arquivo scripts/exemplos/maps-exemplo.json --simular`.
- Chaves no `.env.local`: `APIFY_TOKEN`, `TURSO_DATABASE_URL` e `TURSO_AUTH_TOKEN`.
