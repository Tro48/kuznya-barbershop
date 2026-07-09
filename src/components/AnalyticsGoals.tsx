"use client";

import { useEffect } from "react";
import { reachGoal } from "@/lib/analytics";

/**
 * Один делегированный слушатель вместо onClick на каждой ссылке: цель объявляется
 * в разметке атрибутом `data-goal`, а не тянет обработчик через полдерева.
 *
 * `form_submit_success` шлёт сама форма — после ответа сервера, а не по клику.
 */
export function AnalyticsGoals() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const goal = target?.closest<HTMLElement>("[data-goal]")?.dataset.goal;
      if (goal) reachGoal(goal);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
