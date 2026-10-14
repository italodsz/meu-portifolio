/** Cores da cena 3D, num lugar só (o resto do site usa os tokens de app/globals.css). */
export const scenePalette = {
  background: { dark: "#08070b", light: "#f6f5fa" },
  moon: {
    /** Lua "de verdade": cinza nos mares, creme claro nas terras altas. */
    low: "#7d776e",
    high: "#fffaf0",
    shadow: "#050506",
    rim: "#fff3dd",
    halo: "#fff1d6",
  },
  stars: ["#ffffff", "#f1edff", "#d9cfff", "#bba8ff", "#fff4e6"],
  starsLight: "#4b2bb0",
  nebula: "#7c4dff",
  constellation: { line: "#b9a7ff", lineLight: "#6d3fe0", starLight: "#6d3fe0" },
  constellationGlow: ["rgba(185,167,255,0.35)", "rgba(124,77,255,0)"] as const,
  shootingStar: "#f3eeff",
} as const;
