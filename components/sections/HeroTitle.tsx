"use client";

import { useEffect, useRef } from "react";
import { animate } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn, EASE } from "@/lib/utils";

type HeroTitleProps = {
  lines: { text: string; className?: string }[];
  play: boolean;
  className?: string;
};

/**
 * Título do hero revelado linha por linha com máscara.
 * O texto já vem visível no HTML do servidor (a primeira pintura conta para o LCP, por baixo
 * da cortina do preloader). Depois da hidratação as linhas descem para trás da máscara e
 * sobem quando a intro termina. Em visitas repetidas, o CSS esconde as linhas antes da
 * pintura (html[data-preloaded] .hero-line).
 */
export function HeroTitle({ lines, play, className }: HeroTitleProps) {
  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    const elements = refs.current.filter((element): element is HTMLSpanElement => element !== null);
    if (!play) {
      elements.forEach((element) => {
        element.style.transform = "translateY(108%)";
      });
      return;
    }
    const controls = elements.map((element, index) =>
      animate(
        element,
        { transform: ["translateY(108%)", "translateY(0%)"] },
        { duration: reduced ? 0 : 1, ease: EASE, delay: reduced ? 0 : 0.1 + index * 0.14 },
      ),
    );
    return () => controls.forEach((control) => control.stop());
  }, [play, reduced]);

  return (
    <h1 id="hero-title" className={className}>
      {lines.map((line, index) => (
        <span key={line.text} className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
          <span
            ref={(element) => {
              refs.current[index] = element;
            }}
            className={cn("hero-line block will-change-transform", line.className)}
          >
            {line.text}
          </span>
        </span>
      ))}
    </h1>
  );
}
