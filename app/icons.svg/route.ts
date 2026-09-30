import { ICONS } from "@/data/icons";

export const dynamic = "force-static";

/**
 * Sprite SVG com os ícones de marca, servido como arquivo estático e cacheado.
 * Os componentes usam <use href="/icons.svg#icon-react">, então os paths não vão no HTML.
 */
export function GET() {
  const symbols = Object.entries(ICONS)
    .map(([id, path]) => `<symbol id="icon-${id}" viewBox="0 0 24 24"><path d="${path}"/></symbol>`)
    .join("");
  return new Response(`<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
