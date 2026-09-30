"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { SceneController } from "./SceneController";
import { CameraSpace } from "./CameraSpace";
import { Moon } from "./Moon";
import { Stars } from "./Stars";
import { Nebula } from "./Nebula";
import { ShootingStar } from "./ShootingStar";
import { Constellation } from "./Constellation";

export type SceneProps = {
  theme: "dark" | "light";
  mobile: boolean;
  reduced: boolean;
  onReady?: () => void;
};

/**
 * Canvas único, fixo e em tela cheia atrás do conteúdo.
 * Mobile: menos estrelas e sem pós-processamento. Reduced motion: renderiza só quando preciso.
 * O render pausa quando a aba não está visível.
 */
export default function Scene({ theme, mobile, reduced, onReady }: SceneProps) {
  const active = reduced ? "demand" : "always";
  const [frameloop, setFrameloop] = useState<"always" | "demand" | "never">(active);

  useEffect(() => {
    const update = () => setFrameloop(document.hidden ? "never" : active);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, [active]);

  return (
    <Canvas
      aria-hidden="true"
      frameloop={frameloop}
      dpr={[1, 1.5]}
      flat
      camera={{ fov: 38, near: 0.1, far: 600, position: [0, 0, 10] }}
      gl={{
        antialias: !mobile,
        alpha: false,
        stencil: false,
        powerPreference: "high-performance",
      }}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      onCreated={() => onReady?.()}
    >
      <SceneController theme={theme} mobile={mobile} reduced={reduced} />
      {!mobile && <Nebula />}
      <Stars count={mobile ? 1200 : 4000} />
      <CameraSpace>
        <Moon
          segments={mobile ? 64 : 96}
          reliefSize={mobile ? 512 : 1024}
          bloom={!mobile && theme === "dark"}
        />
        <Constellation />
        <ShootingStar />
      </CameraSpace>
      {!mobile && theme === "dark" && (
        <EffectComposer multisampling={0}>
          <Bloom
            mipmapBlur
            intensity={0.85}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.3}
            radius={0.72}
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}
