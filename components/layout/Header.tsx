"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useLenis } from "lenis/react";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { LocaleSwitch } from "./LocaleSwitch";
import { ThemeToggle } from "./ThemeToggle";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrollTo } from "@/hooks/useScrollTo";
import { SECTIONS } from "@/lib/sections";
import { cn, EASE } from "@/lib/utils";

const OBSERVED: readonly string[] = ["hero", ...SECTIONS.map((section) => section.id)];
const NONE: readonly string[] = [];

export function Header() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { direction, atTop } = useScrollDirection();
  const active = useActiveSection(isHome ? OBSERVED : NONE);
  const [open, setOpen] = useState(false);
  const scrollTo = useScrollTo();
  const lenis = useLenis();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const hidden = direction === "down" && !atTop && !open;

  // Trava o scroll e controla o foco enquanto o menu mobile está aberto.
  useEffect(() => {
    if (!open) return;
    const menuButton = menuButtonRef.current;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      menuButton?.focus();
    };
  }, [open, lenis]);

  const onNavigate = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    setOpen(false);
    if (!isHome) return;
    event.preventDefault();
    scrollTo(id === "hero" ? 0 : `#${id}`);
    history.replaceState(null, "", id === "hero" ? window.location.pathname : `#${id}`);
  };

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "border-b transition-[background-color,border-color,backdrop-filter] duration-500",
            atTop && !open
              ? "border-transparent bg-transparent"
              : "border-border bg-bg/70 backdrop-blur-xl",
          )}
        >
          <div className="container-site flex h-(--header-h) items-center justify-between gap-6">
            <Link
              href="/"
              aria-label={t("logoLabel")}
              onClick={(event) => onNavigate(event, "hero")}
              className="rounded-md"
            >
              <Logo />
            </Link>

            <nav aria-label={t("primary")} className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {SECTIONS.map((section) => {
                  const isActive = isHome && active === section.id;
                  return (
                    <li key={section.id}>
                      <Link
                        href={`/#${section.id}`}
                        onClick={(event) => onNavigate(event, section.id)}
                        aria-current={isActive ? "true" : undefined}
                        className={cn(
                          "label-mono relative flex items-center gap-2 rounded-full px-3.5 py-2 transition-colors",
                          isActive ? "text-text" : "text-text-muted hover:text-text",
                        )}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-0 -z-10 rounded-full border border-border bg-surface-2"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        <span
                          aria-hidden="true"
                          className={cn(
                            "size-1.5 rounded-full transition-colors",
                            isActive ? "bg-accent" : "bg-transparent",
                          )}
                        />
                        {t(section.key)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <LocaleSwitch />
              <ThemeToggle />
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? t("closeMenu") : t("openMenu")}
                className="relative grid size-10 place-items-center rounded-full border border-border bg-bg/60 backdrop-blur-md transition-colors hover:border-accent lg:hidden"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute h-px w-4 bg-current transition-transform duration-500 ease-(--ease-out-expo)",
                    open ? "rotate-45" : "-translate-y-[3px]",
                  )}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute h-px w-4 bg-current transition-transform duration-500 ease-(--ease-out-expo)",
                    open ? "-rotate-45" : "translate-y-[3px]",
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t("primary")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.15 } }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-bg/95 pt-(--header-h) backdrop-blur-xl lg:hidden"
            data-lenis-prevent
          >
            <nav aria-label={t("primary")} className="container-site flex-1 overflow-y-auto py-8">
              <ul className="flex flex-col gap-1">
                {SECTIONS.map((section, index) => (
                  <li key={section.id} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "110%", transition: { duration: 0.35, ease: EASE } }}
                      transition={{ duration: 0.7, ease: EASE, delay: 0.08 + index * 0.06 }}
                    >
                      <Link
                        ref={index === 0 ? firstLinkRef : undefined}
                        href={`/#${section.id}`}
                        onClick={(event) => onNavigate(event, section.id)}
                        className="group flex items-baseline gap-4 py-1 text-[clamp(2.5rem,11vw,4.5rem)] leading-none font-bold tracking-tighter transition-colors hover:text-accent"
                      >
                        <span className="label-mono text-accent-ink">{section.number}</span>
                        {t(section.key)}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
