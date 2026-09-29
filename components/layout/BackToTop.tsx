"use client";

import { useScrollTo } from "@/hooks/useScrollTo";
import { cn } from "@/lib/utils";

export function BackToTop({ label, className }: { label: string; className?: string }) {
  const scrollTo = useScrollTo();
  return (
    <button
      type="button"
      onClick={() => {
        scrollTo(0);
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
      className={cn(
        "group label-mono inline-flex items-center gap-2 transition-colors hover:text-accent",
        className,
      )}
    >
      {label}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-500 ease-(--ease-out-expo) group-hover:-translate-y-1"
      >
        ↑
      </span>
    </button>
  );
}
