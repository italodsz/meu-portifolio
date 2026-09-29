"use client";

import { useReducedMotion as useMotionReducedMotion } from "motion/react";

/**
 * Ponto único para saber se o visitante pediu menos movimento.
 * Com reduced motion: sem parallax, sem animações ligadas ao scroll, só fades curtos.
 */
export function useReducedMotion(): boolean {
  return useMotionReducedMotion() ?? false;
}
