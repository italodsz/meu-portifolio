"use client";

import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

export type ScrollDirection = "up" | "down";

/** Direção do scroll, com uma tolerância para evitar tremidas. */
export function useScrollDirection(threshold = 8): { direction: ScrollDirection; atTop: boolean } {
  const { scrollY } = useScroll();
  const [direction, setDirection] = useState<ScrollDirection>("up");
  const [atTop, setAtTop] = useState(true);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    const delta = current - previous;
    setAtTop(current < 24);
    if (Math.abs(delta) < threshold) return;
    setDirection(delta > 0 ? "down" : "up");
  });

  return { direction, atTop };
}
