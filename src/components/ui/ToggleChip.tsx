import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const base =
  "text-small cursor-pointer rounded-sm border px-4 py-2 tracking-wide " +
  "transition-colors duration-200";

const states = {
  active: "border-brass text-brass",
  idle: "border-scale text-ash hover:border-ash hover:text-chalk",
};

type ToggleChipProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "children" | "aria-pressed"
> & {
  active: boolean;
  children: ReactNode;
};

/**
 * Чип-переключатель: фильтр галереи, выбор удобного времени. Не ссылка и не
 * радиокнопка — `aria-pressed` сообщает скринридеру состояние, а не факт клика.
 */
export function ToggleChip({ active, children, ...props }: ToggleChipProps) {
  return (
    <button
      type="button"
      {...props}
      aria-pressed={active}
      className={cn(base, active ? states.active : states.idle)}
    >
      {children}
    </button>
  );
}
