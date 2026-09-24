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

Coleta empresas no Google Maps (Apify), filtra (aberta, sem site próprio, com telefone e avaliações) e grava no **NexCRM** (crm.nexcript.com.br) pela API de ingestão. O acompanhamento (Hoje, cadência, mensagens, pipeline) é feito lá; o antigo painel `/interno` foi removido.

```bash
pnpm prospectar --nicho odontologia --cidade "Campinas, SP"
pnpm prospectar --nicho odontologia --bairros zona-sul --limite 10
pnpm prospectar --nicho todos --bairros "Moema, Brooklin" --limite 5
```

- `--bairros` aceita uma região de São Paulo (`zona-sul`, `zona-oeste`, `zona-norte`, `zona-leste`, `centro`), `todas` ou bairros separados por vírgula. Lista em `lib/prospects/regions.ts`.
- Antes de chamar o Apify, o script mostra o custo máximo estimado e exige `--confirmar` acima de US$ 0,50.
- O CRM não duplica: o mesmo lugar só tem avaliações e score atualizados; telefone já cadastrado fica de fora.

- Nichos e termos de busca: `lib/prospects/niches.ts`.
- Regras de filtro e score: `lib/prospects/maps.ts`.
- Teste sem Apify: `pnpm prospectar --nicho odontologia --arquivo scripts/exemplos/maps-exemplo.json --simular`.
- Chaves no `.env.local`: `APIFY_TOKEN`, `NEXCRM_URL` e `NEXCRM_TOKEN` (token criado com `pnpm token:criar` no repositório do NexCRM).

### Empresas recém-abertas (CNPJ)

Lê os dados abertos de CNPJ da Receita Federal (compartilhamento público do SERPRO, atualizado todo mês) em streaming: cerca de 5,4 GB passam pela rede, nada é gravado em disco. Filtra empresas **ativas**, abertas nos últimos 60 dias, com CNAE do combo de nichos, nas cidades de `cnpjCities` (`lib/prospects/regions.ts`) e com telefone. Grava no NexCRM com a origem "Prospecção · CNPJ novo".

```bash
pnpm prospectar:cnpj --simular          # todos os arquivos, sem gravar (~15 min)
pnpm prospectar:cnpj                    # grava as empresas com nome fantasia
pnpm prospectar:cnpj --dias 30 --nicho odontologia --cidades "SAO PAULO/SP"
```

- Por padrão, só entram empresas **com nome fantasia**. Sem nome fantasia (quase sempre MEI), a razão social é nome e CPF de pessoa física e não é guardada; `--incluir-sem-nome` grava essas empresas com um nome descritivo.
- Guarda só o necessário para a abordagem: nome fantasia, telefone, endereço comercial, cidade, nicho e data de abertura.
- As mensagens do roteiro no NexCRM usam a abertura recente como "momento" ("vi no cadastro público de empresas que vocês abriram agora em setembro…").
- Requer `bsdtar` (nativo no macOS) para descompactar em streaming.
- **Telefone de contador:** o coletor conta em quantas empresas abertas no período (todo o Brasil, qualquer atividade) cada telefone aparece. Com 3 ou mais, o número é marcado como provável contabilidade: o prospect entra no CRM com a etiqueta "tel. de contador?", sem pontos de contato no score, e o número vira um lead de parceria no pipeline **Parcerias** (Frente 2, parcerias de indicação).
