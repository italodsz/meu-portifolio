"use client";

import { useCallback } from "react";
import { useLenis } from "lenis/react";

/** Rola até um seletor/elemento/posição usando Lenis quando disponível. */
export function useScrollTo() {
  const lenis = useLenis();

  return useCallback(
    (target: string | number | HTMLElement) => {
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.4 });
        return;
      }
      if (typeof target === "number") {
        window.scrollTo({ top: target });
        return;
      }
      const element = typeof target === "string" ? document.querySelector(target) : target;
      element?.scrollIntoView();
    },
    [lenis],
  );
}
