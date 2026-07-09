"use client";

import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Reveal, STAGGER } from "@/components/ui/Reveal";
import { useBooking } from "@/components/booking/BookingContext";
import { services } from "@/content/services";
import { formatDuration, formatPrice } from "@/lib/format";

export function Services() {
  const { prefill } = useBooking();

  return (
    <Section
      id="services"
      index="01"
      title="Услуги"
      lead="Цена «от» — за работу мастера без надбавок за время и день недели. Итог называем до начала, а не после."
    >
      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <li key={service.slug} className="h-full">
            <Reveal delay={index * STAGGER} className="h-full">
              {/* Тени не используем: на угольном фоне глубину даёт граница и поверхность светлее. */}
              <article className="border-scale bg-anvil hover:border-brass flex h-full flex-col rounded-sm border p-6 transition-colors duration-200 md:p-8">
                <h3 className="text-h3 uppercase">{service.title}</h3>

                <p className="text-ash text-small mt-3 flex-1">{service.description}</p>

                <div className="border-scale mt-6 flex items-baseline justify-between border-t pt-5">
                  <span className="tnum font-display text-xl font-semibold">
                    от {formatPrice(service.priceFrom)}
                  </span>
                  <span className="tnum text-ash text-small">
                    {formatDuration(service.durationMin)}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-5 w-full"
                  onClick={() => prefill({ service: service.slug })}
                >
                  Записаться
                  <span className="sr-only"> на услугу «{service.title}»</span>
                </Button>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
