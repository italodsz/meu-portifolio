@AGENTS.md

# Portfólio Ítalo de Souza — Brief completo

Você vai construir do zero, neste repositório (`italodsz/meu-portifolio`), o portfólio pessoal de **Ítalo de Souza**, Desenvolvedor de Software Fullstack. Leia este documento inteiro antes de começar. Ele define stack, design, conteúdo, animações, funcionalidades e critérios de qualidade.

**Primeira tarefa:** salve este brief na raiz do repositório como `CLAUDE.md`, para que sessões futuras sigam as mesmas decisões.

---

## 1. Objetivo

Um portfólio que impressione recrutadores e clientes pelo **nível técnico de front-end** (animações, 3D, performance) e que também mostre **habilidade fullstack** (renderização no servidor, dados dinâmicos, rotas, i18n). O site precisa ser bonito, fluido, rápido e acessível. Menos efeitos, muito bem executados, é melhor do que muitos efeitos mal feitos.

---

## 2. Stack (obrigatória)

- **Next.js** (versão estável mais recente, App Router, Server Components onde fizer sentido)
- **React** + **TypeScript** (`strict: true`)
- **Tailwind CSS** (versão mais recente), com as cores e fontes definidas como tokens de tema
- **Motion** (pacote `motion`, import de `motion/react`) para todas as animações de interface e scroll
- **React Three Fiber** + **@react-three/drei** + **@react-three/postprocessing** + **three** para a cena 3D
- **next-intl** para PT/EN com rotas `/pt` e `/en`
- **next-themes** para tema escuro/claro
- **Lenis** (`lenis/react`) para scroll suave
- **lucide-react** para ícones de interface; **simple-icons** (ou equivalente) para logos de tecnologias
- Fontes com `next/font`: **Geist** (títulos e texto) e **Geist Mono** (rótulos, números, detalhes técnicos)
- ESLint + Prettier configurados
- Hospedagem prevista: **Vercel**. Não é site estático: use renderização no servidor e revalidação (ISR) onde indicado. Deixe o projeto pronto para receber um **domínio próprio** no futuro sem mudar código.

Não usar: GSAP, jQuery, bibliotecas de UI prontas (MUI, Chakra etc.), formulário de contato, chat com IA.

---

## 3. Direção visual

### Referências (descritas, porque você não consegue abri-las)

1. **Estrutura e tom**: portfólio pessoal minimalista em fundo quase preto, com títulos enormes e bem pesados em duas cores (primeira frase em branco, segunda em cinza ou destaque), seções numeradas com rótulo pequeno em fonte mono ("01 / SOBRE", "02 / PROJETOS"), selo de status com bolinha colorida no topo do hero, cards grandes de projeto com print, tags em pílula e seta ↗, e rodapé com localização e coordenadas geográficas. **Use apenas como inspiração de estrutura; não copie textos nem layout exato.**
2. **Paleta e energia** (referência principal de cor): landing page em preto profundo com **vermelho vivo** como única cor de destaque; fotos com tratamento duotone vermelho e preto; um elemento orgânico brilhante em vermelho no hero; **bento grid** de cards escuros com bordas sutis; números grandes ("120+", "95%"); palavras-chave destacadas em vermelho no meio das frases; faixa de logos.

O resultado deve ser **mais limpo e mais animado** que a referência 1, com a paleta da referência 2.

### Paleta (tokens)

| Token         | Escuro (padrão)          | Claro              |
| ------------- | ------------------------ | ------------------ |
| `bg`          | `#0A0A0A`                | `#F4F1EC`          |
| `surface`     | `#141414`                | `#FFFFFF`          |
| `surface-2`   | `#1C1C1C`                | `#EAE6E0`          |
| `accent`      | `#FF2D20`                | `#E0241A`          |
| `accent-glow` | `#FF5A45`                | `#FF4A38`          |
| `text`        | `#F5F5F5`                | `#111111`          |
| `text-muted`  | `#8A8A8A`                | `#6B6B6B`          |
| `border`      | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.08)` |

- Tema **escuro é o padrão**; o claro é opcional via botão e fica salvo por visitante.
- Vermelho só em títulos, destaques, detalhes e estados de hover. Parágrafos longos nunca em vermelho. Confira contraste WCAG AA.
- Textura de **grão (noise)** bem sutil sobre o site inteiro.

### Tipografia

- Títulos: Geist, peso 700–800, tracking negativo, tamanhos fluidos com `clamp()` (hero chegando a ~9–10vw no desktop).
- Rótulos de seção, números, datas e coordenadas: Geist Mono, caixa alta, tracking largo.
- Títulos em duas cores: primeira linha `text`, segunda linha `accent` (ou `text-muted`).

### Linguagem visual

- Cantos arredondados grandes nos cards (≈24px), bordas de 1px com `border`.
- Muito espaço em branco (negativo); grid de 12 colunas no desktop.
- Seções numeradas: `01 / SOBRE`, `02 / MANIFESTO`, `03 / PROJETOS`, `04 / STACK`, `05 / GITHUB`, `06 / CONTATO`.

---

## 4. Cena 3D — "Shoot for the moon"

Conceito tirado da citação favorita do Ítalo: _"Shoot for the moon. Even if you miss, you'll land among the stars." — Les Brown_. O 3D conta essa história ao longo do scroll.

### Arquitetura

- Um único `<Canvas>` fixo em tela cheia, atrás do conteúdo (`position: fixed; inset: 0; z-index: 0; pointer-events: none`), carregado com `next/dynamic` (`ssr: false`) **depois** do conteúdo principal.
- O progresso do scroll (Motion `useScroll`) controla o estado da cena: posição da câmera, posição e escala da lua, opacidade das camadas.

### Lua vermelha

- Esfera **procedural** (sem modelo externo): relevo de crateras gerado por ruído (fbm/voronoi) em shader próprio ou em mapa de normais gerado por código.
- Iluminação lateral criando fase lunar (terminador visível: parte da lua na sombra).
- **Rim light vermelho** (fresnel) na borda e **bloom** vermelho suave via postprocessing.
- Rotação lenta contínua; inclina levemente seguindo o mouse (com amortecimento).
- Posição: no hero, grande, à direita e parcialmente cortada pela borda da tela no desktop; centralizada e menor no mobile.

### Céu noturno realista (em vermelho)

- Campo de estrelas com `Points` e shader próprio: **3 camadas de profundidade**, tamanhos e brilhos variados (maioria pequena e fraca, poucas grandes e fortes), tons de vermelho a rosa-claro com algumas quase brancas.
- **Cintilação** individual (cada estrela com fase e velocidade próprias).
- **Parallax** entre camadas com o mouse e com o scroll.
- **Estrela cadente** ocasional (a cada 8–15 s, aleatório).
- **Nebulosa**: névoa vermelha muito sutil (plano com shader de ruído), quase imperceptível.
- Quantidade: ~4000 estrelas no desktop, ~1200 no mobile.

### Narrativa ao longo do scroll

1. **Hero**: lua em destaque, estrelas ao fundo.
2. **Sobre / Manifesto**: a câmera se afasta, a lua desliza para trás e para o lado, ficando como pano de fundo discreto.
3. **Projetos**: a lua fica pequena e distante; 5 estrelas se destacam e são ligadas por **linhas de constelação que se desenham** quando a seção entra na tela. Ao passar o mouse num card de projeto, a estrela correspondente pulsa e brilha mais.
4. **Contato / Rodapé**: céu estrelado aberto e a citação completa do Les Brown.

### Tema claro

- Mesma cena, mas mais discreta: estrelas em vermelho escuro com opacidade baixa, lua com menos bloom, sem nebulosa.

### Performance e fallback

- `dpr` limitado a `[1, 1.5]`; sem postprocessing no mobile; pausar o render quando a aba não está visível.
- Com `prefers-reduced-motion: reduce`: cena estática (sem rotação, cintilação, estrela cadente nem parallax).
- Se WebGL não estiver disponível: fundo com gradiente radial vermelho sutil e estrelas em CSS.

---

## 5. Estrutura da página (one-page) e conteúdo

Todo texto fica em arquivos de mensagens do next-intl (`messages/pt.json`, `messages/en.json`) ou em arquivos de dados tipados. Nada de texto fixo nos componentes. Textos em inglês: tradução natural e profissional, não literal.

### 00 · Preloader

- Contador em Geist Mono de 000 a 100, depois uma cortina vermelha sobe revelando o hero.
- Só na primeira visita da sessão; pular se `prefers-reduced-motion`.
- Duração total ≤ 2,2 s.

### Menu (header)

- Logo **"ÍS."** (ponto em `accent`) à esquerda; links das seções; botão **PT/EN**; botão de tema (sol/lua).
- Fixo, fundo translúcido com blur; esconde ao rolar para baixo e reaparece ao rolar para cima.
- Mobile: menu em tela cheia com links grandes animados em sequência.
- Indicador da seção ativa.

### 01 · Hero

- **Selo de status** com bolinha verde pulsando:
  - PT: **"Disponível para novos desafios"**
  - EN: **"Available for new challenges"**
  - Vem de `config/site.ts` (`status: { available: boolean }`), para o Ítalo trocar sem mexer em layout.
- **Título** (duas cores, revelado linha por linha com máscara):
  - PT: **"Mirando na lua."** / **"Construindo entre as estrelas."**
  - EN: **"Aiming for the moon."** / **"Building among the stars."**
- **Subtítulo**:
  - PT: "Oi, eu sou o Ítalo — desenvolvedor fullstack em Campinas. Construo produtos web e mobile de ponta a ponta, do banco de dados à última animação."
  - EN: "Hi, I'm Ítalo — a fullstack developer based in Campinas, Brazil. I build web and mobile products end to end, from the database to the last animation."
- **Botões** (efeito magnético): "Ver projetos ↓" (rola até Projetos) e "Baixar currículo" (abre `/cv/italo-de-souza-curriculo.pdf`).
- Link secundário: `@italowsd ↗` (Instagram).
- **Linha de números** animados (contam de 0 ao valor ao entrar na tela):
  - Repositórios públicos: **do GitHub, ao vivo** (ver seção 6)
  - Linguagens usadas: **do GitHub, ao vivo**
  - Projetos em destaque: 5
  - Idiomas: 3
- Indicador "role para baixo" animado.

### 02 · Sobre (`01 / SOBRE`)

- Título: PT "Código é como as ideias **ganham forma.**" / EN "Code is how ideas **take shape.**"
- **Bio curta (provisória, será substituída pelo Ítalo)**:
  - PT: "Sou estudante de Sistemas de Informação na PUC-Campinas e desenvolvedor fullstack. Gosto de construir de ponta a ponta — de APIs e bancos de dados a interfaces web e mobile com atenção aos detalhes. Já desenvolvi um app com IA integrada, uma plataforma com chat em tempo real e automações de análise de documentos com OCR. Sou movido por determinação e pela vontade constante de descobrir até onde consigo chegar."
  - EN: traduzir.
- **Foto**: placeholder em `public/images/italo.jpg` (use um retângulo com gradiente e a inicial "Í" até a foto real chegar). Tratamento **duotone preto e vermelho** via CSS (`mix-blend-mode` / filtros) ou shader, com leve parallax e revelação por máscara ao entrar.
- **Formação** (linha do tempo animada):
  - 2024 — 2027 · **PUC-Campinas** · Bacharelado em Sistemas de Informação
- **Idiomas**: Português (nativo), Inglês (fluente), Espanhol (intermediário).

### 03 · Manifesto (`02 / MANIFESTO`)

Texto longo em tipografia grande. Cada palavra começa em `text-muted` com baixa opacidade e **acende para `text`** conforme o scroll (Motion `useScroll` + `useTransform` por palavra). Algumas palavras-chave acendem em `accent`: _determinação_, _evolução_, _disciplina_, _curiosidade_, _tentei de verdade_, _ir além_. A seção é alta (sticky) para a leitura acompanhar o scroll. Termina com a citação em destaque.

**PT (usar exatamente):**

> Sou uma pessoa movida por determinação, evolução e pela vontade constante de descobrir até onde sou capaz de chegar.
>
> Acredito que grandes resultados raramente são fruto apenas de talento. Eles vêm da disciplina, da curiosidade, da capacidade de aprender, de errar, ajustar e continuar. Por isso, procuro encarar cada novo desafio como uma oportunidade de me desenvolver, ampliar meus conhecimentos e me tornar uma versão mais preparada de mim mesmo.
>
> Tenho ambição, mas não apenas no sentido de alcançar cargos, reconhecimento ou resultados. Para mim, sucesso também significa poder olhar para a minha trajetória e ter a certeza de que não me acomodei diante do meu próprio potencial.
>
> Meu maior objetivo é chegar a um ponto da vida em que eu possa olhar para trás e sentir que realmente me esforcei no meu limite, não no limite definido pelos outros, mas naquele que representa quem eu sou, o que acredito e aquilo que sou capaz de construir.
>
> Quero ter a satisfação de saber que tentei de verdade. Que aceitei desafios mesmo quando existia a possibilidade de falhar. Que continuei aprendendo quando ainda não sabia o suficiente. Que busquei oportunidades maiores mesmo quando seria mais confortável permanecer onde estava.
>
> Não espero que todo caminho seja fácil, nem que toda tentativa dê certo. Acredito que erros, dificuldades e fracassos fazem parte de qualquer trajetória que realmente valha a pena. O que importa é continuar avançando, absorvendo cada experiência e transformando esforço em evolução.
>
> Tenho muito a aprender, muito a construir e objetivos cada vez maiores para perseguir.
>
> No fim, minha medida de sucesso é simples: saber que fui o mais longe que pude com aquilo que estava ao meu alcance e que nunca deixei de tentar ir além.
>
> "Shoot for the moon. Even if you miss, you'll land among the stars." — Les Brown

**EN (usar exatamente):**

> I'm driven by determination, growth and a constant urge to find out how far I can go.
>
> I believe great results are rarely the product of talent alone. They come from discipline, curiosity and the ability to learn, fail, adjust and keep going. That's why I see every new challenge as a chance to grow, expand what I know and become a better-prepared version of myself.
>
> I'm ambitious — but not only in the sense of titles, recognition or results. To me, success also means being able to look back at my path and know for sure that I never settled below my own potential.
>
> My biggest goal is to reach a point in life where I can look back and feel that I truly pushed to my limit — not the limit others set for me, but the one that reflects who I am, what I believe in and what I'm capable of building.
>
> I want the satisfaction of knowing I really tried. That I took on challenges even when failure was possible. That I kept learning when I didn't know enough yet. That I went after bigger opportunities even when staying put would have been more comfortable.
>
> I don't expect every path to be easy, or every attempt to work out. Mistakes, setbacks and failures are part of any journey worth taking. What matters is to keep moving forward, absorbing every experience and turning effort into growth.
>
> I have a lot to learn, a lot to build and ever-bigger goals to chase.
>
> In the end, my measure of success is simple: knowing I went as far as I could with what was within my reach — and that I never stopped trying to go further.
>
> "Shoot for the moon. Even if you miss, you'll land among the stars." — Les Brown

### 04 · Projetos (`03 / PROJETOS`)

- Título: PT "Trabalhos **selecionados.**" / EN "Selected **work.**"
- Layout **bento grid** (YSA ocupa o card maior). Cada card: número (01–05), imagem/preview, nome, descrição curta, tags em pílula, seta ↗ que gira no hover, selo "Projeto em equipe" quando aplicável.
- Hover: **spotlight** (gradiente radial que segue o mouse dentro do card), borda acende em `accent`, imagem com zoom leve. A estrela correspondente na constelação 3D brilha.
- Cada projeto tem **página própria** em `/[locale]/projetos/[slug]` (gerada a partir dos dados, com `generateStaticParams` + metadata dinâmica): hero do projeto, contexto, problema, solução, funcionalidades, stack, papel do Ítalo, galeria, links, navegação "próximo projeto". Transição animada entre a grade e a página (shared layout / View Transitions).
- Imagens: placeholders gerados (gradiente escuro com leve vermelho, nome do projeto em Geist Mono e um padrão de grid) em `public/projects/<slug>/cover.jpg`, até o Ítalo enviar prints reais.
- Dados em `data/projects.ts` com tipo `Project` (slug, title, summary, description, highlights, stack, role, team, repoUrl?, demoUrl?, images, featured, order), com textos PT e EN.

**Projetos (nesta ordem):**

1. **YSA — Assistente Pessoal Inteligente** · `ysa` · Mobile · IA
   - App mobile de organização pessoal com IA integrada: gerencia tarefas, eventos, listas e rotinas, com um chat inteligente que entende contexto, responde em linguagem natural e ajuda na produtividade.
   - Destaques: sincronização em tempo real, autenticação, notificações, automação de tarefas.
   - Stack: React Native (Expo), TypeScript, Supabase, Node.js, API REST, LLM.
   - Links: **pendente** (o Ítalo vai enviar informações). Por enquanto, sem botão de repositório e com um selo "Em breve mais detalhes".

2. **Plataforma de Consultoria em Tempo Real** · `consultoria` · Web · Fullstack · Projeto em equipe
   - Plataforma que conecta clientes e consultores, com gestão de projetos, chat em tempo real, geração de roadmaps em PDF e histórico de status.
   - Destaques: chat via WebSocket, autenticação JWT, geração de PDF, API REST.
   - Stack: Java, Spring Boot, WebSocket, JWT, PostgreSQL, iText7, React, Vite, Tailwind CSS.
   - Repositório: https://github.com/italodsz/SI-PI4-2025-T1-G05

3. **Análise de Documentos com IA** · `ocr-precatorios` · IA · Dados · Projeto em equipe
   - Automação da extração de dados de documentos PDF no processo de compra de precatórios, comparando OCR tradicional (Tesseract + Regex) com o modelo de IA Donut (Vision Encoder-Decoder) em precisão e velocidade.
   - Stack: Python, Jupyter, pytesseract, Donut, Regex.
   - Repositório: https://github.com/italodsz/ProjetoIntegrador05

4. **Fúria Fitness — Gestão de Academia** · `furia-fitness` · Web · Fullstack
   - Sistema web de gestão de academias: cadastro e login de alunos e administradores, controle de acesso por catraca, registro do tempo de permanência e classificação automática de níveis conforme as horas acumuladas de treino.
   - Stack: HTML, CSS, Java, MySQL, JDBC.
   - Repositório: https://github.com/italodsz/Projeto-Integrador-P2

5. **Controle de Riscos no Trabalho** · `controle-riscos` · Mobile · Android
   - Dois aplicativos Android integrados: um para registrar riscos no ambiente de trabalho com fotos e geolocalização, outro para gestores acompanharem tudo em um dashboard com gráficos e mapa.
   - Stack: Kotlin, Firebase, Google Maps, MPAndroidChart.
   - Repositório: https://github.com/italodsz/ProjetoIntegrador03-main

### 05 · Stack (`04 / STACK`)

- **Marquee infinito** em duas faixas (sentidos opostos) com os logos das tecnologias; pausa no hover; velocidade reage à velocidade do scroll.
- Abaixo, habilidades agrupadas em cards bento com hover:
  - **Front-end**: React, Next.js, TypeScript, JavaScript, HTML, CSS, Tailwind CSS
  - **Mobile**: React Native (Expo), Kotlin
  - **Back-end**: Node.js, Java, Spring Boot, APIs REST, WebSocket, JWT
  - **Bancos de dados**: PostgreSQL, MySQL, Oracle, MongoDB Atlas, Supabase, Firebase
  - **IA & Dados**: Python, LLMs, OCR (Tesseract, Donut), Power BI, Excel avançado
  - **Outros**: C, Git, GitHub

### 06 · GitHub ao vivo (`05 / GITHUB`)

Seção dinâmica (Server Component) com dados reais do usuário **`italodsz`**:

- Total de repositórios públicos, seguidores, data de criação da conta.
- **Linguagens mais usadas**: soma dos bytes por linguagem de todos os repositórios (endpoint `/repos/{owner}/{repo}/languages`), exibida numa barra horizontal segmentada animada + legenda com porcentagens.
- **Repositórios recentes**: os 6 atualizados mais recentemente, com nome, linguagem, data relativa ("há 3 dias") e link.
- Cache com `fetch(..., { next: { revalidate: 3600 } })`.
- Variável de ambiente opcional `GITHUB_TOKEN` (para limite de requisições maior); funcionar sem ela.
- Se a API falhar: mostrar dados de fallback de um arquivo local, sem quebrar a página.
- Os números do hero vêm dessa mesma camada de dados (`lib/github.ts`, tipada).

### 07 · Contato (`06 / CONTATO`)

- Chamada grande: PT "Vamos construir **algo incrível** juntos?" / EN "Let's build **something great** together?", revelada letra por letra.
- Links grandes com efeito magnético e seta ↗:
  - E-mail: **italopropriedades@gmail.com** (+ botão **"Copiar e-mail"** com toast animado "Copiado!")
  - LinkedIn: https://www.linkedin.com/in/italo-de-souza-s/
  - GitHub: https://github.com/italodsz
  - Instagram: https://www.instagram.com/italowsd
- **Não exibir telefone.**
- **Sem formulário de contato.**

### Rodapé

- Logo "ÍS.", "Voltar ao topo ↑" (scroll suave).
- **Localização**: Campinas, SP — Brasil · coordenadas `22°54'S 47°03'W`.
- **Hora local ao vivo** (fuso `America/Sao_Paulo`, atualizando a cada segundo, sem erro de hidratação).
- © ano atual · Ítalo de Souza.
- Citação do Les Brown pequena, em Geist Mono.

---

## 6. Catálogo de animações (Motion)

- Preloader com contador e cortina.
- Revelação de títulos **linha por linha** com máscara (overflow hidden + translateY).
- Revelação **letra por letra** no título do Contato.
- **Stagger** em listas, tags e cards ao entrar na tela (`whileInView`, `once: true`).
- **Botões e links magnéticos** (seguem o mouse com mola).
- **Cursor customizado**: círculo pequeno com `mix-blend-mode: difference`, cresce sobre links e mostra "Ver" sobre cards de projeto. Desativado em telas de toque.
- **Spotlight** nos cards (gradiente radial via CSS variables atualizadas no `pointermove`).
- **Contadores** numéricos animados.
- **Palavras acendendo** no Manifesto conforme o scroll.
- **Parallax** em imagens e na foto.
- **Marquee** infinito reagindo à velocidade do scroll.
- **Barra de progresso** de scroll fina em `accent` no topo.
- **Header** que esconde/mostra conforme a direção do scroll.
- **Transições de página** entre a home e as páginas de projeto.
- **Troca de idioma e de tema** com transição suave (sem flash).

Regras:

- Animar só `transform` e `opacity` (e CSS variables), nunca `width`/`top`/`left`.
- Easing padrão: `[0.22, 1, 0.36, 1]`; durações entre 0,4 s e 1 s.
- Tudo respeita `prefers-reduced-motion` (hook `useReducedMotion` centralizado): sem parallax, sem scroll-linked, só fades curtos.

---

## 7. Qualidade (critérios de aceite)

**Performance**

- Lighthouse (mobile) ≥ 90 em Performance, Accessibility, Best Practices e SEO.
- Canvas 3D carregado depois do conteúdo; nenhum layout shift (CLS ≈ 0).
- Imagens com `next/image`, AVIF/WebP, `sizes` corretos, lazy load.
- 60 fps nas animações em um notebook comum.

**Acessibilidade**

- HTML semântico (`header`, `main`, `section` com `aria-labelledby`, `footer`), um único `h1`.
- Navegação completa por teclado, foco visível em `accent`, link "Pular para o conteúdo".
- Contraste AA nos dois temas; textos alternativos em todas as imagens; o Canvas com `aria-hidden`.

**Responsividade**

- Perfeito em 360px, 768px, 1024px, 1440px e 1920px.
- Mobile: menos estrelas, sem postprocessing, sem cursor customizado, hover substituído por estados de toque.

**SEO e compartilhamento**

- Metadata por idioma (title, description, `alternates` com `hreflang`), Open Graph e Twitter card.
- **Imagem OG dinâmica** gerada com `next/og` (fundo preto, lua vermelha estilizada, nome e cargo).
- `sitemap.ts`, `robots.ts`, favicon "ÍS." e `manifest`.
- `metadataBase` lido de uma env `NEXT_PUBLIC_SITE_URL`, para trocar para o domínio próprio sem mexer no código.

**Código**

- Estrutura sugerida:
  ```
  app/[locale]/(home)/page.tsx
  app/[locale]/projetos/[slug]/page.tsx
  components/sections/*    components/ui/*    components/three/*
  config/site.ts           data/projects.ts   data/skills.ts
  lib/github.ts            hooks/*            messages/pt.json  messages/en.json
  public/cv/  public/images/  public/projects/
  ```
- Componentes pequenos e reutilizáveis; hooks próprios (`useMousePosition`, `useMagnetic`, `useScrollDirection`, `useIsTouch`).
- Zero `any`; zero erros de lint e de tipo; `npm run build` passando.
- Sem erros de hidratação no console.

---

## 8. Arquivos e placeholders

- Currículo: `public/cv/italo-de-souza-curriculo.pdf` (crie um PDF placeholder simples; o Ítalo vai substituir).
- Foto: `public/images/italo.jpg` (placeholder até o envio).
- Capas dos projetos: `public/projects/<slug>/cover.jpg` (placeholders gerados).
- Deixe em `README.md` uma seção **"Como atualizar"** explicando: trocar a foto, o currículo, as capas, o status, e adicionar um projeto novo.

---

## 9. Plano de trabalho

Trabalhe em fases. Ao final de cada uma, rode `npm run lint` e `npm run build`, corrija os erros e faça **commit com mensagem descritiva** e push.

1. **Setup**: Next.js + TS + Tailwind + ESLint/Prettier, tokens de tema, fontes, next-intl (`/pt`, `/en`, redirect da raiz para `/pt`), next-themes, Lenis, `CLAUDE.md`.
2. **Layout base**: header, rodapé, estrutura das seções, conteúdo PT/EN completo, dados tipados.
3. **Seções**: Hero, Sobre, Manifesto, Projetos (grid + páginas), Stack, GitHub ao vivo, Contato — funcionais e responsivas, ainda com animações mínimas.
4. **Animações**: todo o catálogo da seção 6, preloader e cursor.
5. **3D**: lua, céu estrelado, nebulosa, estrela cadente, narrativa no scroll, constelação dos projetos, fallbacks.
6. **Polimento**: SEO, OG dinâmica, acessibilidade, performance (medir com Lighthouse), revisão mobile, README final.

Se alguma decisão técnica não estiver coberta aqui, escolha a opção mais simples, robusta e profissional, e registre a decisão no `CLAUDE.md`.

---

## 10. Deploy

- O projeto deve rodar na **Vercel** sem configuração extra (build padrão do Next.js).
- Documente no README as variáveis de ambiente: `NEXT_PUBLIC_SITE_URL` e `GITHUB_TOKEN` (opcional).
- Documente como apontar um domínio próprio na Vercel no futuro.

---

## 11. Decisões técnicas registradas

Decisões tomadas durante a implementação que não estavam cobertas pelo brief:

- **Next.js 16** (App Router, Turbopack). O antigo `middleware.ts` agora se chama `proxy.ts` (next-intl roda nele). `next lint` não existe mais: `npm run lint` chama o ESLint direto.
- **Fontes**: pacote `geist` (usa `next/font/local`), para o build não depender de baixar fontes do Google.
- **i18n**: `localeDetection: false` — a raiz `/` sempre redireciona para `/pt`, como pede o brief. Ids das seções (âncoras) são os mesmos nos dois idiomas: `about`, `manifesto`, `projects`, `stack`, `github`, `contact`.
- **Tokens extras de cor** (além da tabela do brief), para manter contraste AA:
  - `accent-ink` — vermelho para textos pequenos (`#FF2D20` no escuro, `#C41E15` no claro; o `#E0241A` do claro tem só ~4,2:1 sobre o fundo creme).
  - `on-accent` — cor do texto sobre fundo vermelho (`#0A0A0A` no escuro, `#FFFFFF` no claro).
  - `border-strong` — borda um pouco mais visível para hovers e divisores.
- **Tema**: next-themes com `attribute="data-theme"`, escuro padrão, sem seguir o sistema. A troca faz um crossfade da página com a View Transitions API (`document.startViewTransition`); sem suporte, troca direto. Evitamos seletores universais (`html.x *`) porque cada mudança de classe no `<html>` recalcularia o CSS da página inteira.
- **Preloader**: 100% CSS (contador com `@property` inteiros + `counter()`, cortina com `@keyframes`), então começa na primeira pintura sem esperar o JS. O componente só sincroniza a revelação do hero com o início da subida da cortina, trava o scroll e grava a sessão. Um script inline no `<head>` marca `<html data-preloaded>` antes da pintura quando o preloader já foi visto na sessão (`sessionStorage`) ou com reduced motion — assim não há flash da cortina.
- **Título do hero**: vem visível no HTML do servidor (a primeira pintura conta para o LCP, por baixo da cortina); depois da hidratação as linhas descem para trás da máscara e sobem quando a cortina começa a subir. Em visitas repetidas, o CSS `html[data-preloaded] .hero-line` esconde as linhas antes da pintura.
- **Manifesto**: cada palavra é uma `<span>` do servidor com `--i` (índice); o parágrafo tem `--n` (total) e `--p` (progresso 0–1). A cor da palavra é `color-mix()` entre `text-dim` e `text`/`accent` calculada em CSS. `--p` é animado por scroll-driven animations (`animation-timeline: view()`); onde não há suporte, `LitParagraph` usa `scroll()` do Motion. O estado "apagado" (`--text-dim`) mantém contraste ≥ 3:1 (texto grande). O parallax da foto do Sobre também é scroll-driven em CSS.
- **Ícones de marca**: servidos como sprite estático em `/icons.svg` (`app/icons.svg/route.ts`) e referenciados com `<use>` — os paths não vão no HTML nem no payload RSC.
- **Lenis**: só em telas com mouse (`(hover: hover) and (pointer: fine)`). No toque o scroll nativo já é suave e o Lenis só custaria processamento (era o maior custo de JS no Lighthouse mobile).
- **Não usar `<Suspense>` em volta das seções** da home: com componentes assíncronos, o React passa a fazer streaming fora de ordem e o conteúdo só aparece depois de scripts inline (e nunca sem JS).
- **CSS inline** (`experimental.inlineCss`): o Tailwind gera pouco CSS; inline no `<head>` remove o request que bloqueia a primeira pintura.
- **Logos**: `simple-icons` não tem LinkedIn, Oracle, Power BI nem Excel. LinkedIn usa um SVG próprio; os outros aparecem só com o nome.
- **GitHub**: `lib/github.ts` usa `fetch` com `revalidate: 3600`, timeout de 6 s e cai para `data/github-fallback.json` se a API falhar. Linguagens somadas só de repositórios que não são fork.
- **Cena 3D**:
  - Só entra com WebGL acelerado por hardware (`failIfMajorPerformanceCaveat` + checagem do renderer). Renderização por software (SwiftShader, llvmpipe — inclusive a do Lighthouse/PageSpeed) fica com o céu em CSS. Para testar a cena num navegador sem GPU, abra a página com `?webgl=force`.
  - Carrega na primeira interação (mouse, toque, scroll, teclado) ou 4,5 s depois da intro, o que vier primeiro.
  - O relevo da lua (crateras + mares) é calculado uma vez na GPU e gravado num cubemap com mipmaps (`components/three/bakeRelief.ts`); a cada frame o shader só lê o cubemap e calcula a normal por diferenças finitas.
  - A narrativa por seção fica em `components/three/narrative.ts`, com posições em coordenadas de tela. Telas em pé (proporção < 1) usam outra composição (lua centralizada e menor no hero; o hero reserva `40svh` no topo).
  - Os objetos do three.js são alterados de forma imperativa dentro do `useFrame` (padrão do R3F); por isso a regra `react-hooks/immutability` está desligada só em `components/three/**`.
- **Diagnóstico de performance**: `ANALYZE_SOURCEMAPS=1 npm run build` gera source maps de produção para perfilar localmente.
- **Textos de projeto**: `context`, `problem`, `solution` e `role` em `data/projects.ts` foram escritos a partir das descrições do brief e precisam ser revisados pelo Ítalo.
