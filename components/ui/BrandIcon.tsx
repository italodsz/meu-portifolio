import type { IconId } from "@/data/icons";
import { cn } from "@/lib/utils";

/** Ícone de marca referenciado do sprite estático /icons.svg (ver app/icons.svg/route.ts). */
export function BrandIcon({
  id,
  className,
  title,
}: {
  id: IconId;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={cn("size-[1em] shrink-0", className)}
    >
      <use href={`/icons.svg#icon-${id}`} />
    </svg>
  );
}
