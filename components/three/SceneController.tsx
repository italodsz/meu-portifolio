"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, MathUtils, type PerspectiveCamera } from "three";
import { live } from "./live";
import {
  measureAnchors,
  REDUCED,
  REDUCED_PORTRAIT,
  targetFor,
  type Anchor,
  type SceneKey,
} from "./narrative";
import { sceneState } from "@/lib/scene-store";

const DARK_BG = new Color("#0a0a0a");
const LIGHT_BG = new Color("#f4f1ec");

type Props = { theme: "dark" | "light"; mobile: boolean; reduced: boolean };

/**
 * Lê o scroll e o mouse, calcula o estado-alvo da narrativa e suaviza tudo.
 * Também move a câmera (afastamento e inclinação) e ajusta a cor de fundo pelo tema.
 */
export function SceneController({ theme, mobile, reduced }: Props) {
  const anchors = useRef<Anchor[]>([]);
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const scene = useThree((state) => state.scene);
  const invalidate = useThree((state) => state.invalidate);
  const background = useRef(new Color(theme === "light" ? LIGHT_BG : DARK_BG));
  const themeTarget = theme === "light" ? 1 : 0;

  useEffect(() => {
    live.mobile = mobile;
    live.reduced = reduced;
    scene.background = background.current;
  }, [mobile, reduced, scene]);

  useEffect(() => {
    if (reduced) {
      live.theme = themeTarget;
      background.current.copy(themeTarget ? LIGHT_BG : DARK_BG);
      invalidate();
    }
  }, [reduced, themeTarget, invalidate]);

  // Mede as seções no carregamento e sempre que a página muda de tamanho.
  useEffect(() => {
    const measure = () => {
      anchors.current = measureAnchors(window.innerHeight);
      invalidate();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [invalidate]);

  // Mouse (desktop e sem reduced motion).
  useEffect(() => {
    if (mobile || reduced) return;
    const onMove = (event: PointerEvent) => {
      sceneState.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mobile, reduced]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);
    live.fov = camera.fov;
    live.aspect = camera.aspect;

    const target: SceneKey = reduced
      ? Object.assign(live.target, camera.aspect < 1 ? REDUCED_PORTRAIT : REDUCED)
      : targetFor(window.scrollY, anchors.current, camera.aspect < 1, live.target);

    const key = live.key;
    const lambda = reduced ? 100 : 3.2;
    for (const name of Object.keys(target) as (keyof SceneKey)[]) {
      key[name] = MathUtils.damp(key[name], target[name], lambda, delta);
    }

    const max = document.documentElement.scrollHeight - window.innerHeight;
    const scroll = reduced || max <= 0 ? 0 : window.scrollY / max;
    live.scroll = MathUtils.damp(live.scroll, scroll, 4, delta);
    live.pointer.x = MathUtils.damp(live.pointer.x, sceneState.pointer.x, 2.5, delta);
    live.pointer.y = MathUtils.damp(live.pointer.y, sceneState.pointer.y, 2.5, delta);
    live.theme = MathUtils.damp(live.theme, themeTarget, 4, delta);

    background.current.lerpColors(DARK_BG, LIGHT_BG, live.theme);

    camera.position.set(live.pointer.x * 0.35, live.pointer.y * 0.2, key.camZ);
    camera.rotation.set(key.tilt + live.pointer.y * 0.015, -live.pointer.x * 0.02, 0);
  }, -1);

  return null;
}
