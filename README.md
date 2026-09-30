# Ítalo de Souza — Portfólio

Portfólio pessoal de **Ítalo de Souza**, desenvolvedor de software fullstack em Campinas, SP.
Tema "Shoot for the moon": uma lua vermelha procedural em 3D e um céu estrelado que acompanham o scroll.

- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion, React Three Fiber, next-intl, next-themes, Lenis.
- **Idiomas:** `/pt` (padrão) e `/en`.
- **Dados dinâmicos:** seção "GitHub ao vivo" com cache de 1 hora (ISR).

As decisões de design e técnicas estão em [`CLAUDE.md`](./CLAUDE.md).

## Rodando localmente

Requisitos: Node.js 20.9 ou mais novo.

```bash
npm install
cp .env.example .env.local   # opcional
npm run dev                  # http://localhost:3000
```

Scripts úteis:

| Comando             | O que faz                      |
| ------------------- | ------------------------------ |
| `npm run dev`       | Servidor de desenvolvimento    |
| `npm run build`     | Build de produção              |
| `npm run start`     | Sobe o build de produção       |
| `npm run lint`      | ESLint                         |
| `npm run typecheck` | Checagem de tipos (TypeScript) |
| `npm run format`    | Formata tudo com Prettier      |

## Variáveis de ambiente

| Variável               | Obrigatória | Para que serve                                                                                                                                                                                         |
| ---------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | Não         | URL pública do site (ex.: `https://italodesouza.dev`). Usada em metadata, Open Graph, sitemap e robots. Sem ela, a Vercel usa o domínio de produção do projeto e, localmente, `http://localhost:3000`. |
| `GITHUB_TOKEN`         | Não         | Token do GitHub (sem nenhuma permissão extra) para aumentar o limite da API de 60 para 5.000 requisições/hora. Recomendado na Vercel, porque os IPs são compartilhados.                                |

Crie o token em GitHub → Settings → Developer settings → Personal access tokens → _Fine-grained token_, com acesso só a repositórios públicos.

## Como atualizar

### Trocar a foto

Substitua `public/images/italo.jpg` por uma foto sua (vertical, proporção 4:5, pelo menos 1200 × 1500 px). O tratamento duotone preto e vermelho é aplicado automaticamente por CSS, então pode ser uma foto colorida normal.

### Trocar o currículo

Substitua `public/cv/italo-de-souza-curriculo.pdf` mantendo o mesmo nome. O botão "Baixar currículo" já aponta para ele (o caminho também está em `config/site.ts`, campo `cvPath`).

### Trocar as capas dos projetos

Cada projeto tem uma capa em `public/projects/<slug>/cover.jpg` (1600 × 1000 px, proporção 16:10). Basta substituir o arquivo mantendo o nome. As imagens são otimizadas automaticamente (AVIF/WebP) pelo `next/image`.

Para adicionar uma galeria na página do projeto, coloque as imagens na mesma pasta e liste-as no campo `images` do projeto em `data/projects.ts`:

```ts
images: [
  {
    src: "/projects/ysa/tela-1.jpg",
    alt: { pt: "Tela inicial do app", en: "App home screen" },
    width: 1600,
    height: 1000,
  },
],
```

### Mudar o status ("Disponível para novos desafios")

Em `config/site.ts`, altere `status.available`:

- `true` → selo verde "Disponível para novos desafios"
- `false` → selo neutro "Focado em projetos atuais"

Os textos dos dois estados ficam em `messages/pt.json` e `messages/en.json` (`Hero.statusAvailable` / `Hero.statusUnavailable`).

### Adicionar um projeto novo

1. Em `data/projects.ts`, copie um dos objetos do array `projects` e ajuste:
   - `slug` (vira a URL: `/pt/projetos/<slug>`), `order` (posição na grade), `featured`;
   - textos em português e inglês (`title`, `summary`, `description`, `context`, `problem`, `solution`, `highlights`, `role`, `categories`);
   - `stack`, `team` (mostra o selo "Projeto em equipe"), `repoUrl` e `demoUrl` (opcionais);
   - `comingSoon: true` mostra o selo "Em breve mais detalhes".
2. Coloque a capa em `public/projects/<slug>/cover.jpg`.
3. Pronto: o card, a página do projeto, o sitemap e a imagem de compartilhamento são gerados automaticamente.

A grade foi desenhada para 5 projetos (o primeiro ocupa o card grande). A partir do sexto, os cards seguem o tamanho dos últimos; se quiser outra composição, ajuste o array `LAYOUT` em `components/sections/Projects.tsx`. A constelação 3D tem uma estrela por projeto nos 5 primeiros (posições em `components/three/Constellation.tsx`).

### Editar textos

Todos os textos da interface estão em `messages/pt.json` e `messages/en.json`. Os dados de contato e redes ficam em `config/site.ts`; as habilidades em `data/skills.ts`.

### Atualizar os dados de fallback do GitHub

Se a API do GitHub falhar, a seção usa `data/github-fallback.json`. Vale atualizar esse arquivo de vez em quando com números reais (repositórios, seguidores, linguagens).

## Deploy na Vercel

1. Em [vercel.com/new](https://vercel.com/new), importe o repositório `italodsz/meu-portifolio`.
2. A Vercel detecta Next.js sozinha; não é preciso mudar nenhuma configuração de build.
3. Em **Settings → Environment Variables**, adicione `GITHUB_TOKEN` (recomendado). `NEXT_PUBLIC_SITE_URL` só é necessária quando houver domínio próprio.
4. Faça o deploy.

### Apontar um domínio próprio

1. No projeto da Vercel, vá em **Settings → Domains** e adicione o domínio (ex.: `italodesouza.dev`).
2. No painel do seu registrador de domínio, crie os registros DNS que a Vercel mostrar (normalmente um registro `A` para o domínio raiz e um `CNAME` para `www`).
3. Em **Settings → Environment Variables**, defina `NEXT_PUBLIC_SITE_URL=https://seu-dominio` e faça um novo deploy para atualizar metadata, Open Graph e sitemap.

Nenhuma alteração de código é necessária.

## Estrutura

```
app/
  [locale]/(home)/page.tsx          home (one-page)
  [locale]/projetos/[slug]/page.tsx página de cada projeto
  [locale]/opengraph-image.tsx      imagem de compartilhamento
  icons.svg/route.ts                sprite com os ícones de marca
  sitemap.ts  robots.ts  manifest.ts  icon.tsx  apple-icon.tsx
components/
  sections/   seções da página        three/   cena 3D (lua, estrelas, constelação)
  layout/     header, rodapé, preloader, cursor
  ui/         componentes reutilizáveis (revelações, magnético, contador...)
config/site.ts   status, contato, localização
data/            projetos, habilidades, ícones, fallback do GitHub
lib/github.ts    camada de dados do GitHub (tipada, com cache e fallback)
messages/        textos PT e EN
public/          currículo, foto e capas
```

## Licenças

As fontes Geist (Vercel) são distribuídas sob a SIL Open Font License; uma cópia está em `assets/fonts/OFL-Geist.txt`. Os logos de tecnologias vêm do [Simple Icons](https://simpleicons.org) (CC0).
