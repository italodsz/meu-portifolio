import { createKey, type SceneKey } from "./narrative";

/**
 * Estado "ao vivo" da cena, atualizado uma vez por frame pelo SceneController
 * e lido pelos outros componentes 3D no useFrame (sem re-render do React).
 */
export const live: {
  key: SceneKey;
  target: SceneKey;
  /** Mouse suavizado (−1 a 1). */
  pointer: { x: number; y: number };
  /** Progresso do scroll da página inteira (0 a 1), suavizado. */
  scroll: number;
  /** 0 = tema escuro, 1 = tema claro (suavizado). */
  theme: number;
  /** Campo de visão vertical e proporção da câmera. */
  fov: number;
  aspect: number;
  reduced: boolean;
  mobile: boolean;
} = {
  key: createKey(),
  target: createKey(),
  pointer: { x: 0, y: 0 },
  scroll: 0,
  theme: 0,
  fov: 45,
  aspect: 16 / 9,
  reduced: false,
  mobile: false,
};

/** Converte coordenadas de tela (−1 a 1) para o espaço da câmera a uma distância. */
export function screenToCamera(x: number, y: number, distance: number) {
  const halfHeight = Math.tan((live.fov * Math.PI) / 360) * distance;
  const halfWidth = halfHeight * live.aspect;
  return { x: x * halfWidth, y: y * halfHeight, halfHeight };
}
