import { getTranslations } from "next-intl/server";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealLetters } from "@/components/ui/RevealLetters";
import { Reveal } from "@/components/ui/Reveal";
import { ContactLink } from "./ContactLink";
import { CopyEmail } from "./CopyEmail";
import { siteConfig } from "@/config/site";

export async function Contact() {
  const t = await getTranslations("Contact");
  const { contact } = siteConfig;

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative pt-28 pb-20 md:pt-40 md:pb-28"
    >
      <div className="container-site flex flex-col gap-12 md:gap-16">
        <SectionLabel number={siteConfig.features.githubLive ? "06" : "05"} label={t("label")} />
        <RevealLetters
          id="contact-title"
          className="title-xl"
          segments={[
            { text: t("titleA") },
            { text: t("titleB"), className: "text-accent" },
            { text: t("titleC") },
          ]}
        />

        <Reveal className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-[44ch] text-lg leading-relaxed text-text-muted">{t("intro")}</p>
          <CopyEmail email={contact.email} label={t("copy")} copiedLabel={t("copied")} />
        </Reveal>

        <Reveal>
          <ul className="border-t border-border">
            <li>
              <ContactLink
                href={`mailto:${contact.email}`}
                label={t("email")}
                value={contact.email}
                external={false}
              />
            </li>
            <li>
              <ContactLink
                href={contact.linkedin}
                label={t("linkedin")}
                value="in/italo-de-souza-s"
                icon="linkedin"
              />
            </li>
            <li>
              <ContactLink
                href={contact.github}
                label={t("github")}
                value="italodsz"
                icon="github"
              />
            </li>
            <li>
              <ContactLink
                href={contact.instagram}
                label={t("instagram")}
                value={contact.instagramHandle}
                icon="instagram"
              />
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
