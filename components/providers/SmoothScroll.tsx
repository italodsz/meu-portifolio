"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Scroll suave com Lenis só em telas com mouse. No toque o scroll nativo já é suave
 * (o Lenis não suaviza toque por padrão) e só custaria processamento.
 * Desligado com prefers-reduced-motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)", false);

  if (reduced || !finePointer) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.11,
        wheelMultiplier: 1,
        autoRaf: true,
        anchors: true,
        stopInertiaOnNavigate: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
