"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE } from "@/lib/utils";

/** Foto com duotone preto/vermelho, revelação por máscara e parallax leve. */
export function AboutPhoto({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-7%", "7%"]);

  return (
    <div
      ref={ref}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] border border-border"
    >
      <motion.div className="duotone absolute -inset-[8%]" style={{ y }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 38vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover"
        />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 origin-top bg-accent"
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 1.1, ease: EASE }}
      />
      <span className="label-mono absolute bottom-4 left-4 rounded-full bg-bg/70 px-3 py-1.5 text-text backdrop-blur-md">
        Campinas · SP
      </span>
    </div>
  );
}
