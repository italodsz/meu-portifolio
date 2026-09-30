import { getTranslations } from "next-intl/server";
import { getGitHubData } from "@/lib/github";
import { projects } from "@/data/projects";
import { siteConfig } from "@/config/site";
import { HeroContent } from "./HeroContent";

export async function Hero() {
  const [t, github] = await Promise.all([getTranslations("Hero"), getGitHubData()]);
  const tAbout = await getTranslations("About");
  const spokenLanguages = tAbout.raw("languages") as unknown[];

  return (
    <HeroContent
      available={siteConfig.status.available}
      stats={[
        { value: github.publicRepos, label: t("stats.repos") },
        { value: github.languages.length, label: t("stats.languages") },
        {
          value: projects.filter((project) => project.featured).length,
          label: t("stats.featured"),
        },
        { value: spokenLanguages.length, label: t("stats.spoken") },
      ]}
    />
  );
}
