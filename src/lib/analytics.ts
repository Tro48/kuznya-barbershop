declare global {
  interface Window {
    ym?: (id: number, action: string, goal: string) => void;
  }
}

export const YM_COUNTER_ID = Number(process.env.NEXT_PUBLIC_YM_ID) || 0;

/**
 * Цель отправляем **после успешного ответа сервера**, а не по клику на кнопку —
 * иначе в статистику попадут неудачные отправки.
 */
export function reachGoal(goal: string): void {
  if (typeof window === "undefined" || !window.ym || !YM_COUNTER_ID) return;
  window.ym(YM_COUNTER_ID, "reachGoal", goal);
}
