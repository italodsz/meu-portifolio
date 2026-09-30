"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  BackSide,
  Color,
  MathUtils,
  Matrix3,
  Vector3,
  type Group,
  type Mesh,
  type ShaderMaterial,
} from "three";
import { haloFragment, haloVertex, moonFragment, moonVertex } from "./shaders/moon";
import { live, screenToCamera } from "./live";
import { bakeRelief } from "./bakeRelief";

const DISTANCE = 10;
const HALO_SCALE = 1.22;

/** Lua vermelha procedural com fase, rim light e halo. Fica no espaço da câmera. */
type MoonProps = {
  segments?: number;
  reliefSize?: number;
  /** Sem bloom (mobile) o halo aditivo fica bem mais forte, então é atenuado. */
  bloom?: boolean;
};

export function Moon({ segments = 96, reliefSize = 1024, bloom = true }: MoonProps) {
  const gl = useThree((state) => state.gl);
  const relief = useMemo(() => bakeRelief(gl, reliefSize), [gl, reliefSize]);
  useEffect(() => () => relief.dispose(), [relief]);
  const group = useRef<Group>(null);
  const tiltGroup = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);
  const haloMaterial = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uRelief: { value: relief.texture },
      uModelRot: { value: new Matrix3() },
      uEps: { value: 1.5 / reliefSize },
      uLightDir: { value: new Vector3(0.42, 0.48, 0.77).normalize() },
      uColorLow: { value: new Color("#2e0604") },
      uColorHigh: { value: new Color("#e0503f") },
      uShadow: { value: new Color("#0d0101") },
      uRim: { value: new Color("#ff2d20") },
      uRimStrength: { value: 1.4 },
      uBump: { value: 0.22 },
      uFade: { value: 1 },
    }),
    [relief, reliefSize],
  );

  const haloUniforms = useMemo(
    () => ({
      uColor: { value: new Color("#ff2d20") },
      uStrength: { value: 0.9 },
      uEdge: { value: Math.sqrt(1 - 1 / (HALO_SCALE * HALO_SCALE)) },
    }),
    [],
  );

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);
    const key = live.key;
    const { x, y, halfHeight } = screenToCamera(key.moonX, key.moonY, DISTANCE);
    const radius = Math.max(0.001, key.moonR * halfHeight);

    if (group.current) {
      group.current.position.set(x, y, -DISTANCE);
      group.current.scale.setScalar(radius);
    }
    if (tiltGroup.current && !live.reduced) {
      // Inclina levemente seguindo o mouse (com amortecimento).
      tiltGroup.current.rotation.x = MathUtils.damp(
        tiltGroup.current.rotation.x,
        -live.pointer.y * 0.18,
        2,
        delta,
      );
      tiltGroup.current.rotation.z = MathUtils.damp(
        tiltGroup.current.rotation.z,
        live.pointer.x * 0.12,
        2,
        delta,
      );
    }
    if (mesh.current) {
      if (!live.reduced) mesh.current.rotation.y += delta * 0.035;
      mesh.current.updateMatrixWorld();
      if (material.current) {
        const rotation = material.current.uniforms.uModelRot.value as Matrix3;
        rotation.setFromMatrix4(mesh.current.matrixWorld);
      }
    }

    const light = live.theme;
    if (material.current) {
      material.current.uniforms.uFade.value = key.moonFade * MathUtils.lerp(1, 0.85, light);
      material.current.uniforms.uRimStrength.value =
        MathUtils.lerp(1.4, 0.6, light) * (bloom ? 1 : 0.6);
    }
    if (haloMaterial.current) {
      haloMaterial.current.uniforms.uStrength.value =
        key.moonFade * MathUtils.lerp(0.7, 0.12, light) * (bloom ? 1 : 0.35);
    }
  });

  return (
    <group ref={group}>
      <group ref={tiltGroup}>
        <mesh ref={mesh} rotation={[0.35, 0.8, 0.1]}>
          <sphereGeometry args={[1, segments, segments]} />
          <shaderMaterial
            ref={material}
            vertexShader={moonVertex}
            fragmentShader={moonFragment}
            uniforms={uniforms}
          />
        </mesh>
      </group>
      <mesh scale={HALO_SCALE} renderOrder={-1}>
        <sphereGeometry args={[1, 48, 48]} />
        <shaderMaterial
          ref={haloMaterial}
          vertexShader={haloVertex}
          fragmentShader={haloFragment}
          uniforms={haloUniforms}
          side={BackSide}
          blending={AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
