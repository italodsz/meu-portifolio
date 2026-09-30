"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { useLenis } from "lenis/react";
import { markIntroDone, PRELOADER_KEY } from "@/lib/intro";

const noop = () => () => {};

/** Já rodou nesta página (ex.: ao trocar de idioma o layout remonta, mas não repetimos). */
let shownThisPage = false;

const LIFT_ANIMATION = "preloader-lift";

/**
 * Contador 000 → 100 e cortina vermelha que sobe revelando o hero (≈ 2 s no total).
 *
 * A animação é 100% CSS (ver .preloader em globals.css), então começa na primeira pintura,
 * sem esperar o JavaScript. Este componente só:
 * - sincroniza a revelação do hero com o início da subida da cortina;
 * - trava o scroll enquanto a cortina está na tela;
 * - marca a sessão para não repetir o preloader.
 * Só na primeira visita da sessão; pulado com prefers-reduced-motion (script inline no layout).
 */
export function Preloader() {
  const t = useTranslations("Preloader");
  const ref = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const lenis = useLenis();
  // O script inline marca <html data-preloaded> quando o preloader deve ser pulado.
  const skip = useSyncExternalStore(
    noop,
    () => Boolean(document.documentElement.dataset.preloaded) || shownThisPage,
    () => false,
  );

  // Trava o scroll (Lenis no desktop; wheel/touch no mobile) enquanto a cortina cobre a tela.
  useEffect(() => {
    if (skip || done) return;
    lenis?.stop();
    const block = (event: Event) => event.preventDefault();
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    return () => {
      lenis?.start();
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
    };
  }, [skip, done, lenis]);

  useEffect(() => {
    const element = ref.current;
    if (skip || !element) return;

    const finish = () => {
      shownThisPage = true;
      markIntroDone();
      try {
        sessionStorage.setItem(PRELOADER_KEY, "1");
      } catch {}
      setDone(true);
    };

    const lift = element
      .getAnimations()
      .find((animation) => (animation as CSSAnimation).animationName === LIFT_ANIMATION);
    if (!lift) {
      // Navegador sem suporte à animação: libera o hero direto.
      finish();
      return;
    }

    // Revela o hero quando a cortina começa a subir (ou já, se a hidratação chegou tarde).
    const delay = Number(lift.effect?.getTiming().delay ?? 0);
    const elapsed = Number(lift.currentTime ?? 0);
    let timer: number | undefined;
    if (elapsed >= delay) markIntroDone();
    else timer = window.setTimeout(markIntroDone, delay - elapsed);

    let cancelled = false;
    lift.finished.then(() => !cancelled && finish()).catch(() => {});
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [skip]);

  if (skip || done) return null;

  return (
    <div ref={ref} className="preloader" role="status" aria-live="polite">
      <span className="label-mono">{t("loading")}</span>
      <span className="preloader-count" aria-hidden="true" />
    </div>
  );
}
