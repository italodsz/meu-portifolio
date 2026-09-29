"use client";

import { motion } from "motion/react";
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

/** Títulos revelados linha por linha com máscara (overflow hidden + translateY). */
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
  const Tag = as;
  const controlled = play !== undefined;

  return (
    <Tag id={id} className={className}>
      {lines.map((line, index) => (
        <span
          key={line.text}
          className={cn("-mb-[0.08em] block overflow-hidden pb-[0.08em]", lineClassName)}
        >
          <motion.span
            className={cn("block will-change-transform", line.className)}
            initial={{ y: "108%" }}
            {...(controlled
              ? { animate: play ? { y: "0%" } : { y: "108%" } }
              : { whileInView: { y: "0%" }, viewport: { once: true, margin: "0px 0px -8% 0px" } })}
            transition={{ duration: 1, ease: EASE, delay: delay + index * stagger }}
          >
            {line.text}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
