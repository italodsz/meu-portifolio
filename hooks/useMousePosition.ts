"use client";

import { useEffect } from "react";
import { useMotionValue, type MotionValue } from "motion/react";

export type MousePosition = {
  /** Posição em pixels na viewport. */
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** Posição normalizada de -1 a 1 (centro = 0). */
  nx: MotionValue<number>;
  ny: MotionValue<number>;
};

/** Posição do mouse como MotionValues (não causa re-render). */
export function useMousePosition(): MousePosition {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      nx.set((event.clientX / window.innerWidth) * 2 - 1);
      ny.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y, nx, ny]);

  return { x, y, nx, ny };
}
