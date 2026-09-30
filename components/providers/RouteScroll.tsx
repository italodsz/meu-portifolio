"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";
import { usePathname } from "@/i18n/navigation";

/**
 * Ao trocar de rota: volta ao topo, ou vai direto para a âncora (#projects etc.).
 * Necessário porque o Lenis mantém sua própria posição de scroll.
 */
export function RouteScroll() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    const hash = window.location.hash;
    const frame = requestAnimationFrame(() => {
      const target = hash ? document.querySelector<HTMLElement>(hash) : null;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(target ?? 0, { immediate: true, force: true });
      } else if (target) {
        target.scrollIntoView();
      }
    });
    return () => cancelAnimationFrame(frame);
    // Só reage à mudança de rota.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
