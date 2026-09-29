"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { cn } from "@/lib/utils";

/** Envolve um botão/link para que ele siga o mouse com mola. */
export function Magnetic({
  children,
  className,
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const { ref, x, y, onPointerMove, onPointerLeave } = useMagnetic<HTMLDivElement>(strength);
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.div>
  );
}
