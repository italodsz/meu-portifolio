"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { scroll } from "motion";

/**
 * Parágrafo do manifesto. O progresso de leitura fica na variável CSS --p (0 a 1) e cada
 * palavra calcula a própria opacidade a partir dela (ver .lit-word em globals.css).
 *
 * Onde o navegador suporta scroll-driven animations, --p é animado só com CSS
 * (animation-timeline: view()). Nos outros, este componente atualiza --p via JS.
 */
export function LitParagraph({
  count,
  className,
  children,
}: {
  count: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (CSS.supports("animation-timeline: view()")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.style.setProperty("--p", "1");
      return;
    }
    return scroll((progress: number) => element.style.setProperty("--p", progress.toFixed(4)), {
      target: element,
      offset: ["start 0.88", "end 0.6"],
    });
  }, []);

  return (
    <p
      ref={ref}
      className={`lit-para ${className ?? ""}`}
      style={{ "--n": count } as CSSProperties}
    >
      {children}
    </p>
  );
}
