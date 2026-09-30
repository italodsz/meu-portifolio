import { cn } from "@/lib/utils";

/** Logo "ÍS." com o ponto em vermelho. */
export function Logo({ className, size = "sm" }: { className?: string; size?: "sm" | "lg" }) {
  return (
    <span
      className={cn(
        "font-sans font-extrabold tracking-tight",
        size === "lg" ? "text-4xl" : "text-xl",
        className,
      )}
    >
      ÍS<span className="text-accent">.</span>
    </span>
  );
}
