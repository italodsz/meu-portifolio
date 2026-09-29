import { cn } from "@/lib/utils";

/** Seta ↗ em SVG (herda a cor do texto). Gira no hover do elemento pai com classe `group`. */
export function ArrowUpRight({
  className,
  rotate = true,
}: {
  className?: string;
  rotate?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(
        "size-[1em] shrink-0 transition-transform duration-500 ease-(--ease-out-expo)",
        rotate && "group-hover:rotate-45 group-focus-visible:rotate-45",
        className,
      )}
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
