"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { useBooking } from "@/components/booking/BookingContext";
import { site, telHref } from "@/lib/site";

export function Hero() {
  const { prefill } = useBooking();

  return (
    /* 100svh, не 100vh: на мобильном vh считает адресную строку и герой уезжает за экран. */
    <section id="top" className="relative flex min-h-svh flex-col justify-end pt-20">
      <Image
        src="/images/hero.webp"
        alt="Зал барбершопа «Кузня»: кресла у зеркал, приглушённый свет"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Скрим держит контраст текста на любом кадре фотографии, а не «обычно». */}
      <div
        aria-hidden="true"
        className="from-coal via-coal/85 to-coal/30 absolute inset-0 bg-gradient-to-t"
      />

      <Container className="relative pb-16 md:pb-24">
        <h1 className="max-w-4xl">
          <span className="text-ash mb-6 block text-small tracking-[0.24em] uppercase">
            Барбершоп «{site.name}» · Санкт-Петербург
          </span>
          <span className="text-hero block uppercase">{site.slogan}</span>
        </h1>

        <p className="text-ash mt-8 max-w-xl text-balance">
          Стрижка, борода и опасная бритва. Записываетесь за минуту — администратор
          перезванивает в течение пятнадцати.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button onClick={() => prefill({})}>Записаться</Button>
          <a
            href={telHref}
            data-goal="phone_click"
            className="hover:text-brass border-scale hover:border-brass inline-flex h-12 items-center rounded-sm border px-6 tracking-wide transition-colors duration-200"
          >
            {site.phoneFormatted}
          </a>
        </div>
      </Container>
    </section>
  );
}
