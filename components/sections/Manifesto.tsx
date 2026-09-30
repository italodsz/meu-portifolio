"use client";

import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useTranslations } from "next-intl";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type Piece = { text: string; accent: boolean };
/** Uma palavra pode ter partes em destaque e partes normais (ex.: "evolução" + ","). */
type Word = Piece[];

/** Converte "texto [[destaque]] texto" em palavras, preservando a pontuação colada. */
function parseWords(paragraph: string): Word[] {
  const words: Word[] = [];
  let current: Word = [];
  const parts = paragraph.split(/(\[\[[^\]]+\]\])/g).filter(Boolean);
  for (const part of parts) {
    const accent = part.startsWith("[[");
    const clean = accent ? part.slice(2, -2) : part;
    for (const token of clean.split(/(\s+)/)) {
      if (!token) continue;
      if (/^\s+$/.test(token)) {
        if (current.length) words.push(current);
        current = [];
        continue;
      }
      current.push({ text: token, accent });
    }
  }
  if (current.length) words.push(current);
  return words;
}

function WordPieces({ word }: { word: Word }) {
  return word.map((piece, index) => (
    <span key={index} className={cn(piece.accent && "text-accent")}>
      {piece.text}
    </span>
  ));
}

export function Manifesto() {
  const t = useTranslations("Manifesto");
  const paragraphs = t.raw("paragraphs") as string[];
  const parsed = useMemo(() => paragraphs.map(parseWords), [paragraphs]);
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.7", "end 0.8"],
  });
  const percent = useTransform(scrollYProgress, (value) =>
    String(Math.round(Math.min(1, Math.max(0, value)) * 100)).padStart(3, "0"),
  );

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      aria-labelledby="manifesto-title"
      className="relative py-28 md:py-40"
    >
      <div className="container-site grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-3">
          <div className="flex flex-col gap-6 md:sticky md:top-28">
            <SectionLabel number="02" label={t("label")} />
            <h2 id="manifesto-title" className="sr-only">
              {t("title")}
            </h2>
            <div aria-hidden="true" className="hidden items-center gap-4 md:flex">
              <span className="relative h-32 w-px overflow-hidden bg-border-strong">
                <motion.span
                  className="absolute inset-0 origin-top bg-accent"
                  style={{ scaleY: reduced ? 1 : scrollYProgress }}
                />
              </span>
              <span className="label-mono flex flex-col gap-1 text-text-muted">
                <span>{t("progress")}</span>
                <span className="text-text tabular-nums">
                  <motion.span>{percent}</motion.span>%
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 md:col-span-9 md:gap-10">
          {parsed.map((words, index) => (
            <ManifestoParagraph key={index} words={words} reduced={reduced} />
          ))}

          <Reveal className="mt-10 border-t border-border pt-10 md:mt-16 md:pt-14">
            <figure className="flex flex-col gap-6">
              <blockquote className="title-md max-w-[22ch] text-balance">
                <span className="text-accent">“</span>
                {t("quote")}
                <span className="text-accent">”</span>
              </blockquote>
              <figcaption className="label-mono text-text-muted">— {t("quoteAuthor")}</figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ManifestoParagraph({ words, reduced }: { words: Word[]; reduced: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.88", "end 0.6"] });
  const className =
    "text-[clamp(1.5rem,2.9vw,2.6rem)] leading-[1.22] font-semibold tracking-[-0.025em] text-pretty";

  if (reduced) {
    return (
      <p ref={ref} className={className}>
        {words.map((word, index) => (
          <span key={index}>
            <WordPieces word={word} />{" "}
          </span>
        ))}
      </p>
    );
  }

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <ManifestoWord
          key={index}
          word={word}
          progress={scrollYProgress}
          range={[index / words.length, (index + 1) / words.length]}
        />
      ))}
    </p>
  );
}

function ManifestoWord({
  word,
  progress,
  range,
}: {
  word: Word;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>
        <WordPieces word={word} />
      </motion.span>{" "}
    </>
  );
}
