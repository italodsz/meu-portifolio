"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useIntroDone } from "@/lib/intro";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

// Three.js só é baixado no cliente, depois do conteúdo principal.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

const noop = () => () => {};

/**
 * Decide se a cena 3D entra: espera a intro terminar e o navegador ficar ocioso.
 * Sem WebGL, fica só o céu em CSS (gradiente radial vermelho + estrelas).
 */
export function SceneLoader() {
  const introDone = useIntroDone();
  const reduced = useReducedMotion();
  const mobile = useMediaQuery("(max-width: 767px), (pointer: coarse)", false);
  const { resolvedTheme } = useTheme();
  const webgl = useSyncExternalStore(noop, hasWebGL, () => false);
  const [idle, setIdle] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!introDone || !webgl) return;
    const start = () => setIdle(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 1800 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(start, 600);
    return () => window.clearTimeout(id);
  }, [introDone, webgl]);

  return (
    <>
      <div aria-hidden="true" className="css-sky" />
      {idle && (
        <div
          aria-hidden="true"
          className={cn(
            "fixed inset-0 z-0 transition-opacity duration-[1400ms] ease-(--ease-out-expo)",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <Scene
            theme={resolvedTheme === "light" ? "light" : "dark"}
            mobile={mobile}
            reduced={reduced}
            onReady={() => requestAnimationFrame(() => setReady(true))}
          />
        </div>
      )}
    </>
  );
}
