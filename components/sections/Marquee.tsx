"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type MarqueeItem = { name: string; icon?: string };

type MarqueeRowProps = {
  items: MarqueeItem[];
  /** 1 = para a esquerda, −1 = para a direita. */
  direction: 1 | -1;
  /** Porcentagem da largura de uma cópia por segundo. */
  baseSpeed?: number;
};

function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

/** Faixa infinita de logos; pausa no hover e acelera com a velocidade do scroll. */
export function MarqueeRow({ items, direction, baseSpeed = 2.2 }: MarqueeRowProps) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const hovered = useRef(false);
  const speed = useRef(1);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [-2000, 0, 2000], [-4, 0, 4], {
    clamp: false,
  });
  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    // Suaviza a pausa no hover.
    speed.current += ((hovered.current ? 0 : 1) - speed.current) * 0.08;
    const factor = velocityFactor.get();
    const boost = 1 + Math.abs(factor);
    const sign = factor < 0 ? -1 : 1;
    const moveBy = direction * baseSpeed * (delta / 1000) * boost * sign * speed.current;
    baseX.set(baseX.get() - moveBy);
  });

  const doubled = [...items, ...items];

  return (
    <div
      className="mask-fade-x overflow-hidden py-2"
      onPointerEnter={() => (hovered.current = true)}
      onPointerLeave={() => (hovered.current = false)}
    >
      <motion.ul className="flex w-max" style={{ x: reduced ? "0%" : x }}>
        {doubled.map((item, index) => (
          <li
            key={`${item.name}-${index}`}
            aria-hidden={index >= items.length ? true : undefined}
            className="mr-3 flex items-center gap-3 rounded-full border border-border px-5 py-3 text-text-muted transition-colors hover:border-accent/50 hover:text-text md:mr-4 md:px-6 md:py-4"
          >
            {item.icon && <BrandIcon path={item.icon} className="size-5 md:size-6" />}
            <span className="font-mono text-sm tracking-wide whitespace-nowrap md:text-base">
              {item.name}
            </span>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
