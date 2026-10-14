import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.role.pt}`,
    short_name: siteConfig.shortName,
    description: "Portfólio de Ítalo de Souza, desenvolvedor de software fullstack.",
    start_url: "/pt",
    display: "standalone",
    background_color: "#08070b",
    theme_color: "#08070b",
    lang: "pt-BR",
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
