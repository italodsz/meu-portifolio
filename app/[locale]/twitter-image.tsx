import { getTranslations } from "next-intl/server";
import { renderOg, OG_SIZE } from "@/lib/og";
import { toLocale } from "@/lib/locale";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";

export const alt = "Ítalo de Souza — Desenvolvedor de Software Fullstack";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = toLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Meta" });
  return renderOg({
    eyebrow: t("role"),
    title: siteConfig.name,
    subtitle: siteConfig.quote.text,
    footer: `${siteConfig.location.city} · ${siteConfig.location.coordinates}`,
  });
}
