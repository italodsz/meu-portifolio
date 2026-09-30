import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Ignora API, arquivos internos do Next, rotas de metadata e qualquer arquivo com extensão.
  matcher:
    "/((?!api|_next|_vercel|icon|apple-icon|sitemap.xml|robots.txt|manifest.webmanifest|.*\\..*).*)",
};
