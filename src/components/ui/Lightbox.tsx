"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "@/lib/reduced-motion";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/** `createPortal` требует `document`. На сервере его нет, поэтому первый рендер — пустой. */
const noopSubscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

/** Ширина скроллбара: без компенсации страница дёргается в момент блокировки. */
function lockBodyScroll(): () => void {
  const { body, documentElement } = document;
  const scrollbar = window.innerWidth - documentElement.clientWidth;
  const prevOverflow = body.style.overflow;
  const prevPadding = body.style.paddingRight;

  body.style.overflow = "hidden";
  if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

  return () => {
    body.style.overflow = prevOverflow;
    body.style.paddingRight = prevPadding;
  };
}

type LightboxProps = {
  open: boolean;
  onClose: () => void;
  /** Доступное имя диалога — читается скринридером при открытии. */
  label: string;
  children: ReactNode;
  /** Стрелки листают галерею; лайтбокс сам о содержимом ничего не знает. */
  onPrev?: () => void;
  onNext?: () => void;
};

/**
 * Диалог поверх страницы: закрытие по `Esc` и клику по фону, ловушка фокуса
 * внутри, возврат фокуса на элемент, с которого открывали.
 * Написан переиспользуемым — пригодится в следующем проекте.
 */
export function Lightbox({
  open,
  onClose,
  label,
  children,
  onPrev,
  onNext,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const isClient = useIsClient();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    openerRef.current = document.activeElement as HTMLElement | null;
    const unlock = lockBodyScroll();
    dialogRef.current?.focus();

    return () => {
      unlock();
      // Фокус возвращается на карточку, с которой открывали, а не улетает в body.
      openerRef.current?.focus();
    };
  }, [open]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key === "ArrowLeft" && onPrev) {
        onPrev();
        return;
      }
      if (event.key === "ArrowRight" && onNext) {
        onNext();
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose, onPrev, onNext],
  );

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          className="bg-coal/95 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm md:p-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className="relative flex max-h-full w-full max-w-5xl flex-col outline-none"
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
