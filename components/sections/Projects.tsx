import { getTranslations } from "next-intl/server";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealLines } from "@/components/ui/RevealLines";
import { ProjectCard } from "./ProjectCard";
import { sortedProjects } from "@/data/projects";

/** Posição de cada card no bento grid (12 colunas no desktop). */
const LAYOUT = [
  { className: "md:col-span-12 lg:col-span-7 lg:row-span-2", size: "large" },
  { className: "md:col-span-6 lg:col-span-5", size: "medium" },
  { className: "md:col-span-6 lg:col-span-5", size: "medium" },
  { className: "md:col-span-6", size: "small" },
  { className: "md:col-span-6", size: "small" },
] as const;

export async function Projects() {
  const t = await getTranslations("Projects");

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative py-28 md:py-40">
      <div className="container-site flex flex-col gap-12 md:gap-16">
        <div className="flex flex-col gap-6">
          <SectionLabel number="03" label={t("label")} />
          <RevealLines
            id="projects-title"
            className="title-lg"
            lines={[{ text: t("titleA") }, { text: t("titleB"), className: "text-accent" }]}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-12 md:gap-5">
          {sortedProjects.map((project, index) => {
            const layout = LAYOUT[index] ?? LAYOUT[LAYOUT.length - 1];
            return (
              <ProjectCard
                key={project.slug}
                project={project}
                index={index}
                size={layout.size}
                className={layout.className}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
