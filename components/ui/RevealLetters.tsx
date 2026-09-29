"use client";

import { motion } from "motion/react";
import { cn, EASE } from "@/lib/utils";

export type LetterSegment = { text: string; className?: string };

type RevealLettersProps = {
  segments: LetterSegment[];
  className?: string;
  as?: "h2" | "h3" | "p";
  id?: string;
  stagger?: number;
};

/** Revela o texto letra por letra (palavras não quebram no meio). */
export function RevealLetters({
  segments,
  className,
  as = "h2",
  id,
  stagger = 0.018,
}: RevealLettersProps) {
  const Tag = as;
  const fullText = segments.map((segment) => segment.text).join(" ");
  let letterIndex = 0;

  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{fullText}</span>
      <motion.span
        aria-hidden="true"
        className="block"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      >
        {segments.map((segment, segmentIndex) => (
          <span key={segmentIndex} className={cn("block", segment.className)}>
            {segment.text.split(" ").map((word, wordIndex) => (
              <span
                key={wordIndex}
                className="-mb-[0.1em] inline-flex overflow-hidden pb-[0.1em] whitespace-nowrap"
              >
                {Array.from(word).map((char, charIndex) => {
                  const index = letterIndex++;
                  return (
                    <motion.span
                      key={charIndex}
                      className="inline-block will-change-transform"
                      variants={{
                        hidden: { y: "110%" },
                        show: {
                          y: "0%",
                          transition: { duration: 0.8, ease: EASE, delay: index * stagger },
                        },
                      }}
                    >
                      {char}
                    </motion.span>
                  );
                })}
                <span className="inline-block">&nbsp;</span>
              </span>
            ))}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
