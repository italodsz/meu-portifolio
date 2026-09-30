import { getLocale, getTranslations } from "next-intl/server";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealLines } from "@/components/ui/RevealLines";
import { SpotlightCard } from "@/components/ui/Spotlight";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { MarqueeRow } from "./Marquee";
import { marqueeRows, skillGroups, techName } from "@/data/skills";
import type { Locale } from "@/i18n/routing";
import { pad } from "@/lib/utils";

export async function Stack() {
  const t = await getTranslations("Stack");
  const locale = (await getLocale()) as Locale;
  const rows = marqueeRows.map((row) =>
    row.map((item) => ({ name: techName(item, locale), icon: item.icon })),
  );

  return (
    <section id="stack" aria-labelledby="stack-title" className="relative py-28 md:py-40">
      <div className="container-site flex flex-col gap-6">
        <SectionLabel number="04" label={t("label")} />
        <RevealLines
          id="stack-title"
          className="title-lg"
          lines={[{ text: t("titleA") }, { text: t("titleB"), className: "text-accent" }]}
        />
      </div>

      <div
        className="mt-14 flex flex-col gap-3 md:mt-20"
        role="group"
        aria-label={t("marqueeLabel")}
      >
        <MarqueeRow items={rows[0]} direction={1} />
        <MarqueeRow items={rows[1]} direction={-1} />
      </div>

      <div className="container-site mt-14 md:mt-20">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5" stagger={0.08}>
          {skillGroups.map((group, index) => (
            <StaggerItem key={group.key} className="h-full">
              <SpotlightCard className="group flex h-full flex-col gap-6 p-6 transition-colors duration-500 hover:border-accent/50 md:p-8">
                <div className="relative z-[3] flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold tracking-tight">{t(`groups.${group.key}`)}</h3>
                  <span className="label-mono text-accent-ink">{pad(index + 1)}</span>
                </div>
                <ul className="relative z-[3] flex flex-wrap gap-2">
                  {group.items.map((item) => {
                    const name = techName(item, locale);
                    return (
                      <li
                        key={name}
                        className="flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm"
                      >
                        {item.icon ? (
                          <BrandIcon id={item.icon} className="size-3.5 text-text-muted" />
                        ) : (
                          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                        )}
                        {name}
                      </li>
                    );
                  })}
                </ul>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
