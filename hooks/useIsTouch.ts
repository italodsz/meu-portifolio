"use client";

import { useMediaQuery } from "./useMediaQuery";

/** true em telas de toque (sem hover fino). */
export function useIsTouch(): boolean {
  return useMediaQuery("(hover: none), (pointer: coarse)", false);
}

/** true em telas pequenas (mobile). */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)", false);
}
