"use client";

import { motion, type Variants } from "motion/react";
import { cn, EASE } from "@/lib/utils";

export type RevealLine = { text: string; className?: string };

type RevealLinesProps = {
  lines: RevealLine[];
  className?: string;
  lineClassName?: string;
  /** Quando definido, a animação é controlada (ex.: hero após o preloader). */
  play?: boolean;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
};

const TAGS = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p };

/**
 * Títulos revelados linha por linha com máscara (overflow hidden + translateY).
 * O elemento observado é o título inteiro: as linhas ficam recortadas pela máscara
 * e nunca "entrariam na tela" sozinhas.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  play,
  delay = 0,
  stagger = 0.12,
  as = "h2",
  id,
}: RevealLinesProps) {
  const Tag = TAGS[as];
  const controlled = play !== undefined;

  const line: Variants = {
    hidden: { y: "108%" },
    show: (index: number) => ({
      y: "0%",
      transition: { duration: 1, ease: EASE, delay: delay + index * stagger },
    }),
  };

  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      {...(controlled
        ? { animate: play ? "show" : "hidden" }
        : { whileInView: "show", viewport: { once: true, margin: "0px 0px -8% 0px" } })}
    >
      {lines.map((item, index) => (
        <span
          key={item.text}
          className={cn("-mb-[0.08em] block overflow-hidden pb-[0.08em]", lineClassName)}
        >
          <motion.span
            className={cn("block will-change-transform", item.className)}
            variants={line}
            custom={index}
          >
            {item.text}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
