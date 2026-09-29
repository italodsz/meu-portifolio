"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { EASE } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  show: (stagger: number = 0.07) => ({ transition: { staggerChildren: stagger } }),
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "ul" | "ol" | "div";
};

/** Container que anima os filhos (StaggerItem) em sequência ao entrar na tela. */
export function Stagger({ children, className, stagger = 0.07, as = "div" }: StaggerProps) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      variants={container}
      custom={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "li" | "div" | "span";
}) {
  const Component = motion[as];
  return (
    <Component className={className} variants={item}>
      {children}
    </Component>
  );
}
