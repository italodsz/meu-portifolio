"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { EASE } from "@/lib/utils";

/**
 * Foto com duotone preto/vermelho, revelação por máscara e parallax leve.
 * O parallax usa scroll-driven animations do CSS (.parallax-frame/.parallax-media).
 */
export function AboutPhoto({ src, alt, label }: { src: string; alt: string; label: string }) {
  return (
    <div className="parallax-frame relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] border border-border">
      <div className="duotone parallax-media absolute -inset-[8%]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 38vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 origin-top bg-accent"
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 1.1, ease: EASE }}
      />
      <span className="label-mono absolute bottom-4 left-4 rounded-full bg-bg/70 px-3 py-1.5 text-text backdrop-blur-md">
        {label}
      </span>
    </div>
  );
}
