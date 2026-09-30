import type { Localized } from "@/lib/i18n";
import type { IconId } from "./icons";

export type Tech = {
  name: string | Localized;
  /** Ícone do sprite (data/icons.ts); sem ícone, mostramos só o nome. */
  icon?: IconId;
};

function tech(name: string | Localized, icon?: IconId): Tech {
  return { name, icon };
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
      tech("React", "react"),
      tech("Next.js", "nextjs"),
      tech("TypeScript", "typescript"),
      tech("JavaScript", "javascript"),
      tech("HTML", "html"),
      tech("CSS", "css"),
      tech("Tailwind CSS", "tailwind"),
    ],
  },
  {
    key: "mobile",
    items: [tech("React Native (Expo)", "expo"), tech("Kotlin", "kotlin")],
  },
  {
    key: "backend",
    items: [
      tech("Node.js", "nodejs"),
      tech("Java", "java"),
      tech("Spring Boot", "springboot"),
      tech({ pt: "APIs REST", en: "REST APIs" }),
      tech("WebSocket", "websocket"),
      tech("JWT", "jwt"),
    ],
  },
  {
    key: "databases",
    items: [
      tech("PostgreSQL", "postgresql"),
      tech("MySQL", "mysql"),
      tech("Oracle"),
      tech("MongoDB Atlas", "mongodb"),
      tech("Supabase", "supabase"),
      tech("Firebase", "firebase"),
    ],
  },
  {
    key: "ai",
    items: [
      tech("Python", "python"),
      tech("LLMs"),
      tech("OCR (Tesseract, Donut)"),
      tech("Power BI"),
      tech({ pt: "Excel avançado", en: "Advanced Excel" }),
    ],
  },
  {
    key: "others",
    items: [tech("C", "c"), tech("Git", "git"), tech("GitHub", "github")],
  },
];

/** Logos das duas faixas do marquee (só tecnologias com ícone). */
export const marqueeRows: Tech[][] = [
  [
    tech("React", "react"),
    tech("Next.js", "nextjs"),
    tech("TypeScript", "typescript"),
    tech("JavaScript", "javascript"),
    tech("Tailwind CSS", "tailwind"),
    tech("HTML", "html"),
    tech("CSS", "css"),
    tech("Expo", "expo"),
    tech("Kotlin", "kotlin"),
    tech("Android", "android"),
    tech("Vite", "vite"),
  ],
  [
    tech("Node.js", "nodejs"),
    tech("Java", "java"),
    tech("Spring Boot", "springboot"),
    tech("PostgreSQL", "postgresql"),
    tech("MySQL", "mysql"),
    tech("MongoDB", "mongodb"),
    tech("Supabase", "supabase"),
    tech("Firebase", "firebase"),
    tech("Python", "python"),
    tech("Jupyter", "jupyter"),
    tech("Git", "git"),
    tech("GitHub", "github"),
  ],
];

export function techName(item: Tech, locale: keyof Localized): string {
  return typeof item.name === "string" ? item.name : item.name[locale];
}

const extraIcons: Record<string, IconId> = {
  "Google Maps": "googlemaps",
};

/** Ícone de uma tecnologia pelo nome, se existir. */
export function techIcon(name: string): IconId | undefined {
  const all = [...skillGroups.flatMap((group) => group.items), ...marqueeRows.flat()];
  const found = all.find((item) => typeof item.name === "string" && item.name === name);
  return found?.icon ?? extraIcons[name];
}
