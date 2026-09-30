"use client";

import { ViewTransition } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Pill } from "@/components/ui/Pill";
import { ArrowUpRight } from "@/components/ui/ArrowUpRight";
import { useSpotlightHandlers } from "@/components/ui/Spotlight";
import { setHoveredProject } from "@/lib/scene-store";
import type { Project } from "@/data/projects";
import { cn, EASE, pad } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  index: number;
  size: "large" | "medium" | "small";
  className?: string;
};

export function ProjectCard({ project, index, size, className }: ProjectCardProps) {
  const t = useTranslations("Projects");
  const locale = useLocale();
  const spotlight = useSpotlightHandlers();
  const title = project.title[locale];

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay: (index % 2) * 0.08 }}
      className={cn("h-full", className)}
    >
      <Link
        href={`/projetos/${project.slug}`}
        data-cursor="view"
        aria-label={t("openProject", { title })}
        onPointerEnter={() => setHoveredProject(index)}
        onPointerLeave={(event) => {
          setHoveredProject(-1);
          spotlight.onPointerLeave(event);
        }}
        onFocus={() => setHoveredProject(index)}
        onBlur={() => setHoveredProject(-1)}
        onPointerMove={spotlight.onPointerMove}
        className="group card spotlight flex h-full flex-col gap-5 overflow-hidden p-3 transition-colors duration-500 hover:border-accent/60 focus-visible:border-accent md:p-4"
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-[1.1rem] bg-surface-2",
            size === "large"
              ? "aspect-[16/11] md:aspect-auto md:min-h-[26rem] md:flex-1"
              : "aspect-[16/10]",
          )}
        >
          <ViewTransition name={`project-cover-${project.slug}`} share="morph" default="none">
            <Image
              src={project.cover.src}
              alt={t("coverAlt", { title })}
              fill
              sizes={
                size === "large"
                  ? "(min-width: 1024px) 56vw, 100vw"
                  : "(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
              }
              className="object-cover transition-transform duration-[1200ms] ease-(--ease-out-expo) group-hover:scale-[1.04]"
            />
          </ViewTransition>
          <div className="absolute inset-x-3 top-3 z-[3] flex items-start justify-between gap-3">
            <span className="label-mono rounded-full bg-bg/70 px-3 py-1.5 backdrop-blur-md">
              {pad(index + 1)}
            </span>
            <span className="grid size-10 place-items-center rounded-full bg-bg/70 text-lg backdrop-blur-md transition-colors duration-500 group-hover:bg-accent group-hover:text-on-accent">
              <ArrowUpRight />
            </span>
          </div>
        </div>

        <div className="relative z-[3] flex flex-col gap-3 px-2 pb-2">
          <div className="flex flex-wrap items-center gap-2">
            {project.team && <Pill className="border-accent/40 text-accent-ink">{t("team")}</Pill>}
            {project.comingSoon && (
              <Pill className="border-accent/40 text-accent-ink">{t("soon")}</Pill>
            )}
            {project.categories[locale].map((category) => (
              <Pill key={category}>{category}</Pill>
            ))}
          </div>
          <h3
            className={cn(
              "font-bold tracking-tight text-balance transition-colors duration-500 group-hover:text-accent",
              size === "large" ? "text-3xl md:text-4xl" : "text-2xl",
            )}
          >
            {title}
          </h3>
          <p className="max-w-[52ch] leading-relaxed text-pretty text-text-muted">
            {project.summary[locale]}
          </p>
          <ul className="flex flex-wrap gap-1.5 pt-1" aria-label="Stack">
            {project.stack.slice(0, size === "large" ? 6 : 4).map((tech) => (
              <li
                key={tech}
                className="rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[0.6875rem] text-text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </motion.article>
  );
}
