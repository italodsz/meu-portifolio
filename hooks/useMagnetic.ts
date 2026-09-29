"use client";

import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { useMotionValue, useSpring, type MotionValue } from "motion/react";
import { useIsTouch } from "./useIsTouch";
import { useReducedMotion } from "./useReducedMotion";

const SPRING = { stiffness: 220, damping: 18, mass: 0.4 };

type Magnetic<T extends HTMLElement> = {
  ref: React.RefObject<T | null>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  onPointerMove: (event: ReactPointerEvent<T>) => void;
  onPointerLeave: () => void;
};

/** Faz o elemento seguir o mouse com mola enquanto o ponteiro está sobre ele. */
export function useMagnetic<T extends HTMLElement>(strength = 0.35): Magnetic<T> {
  const ref = useRef<T>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);
  const isTouch = useIsTouch();
  const reduced = useReducedMotion();
  const disabled = isTouch || reduced;

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<T>) => {
      if (disabled || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      rawX.set((event.clientX - (rect.left + rect.width / 2)) * strength);
      rawY.set((event.clientY - (rect.top + rect.height / 2)) * strength);
    },
    [disabled, rawX, rawY, strength],
  );

  const onPointerLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { ref, x, y, onPointerMove, onPointerLeave };
}
