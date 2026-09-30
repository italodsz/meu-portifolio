import { getTranslations } from "next-intl/server";
import { renderOg, OG_SIZE } from "@/lib/og";
import { toLocale } from "@/lib/locale";
import { getProject, projects } from "@/data/projects";
import { siteConfig } from "@/config/site";

export const alt = "Projeto de Ítalo de Souza";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectOpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = toLocale(rawLocale);
  const project = getProject(slug);
  const t = await getTranslations({ locale, namespace: "Meta" });
  return renderOg({
    eyebrow: project ? project.categories[locale].join(" · ") : t("role"),
    title: project ? project.title[locale] : siteConfig.name,
    subtitle: project ? project.summary[locale] : t("description"),
    footer: `${siteConfig.name} · ${t("role")}`,
  });
}
