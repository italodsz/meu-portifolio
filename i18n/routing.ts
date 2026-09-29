import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en"],
  defaultLocale: "pt",
  // A raiz sempre abre em português; o visitante troca pelo botão PT/EN.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
