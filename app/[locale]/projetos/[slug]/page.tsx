import { ViewTransition } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Globe } from "lucide-react";
import { siGithub } from "simple-icons";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { toLocale } from "@/lib/locale";
import { getNextProject, getProject, projects } from "@/data/projects";
import { techIcon } from "@/data/skills";
import { RevealLines } from "@/components/ui/RevealLines";
import { Reveal } from "@/components/ui/Reveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { Pill } from "@/components/ui/Pill";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ArrowUpRight } from "@/components/ui/ArrowUpRight";
import { Magnetic } from "@/components/ui/Magnetic";
import { pad } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projetos/[slug]">): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = toLocale(rawLocale);
  const project = getProject(slug);
  if (!project) return {};
  const title = project.title[locale];
  const description = project.description[locale];

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/projetos/${slug}`,
      languages: Object.fromEntries([
        ...routing.locales.map((item) => [
          item === "pt" ? "pt-BR" : item,
          `/${item}/projetos/${slug}`,
        ]),
        ["x-default", `/pt/projetos/${slug}`],
      ]),
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/${locale}/projetos/${slug}`,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projetos/[slug]">) {
  const { locale: rawLocale, slug } = await params;
  const locale = toLocale(rawLocale);
  setRequestLocale(locale);

  const project = getProject(slug);
  if (!project) notFound();

  const t = await getTranslations("Projects");
  const next = getNextProject(slug);
  const index = projects.findIndex((item) => item.slug === slug);
  const title = project.title[locale];

  const story = [
    { key: "context", label: t("detail.context"), text: project.context[locale] },
    { key: "problem", label: t("detail.problem"), text: project.problem[locale] },
    { key: "solution", label: t("detail.solution"), text: project.solution[locale] },
  ];

  return (
    <article className="pt-[calc(var(--header-h)+2.5rem)]">
      <header className="container-site flex flex-col gap-10 pb-12 md:pb-16">
        <Reveal y={12}>
          <Link
            href="/#projects"
            className="group label-mono inline-flex items-center gap-2 text-text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-4 transition-transform duration-500 group-hover:-translate-x-1"
            />
            {t("detail.back")}
          </Link>
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal y={12} className="flex flex-wrap items-center gap-2">
            <span className="label-mono mr-2 text-accent-ink">
              {pad(index + 1)} / {pad(projects.length)}
            </span>
            {project.team && <Pill className="border-accent/40 text-accent-ink">{t("team")}</Pill>}
            {project.comingSoon && (
              <Pill className="border-accent/40 text-accent-ink">{t("soon")}</Pill>
            )}
            {project.categories[locale].map((category) => (
              <Pill key={category}>{category}</Pill>
            ))}
          </Reveal>
          <RevealLines
            as="h1"
            className="title-lg max-w-[18ch] text-balance"
            lines={[{ text: title }]}
          />
          <Reveal delay={0.1}>
            <p className="max-w-[60ch] text-lg leading-relaxed text-pretty text-text-muted md:text-xl">
              {project.description[locale]}
            </p>
          </Reveal>
        </div>
      </header>

      <div className="container-site">
        <ViewTransition name={`project-cover-${project.slug}`} share="morph" default="none">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-border bg-surface-2 md:aspect-[16/8]">
            <Image
              src={project.cover.src}
              alt={t("coverAlt", { title })}
              fill
              priority
              sizes="(min-width: 1440px) 1360px, 100vw"
              className="object-cover"
            />
          </div>
        </ViewTransition>
      </div>

      <div className="container-site grid gap-16 py-20 md:grid-cols-12 md:gap-8 md:py-28">
        <aside className="md:col-span-4 lg:col-span-3">
          <dl className="flex flex-col gap-8 md:sticky md:top-28">
            <div className="flex flex-col gap-2">
              <dt className="label-mono text-text-muted">{t("detail.category")}</dt>
              <dd>{project.categories[locale].join(" · ")}</dd>
            </div>
            <div className="flex flex-col gap-2">
              <dt className="label-mono text-text-muted">{t("detail.team")}</dt>
              <dd>{project.team ? t("team") : t("detail.solo")}</dd>
            </div>
            <div className="flex flex-col gap-3">
              <dt className="label-mono text-text-muted">{t("detail.stack")}</dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => {
                    const icon = techIcon(tech);
                    return (
                      <li
                        key={tech}
                        className="flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm"
                      >
                        {icon ? (
                          <BrandIcon path={icon} className="size-3.5 text-text-muted" />
                        ) : (
                          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                        )}
                        {tech}
                      </li>
                    );
                  })}
                </ul>
              </dd>
            </div>
            <div className="flex flex-col gap-3">
              <dt className="label-mono text-text-muted">{t("detail.links")}</dt>
              <dd className="flex flex-wrap gap-3">
                {project.repoUrl && (
                  <Magnetic>
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 font-semibold text-on-accent transition-colors hover:bg-accent-glow"
                    >
                      <BrandIcon path={siGithub.path} className="size-4" />
                      {t("detail.repo")}
                      <ArrowUpRight />
                    </a>
                  </Magnetic>
                )}
                {project.demoUrl && (
                  <Magnetic>
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex h-11 items-center gap-2 rounded-full border border-border-strong px-5 font-semibold transition-colors hover:border-accent hover:text-accent"
                    >
                      <Globe aria-hidden="true" className="size-4" />
                      {t("detail.demo")}
                      <ArrowUpRight />
                    </a>
                  </Magnetic>
                )}
                {!project.repoUrl && !project.demoUrl && (
                  <p className="text-sm leading-relaxed text-text-muted">{t("detail.noLinks")}</p>
                )}
              </dd>
            </div>
          </dl>
        </aside>

        <div className="flex flex-col gap-20 md:col-span-8 lg:col-span-8 lg:col-start-5">
          <section aria-labelledby="story-title" className="flex flex-col gap-12">
            <h2 id="story-title" className="sr-only">
              {t("detail.overview")}
            </h2>
            {story.map((block, blockIndex) => (
              <Reveal key={block.key} className="grid gap-4 md:grid-cols-8 md:gap-8">
                <h3 className="label-mono flex gap-3 text-text-muted md:col-span-2 md:pt-2">
                  <span className="text-accent-ink">{pad(blockIndex + 1)}</span>
                  {block.label}
                </h3>
                <p className="text-xl leading-relaxed text-pretty md:col-span-6 md:text-2xl md:leading-snug">
                  {block.text}
                </p>
              </Reveal>
            ))}
          </section>

          <section aria-labelledby="features-title" className="flex flex-col gap-8">
            <h2 id="features-title" className="title-md">
              {t("detail.features")}
            </h2>
            <Stagger as="ul" className="border-t border-border">
              {project.highlights[locale].map((highlight, highlightIndex) => (
                <StaggerItem
                  as="li"
                  key={highlight}
                  className="flex items-baseline gap-6 border-b border-border py-5"
                >
                  <span className="label-mono text-accent-ink">{pad(highlightIndex + 1)}</span>
                  <span className="text-lg md:text-xl">{highlight}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </section>

          <section aria-labelledby="role-title" className="flex flex-col gap-6">
            <h2 id="role-title" className="title-md">
              {t("detail.role")}
            </h2>
            <Reveal>
              <p className="max-w-[60ch] text-lg leading-relaxed text-text-muted">
                {project.role[locale]}
              </p>
            </Reveal>
          </section>

          {project.images.length > 0 && (
            <section aria-labelledby="gallery-title" className="flex flex-col gap-8">
              <h2 id="gallery-title" className="title-md">
                {t("detail.gallery")}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {project.images.map((image, imageIndex) => (
                  <Reveal
                    key={image.src}
                    className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] border border-border bg-surface-2"
                  >
                    <Image
                      src={image.src}
                      alt={
                        image.alt[locale] ||
                        t("detail.galleryAlt", { title, index: imageIndex + 1 })
                      }
                      fill
                      sizes="(min-width: 768px) 40vw, 100vw"
                      className="object-cover"
                    />
                  </Reveal>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <nav aria-label={t("detail.next")} className="container-site pb-24 md:pb-32">
        <Link
          href={`/projetos/${next.slug}`}
          data-cursor="view"
          className="group card flex flex-col gap-8 overflow-hidden p-6 transition-colors duration-500 hover:border-accent/60 md:flex-row md:items-center md:justify-between md:p-10"
        >
          <div className="flex flex-col gap-4">
            <span className="label-mono text-text-muted">{t("detail.next")}</span>
            <span className="text-[clamp(2rem,5vw,4.5rem)] leading-none font-bold tracking-tighter text-balance transition-colors duration-500 group-hover:text-accent">
              {next.title[locale]}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden aspect-[16/10] w-56 overflow-hidden rounded-xl border border-border lg:block">
              <Image
                src={next.cover.src}
                alt=""
                fill
                sizes="224px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <span className="grid size-16 shrink-0 place-items-center rounded-full bg-accent text-2xl text-on-accent md:size-20">
              <ArrowUpRight />
            </span>
          </div>
        </Link>
      </nav>
    </article>
  );
}
