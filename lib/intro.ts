"use client";

import { useSyncExternalStore } from "react";

/**
 * Estado global "a intro terminou?" — o hero só anima depois que o preloader libera a tela.
 * Se o preloader já foi visto na sessão (ou reduced motion), o script inline em <head>
 * marca <html data-preloaded> e a intro é considerada concluída desde o início.
 */
let done = false;
const listeners = new Set<() => void>();

function readInitial() {
  if (typeof document !== "undefined" && document.documentElement.dataset.preloaded) done = true;
}

export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  readInitial();
  return done;
}

export function useIntroDone(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export const PRELOADER_KEY = "is-preloaded";

/** Script executado antes da pintura para decidir se o preloader aparece. */
export const preloaderScript = `try{if(sessionStorage.getItem("${PRELOADER_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.preloaded="1"}}catch(e){document.documentElement.dataset.preloaded="1"}`;
