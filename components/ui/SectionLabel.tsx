import { cn } from "@/lib/utils";

type SectionLabelProps = {
  number: string;
  label: string;
  className?: string;
};

/** Rótulo de seção no formato "01 / SOBRE". */
export function SectionLabel({ number, label, className }: SectionLabelProps) {
  return (
    <p className={cn("label-mono flex items-center gap-3 text-text-muted", className)}>
      <span className="text-accent-ink">{number}</span>
      <span aria-hidden="true" className="h-px w-8 bg-border-strong" />
      <span>{label}</span>
    </p>
  );
}
