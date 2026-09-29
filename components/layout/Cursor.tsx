"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useTranslations } from "next-intl";
import { useIsTouch } from "@/hooks/useIsTouch";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type CursorState = "default" | "link" | "view";

/**
 * Cursor customizado: círculo com mix-blend-mode difference que cresce sobre links e mostra
 * "Ver" sobre cards de projeto (elementos com data-cursor="view"). Desligado em telas de toque.
 */
export function Cursor() {
  const isTouch = useIsTouch();
  const reduced = useReducedMotion();
  if (isTouch) return null;
  return <CursorDot reduced={reduced} />;
}

function CursorDot({ reduced }: { reduced: boolean }) {
  const t = useTranslations("Cursor");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const spring = reduced
    ? { stiffness: 2000, damping: 100 }
    : { stiffness: 500, damping: 40, mass: 0.35 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const [state, setState] = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("has-custom-cursor");
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("[data-cursor='view']")) setState("view");
      else if (target?.closest("a, button, [role='button'], input, label, summary"))
        setState("link");
      else setState("default");
    };
    const onLeave = () => setVisible(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y]);

  // Anima só scale/opacity (o círculo tem 88px e é reduzido).
  const scale = state === "view" ? 1 : state === "link" ? 48 / 88 : 14 / 88;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[90] mix-blend-difference"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="-mt-11 -ml-11 grid size-22 place-items-center rounded-full bg-white"
        initial={false}
        animate={{ scale, opacity: visible ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <AnimatePresence>
          {state === "view" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="label-mono text-black"
            >
              {t("view")}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
