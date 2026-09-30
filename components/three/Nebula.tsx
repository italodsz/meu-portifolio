"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Color, type Mesh, type ShaderMaterial } from "three";
import { nebulaFragment, nebulaVertex } from "./shaders/nebula";
import { live } from "./live";

/** Névoa vermelha quase imperceptível atrás das estrelas (só no tema escuro). */
export function Nebula() {
  const mesh = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0.1 },
      uColor: { value: new Color("#ff2d20") },
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (!material.current || !mesh.current) return;
    material.current.uniforms.uTime.value = live.reduced ? 0 : clock.elapsedTime;
    const opacity = 0.045 * (1 - live.theme);
    material.current.uniforms.uOpacity.value = opacity;
    mesh.current.visible = opacity > 0.002;
  });

  return (
    <mesh ref={mesh} position={[0, 12, -190]} rotation={[0.08, 0, 0]}>
      <planeGeometry args={[520, 320]} />
      <shaderMaterial
        ref={material}
        vertexShader={nebulaVertex}
        fragmentShader={nebulaFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}
