"use client";

import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const noop = () => () => {};

/** Botão sol/lua. A troca aplica uma transição curta de cores (sem flash). */
export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("Nav");
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const isDark = !mounted || resolvedTheme !== "light";

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Crossfade da página inteira via View Transitions API (quando disponível).
    if (!reduced && typeof document.startViewTransition === "function") {
      document.documentElement.dataset.themeSwitch = "";
      const transition = document.startViewTransition(() => {
        flushSync(() => setTheme(next));
      });
      transition.finished.finally(() => delete document.documentElement.dataset.themeSwitch);
      return;
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? t("themeToLight") : t("themeToDark")}
      className={cn(
        "relative grid size-10 place-items-center rounded-full border border-border bg-bg/60 backdrop-blur-md transition-colors hover:border-accent hover:text-accent",
        className,
      )}
    >
      <Sun
        aria-hidden="true"
        className={cn(
          "absolute size-4 transition-all duration-500",
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0",
        )}
      />
      <Moon
        aria-hidden="true"
        className={cn(
          "absolute size-4 transition-all duration-500",
          isDark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
        )}
      />
    </button>
  );
}
