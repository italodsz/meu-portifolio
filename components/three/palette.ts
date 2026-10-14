/** Cores da cena 3D, num lugar só (o resto do site usa os tokens de app/globals.css). */
export const scenePalette = {
  background: { dark: "#08070b", light: "#f6f5fa" },
  moon: {
    /** Lua "de verdade": cinza nos mares, creme claro nas terras altas. */
    low: "#5f5a52",
    high: "#cfc5b1",
    shadow: "#050506",
    rim: "#e8dcc4",
    halo: "#d9cbb0",
  },
  stars: ["#ffffff", "#efe6ff", "#d2b8ff", "#a36bff", "#fff4e6"],
  starsLight: "#4d0099",
  nebula: "#6600cc",
  constellation: { line: "#9955ff", lineLight: "#6600cc", starLight: "#6600cc" },
  constellationGlow: ["rgba(153,85,255,0.35)", "rgba(102,0,204,0)"] as const,
  shootingStar: "#f3eeff",
} as const;
