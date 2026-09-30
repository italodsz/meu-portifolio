"use client";

import { useLayoutEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Barra vertical e porcentagem de leitura do manifesto (na coluna fixa à esquerda). */
export function ManifestoProgress({ label, targetId }: { label: string; targetId: string }) {
  const target = useRef<HTMLElement | null>(null);
  // Precisa rodar antes do useScroll, que lê target.current no próprio layout effect.
  useLayoutEffect(() => {
    target.current = document.getElementById(targetId);
  }, [targetId]);

  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ["start 0.7", "end 0.8"] });
  const percent = useTransform(scrollYProgress, (value) =>
    String(Math.round(Math.min(1, Math.max(0, value)) * 100)).padStart(3, "0"),
  );

  return (
    <div aria-hidden="true" className="hidden items-center gap-4 md:flex">
      <span className="relative h-32 w-px overflow-hidden bg-border-strong">
        <motion.span
          className="absolute inset-0 origin-top bg-accent"
          style={{ scaleY: reduced ? 1 : scrollYProgress }}
        />
      </span>
      <span className="label-mono flex flex-col gap-1 text-text-muted">
        <span>{label}</span>
        <span className="text-text tabular-nums">
          <motion.span>{percent}</motion.span>%
        </span>
      </span>
    </div>
  );
}
