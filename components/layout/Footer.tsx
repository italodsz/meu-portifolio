import { getLocale, getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { Logo } from "./Logo";
import { LocalTime } from "./LocalTime";
import { BackToTop } from "./BackToTop";

export async function Footer() {
  const t = await getTranslations("Footer");
  const locale = await getLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-border">
      <div className="container-site grid gap-10 py-12 md:grid-cols-12 md:gap-6 md:py-16">
        <div className="flex flex-col gap-4 md:col-span-4">
          <Logo size="lg" />
          <BackToTop label={t("backToTop")} className="self-start text-text-muted" />
        </div>

        <dl className="grid grid-cols-2 gap-6 md:col-span-5">
          <div className="flex flex-col gap-2">
            <dt className="label-mono text-text-muted">{t("location")}</dt>
            <dd className="text-sm leading-relaxed">
              {siteConfig.location.city} —{" "}
              {siteConfig.location.country[locale === "en" ? "en" : "pt"]}
              <br />
              <span className="font-mono text-xs tracking-wider text-accent-ink">
                {siteConfig.location.coordinates}
              </span>
            </dd>
          </div>
          <div className="flex flex-col gap-2">
            <dt className="label-mono text-text-muted">{t("localTime")}</dt>
            <dd className="font-mono text-sm tabular-nums">
              <LocalTime />
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-4 md:col-span-3 md:items-end md:text-right">
          <p className="font-mono text-[0.6875rem] leading-relaxed tracking-wide text-text-muted">
            “{siteConfig.quote.text}”
            <br />— {siteConfig.quote.author}
          </p>
          <p className="label-mono text-text-muted">
            © {year} · {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
