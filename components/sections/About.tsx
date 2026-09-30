import { getTranslations } from "next-intl/server";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealLines } from "@/components/ui/RevealLines";
import { Reveal } from "@/components/ui/Reveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { AboutPhoto } from "./AboutPhoto";
import { siteConfig } from "@/config/site";

type Education = { period: string; institution: string; course: string };
type SpokenLanguage = { name: string; level: string };

export async function About() {
  const t = await getTranslations("About");
  const education = t.raw("education") as Education[];
  const languages = t.raw("languages") as SpokenLanguage[];

  return (
    <section id="about" aria-labelledby="about-title" className="relative py-28 md:py-40">
      <div className="container-site grid gap-12 md:grid-cols-12 md:gap-x-8 md:gap-y-16">
        <SectionLabel number="01" label={t("label")} className="md:col-span-12" />

        <div className="md:col-span-5 lg:col-span-4">
          <div className="md:sticky md:top-28">
            <AboutPhoto
              src={siteConfig.photo}
              alt={t("photoAlt")}
              label={siteConfig.location.city}
            />
          </div>
        </div>

        <div className="flex flex-col gap-14 md:col-span-7 lg:col-span-7 lg:col-start-6">
          <RevealLines
            id="about-title"
            className="title-lg text-balance"
            lines={[{ text: t("titleA") }, { text: t("titleB"), className: "text-accent" }]}
          />

          <Reveal>
            <p className="max-w-[60ch] text-lg leading-relaxed text-pretty md:text-xl">
              {t("bio")}
            </p>
          </Reveal>

          <div className="grid gap-12 sm:grid-cols-2">
            <div className="flex flex-col gap-6">
              <h3 className="label-mono text-text-muted">{t("educationTitle")}</h3>
              <Stagger as="ol" className="relative flex flex-col gap-8 border-l border-border pl-6">
                {education.map((item) => (
                  <StaggerItem as="li" key={item.institution} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 -left-[1.8rem] size-2.5 rounded-full bg-accent ring-4 ring-bg"
                    />
                    <p className="label-mono text-accent-ink">{item.period}</p>
                    <p className="mt-2 text-xl font-semibold tracking-tight">{item.institution}</p>
                    <p className="mt-1 text-text-muted">{item.course}</p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="label-mono text-text-muted">{t("languagesTitle")}</h3>
              <Stagger as="ul" className="flex flex-col">
                {languages.map((language) => (
                  <StaggerItem
                    as="li"
                    key={language.name}
                    className="flex items-baseline justify-between gap-4 border-b border-border py-3 first:pt-0"
                  >
                    <span className="text-lg font-medium">{language.name}</span>
                    <span className="label-mono text-text-muted">{language.level}</span>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
