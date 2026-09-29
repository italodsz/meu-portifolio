/** Junta classes condicionalmente (sem dependências externas). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Easing padrão do site. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function pad(value: number, length = 2): string {
  return String(value).padStart(length, "0");
}
