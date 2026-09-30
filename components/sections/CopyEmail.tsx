"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { EASE } from "@/lib/utils";

export function CopyEmail({
  email,
  label,
  copiedLabel,
}: {
  email: string;
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeout.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Navegadores sem Clipboard API: seleciona via input temporário.
      const input = document.createElement("input");
      input.value = email;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-12 items-center gap-2 rounded-full border border-border-strong px-5 font-semibold transition-colors hover:border-accent hover:text-accent"
      >
        {copied ? (
          <Check aria-hidden="true" className="size-4" />
        ) : (
          <Copy aria-hidden="true" className="size-4" />
        )}
        {label}
      </button>
      <div
        aria-live="polite"
        className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2"
      >
        <AnimatePresence>
          {copied && (
            <motion.span
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="label-mono block rounded-full bg-accent px-4 py-2 whitespace-nowrap text-on-accent"
            >
              {copiedLabel}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
