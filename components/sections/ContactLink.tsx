"use client";

import { motion } from "motion/react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { ArrowUpRight } from "@/components/ui/ArrowUpRight";
import { BrandIcon } from "@/components/ui/BrandIcon";
import type { IconId } from "@/data/icons";

type ContactLinkProps = {
  href: string;
  label: string;
  value: string;
  icon?: IconId;
  external?: boolean;
};

/** Linha grande de contato: preenchimento que cresce no hover e seta magnética. */
export function ContactLink({ href, label, value, icon, external = true }: ContactLinkProps) {
  const { ref, x, y, onPointerMove, onPointerLeave } = useMagnetic<HTMLAnchorElement>(0.12);

  return (
    <motion.a
      ref={ref}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="group relative flex items-center justify-between gap-6 overflow-hidden border-b border-border py-6 sm:pl-3 md:py-8"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-y-100"
      />
      <span className="relative flex min-w-0 items-center gap-4 md:gap-8">
        <span className="label-mono hidden w-24 shrink-0 text-text-muted transition-colors duration-500 group-hover:text-on-accent sm:block">
          {label}
        </span>
        <span className="flex min-w-0 items-center gap-3 text-[clamp(1.35rem,4.2vw,3.25rem)] leading-none font-bold tracking-tight transition-[color,transform] duration-500 group-hover:translate-x-2 group-hover:text-on-accent md:gap-4">
          {icon && <BrandIcon id={icon} className="size-[0.7em] shrink-0" />}
          <span className="truncate">{value}</span>
        </span>
      </span>
      <motion.span
        style={{ x, y }}
        className="relative text-[clamp(1.5rem,3.5vw,2.75rem)] transition-colors duration-500 group-hover:text-on-accent"
      >
        <ArrowUpRight />
      </motion.span>
    </motion.a>
  );
}
