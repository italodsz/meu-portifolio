"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Line,
  LineBasicMaterial,
  MathUtils,
  NormalBlending,
  SRGBColorSpace,
  type Sprite,
  type SpriteMaterial,
} from "three";
import { live, screenToCamera } from "./live";
import { sceneState } from "@/lib/scene-store";

const DISTANCE = 20;
const SEGMENT_POINTS = 40;
const DRAW_SECONDS = 2.2;

/** Posições das 5 estrelas (uma por projeto), em coordenadas de tela. */
const DESKTOP_POINTS: [number, number][] = [
  [0.2, 0.5],
  [0.38, 0.7],
  [0.56, 0.52],
  [0.72, 0.64],
  [0.88, 0.38],
];
const MOBILE_POINTS: [number, number][] = [
  [-0.72, 0.66],
  [-0.34, 0.84],
  [0.02, 0.7],
  [0.38, 0.86],
  [0.74, 0.68],
];

function glowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.12, "rgba(255,220,214,0.95)");
    gradient.addColorStop(0.35, "rgba(255,90,69,0.35)");
    gradient.addColorStop(1, "rgba(255,45,32,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/**
 * Constelação dos projetos: 5 estrelas ligadas por linhas que se desenham quando a seção
 * Projetos entra na tela. A estrela do card com hover pulsa e brilha mais.
 */
export function Constellation() {
  const sprites = useRef<(Sprite | null)[]>([]);
  const progress = useRef(0);
  const texture = useMemo(() => (typeof document === "undefined" ? null : glowTexture()), []);
  const line = useMemo(() => {
    const total = (DESKTOP_POINTS.length - 1) * SEGMENT_POINTS + 1;
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(total * 3), 3));
    geometry.setDrawRange(0, 0);
    const material = new LineBasicMaterial({
      color: new Color("#ff5a45"),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    const object = new Line(geometry, material);
    object.frustumCulled = false;
    return object;
  }, []);

  useEffect(
    () => () => {
      line.geometry.dispose();
      (line.material as LineBasicMaterial).dispose();
      texture?.dispose();
    },
    [line, texture],
  );

  useFrame(({ clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);
    // Só aparece de fato quando a seção Projetos está na tela (não na transição anterior).
    const visibility = Math.min(1, Math.max(0, (live.key.constellation - 0.6) / 0.4));
    const points = live.aspect < 1 ? MOBILE_POINTS : DESKTOP_POINTS;

    // As linhas se desenham quando a seção aparece e "apagam" quando ela sai.
    if (visibility > 0.5) progress.current = Math.min(1, progress.current + delta / DRAW_SECONDS);
    else if (visibility < 0.05) progress.current = 0;
    const drawn = live.reduced ? (visibility > 0.5 ? 1 : 0) : progress.current;

    const world = points.map(([x, y]) => screenToCamera(x, y, DISTANCE));
    const position = line.geometry.getAttribute("position") as BufferAttribute;
    let index = 0;
    for (let segment = 0; segment < world.length - 1; segment++) {
      const a = world[segment];
      const b = world[segment + 1];
      for (let step = 0; step < SEGMENT_POINTS; step++) {
        const t = step / SEGMENT_POINTS;
        position.setXYZ(index++, a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, -DISTANCE);
      }
    }
    const last = world[world.length - 1];
    position.setXYZ(index, last.x, last.y, -DISTANCE);
    position.needsUpdate = true;
    line.geometry.setDrawRange(0, Math.floor(drawn * (position.count - 1)) + (drawn > 0 ? 1 : 0));

    const lineMaterial = line.material as LineBasicMaterial;
    lineMaterial.opacity = visibility * MathUtils.lerp(0.55, 0.5, live.theme);
    const blending = live.theme > 0.5 ? NormalBlending : AdditiveBlending;
    if (lineMaterial.blending !== blending) {
      lineMaterial.blending = blending;
      lineMaterial.color.set(live.theme > 0.5 ? "#c41e15" : "#ff5a45");
      lineMaterial.needsUpdate = true;
    }

    const time = clock.elapsedTime;
    world.forEach((point, star) => {
      const sprite = sprites.current[star];
      if (!sprite) return;
      // Cada estrela acende quando a linha chega até ela.
      const reached = drawn >= star / (world.length - 1) - 0.001 ? 1 : 0.25;
      const hovered = sceneState.hoveredProject === star;
      const base = (live.mobile ? 0.55 : 0.7) * (hovered ? 2.1 : 1);
      const pulse = hovered && !live.reduced ? 1 + Math.sin(time * 6) * 0.18 : 1;
      const scale = MathUtils.damp(sprite.scale.x, base * pulse, 8, delta);
      sprite.scale.setScalar(scale);
      sprite.position.set(point.x, point.y, -DISTANCE + 0.01);
      const material = sprite.material as SpriteMaterial;
      material.opacity = visibility * reached * (hovered ? 1 : 0.85);
      const spriteBlending = live.theme > 0.5 ? NormalBlending : AdditiveBlending;
      if (material.blending !== spriteBlending) {
        material.blending = spriteBlending;
        material.color.set(live.theme > 0.5 ? "#c41e15" : "#ffffff");
        material.needsUpdate = true;
      }
    });
  });

  return (
    <group>
      <primitive object={line} />
      {DESKTOP_POINTS.map((_, star) => (
        <sprite
          key={star}
          ref={(sprite) => {
            sprites.current[star] = sprite;
          }}
          scale={0.7}
        >
          <spriteMaterial
            map={texture}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
            opacity={0}
          />
        </sprite>
      ))}
    </group>
  );
}
