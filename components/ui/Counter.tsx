"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { pad } from "@/lib/utils";

type CounterProps = {
  value: number;
  /** Número mínimo de dígitos (ex.: 2 → "05"). */
  digits?: number;
  duration?: number;
  /** Só começa quando `play` for true (além de estar visível). */
  play?: boolean;
  className?: string;
};

/** Número que conta de 0 até `value` ao entrar na tela. */
export function Counter({
  value,
  digits = 2,
  duration = 1.6,
  play = true,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || !inView || !play) return;
    if (reduced) {
      element.textContent = pad(value, digits);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        element.textContent = pad(Math.round(latest), digits);
      },
    });
    return () => controls.stop();
  }, [inView, play, reduced, value, digits, duration]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {pad(0, digits)}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
