import { getTranslations } from "next-intl/server";
import { siGithub, siInstagram } from "simple-icons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealLetters } from "@/components/ui/RevealLetters";
import { Reveal } from "@/components/ui/Reveal";
import { LINKEDIN_PATH } from "@/components/ui/BrandIcon";
import { ContactLink } from "./ContactLink";
import { CopyEmail } from "./CopyEmail";
import { siteConfig } from "@/config/site";

export async function Contact() {
  const t = await getTranslations("Contact");
  const { contact, quote } = siteConfig;

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative pt-28 pb-20 md:pt-40 md:pb-28"
    >
      <div className="container-site flex flex-col gap-12 md:gap-16">
        <SectionLabel number="06" label={t("label")} />
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
                icon={LINKEDIN_PATH}
              />
            </li>
            <li>
              <ContactLink
                href={contact.github}
                label={t("github")}
                value="italodsz"
                icon={siGithub.path}
              />
            </li>
            <li>
              <ContactLink
                href={contact.instagram}
                label={t("instagram")}
                value={contact.instagramHandle}
                icon={siInstagram.path}
              />
            </li>
          </ul>
        </Reveal>

        <Reveal className="flex flex-col items-center gap-5 pt-16 text-center md:pt-24">
          <figure className="flex flex-col items-center gap-5">
            <blockquote className="text-[clamp(1.5rem,3.4vw,3rem)] leading-tight font-semibold tracking-tight text-balance">
              “
              {quote.text.split(/(moon|stars)/).map((part, index) =>
                part === "moon" || part === "stars" ? (
                  <span key={index} className="text-accent">
                    {part}
                  </span>
                ) : (
                  part
                ),
              )}
              ”
            </blockquote>
            <figcaption className="label-mono text-text-muted">— {quote.author}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
