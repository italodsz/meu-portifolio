/**
 * Narrativa da cena ao longo do scroll ("Shoot for the moon").
 *
 * Cada seção da home tem um estado-alvo. A posição da lua é descrita em coordenadas de tela
 * (x/y de −1 a 1 e raio como fração da meia-altura da tela), para funcionar em qualquer proporção.
 * Entre duas seções os estados são interpolados com smoothstep; depois, suavizados com damping.
 */
export type SceneKey = {
  /** Centro da lua em coordenadas de tela (−1 a 1). */
  moonX: number;
  moonY: number;
  /** Raio da lua como fração da meia-altura da tela. */
  moonR: number;
  /** Brilho da lua (0 a 1). */
  moonFade: number;
  /** Distância da câmera (afastar = parallax das estrelas). */
  camZ: number;
  /** Inclinação da câmera para cima (rad). */
  tilt: number;
  /** Brilho das estrelas. */
  stars: number;
  /** Visibilidade da constelação dos projetos (0 a 1). */
  constellation: number;
};

export type SceneKeyName =
  "hero" | "about" | "manifesto" | "projects" | "stack" | "github" | "contact" | "page";

const DESKTOP: Record<SceneKeyName, SceneKey> = {
  hero: {
    moonX: 0.86,
    moonY: 0.55,
    moonR: 0.75,
    moonFade: 1,
    camZ: 10,
    tilt: 0,
    stars: 1,
    constellation: 0,
  },
  about: {
    moonX: 0.98,
    moonY: 0.72,
    moonR: 0.42,
    moonFade: 0.55,
    camZ: 12,
    tilt: 0.02,
    stars: 0.9,
    constellation: 0,
  },
  manifesto: {
    moonX: 0.96,
    moonY: 0.78,
    moonR: 0.3,
    moonFade: 0.4,
    camZ: 13,
    tilt: 0.03,
    stars: 0.8,
    constellation: 0,
  },
  projects: {
    moonX: 0.86,
    moonY: 0.86,
    moonR: 0.12,
    moonFade: 0.7,
    camZ: 15,
    tilt: 0.05,
    stars: 0.85,
    constellation: 1,
  },
  stack: {
    moonX: 0.8,
    moonY: 0.8,
    moonR: 0.09,
    moonFade: 0.6,
    camZ: 16,
    tilt: 0.07,
    stars: 0.8,
    constellation: 0,
  },
  github: {
    moonX: 0.8,
    moonY: 0.8,
    moonR: 0.08,
    moonFade: 0.6,
    camZ: 17,
    tilt: 0.09,
    stars: 0.85,
    constellation: 0,
  },
  contact: {
    moonX: 0.62,
    moonY: 0.66,
    moonR: 0.07,
    moonFade: 0.9,
    camZ: 19,
    tilt: 0.2,
    stars: 1.25,
    constellation: 0,
  },
  page: {
    moonX: 0.8,
    moonY: 0.78,
    moonR: 0.14,
    moonFade: 0.55,
    camZ: 15,
    tilt: 0.05,
    stars: 0.85,
    constellation: 0,
  },
};

const MOBILE: Record<SceneKeyName, SceneKey> = {
  hero: {
    moonX: 0,
    moonY: 0.6,
    moonR: 0.3,
    moonFade: 1,
    camZ: 10,
    tilt: 0,
    stars: 1,
    constellation: 0,
  },
  about: {
    moonX: 0.75,
    moonY: 0.78,
    moonR: 0.18,
    moonFade: 0.5,
    camZ: 12,
    tilt: 0.02,
    stars: 0.9,
    constellation: 0,
  },
  manifesto: {
    moonX: 0.8,
    moonY: 0.82,
    moonR: 0.14,
    moonFade: 0.4,
    camZ: 13,
    tilt: 0.03,
    stars: 0.8,
    constellation: 0,
  },
  projects: {
    moonX: 0.8,
    moonY: 0.88,
    moonR: 0.06,
    moonFade: 0.7,
    camZ: 15,
    tilt: 0.05,
    stars: 0.85,
    constellation: 1,
  },
  stack: {
    moonX: 0.8,
    moonY: 0.9,
    moonR: 0.05,
    moonFade: 0.6,
    camZ: 16,
    tilt: 0.07,
    stars: 0.8,
    constellation: 0,
  },
  github: {
    moonX: 0.8,
    moonY: 0.9,
    moonR: 0.05,
    moonFade: 0.6,
    camZ: 17,
    tilt: 0.09,
    stars: 0.85,
    constellation: 0,
  },
  contact: {
    moonX: -0.6,
    moonY: 0.84,
    moonR: 0.05,
    moonFade: 0.9,
    camZ: 19,
    tilt: 0.2,
    stars: 1.25,
    constellation: 0,
  },
  page: {
    moonX: 0.8,
    moonY: 0.88,
    moonR: 0.08,
    moonFade: 0.55,
    camZ: 15,
    tilt: 0.05,
    stars: 0.85,
    constellation: 0,
  },
};

/** Estado estático usado com prefers-reduced-motion. */
export const REDUCED: SceneKey = {
  moonX: 0.92,
  moonY: 0.78,
  moonR: 0.4,
  moonFade: 0.55,
  camZ: 12,
  tilt: 0,
  stars: 0.85,
  constellation: 0,
};

export const REDUCED_PORTRAIT: SceneKey = {
  ...REDUCED,
  moonX: 0.62,
  moonY: 0.8,
  moonR: 0.2,
};

const ORDER: SceneKeyName[] = [
  "hero",
  "about",
  "manifesto",
  "projects",
  "stack",
  "github",
  "contact",
];

export type Anchor = { name: SceneKeyName; at: number };

/** Mede onde cada estado deve estar "completo" (em px de scroll). */
export function measureAnchors(viewportHeight: number): Anchor[] {
  const anchors: Anchor[] = [];
  for (const name of ORDER) {
    if (name === "hero") {
      if (document.getElementById("hero")) anchors.push({ name, at: 0 });
      continue;
    }
    const element = document.getElementById(name);
    if (!element) continue;
    const top = element.getBoundingClientRect().top + window.scrollY;
    anchors.push({ name, at: Math.max(0, top - viewportHeight * 0.55) });
  }
  return anchors;
}

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const KEYS = Object.keys(DESKTOP.hero) as (keyof SceneKey)[];

/** Estado-alvo para a posição de scroll atual (telas em pé usam a composição vertical). */
export function targetFor(
  scrollY: number,
  anchors: Anchor[],
  portrait: boolean,
  out: SceneKey,
): SceneKey {
  const table = portrait ? MOBILE : DESKTOP;
  if (anchors.length === 0) return Object.assign(out, table.page);
  if (scrollY <= anchors[0].at) return Object.assign(out, table[anchors[0].name]);

  for (let index = 0; index < anchors.length - 1; index++) {
    const from = anchors[index];
    const to = anchors[index + 1];
    if (scrollY < to.at) {
      const t = smoothstep(
        Math.min(1, Math.max(0, (scrollY - from.at) / Math.max(1, to.at - from.at))),
      );
      const a = table[from.name];
      const b = table[to.name];
      for (const key of KEYS) out[key] = a[key] + (b[key] - a[key]) * t;
      return out;
    }
  }
  return Object.assign(out, table[anchors[anchors.length - 1].name]);
}

export function createKey(): SceneKey {
  return { ...DESKTOP.hero };
}
