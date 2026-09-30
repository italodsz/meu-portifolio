"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  NormalBlending,
  Vector2,
  type ShaderMaterial,
} from "three";
import { starsFragment, starsVertex } from "./shaders/stars";
import { live } from "./live";

/** Gerador pseudoaleatório com semente (o céu é sempre o mesmo). */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTE = [
  { color: new Color("#ff3b2f"), weight: 0.34 },
  { color: new Color("#ff6a5c"), weight: 0.26 },
  { color: new Color("#ffb3aa"), weight: 0.22 },
  { color: new Color("#ffd9d4"), weight: 0.12 },
  { color: new Color("#fff4f2"), weight: 0.06 },
];

const LAYERS = [
  { share: 0.2, min: 40, max: 60 },
  { share: 0.35, min: 70, max: 100 },
  { share: 0.45, min: 110, max: 160 },
];

function buildGeometry(count: number) {
  const random = mulberry32(20260930);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const speeds = new Float32Array(count);
  const layers = new Float32Array(count);

  let index = 0;
  LAYERS.forEach((layer, layerIndex) => {
    const amount =
      layerIndex === LAYERS.length - 1 ? count - index : Math.round(count * layer.share);
    for (let n = 0; n < amount; n++, index++) {
      // Direção aleatória concentrada à frente da câmera (−z), com folga para cima.
      const u = random() * 2 - 1;
      const theta = random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      let x = s * Math.cos(theta);
      let y = u;
      let z = s * Math.sin(theta);
      if (z > -0.15) z = -Math.abs(z) - 0.15;
      const length = Math.hypot(x, y, z);
      const radius = layer.min + random() * (layer.max - layer.min);
      x = (x / length) * radius;
      y = (y / length) * radius;
      z = (z / length) * radius;
      positions.set([x, y, z], index * 3);

      // Maioria pequena e fraca; poucas grandes e fortes.
      const brightness = Math.pow(random(), 7);
      sizes[index] =
        (1.1 + brightness * 5.5) * (layerIndex === 0 ? 1.15 : layerIndex === 1 ? 1 : 0.85);

      let pick = random();
      let color = PALETTE[0].color;
      for (const entry of PALETTE) {
        if (pick < entry.weight) {
          color = entry.color;
          break;
        }
        pick -= entry.weight;
      }
      colors.set([color.r, color.g, color.b], index * 3);
      phases[index] = random() * Math.PI * 2;
      speeds[index] = 0.6 + random() * 2.4;
      layers[index] = layerIndex;
    }
  });

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("aColor", new BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
  geometry.setAttribute("aPhase", new BufferAttribute(phases, 1));
  geometry.setAttribute("aSpeed", new BufferAttribute(speeds, 1));
  geometry.setAttribute("aLayer", new BufferAttribute(layers, 1));
  return geometry;
}

/** Céu estrelado vermelho com 3 camadas de profundidade, cintilação e parallax. */
export function Stars({ count }: { count: number }) {
  const material = useRef<ShaderMaterial>(null);
  const dpr = useThree((state) => state.viewport.dpr);
  const geometry = useMemo(() => buildGeometry(count), [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uTwinkle: { value: 1 },
      uParallax: { value: new Vector2() },
      uScroll: { value: 0 },
      uOpacity: { value: 1 },
      uLightMode: { value: 0 },
      uLightColor: { value: new Color("#a3170f") },
    }),
    [],
  );

  useFrame(({ clock }) => {
    const current = material.current;
    if (!current) return;
    const u = current.uniforms;
    u.uTime.value = live.reduced ? 0 : clock.elapsedTime;
    u.uPixelRatio.value = dpr;
    u.uTwinkle.value = live.reduced ? 0 : 1;
    if (live.reduced) u.uParallax.value.set(0, 0);
    else u.uParallax.value.set(live.pointer.x, live.pointer.y);
    u.uScroll.value = live.reduced ? 0 : live.scroll;
    u.uLightMode.value = live.theme;
    u.uOpacity.value = live.key.stars * (1 - live.theme * 0.45);
    const blending = live.theme > 0.5 ? NormalBlending : AdditiveBlending;
    if (current.blending !== blending) {
      current.blending = blending;
      current.needsUpdate = true;
    }
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={starsVertex}
        fragmentShader={starsFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
