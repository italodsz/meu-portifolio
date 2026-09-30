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
  siInstagram,
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

/** LinkedIn não está no simple-icons; usamos o "in" oficial desenhado à mão. */
const LINKEDIN_PATH =
  "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z";

/**
 * Todos os ícones de marca usados no site (paths SVG, viewBox 24×24).
 * São desenhados uma única vez num sprite (IconSprite) e referenciados com <use>.
 */
export const ICONS = {
  android: siAndroid.path,
  c: siC.path,
  css: siCss.path,
  expo: siExpo.path,
  firebase: siFirebase.path,
  git: siGit.path,
  github: siGithub.path,
  googlemaps: siGooglemaps.path,
  html: siHtml5.path,
  instagram: siInstagram.path,
  javascript: siJavascript.path,
  jwt: siJsonwebtokens.path,
  jupyter: siJupyter.path,
  kotlin: siKotlin.path,
  linkedin: LINKEDIN_PATH,
  mongodb: siMongodb.path,
  mysql: siMysql.path,
  nextjs: siNextdotjs.path,
  nodejs: siNodedotjs.path,
  java: siOpenjdk.path,
  postgresql: siPostgresql.path,
  python: siPython.path,
  react: siReact.path,
  websocket: siSocketdotio.path,
  springboot: siSpringboot.path,
  supabase: siSupabase.path,
  tailwind: siTailwindcss.path,
  typescript: siTypescript.path,
  vite: siVite.path,
} as const;

export type IconId = keyof typeof ICONS;
