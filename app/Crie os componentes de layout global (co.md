Crie os componentes de layout global (components/layout/). 

── NAVBAR (components/layout/Navbar.tsx) ───────────── 

Comportamento: 

  - Transparente no topo da Home, sólida (#0D1B2A) ao scrollar 
  - Sempre sólida em páginas internas 
  - Sticky (position: sticky, top: 0, z-index: 50) 
  - Blur backdrop quando transparente (backdrop-blur-sm) 
 
Conteúdo desktop: 

  Esquerda: Logo 'NexCript' (fonte Syne, bold) com ponto teal 
  Centro: Links — Serviços · Cases · Sobre · Blog 
  Direita: Botão 'Falar com consultor' (#E67E22, sem outline) 
 
Links com animação de underline grow no hover (CSS) 
Link ativo com cor teal (usar usePathname do Next.js) 

Mobile (hamburger menu): 

  Ícone hambúrguer (Lucide Menu / X) 
  Menu fullscreen com fade-in e slide-down 
  Todos os links verticais + CTA ao final 
  Fechar ao clicar no link ou fora do menu 

── FOOTER (components/layout/Footer.tsx) ───────────── 

Background: #0D1B2A 
Padding: generoso (py-16) 

Seção superior — 4 colunas: 

  Col 1 (40%): Logo + tagline + ícones de redes (LinkedIn, GitHub) 
  Col 2: Serviços (links para /servicos com âncoras) 
  Col 3: Empresa (Cases, Sobre, Blog) 
  Col 4: Contato (email, WhatsApp, endereço) 
 
Linha divisória teal sutil 
 
Seção inferior — 2 colunas: 

  Esquerda: '© 2026 NexCript. Todos os direitos reservados.' 
  Direita: 'Política de Privacidade · Termos de Uso' 
 
Links do footer com hover em teal, sem underline por padrão. 
