"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { MasterSlug } from "@/content/masters";
import type { ServiceSlug } from "@/content/services";

export const BOOKING_ANCHOR = "booking";

export type Prefill = {
  service?: ServiceSlug;
  master?: MasterSlug;
};

type BookingContextValue = {
  prefill: (values: Prefill) => void;
  /** Меняется на каждый клик — форма реагирует даже на повторный выбор той же услуги. */
  request: { values: Prefill; nonce: number } | null;
};

const BookingContext = createContext<BookingContextValue | null>(null);

/**
 * Состояние поднято сюда, а не в Zustand: на лендинге его ровно столько, сколько
 * помещается в один `useState`. Zustand появится в проекте «Проявка», где оправдан.
 */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<BookingContextValue["request"]>(null);

  const prefill = useCallback((values: Prefill) => {
    setRequest((current) => ({ values, nonce: (current?.nonce ?? 0) + 1 }));

    const form = document.getElementById(BOOKING_ANCHOR);
    form?.scrollIntoView({ block: "start" });
  }, []);

  const value = useMemo(() => ({ prefill, request }), [prefill, request]);

  return <BookingContext value={value}>{children}</BookingContext>;
}

export function useBooking(): BookingContextValue {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking вызван вне BookingProvider");
  return context;
}
