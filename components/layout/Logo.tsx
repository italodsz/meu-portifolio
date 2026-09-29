import { cn } from "@/lib/utils";

/** Logo "ÍS." com o ponto em vermelho. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-sans text-xl font-extrabold tracking-tight", className)}>
      ÍS<span className="text-accent">.</span>
    </span>
  );
}
