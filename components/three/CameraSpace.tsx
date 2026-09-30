"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

/** Grupo que acompanha a câmera: os filhos ficam posicionados em coordenadas de tela. */
export function CameraSpace({ children }: { children: ReactNode }) {
  const group = useRef<Group>(null);
  useFrame(({ camera }) => {
    if (!group.current) return;
    group.current.position.copy(camera.position);
    group.current.quaternion.copy(camera.quaternion);
  });
  return <group ref={group}>{children}</group>;
}
