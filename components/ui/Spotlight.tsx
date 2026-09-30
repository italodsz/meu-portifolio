"use client";

import type { ReactNode, PointerEvent } from "react";
import { cn } from "@/lib/utils";

/** Atualiza --mx/--my no pointermove para o gradiente radial do spotlight (.spotlight). */
export function useSpotlightHandlers() {
  return {
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
      event.currentTarget.style.setProperty("--spot-opacity", "1");
    },
    onPointerLeave: (event: PointerEvent<HTMLElement>) => {
      event.currentTarget.style.setProperty("--spot-opacity", "0");
    },
  };
}

export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const handlers = useSpotlightHandlers();
  return (
    <div {...handlers} className={cn("card spotlight", className)}>
      {children}
    </div>
  );
}
