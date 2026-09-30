import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { toLocale } from "@/lib/locale";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Manifesto } from "@/components/sections/Manifesto";
import { Projects } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";
import { GitHubLive } from "@/components/sections/GitHubLive";
import { Contact } from "@/components/sections/Contact";

/** ISR usado pelos dados do GitHub quando a seção for reativada. */
export const revalidate = 3600;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Meta" });
  // Dados estruturados (schema.org) para buscadores.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: t("role"),
    url: `${siteConfig.url}/${locale}`,
    email: `mailto:${siteConfig.contact.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Campinas",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    alumniOf: { "@type": "CollegeOrUniversity", name: "PUC-Campinas" },
    sameAs: [siteConfig.contact.github, siteConfig.contact.linkedin, siteConfig.contact.instagram],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <About />
      <Manifesto />
      <Projects />
      <Stack />
      {siteConfig.features.githubLive && <GitHubLive />}
      <Contact />
    </>
  );
}
