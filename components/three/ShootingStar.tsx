"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Color, type Mesh, type ShaderMaterial } from "three";
import { streakFragment, streakVertex } from "./shaders/streak";
import { live, screenToCamera } from "./live";

const DISTANCE = 30;

type Flight = {
  start: number;
  duration: number;
  from: { x: number; y: number };
  angle: number;
  travel: number;
  length: number;
};

/** Estrela cadente ocasional (a cada 8–15 s, em posição e direção aleatórias). */
export function ShootingStar() {
  const mesh = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);
  const next = useRef(-1);
  const flight = useRef<Flight | null>(null);
  const uniforms = useMemo(
    () => ({ uOpacity: { value: 0 }, uColor: { value: new Color("#ffd2cc") } }),
    [],
  );

  useFrame(({ clock }) => {
    const current = mesh.current;
    if (!current || !material.current) return;
    const time = clock.elapsedTime;
    if (next.current < 0) next.current = time + 4 + Math.random() * 4;

    if (live.reduced || live.theme > 0.5) {
      current.visible = false;
      return;
    }

    if (!flight.current && time >= next.current) {
      const goingLeft = Math.random() < 0.5;
      flight.current = {
        start: time,
        duration: 0.9 + Math.random() * 0.5,
        from: {
          x: Math.random() * 1.2 - 0.6 + (goingLeft ? 0.3 : -0.3),
          y: 0.35 + Math.random() * 0.55,
        },
        angle: goingLeft ? Math.PI + 0.35 + Math.random() * 0.35 : -0.35 - Math.random() * 0.35,
        travel: 0.55 + Math.random() * 0.4,
        length: 3 + Math.random() * 3,
      };
    }

    const active = flight.current;
    if (!active) {
      current.visible = false;
      return;
    }

    const t = (time - active.start) / active.duration;
    if (t >= 1) {
      flight.current = null;
      next.current = time + 8 + Math.random() * 7;
      current.visible = false;
      return;
    }

    const eased = 1 - Math.pow(1 - t, 2);
    const head = screenToCamera(
      active.from.x + Math.cos(active.angle) * active.travel * eased,
      active.from.y + Math.sin(active.angle) * active.travel * eased,
      DISTANCE,
    );
    const length = active.length * Math.min(1, t * 3);
    current.visible = true;
    current.rotation.set(0, 0, active.angle);
    current.scale.set(length, 0.05, 1);
    current.position.set(
      head.x - (Math.cos(active.angle) * length) / 2,
      head.y - (Math.sin(active.angle) * length) / 2,
      -DISTANCE,
    );
    material.current.uniforms.uOpacity.value = Math.sin(Math.PI * t) * 0.9;
  });

  return (
    <mesh ref={mesh} visible={false} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={streakVertex}
        fragmentShader={streakFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}
