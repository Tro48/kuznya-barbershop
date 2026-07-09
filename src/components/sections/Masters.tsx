"use client";

import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { useBooking } from "@/components/booking/BookingContext";
import { masters } from "@/content/masters";

/** «12 лет» — не «12 год». Три формы, потому что русский. */
function yearsLabel(years: number): string {
  const mod10 = years % 10;
  const mod100 = years % 100;
  if (mod10 === 1 && mod100 !== 11) return "год";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "года";
  return "лет";
}

export function Masters() {
  const { prefill } = useBooking();

  return (
    <Section
      id="masters"
      index="03"
      title="Мастера"
      lead="Стрижёт человек, а не барбершоп. Поэтому — с именами, стажем и специализацией."
    >
      <ul className="grid gap-6 md:grid-cols-3">
        {masters.map((master) => (
          <li key={master.slug}>
            <article className="border-scale bg-anvil hover:border-brass flex h-full flex-col overflow-hidden rounded-sm border transition-colors duration-200">
              <div className="relative aspect-4/5">
                <Image
                  src={master.photo}
                  alt={master.photoAlt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-h3 uppercase">{master.name}</h3>

                <p className="tnum text-ash mt-2 text-small">
                  {master.experienceYears} {yearsLabel(master.experienceYears)} в профессии
                  {" · "}
                  {master.specialization}
                </p>

                <blockquote className="border-scale text-ash mt-5 flex-1 border-l pl-4 text-small italic">
                  {master.quote}
                </blockquote>

                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-6 w-full"
                  onClick={() => prefill({ master: master.slug })}
                >
                  Записаться
                  <span className="sr-only"> к мастеру {master.name}</span>
                </Button>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
