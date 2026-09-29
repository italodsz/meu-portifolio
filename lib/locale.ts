import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";

/** Valida o parâmetro [locale] da rota (404 se não for suportado). */
export function toLocale(value: string): Locale {
  if (!hasLocale(routing.locales, value)) notFound();
  return value;
}
