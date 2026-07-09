"use client";

import { useSyncExternalStore } from "react";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Синхронное чтение — нужно там, где решение принимается в layout-эффекте, до отрисовки. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Свой хук вместо `useReducedMotion` из motion: тот читает медиа-запрос один раз
 * при первом рендере и не реагирует на смену системной настройки. Здесь подписка
 * живая, а поведение проверяемо в Playwright с `reducedMotion: "reduce"`.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}
