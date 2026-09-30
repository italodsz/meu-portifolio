"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { ArrowDown, Download } from "lucide-react";
import { RevealLines } from "@/components/ui/RevealLines";
import { Magnetic } from "@/components/ui/Magnetic";
import { Counter } from "@/components/ui/Counter";
import { ArrowUpRight } from "@/components/ui/ArrowUpRight";
import { useIntroDone } from "@/lib/intro";
import { useScrollTo } from "@/hooks/useScrollTo";
import { siteConfig } from "@/config/site";
import { cn, EASE } from "@/lib/utils";

type Stat = { value: number; label: string };

export function HeroContent({ available, stats }: { available: boolean; stats: Stat[] }) {
  const t = useTranslations("Hero");
  const play = useIntroDone();
  const scrollTo = useScrollTo();

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: play ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-svh flex-col justify-end pt-[calc(var(--header-h)+2rem)] pb-8 md:pb-10 portrait:pt-[40svh]"
    >
      <div className="container-site flex flex-col gap-8 md:gap-10">
        <motion.p
          {...fadeUp(0.05)}
          className="label-mono inline-flex items-center gap-3 self-start rounded-full border border-border bg-surface/60 px-4 py-2 backdrop-blur-md"
        >
          <span className="relative flex size-2.5" aria-hidden="true">
            {available && (
              <span className="animate-pulse-dot absolute inset-0 rounded-full bg-emerald-400" />
            )}
            <span
              className={cn(
                "relative size-2.5 rounded-full",
                available ? "bg-emerald-400" : "bg-text-muted",
              )}
            />
          </span>
          {available ? t("statusAvailable") : t("statusUnavailable")}
        </motion.p>

        <RevealLines
          as="h1"
          id="hero-title"
          play={play}
          delay={0.1}
          stagger={0.14}
          className="title-xl max-w-[16ch] text-balance"
          lines={[{ text: t("titleLine1") }, { text: t("titleLine2"), className: "text-accent" }]}
        />

        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <motion.p
            {...fadeUp(0.45)}
            className="max-w-[46ch] text-lg leading-relaxed text-pretty text-text-muted md:col-span-6 md:text-xl"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            {...fadeUp(0.55)}
            className="flex flex-wrap items-center gap-3 md:col-span-6 md:justify-end"
          >
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollTo("#projects")}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 font-semibold text-on-accent transition-colors hover:bg-accent-glow"
              >
                {t("ctaProjects")}
                <ArrowDown
                  aria-hidden="true"
                  className="size-4 transition-transform duration-500 group-hover:translate-y-0.5"
                />
              </button>
            </Magnetic>
            <Magnetic>
              <a
                href={siteConfig.cvPath}
                target="_blank"
                rel="noopener"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border-strong bg-bg/40 px-6 font-semibold backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
              >
                <Download aria-hidden="true" className="size-4" />
                {t("ctaCv")}
              </a>
            </Magnetic>
            <a
              href={siteConfig.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t("instagramLabel")} — ${siteConfig.contact.instagramHandle}`}
              className="group label-mono inline-flex items-center gap-1.5 px-2 py-3 text-text-muted transition-colors hover:text-accent"
            >
              {siteConfig.contact.instagramHandle}
              <ArrowUpRight />
            </a>
          </motion.div>
        </div>

        <motion.div {...fadeUp(0.7)} className="border-t border-border pt-6">
          <h2 className="sr-only">{t("statsLabel")}</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse justify-end gap-1">
                <dt className="label-mono text-text-muted">{stat.label}</dt>
                <dd className="font-mono text-4xl font-medium tracking-tight tabular-nums md:text-5xl">
                  <Counter value={stat.value} play={play} />
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          {...fadeUp(0.9)}
          aria-hidden="true"
          className="label-mono absolute right-6 bottom-9 hidden items-center gap-3 text-text-muted lg:right-10 xl:flex"
        >
          {t("scroll")}
          <span className="relative h-10 w-px overflow-hidden bg-border-strong">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-accent"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
            />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
