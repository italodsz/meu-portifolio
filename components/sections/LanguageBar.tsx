"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/utils";
import { sliceColor } from "@/lib/colors";

export type LanguageSlice = { name: string; percent: number };

/** Barra horizontal segmentada; cada segmento cresce (scaleX) em sequência. */
export function LanguageBar({ slices, label }: { slices: LanguageSlice[]; label: string }) {
  return (
    <motion.div
      role="img"
      aria-label={label}
      className="flex h-4 w-full gap-1 overflow-hidden rounded-full bg-surface-2 md:h-5"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {slices.map((slice, index) => (
        <div key={slice.name} className="h-full min-w-1" style={{ width: `${slice.percent}%` }}>
          <motion.div
            className="h-full origin-left rounded-full"
            style={{ background: sliceColor(index) }}
            variants={{
              hidden: { scaleX: 0 },
              show: {
                scaleX: 1,
                transition: { duration: 0.9, ease: EASE, delay: 0.1 + index * 0.09 },
              },
            }}
          />
        </div>
      ))}
    </motion.div>
  );
}
