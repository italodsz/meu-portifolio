import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  return (
    <section className="container-site flex min-h-[80svh] flex-col items-start justify-center gap-8 pt-(--header-h)">
      <p className="label-mono text-accent-ink">404</p>
      <h1 className="title-lg">{t("title")}</h1>
      <p className="text-lg text-text-muted">{t("description")}</p>
      <Link
        href="/"
        className="inline-flex h-12 items-center rounded-full bg-accent px-6 font-semibold text-on-accent transition-colors hover:bg-accent-glow"
      >
        {t("back")}
      </Link>
    </section>
  );
}
