import type { Localized } from "@/lib/i18n";
import {
  siAndroid,
  siC,
  siCss,
  siExpo,
  siFirebase,
  siGit,
  siGithub,
  siGooglemaps,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siJupyter,
  siKotlin,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siPostgresql,
  siPython,
  siReact,
  siSocketdotio,
  siSpringboot,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVite,
} from "simple-icons";

export type Tech = {
  name: string | Localized;
  /** Path SVG (viewBox 0 0 24 24) do simple-icons; sem ícone, mostramos só o nome. */
  icon?: string;
};

function tech(name: string | Localized, icon?: { path: string }): Tech {
  return { name, icon: icon?.path };
}

export type SkillGroupKey = "frontend" | "mobile" | "backend" | "databases" | "ai" | "others";

export type SkillGroup = {
  key: SkillGroupKey;
  items: Tech[];
};

export const skillGroups: SkillGroup[] = [
  {
    key: "frontend",
    items: [
      tech("React", siReact),
      tech("Next.js", siNextdotjs),
      tech("TypeScript", siTypescript),
      tech("JavaScript", siJavascript),
      tech("HTML", siHtml5),
      tech("CSS", siCss),
      tech("Tailwind CSS", siTailwindcss),
    ],
  },
  {
    key: "mobile",
    items: [tech("React Native (Expo)", siExpo), tech("Kotlin", siKotlin)],
  },
  {
    key: "backend",
    items: [
      tech("Node.js", siNodedotjs),
      tech("Java", siOpenjdk),
      tech("Spring Boot", siSpringboot),
      tech({ pt: "APIs REST", en: "REST APIs" }),
      tech("WebSocket", siSocketdotio),
      tech("JWT", siJsonwebtokens),
    ],
  },
  {
    key: "databases",
    items: [
      tech("PostgreSQL", siPostgresql),
      tech("MySQL", siMysql),
      tech("Oracle"),
      tech("MongoDB Atlas", siMongodb),
      tech("Supabase", siSupabase),
      tech("Firebase", siFirebase),
    ],
  },
  {
    key: "ai",
    items: [
      tech("Python", siPython),
      tech("LLMs"),
      tech("OCR (Tesseract, Donut)"),
      tech("Power BI"),
      tech({ pt: "Excel avançado", en: "Advanced Excel" }),
    ],
  },
  {
    key: "others",
    items: [tech("C", siC), tech("Git", siGit), tech("GitHub", siGithub)],
  },
];

/** Logos das duas faixas do marquee (só tecnologias com ícone). */
export const marqueeRows: Tech[][] = [
  [
    tech("React", siReact),
    tech("Next.js", siNextdotjs),
    tech("TypeScript", siTypescript),
    tech("JavaScript", siJavascript),
    tech("Tailwind CSS", siTailwindcss),
    tech("HTML", siHtml5),
    tech("CSS", siCss),
    tech("Expo", siExpo),
    tech("Kotlin", siKotlin),
    tech("Android", siAndroid),
    tech("Vite", siVite),
  ],
  [
    tech("Node.js", siNodedotjs),
    tech("Java", siOpenjdk),
    tech("Spring Boot", siSpringboot),
    tech("PostgreSQL", siPostgresql),
    tech("MySQL", siMysql),
    tech("MongoDB", siMongodb),
    tech("Supabase", siSupabase),
    tech("Firebase", siFirebase),
    tech("Python", siPython),
    tech("Jupyter", siJupyter),
    tech("Git", siGit),
    tech("GitHub", siGithub),
  ],
];

export function techName(item: Tech, locale: keyof Localized): string {
  return typeof item.name === "string" ? item.name : item.name[locale];
}

const extraIcons: Record<string, { path: string }> = {
  "Google Maps": siGooglemaps,
};

/** Ícone (path SVG) de uma tecnologia pelo nome, se existir. */
export function techIcon(name: string): string | undefined {
  const all = [...skillGroups.flatMap((group) => group.items), ...marqueeRows.flat()];
  const found = all.find((item) => typeof item.name === "string" && item.name === name);
  return found?.icon ?? extraIcons[name]?.path;
}
