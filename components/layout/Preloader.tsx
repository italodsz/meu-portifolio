"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { animate, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { markIntroDone, PRELOADER_KEY } from "@/lib/intro";
import { EASE } from "@/lib/utils";

const COUNT_DURATION = 1.25;
const CURTAIN_DURATION = 0.8;
const noop = () => () => {};

/**
 * Contador 000 → 100 e cortina vermelha que sobe revelando o hero.
 * Só na primeira visita da sessão; pulado com prefers-reduced-motion (ver script inline no layout).
 * Duração total ≈ 2,1 s.
 */
export function Preloader() {
  const t = useTranslations("Preloader");
  const counterRef = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<"count" | "lift" | "done">("count");
  // Lido uma vez na hidratação: o script inline marca <html data-preloaded> quando deve pular.
  const skip = useSyncExternalStore(
    noop,
    () => Boolean(document.documentElement.dataset.preloaded),
    () => false,
  );

  useEffect(() => {
    if (skip) return;
    const lenisRoot = document.documentElement;
    lenisRoot.style.overflow = "hidden";

    const controls = animate(0, 100, {
      duration: COUNT_DURATION,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (value) => {
        if (counterRef.current)
          counterRef.current.textContent = String(Math.round(value)).padStart(3, "0");
      },
      onComplete: () => {
        setPhase("lift");
        markIntroDone();
        try {
          sessionStorage.setItem(PRELOADER_KEY, "1");
        } catch {}
      },
    });
    return () => {
      controls.stop();
      lenisRoot.style.overflow = "";
    };
  }, [skip]);

  if (skip || phase === "done") return null;

  return (
    <motion.div
      className="preloader fixed inset-0 z-[100] flex items-end justify-between bg-accent p-4 text-on-accent sm:p-8"
      initial={{ y: "0%" }}
      animate={phase === "lift" ? { y: "-100%" } : { y: "0%" }}
      transition={{ duration: CURTAIN_DURATION, ease: EASE, delay: 0.05 }}
      onAnimationComplete={() => {
        if (phase === "lift") {
          document.documentElement.style.overflow = "";
          document.documentElement.dataset.preloaded = "1";
          setPhase("done");
        }
      }}
      role="status"
      aria-live="polite"
    >
      <span className="label-mono">{t("loading")}</span>
      <span
        ref={counterRef}
        className="font-mono text-[clamp(4rem,18vw,14rem)] leading-none font-medium tracking-tighter tabular-nums"
      >
        000
      </span>
    </motion.div>
  );
}
