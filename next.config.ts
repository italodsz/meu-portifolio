import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Só para diagnóstico local de performance (ANALYZE_SOURCEMAPS=1 npm run build).
  productionBrowserSourceMaps: process.env.ANALYZE_SOURCEMAPS === "1",
  experimental: {
    // Tailwind gera pouco CSS: inline no <head> evita o request que bloqueia a primeira pintura.
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
