import { Fragment, type CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { LitParagraph } from "./LitParagraph";
import { ManifestoProgress } from "./ManifestoProgress";

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

/**
 * Manifesto: cada palavra começa apagada (text-dim) e acende para text/accent conforme o scroll.
 * As palavras são HTML do servidor; só o progresso de cada parágrafo (--p) vem do cliente.
 */
export async function Manifesto() {
  const t = await getTranslations("Manifesto");
  const paragraphs = (t.raw("paragraphs") as string[]).map(parseWords);

  return (
    <section id="manifesto" aria-labelledby="manifesto-title" className="relative py-28 md:py-40">
      <div className="container-site grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-3">
          <div className="flex flex-col gap-6 md:sticky md:top-28">
            <SectionLabel number="02" label={t("label")} />
            <h2 id="manifesto-title" className="sr-only">
              {t("title")}
            </h2>
            <ManifestoProgress label={t("progress")} targetId="manifesto-text" />
          </div>
        </div>

        <div id="manifesto-text" className="flex flex-col gap-8 md:col-span-9 md:gap-10">
          {paragraphs.map((words, paragraphIndex) => (
            <LitParagraph
              key={paragraphIndex}
              count={words.length}
              className="text-[clamp(1.5rem,2.9vw,2.6rem)] leading-[1.22] font-semibold tracking-[-0.025em] text-pretty"
            >
              {words.map((word, index) => (
                <Fragment key={index}>
                  <span className="lit-word" style={{ "--i": index } as CSSProperties}>
                    {word.map((piece, pieceIndex) =>
                      piece.accent ? (
                        <span key={pieceIndex} className="lit-accent">
                          {piece.text}
                        </span>
                      ) : (
                        piece.text
                      ),
                    )}
                  </span>{" "}
                </Fragment>
              ))}
            </LitParagraph>
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
