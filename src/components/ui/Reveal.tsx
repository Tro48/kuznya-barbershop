"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/lib/reduced-motion";

/**
 * Появление секции: сдержанное и «тяжёлое». Кузнечный молот не порхает.
 *
 * При `prefers-reduced-motion: reduce` анимация не отключается, а схлопывается в
 * мгновенную смену состояния: убрать её целиком — значит оставить контент
 * невидимым, потому что стартовое состояние `opacity: 0`.
 *
 * Клиентский компонент, но `children` приходят пропом — серверные секции
 * остаются серверными.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  /** Стаггер по карточкам: 0.06s между элементами. Больше — начинает раздражать. */
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={
        reduceMotion ? { duration: 0 } : { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Шаг стаггера. В одном месте, чтобы карточки во всех секциях дышали одинаково. */
export const STAGGER = 0.06;
