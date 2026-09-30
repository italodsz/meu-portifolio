import { setRequestLocale } from "next-intl/server";
import { toLocale } from "@/lib/locale";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Manifesto } from "@/components/sections/Manifesto";
import { Projects } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";
import { GitHubLive } from "@/components/sections/GitHubLive";
import { Contact } from "@/components/sections/Contact";

/** ISR: a página é regenerada no máximo a cada hora (dados do GitHub). */
export const revalidate = 3600;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <About />
      <Manifesto />
      <Projects />
      <Stack />
      <GitHubLive />
      <Contact />
    </>
  );
}
