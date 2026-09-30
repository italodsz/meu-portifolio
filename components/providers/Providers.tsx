"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";
import { SmoothScroll } from "./SmoothScroll";
import { RouteScroll } from "./RouteScroll";
import { EASE } from "@/lib/utils";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      themes={["dark", "light"]}
    >
      <MotionConfig reducedMotion="user" transition={{ duration: 0.7, ease: EASE }}>
        <SmoothScroll>
          <RouteScroll />
          {children}
        </SmoothScroll>
      </MotionConfig>
    </ThemeProvider>
  );
}
