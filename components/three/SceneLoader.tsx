"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useIntroDone } from "@/lib/intro";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

// Three.js só é baixado no cliente, depois do conteúdo principal.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

let webglSupport: boolean | undefined;

const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render/i;

/**
 * Testa uma única vez se há WebGL com aceleração de hardware (criar contextos é caro e o
 * navegador limita a quantidade). Renderização por software (SwiftShader, llvmpipe) não
 * sustenta a cena a 60 fps, então nesses casos fica o céu em CSS.
 * Para testes, `?webgl=force` na URL ignora a checagem de hardware.
 */
function hasWebGL(): boolean {
  if (webglSupport !== undefined) return webglSupport;
  const force = new URLSearchParams(window.location.search).get("webgl") === "force";
  try {
    const canvas = document.createElement("canvas");
    const attributes: WebGLContextAttributes = { failIfMajorPerformanceCaveat: !force };
    const context =
      canvas.getContext("webgl2", attributes) ?? canvas.getContext("webgl", attributes);
    let hardware = Boolean(context);
    if (context && !force) {
      const info = context.getExtension("WEBGL_debug_renderer_info");
      const renderer = info ? String(context.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
      hardware = !SOFTWARE_RENDERER.test(renderer);
    }
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    webglSupport = hardware;
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

/**
 * Decide se a cena 3D entra: espera a intro terminar e a primeira interação (ou alguns segundos).
 * Sem WebGL acelerado por hardware, fica só o céu em CSS (gradiente radial vermelho + estrelas).
 */
export function SceneLoader() {
  const introDone = useIntroDone();
  const reduced = useReducedMotion();
  const mobile = useMediaQuery("(max-width: 767px), (pointer: coarse)", false);
  const { resolvedTheme } = useTheme();
  const [idle, setIdle] = useState(false);
  const [ready, setReady] = useState(false);

  // Carrega a cena na primeira interação (mouse, toque, scroll, teclado) ou alguns segundos
  // depois da intro — o que vier primeiro. Assim o 3D nunca disputa o carregamento inicial.
  useEffect(() => {
    if (!introDone) return;
    let done = false;
    let idleId: number | undefined;
    const events = [
      "pointermove",
      "pointerdown",
      "touchstart",
      "wheel",
      "keydown",
      "scroll",
    ] as const;
    const start = () => {
      if (done) return;
      done = true;
      cleanup();
      // Sem WebGL, a cena nunca entra e fica só o céu em CSS.
      const run = () => setIdle(hasWebGL());
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(run, { timeout: 800 });
      } else {
        window.setTimeout(run, 50);
      }
    };
    const timer = window.setTimeout(start, 4500);
    const cleanup = () => {
      window.clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, start));
    };
    events.forEach((event) => window.addEventListener(event, start, { passive: true, once: true }));
    return () => {
      done = true;
      cleanup();
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
    };
  }, [introDone]);

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
