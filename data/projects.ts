import type { Localized } from "@/lib/i18n";

export type ProjectCategory = "mobile" | "web" | "ai" | "data" | "fullstack" | "android";

export type ProjectImage = {
  src: string;
  alt: Localized;
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  order: number;
  featured: boolean;
  title: Localized;
  /** Frase curta usada no card. */
  summary: Localized;
  /** Parágrafo de abertura da página do projeto. */
  description: Localized;
  context: Localized;
  problem: Localized;
  solution: Localized;
  highlights: Localized<string[]>;
  stack: string[];
  role: Localized;
  categories: Localized<string[]>;
  team: boolean;
  /** true enquanto faltam informações (mostra o selo "Em breve mais detalhes"). */
  comingSoon?: boolean;
  repoUrl?: string;
  demoUrl?: string;
  year?: string;
  cover: ProjectImage;
  images: ProjectImage[];
};

function cover(slug: string, title: string): ProjectImage {
  return {
    src: `/projects/${slug}/cover.jpg`,
    alt: { pt: `Capa do projeto ${title}`, en: `Cover of the ${title} project` },
    width: 1600,
    height: 1000,
  };
}

/**
 * Projetos exibidos no portfólio. Para adicionar um novo, copie um objeto, troque o `slug`,
 * ajuste `order` e coloque a capa em `public/projects/<slug>/cover.jpg`.
 *
 * Os campos `context`, `problem`, `solution` e `role` foram escritos a partir das descrições
 * enviadas e devem ser revisados pelo Ítalo.
 */
export const projects: Project[] = [
  {
    slug: "ysa",
    order: 1,
    featured: true,
    title: {
      pt: "YSA — Assistente Pessoal Inteligente",
      en: "YSA — Intelligent Personal Assistant",
    },
    summary: {
      pt: "App mobile de organização pessoal com IA integrada e um chat que entende contexto.",
      en: "A personal organization mobile app with built-in AI and a context-aware chat.",
    },
    description: {
      pt: "App mobile de organização pessoal com IA integrada: gerencia tarefas, eventos, listas e rotinas, com um chat inteligente que entende contexto, responde em linguagem natural e ajuda na produtividade.",
      en: "A personal organization mobile app with built-in AI: it manages tasks, events, lists and routines, with a smart chat that understands context, replies in natural language and helps you stay productive.",
    },
    context: {
      pt: "Organizar a rotina costuma exigir vários apps diferentes — um para tarefas, outro para agenda, outro para listas. A YSA nasceu da ideia de reunir tudo em um só lugar, com um assistente que conversa em vez de só exibir formulários.",
      en: "Staying organized usually means juggling several apps — one for tasks, another for the calendar, another for lists. YSA started from the idea of bringing it all together, with an assistant you talk to instead of filling in forms.",
    },
    problem: {
      pt: "Apps de produtividade tradicionais exigem muitos toques para registrar algo simples e não entendem o contexto do usuário, o que faz a organização virar mais uma tarefa.",
      en: "Traditional productivity apps take too many taps to log something simple and don't understand the user's context, so staying organized becomes yet another chore.",
    },
    solution: {
      pt: "Um app em React Native (Expo) com back-end em Node.js e Supabase, sincronizado em tempo real, em que um chat com LLM interpreta pedidos em linguagem natural e cria ou atualiza tarefas, eventos e listas.",
      en: "A React Native (Expo) app backed by Node.js and Supabase, synced in real time, where an LLM-powered chat interprets natural-language requests and creates or updates tasks, events and lists.",
    },
    highlights: {
      pt: [
        "Sincronização em tempo real",
        "Autenticação",
        "Notificações",
        "Automação de tarefas",
        "Chat com IA que entende contexto",
      ],
      en: [
        "Real-time sync",
        "Authentication",
        "Notifications",
        "Task automation",
        "Context-aware AI chat",
      ],
    },
    stack: ["React Native (Expo)", "TypeScript", "Supabase", "Node.js", "API REST", "LLM"],
    role: {
      pt: "Desenvolvimento de ponta a ponta: arquitetura, app mobile, API, banco de dados e integração com o modelo de linguagem.",
      en: "End-to-end development: architecture, mobile app, API, database and language model integration.",
    },
    categories: { pt: ["Mobile", "IA"], en: ["Mobile", "AI"] },
    team: false,
    comingSoon: true,
    cover: cover("ysa", "YSA"),
    images: [],
  },
  {
    slug: "consultoria",
    order: 2,
    featured: true,
    title: {
      pt: "Plataforma de Consultoria em Tempo Real",
      en: "Real-Time Consulting Platform",
    },
    summary: {
      pt: "Conecta clientes e consultores com chat em tempo real, gestão de projetos e roadmaps em PDF.",
      en: "Connects clients and consultants with real-time chat, project management and PDF roadmaps.",
    },
    description: {
      pt: "Plataforma que conecta clientes e consultores, com gestão de projetos, chat em tempo real, geração de roadmaps em PDF e histórico de status.",
      en: "A platform that connects clients and consultants, with project management, real-time chat, PDF roadmap generation and status history.",
    },
    context: {
      pt: "Projeto Integrador desenvolvido em equipe no curso de Sistemas de Informação da PUC-Campinas, simulando o dia a dia de uma consultoria que acompanha vários clientes ao mesmo tempo.",
      en: "A capstone project built as a team in the Information Systems program at PUC-Campinas, simulating a consultancy that follows several clients at once.",
    },
    problem: {
      pt: "A comunicação entre cliente e consultor costuma ficar espalhada entre e-mails e mensagens, sem um histórico claro do andamento de cada projeto.",
      en: "Client–consultant communication tends to be scattered across emails and messages, with no clear record of how each project is progressing.",
    },
    solution: {
      pt: "Uma API REST em Spring Boot com autenticação JWT e PostgreSQL, chat via WebSocket e geração de roadmaps em PDF com iText7, consumida por um front-end em React com Vite e Tailwind CSS.",
      en: "A Spring Boot REST API with JWT authentication and PostgreSQL, WebSocket chat and PDF roadmaps generated with iText7, consumed by a React front end built with Vite and Tailwind CSS.",
    },
    highlights: {
      pt: [
        "Chat via WebSocket",
        "Autenticação JWT",
        "Geração de PDF",
        "API REST",
        "Histórico de status dos projetos",
      ],
      en: [
        "WebSocket chat",
        "JWT authentication",
        "PDF generation",
        "REST API",
        "Project status history",
      ],
    },
    stack: [
      "Java",
      "Spring Boot",
      "WebSocket",
      "JWT",
      "PostgreSQL",
      "iText7",
      "React",
      "Vite",
      "Tailwind CSS",
    ],
    role: {
      pt: "Desenvolvimento fullstack em equipe, do back-end em Spring Boot à interface em React.",
      en: "Fullstack development as part of the team, from the Spring Boot back end to the React interface.",
    },
    categories: { pt: ["Web", "Fullstack"], en: ["Web", "Fullstack"] },
    team: true,
    repoUrl: "https://github.com/italodsz/SI-PI4-2025-T1-G05",
    year: "2025",
    cover: cover("consultoria", "Consultoria"),
    images: [],
  },
  {
    slug: "ocr-precatorios",
    order: 3,
    featured: true,
    title: {
      pt: "Análise de Documentos com IA",
      en: "AI Document Analysis",
    },
    summary: {
      pt: "Extração automática de dados de PDFs de precatórios: OCR tradicional vs. o modelo de IA Donut.",
      en: "Automated data extraction from court-debt PDFs: traditional OCR vs. the Donut AI model.",
    },
    description: {
      pt: "Automação da extração de dados de documentos PDF no processo de compra de precatórios, comparando OCR tradicional (Tesseract + Regex) com o modelo de IA Donut (Vision Encoder-Decoder) em precisão e velocidade.",
      en: "Automating data extraction from PDF documents in the court-ordered debt (precatórios) purchasing process, comparing traditional OCR (Tesseract + Regex) with the Donut AI model (Vision Encoder-Decoder) on accuracy and speed.",
    },
    context: {
      pt: "Na compra de precatórios, cada negociação depende de dados que estão dentro de documentos PDF longos e sem padrão fixo — um trabalho que costuma ser feito à mão.",
      en: "When buying court-ordered debts, every deal depends on data buried in long PDF documents with no fixed layout — work that is usually done by hand.",
    },
    problem: {
      pt: "A leitura manual é lenta e sujeita a erros. Era preciso descobrir qual abordagem automatiza melhor essa extração: regras com OCR tradicional ou um modelo de IA que entende o documento.",
      en: "Manual reading is slow and error-prone. The question was which approach automates the extraction best: rule-based traditional OCR or an AI model that understands the document.",
    },
    solution: {
      pt: "Dois pipelines em Python executados em notebooks Jupyter: um com pytesseract e expressões regulares, outro com o modelo Donut, comparados lado a lado em precisão e tempo de processamento.",
      en: "Two Python pipelines run in Jupyter notebooks — one with pytesseract and regular expressions, another with the Donut model — compared side by side on accuracy and processing time.",
    },
    highlights: {
      pt: [
        "OCR com Tesseract + Regex",
        "Modelo Donut (Vision Encoder-Decoder)",
        "Comparação de precisão e velocidade",
        "Extração automática de dados de PDFs",
      ],
      en: [
        "OCR with Tesseract + Regex",
        "Donut model (Vision Encoder-Decoder)",
        "Accuracy and speed benchmark",
        "Automated PDF data extraction",
      ],
    },
    stack: ["Python", "Jupyter", "pytesseract", "Donut", "Regex"],
    role: {
      pt: "Desenvolvimento em equipe dos pipelines de extração e da análise comparativa entre as abordagens.",
      en: "Team development of the extraction pipelines and the comparative analysis between approaches.",
    },
    categories: { pt: ["IA", "Dados"], en: ["AI", "Data"] },
    team: true,
    repoUrl: "https://github.com/italodsz/ProjetoIntegrador05",
    cover: cover("ocr-precatorios", "OCR"),
    images: [],
  },
  {
    slug: "furia-fitness",
    order: 4,
    featured: true,
    title: {
      pt: "Fúria Fitness — Gestão de Academia",
      en: "Fúria Fitness — Gym Management",
    },
    summary: {
      pt: "Gestão de academia com controle de catraca, tempo de permanência e níveis por horas de treino.",
      en: "Gym management with turnstile access, time tracking and levels based on training hours.",
    },
    description: {
      pt: "Sistema web de gestão de academias: cadastro e login de alunos e administradores, controle de acesso por catraca, registro do tempo de permanência e classificação automática de níveis conforme as horas acumuladas de treino.",
      en: "A web system for gym management: sign-up and login for members and admins, turnstile access control, time-on-site tracking and automatic level ranking based on accumulated training hours.",
    },
    context: {
      pt: "Academias precisam saber quem entra, quanto tempo cada aluno treina e como reconhecer quem mantém a constância.",
      en: "Gyms need to know who comes in, how long each member trains and how to reward consistency.",
    },
    problem: {
      pt: "Sem um sistema, o controle de acesso e das horas de treino fica em planilhas ou no papel, e não existe uma forma simples de acompanhar a evolução dos alunos.",
      en: "Without a system, access control and training hours live in spreadsheets or on paper, and there's no easy way to track members' progress.",
    },
    solution: {
      pt: "Aplicação web em Java com JDBC e MySQL que registra entradas e saídas pela catraca, soma o tempo de permanência e atualiza automaticamente o nível de cada aluno.",
      en: "A Java web application with JDBC and MySQL that logs turnstile entries and exits, adds up time on site and automatically updates each member's level.",
    },
    highlights: {
      pt: [
        "Cadastro e login de alunos e administradores",
        "Controle de acesso por catraca",
        "Registro do tempo de permanência",
        "Níveis automáticos por horas de treino",
      ],
      en: [
        "Member and admin sign-up and login",
        "Turnstile access control",
        "Time-on-site tracking",
        "Automatic levels by training hours",
      ],
    },
    stack: ["HTML", "CSS", "Java", "MySQL", "JDBC"],
    role: {
      pt: "Desenvolvimento fullstack: modelagem do banco, regras de negócio em Java e interface web.",
      en: "Fullstack development: database modeling, business rules in Java and the web interface.",
    },
    categories: { pt: ["Web", "Fullstack"], en: ["Web", "Fullstack"] },
    team: false,
    repoUrl: "https://github.com/italodsz/Projeto-Integrador-P2",
    cover: cover("furia-fitness", "Fúria Fitness"),
    images: [],
  },
  {
    slug: "controle-riscos",
    order: 5,
    featured: true,
    title: {
      pt: "Controle de Riscos no Trabalho",
      en: "Workplace Risk Control",
    },
    summary: {
      pt: "Dois apps Android integrados: registro de riscos com foto e GPS, e um dashboard para gestores.",
      en: "Two connected Android apps: risk reporting with photos and GPS, plus a dashboard for managers.",
    },
    description: {
      pt: "Dois aplicativos Android integrados: um para registrar riscos no ambiente de trabalho com fotos e geolocalização, outro para gestores acompanharem tudo em um dashboard com gráficos e mapa.",
      en: "Two connected Android apps: one to report workplace hazards with photos and geolocation, and another for managers to follow everything on a dashboard with charts and a map.",
    },
    context: {
      pt: "Riscos no ambiente de trabalho precisam ser identificados e tratados rápido, mas muitas vezes só chegam aos gestores dias depois, por canais informais.",
      en: "Workplace hazards need to be spotted and handled fast, but they often reach managers days later through informal channels.",
    },
    problem: {
      pt: "Faltava um jeito simples de qualquer colaborador registrar um risco na hora, com provas visuais e localização, e de os gestores enxergarem o panorama completo.",
      en: "There was no simple way for any employee to report a hazard on the spot, with visual proof and location, nor for managers to see the full picture.",
    },
    solution: {
      pt: "Dois apps nativos em Kotlin conectados ao Firebase: o de campo envia fotos e coordenadas; o de gestão mostra os registros em gráficos (MPAndroidChart) e em um mapa (Google Maps).",
      en: "Two native Kotlin apps connected to Firebase: the field app sends photos and coordinates; the management app shows reports in charts (MPAndroidChart) and on a map (Google Maps).",
    },
    highlights: {
      pt: [
        "Registro de riscos com fotos",
        "Geolocalização",
        "Dashboard com gráficos",
        "Mapa com os registros",
        "Dados sincronizados via Firebase",
      ],
      en: [
        "Hazard reports with photos",
        "Geolocation",
        "Dashboard with charts",
        "Map of all reports",
        "Data synced through Firebase",
      ],
    },
    stack: ["Kotlin", "Firebase", "Google Maps", "MPAndroidChart"],
    role: {
      pt: "Desenvolvimento dos dois aplicativos Android e da integração com o Firebase.",
      en: "Development of both Android apps and the Firebase integration.",
    },
    categories: { pt: ["Mobile", "Android"], en: ["Mobile", "Android"] },
    team: false,
    repoUrl: "https://github.com/italodsz/ProjetoIntegrador03-main",
    cover: cover("controle-riscos", "Controle de Riscos"),
    images: [],
  },
];

export const sortedProjects = [...projects].sort((a, b) => a.order - b.order);

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string): Project {
  const index = sortedProjects.findIndex((project) => project.slug === slug);
  return sortedProjects[(index + 1) % sortedProjects.length];
}
