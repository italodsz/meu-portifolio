import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 font-mono text-[0.6875rem] tracking-wider text-text-muted uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
