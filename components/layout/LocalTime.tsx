"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { siteConfig } from "@/config/site";

/**
 * Hora local de Campinas, atualizada a cada segundo.
 * No servidor e na primeira pintura mostra "--:--:--" para evitar erro de hidratação.
 */
export function LocalTime({ className }: { className?: string }) {
  const locale = useLocale();
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
      timeZone: siteConfig.location.timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [locale]);

  return (
    <time className={className} suppressHydrationWarning aria-live="off">
      {time ?? "--:--:--"} <span className="text-text-muted">GMT-3</span>
    </time>
  );
}
