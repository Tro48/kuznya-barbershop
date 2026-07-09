"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { site, telHref } from "@/lib/site";
import { Container } from "./Container";
import { useBooking } from "@/components/booking/BookingContext";

/**
 * Порог с гистерезисом: фон включается на 80px, выключается на 64px.
 * Один порог на оба направления заставляет шапку мигать, если остановиться ровно на нём.
 */
const SHOW_AT = 80;
const HIDE_AT = 64;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { prefill } = useBooking();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled((current) => (current ? y > HIDE_AT : y > SHOW_AT));
  });

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        scrolled ? "bg-coal/90 border-scale border-b backdrop-blur-md" : "bg-transparent",
      )}
    >
      <Container className="flex h-20 items-center justify-between gap-4">
        <a
          href="#top"
          className="font-display text-xl font-semibold tracking-[0.18em] uppercase"
        >
          {site.name}
        </a>

        <div className="flex items-center gap-3 md:gap-6">
          <a
            href={telHref}
            data-goal="phone_click"
            className="hover:text-brass hidden tracking-wide transition-colors duration-200 sm:block"
          >
            {site.phoneFormatted}
          </a>
          {/*
           * Пока герой на экране, латунь занята его кнопкой — здесь ghost.
           * Стоит герою уехать, эта кнопка становится единственным CTA и берёт латунь себе.
           */}
          <Button
            size="sm"
            variant={scrolled ? "primary" : "ghost"}
            onClick={() => prefill({})}
          >
            Записаться
          </Button>
        </div>
      </Container>
    </header>
  );
}
