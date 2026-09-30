import { getFormatter, getTranslations } from "next-intl/server";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealLines } from "@/components/ui/RevealLines";
import { SpotlightCard } from "@/components/ui/Spotlight";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { Counter } from "@/components/ui/Counter";
import { ArrowUpRight } from "@/components/ui/ArrowUpRight";
import { Reveal } from "@/components/ui/Reveal";
import { LanguageBar } from "./LanguageBar";
import { sliceColor } from "@/lib/colors";
import { getGitHubData } from "@/lib/github";

const MAX_LANGUAGES = 6;

export async function GitHubLive() {
  const [t, format, data] = await Promise.all([
    getTranslations("GitHub"),
    getFormatter(),
    getGitHubData(),
  ]);

  // Mostra as principais linguagens e agrupa o resto em "Outras".
  const top = data.languages.slice(0, MAX_LANGUAGES);
  const rest = data.languages.slice(MAX_LANGUAGES);
  const restPercent = Math.round(rest.reduce((acc, item) => acc + item.percent, 0) * 10) / 10;
  const slices = [
    ...top.map((item) => ({ name: item.name, percent: item.percent })),
    ...(restPercent > 0 ? [{ name: t("others"), percent: restPercent }] : []),
  ];
  const now = new Date(data.fetchedAt);
  const since = new Date(data.createdAt);

  return (
    <section id="github" aria-labelledby="github-title" className="relative py-28 md:py-40">
      <div className="container-site flex flex-col gap-12 md:gap-16">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="flex flex-col gap-6 md:col-span-8">
            <SectionLabel number="05" label={t("label")} />
            <RevealLines
              id="github-title"
              className="title-lg"
              lines={[{ text: t("titleA") }, { text: t("titleB"), className: "text-accent" }]}
            />
          </div>
          <Reveal className="flex flex-col gap-4 md:col-span-4 md:items-end md:text-right">
            <p className="max-w-[36ch] leading-relaxed text-text-muted">{t("intro")}</p>
            <a
              href={data.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group label-mono inline-flex items-center gap-2 transition-colors hover:text-accent"
            >
              {t("viewProfile")} <ArrowUpRight />
            </a>
          </Reveal>
        </div>

        <Stagger className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
          {[
            { label: t("repos"), value: <Counter value={data.publicRepos} /> },
            { label: t("followers"), value: <Counter value={data.followers} /> },
            {
              label: t("since"),
              value: <span>{format.dateTime(since, { year: "numeric", timeZone: "UTC" })}</span>,
            },
          ].map((stat) => (
            <StaggerItem key={stat.label} className="h-full">
              <SpotlightCard className="flex h-full flex-col justify-between gap-3 p-4 sm:p-6 md:p-8">
                <span className="label-mono relative z-[3] text-[0.625rem] text-text-muted sm:text-xs">
                  {stat.label}
                </span>
                <span className="relative z-[3] font-mono text-3xl font-medium tracking-tight tabular-nums sm:text-5xl md:text-6xl">
                  {stat.value}
                </span>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal>
          <SpotlightCard className="flex flex-col gap-8 p-6 md:p-10">
            <h3 className="label-mono relative z-[3] text-text-muted">{t("languages")}</h3>
            <div className="relative z-[3]">
              <LanguageBar slices={slices} label={t("languagesLabel")} />
            </div>
            <ul className="relative z-[3] grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
              {slices.map((slice, index) => (
                <li key={slice.name} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: sliceColor(index) }}
                  />
                  <span className="truncate">{slice.name}</span>
                  <span className="ml-auto font-mono text-sm text-text-muted tabular-nums">
                    {slice.percent.toFixed(1)}%
                  </span>
                </li>
              ))}
            </ul>
          </SpotlightCard>
        </Reveal>

        <div className="flex flex-col gap-6">
          <h3 className="label-mono text-text-muted">{t("recent")}</h3>
          <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {data.recentRepos.map((repo) => (
              <StaggerItem as="li" key={repo.name} className="h-full">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group card flex h-full flex-col gap-4 p-6 transition-colors duration-500 hover:border-accent/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-mono text-base font-medium break-all">{repo.name}</span>
                    <span className="text-lg transition-colors group-hover:text-accent">
                      <ArrowUpRight />
                    </span>
                  </div>
                  {repo.description && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-text-muted">
                      {repo.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between gap-3 font-mono text-xs text-text-muted">
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
                      {repo.language ?? t("noLanguage")}
                    </span>
                    <span>
                      {t("updated", { time: format.relativeTime(new Date(repo.pushedAt), now) })}
                    </span>
                  </div>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
          {data.source === "fallback" && (
            <p className="label-mono text-text-muted" role="note">
              {t("fallbackNotice")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
