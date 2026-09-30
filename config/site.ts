/**
 * Configurações gerais do site. Edite aqui para trocar status, links e dados de contato
 * sem mexer em layout.
 */
export const siteConfig = {
  name: "Ítalo de Souza",
  shortName: "ÍS.",
  role: { pt: "Desenvolvedor de Software Fullstack", en: "Fullstack Software Developer" },
  /**
   * URL pública. Defina NEXT_PUBLIC_SITE_URL na Vercel quando tiver domínio próprio.
   * Sem ela, usa o domínio de produção da Vercel e, localmente, http://localhost:3000.
   */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  ).replace(/\/$/, ""),
  status: {
    /** true = selo verde "Disponível para novos desafios"; false = selo neutro. */
    available: true,
  },
  github: { username: "italodsz" },
  cvPath: "/cv/italo-de-souza-curriculo.pdf",
  photo: "/images/italo.jpg",
  contact: {
    email: "italopropriedades@gmail.com",
    linkedin: "https://www.linkedin.com/in/italo-de-souza-s/",
    github: "https://github.com/italodsz",
    instagram: "https://www.instagram.com/italowsd",
    instagramHandle: "@italowsd",
  },
  location: {
    city: "Campinas, SP",
    country: { pt: "Brasil", en: "Brazil" },
    coordinates: "22°54'S 47°03'W",
    timeZone: "America/Sao_Paulo",
  },
} as const;

export type SiteConfig = typeof siteConfig;
