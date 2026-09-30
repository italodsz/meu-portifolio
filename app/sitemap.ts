import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { projects } from "@/data/projects";
import { siteConfig } from "@/config/site";

function languages(path: string) {
  return Object.fromEntries(
    routing.locales.map((locale) => [
      locale === "pt" ? "pt-BR" : locale,
      `${siteConfig.url}/${locale}${path}`,
    ]),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    { path: "", priority: 1 },
    ...projects.map((project) => ({ path: `/projetos/${project.slug}`, priority: 0.8 })),
  ];

  return paths.flatMap(({ path, priority }) =>
    routing.locales.map((locale) => ({
      url: `${siteConfig.url}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: languages(path) },
    })),
  );
}
