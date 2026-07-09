"use client";

import { useState } from "react";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";

const { lat, lon } = site.geo;
const MAP_SRC = `https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=16&pt=${lon},${lat},pm2rdm`;

/** Заглушка — чертёжная сетка, а не скриншот карты: ни одного байта и ни одного запроса. */
function MapPlaceholder() {
  return (
    <svg
      aria-hidden="true"
      className="text-scale absolute inset-0 size-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0v32" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <circle cx="50%" cy="50%" r="5" className="fill-brass" />
      <circle
        cx="50%"
        cy="50%"
        r="22"
        fill="none"
        className="stroke-brass"
        strokeWidth="1"
      />
    </svg>
  );
}

export function MapSection() {
  const [showMap, setShowMap] = useState(false);

  return (
    <Section
      id="contacts"
      index="05"
      title="Как добраться"
      lead="Карта грузится по клику: iframe Яндекса весит больше, чем весь остальной лендинг."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <dl className="border-scale bg-anvil divide-scale divide-y rounded-sm border">
          <div className="p-6">
            <dt className="text-ash text-small tracking-wide uppercase">Адрес</dt>
            <dd className="mt-2">
              {site.address.street}, {site.address.city}
              <span className="text-ash mt-1 block text-small">
                {site.address.landmark}
              </span>
            </dd>
          </div>

          <div className="p-6">
            <dt className="text-ash text-small tracking-wide uppercase">Часы работы</dt>
            <dd className="mt-2 space-y-1">
              {site.hours.map((row) => (
                <div key={row.days} className="flex justify-between gap-4">
                  <span>{row.days}</span>
                  <span className="tnum text-ash">{row.time}</span>
                </div>
              ))}
            </dd>
          </div>

          <div className="p-6">
            <dt className="text-ash text-small tracking-wide uppercase">Телефон</dt>
            <dd className="mt-2">
              <a
                href={`tel:${site.phone}`}
                data-goal="phone_click"
                className="hover:text-brass transition-colors duration-200"
              >
                {site.phoneFormatted}
              </a>
            </dd>
          </div>
        </dl>

        <div className="border-scale relative min-h-80 overflow-hidden rounded-sm border lg:min-h-[28rem]">
          {showMap ? (
            <iframe
              src={MAP_SRC}
              title={`Карта: ${site.address.street}, ${site.address.city}`}
              loading="lazy"
              allowFullScreen
              className="absolute inset-0 size-full border-0"
            />
          ) : (
            <>
              <MapPlaceholder />
              <div className="absolute inset-0 grid place-items-center">
                <div className="bg-coal/80 flex flex-col items-center gap-4 rounded-sm p-6 text-center backdrop-blur-sm">
                  <p className="text-ash text-small">
                    {site.address.street}, {site.address.city}
                  </p>
                  <Button variant="ghost" onClick={() => setShowMap(true)}>
                    Показать карту
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Section>
  );
}
