import { setRequestLocale } from "next-intl/server";
import { toLocale } from "@/lib/locale";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  return (
    <section id="hero" className="container-site min-h-screen pt-32">
      Hello
    </section>
  );
}
