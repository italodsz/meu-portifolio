/** Tons de vermelho (do mais forte ao mais fraco) para gráficos segmentados. */
export function sliceColor(index: number): string {
  const strength = Math.max(18, 100 - index * 14);
  return `color-mix(in srgb, var(--accent) ${strength}%, var(--surface-2))`;
}
