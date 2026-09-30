"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** Botão PT/EN que mantém a página e a posição do scroll. */
export function LocaleSwitch({ className }: { className?: string }) {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const next: Locale = routing.locales.find((item) => item !== locale) ?? routing.defaultLocale;

  const switchLocale = () => {
    startTransition(() => {
      router.replace(`${pathname}${window.location.hash}`, { locale: next, scroll: false });
    });
  };

  return (
    <button
      type="button"
      onClick={switchLocale}
      aria-label={t("switchLocale")}
      disabled={pending}
      className={cn(
        "label-mono relative flex h-10 items-center gap-1 rounded-full border border-border bg-bg/60 px-3 backdrop-blur-md transition-colors hover:border-accent disabled:opacity-60",
        className,
      )}
    >
      {routing.locales.map((item, index) => (
        <span key={item} className="flex items-center gap-1">
          {index > 0 && (
            <span aria-hidden="true" className="text-text-muted">
              /
            </span>
          )}
          <span className={item === locale ? "text-text" : "text-text-muted"}>
            {item.toUpperCase()}
          </span>
        </span>
      ))}
    </button>
  );
}
