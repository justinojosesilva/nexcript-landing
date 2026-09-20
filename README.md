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

- Ofertas, preços e prazos: `app/page.tsx`, baseados em `../documentos/MVP_Comercial_Nexcript.md`.
- Visual e responsividade: `app/globals.css` (classes `nx-*`).
- Cabeçalho e rodapé: `components/layout/`.
- Formulário: `app/contato/ContactForm.tsx`.
- `/contato` redireciona para `/#diagnostico`.
- Aurora e Prumo são conceitos ilustrativos, não cases de clientes.

As páginas anteriores `/servicos`, `/cases`, `/sobre` e `/blog` foram preservadas e não aparecem na navegação da landing page. Ainda precisam de revisão editorial antes de serem divulgadas, especialmente alegações de resultados e experiência. A página inicial já usa o posicionamento atual.

Não houve publicação em produção. Antes de publicar, definir domínio/hosting e decidir se haverá captura independente de leads, analytics e política de privacidade específica para essas ferramentas.
