/**
 * Estado compartilhado entre o DOM e a cena 3D, sem re-render do React.
 * A cena lê estes valores dentro do useFrame.
 */
export const sceneState = {
  /** Índice do card de projeto com hover (−1 = nenhum). */
  hoveredProject: -1,
  /** Posição do mouse normalizada (−1 a 1). */
  pointer: { x: 0, y: 0 },
};

export function setHoveredProject(index: number) {
  sceneState.hoveredProject = index;
}
