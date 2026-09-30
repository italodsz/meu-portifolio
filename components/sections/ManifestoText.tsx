"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { scroll } from "motion";

/**
 * Uma única linha de progresso controla todas as palavras do manifesto. Isso impede que o
 * parágrafo seguinte comece a acender antes de o anterior terminar.
 */
export function ManifestoText({
  id,
  totalWords,
  className,
  children,
}: {
  id: string;
  totalWords: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

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
    <div
      ref={ref}
      id={id}
      className={`lit-manifesto ${className ?? ""}`}
      style={{ "--n": totalWords } as CSSProperties}
    >
      {children}
    </div>
  );
}
