"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { Section } from "@/components/layout/Section";
import { Lightbox } from "@/components/ui/Lightbox";
import { masterBySlug, masters, type MasterSlug } from "@/content/masters";
import { WORK_HEIGHT, WORK_WIDTH, works } from "@/content/works";
import { cn } from "@/lib/cn";

type Filter = MasterSlug | "all";

const filters: ReadonlyArray<{ value: Filter; label: string }> = [
  { value: "all", label: "Все работы" },
  ...masters.map((master) => ({ value: master.slug as Filter, label: master.name })),
];

export function Works() {
  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  const visible = useMemo(
    () => (filter === "all" ? works : works.filter((w) => w.masterSlug === filter)),
    [filter],
  );

  const changeFilter = useCallback((next: Filter) => {
    setFilter(next);
    setOpenIndex(null);
  }, []);

  const current = openIndex === null ? null : (visible[openIndex] ?? null);
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((index) =>
        index === null ? null : (index + delta + visible.length) % visible.length,
      ),
    [visible.length],
  );

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <Section
      id="works"
      index="02"
      title="Работы"
      lead="Единственное настоящее доказательство. Отфильтруйте по мастеру — и записывайтесь именно к нему."
    >
      <div
        className="mb-10 flex flex-wrap gap-2"
        role="group"
        aria-label="Фильтр по мастеру"
      >
        {filters.map(({ value, label }) => {
          const active = filter === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => changeFilter(value)}
              className={cn(
                "text-small rounded-sm border px-4 py-2 tracking-wide transition-colors duration-200",
                active
                  ? "border-brass text-brass"
                  : "border-scale text-ash hover:border-ash hover:text-chalk",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <motion.ul layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {/* key={work.id}, не индекс: иначе анимация перестановки перемешает содержимое карточек. */}
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((work, index) => (
            <motion.li
              key={work.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={transition}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                className="group border-scale hover:border-brass relative block w-full overflow-hidden rounded-sm border transition-colors duration-200"
              >
                <span className="relative block aspect-4/5">
                  <Image
                    src={work.src}
                    alt={work.alt}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover"
                  />
                </span>
                <span className="from-coal text-small absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent p-3 pt-10 text-left opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {work.caption}
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Lightbox
        open={current !== null}
        onClose={() => setOpenIndex(null)}
        label={current ? `Работа: ${current.caption}` : "Работа"}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
      >
        {current && (
          <figure className="flex min-h-0 flex-col gap-4">
            <Image
              src={current.src}
              alt={current.alt}
              width={WORK_WIDTH}
              height={WORK_HEIGHT}
              sizes="(min-width: 1024px) 60vw, 90vw"
              className="max-h-[70svh] w-auto self-center rounded-sm object-contain"
            />
            <figcaption className="flex flex-wrap items-center justify-between gap-4">
              <span>
                {current.caption}
                <span className="text-ash">
                  {" · "}
                  {masterBySlug.get(current.masterSlug)?.name}
                </span>
              </span>
              <span className="flex gap-2">
                <LightboxButton onClick={() => step(-1)} label="Предыдущая работа">
                  ←
                </LightboxButton>
                <LightboxButton onClick={() => step(1)} label="Следующая работа">
                  →
                </LightboxButton>
                <LightboxButton onClick={() => setOpenIndex(null)} label="Закрыть">
                  ✕
                </LightboxButton>
              </span>
            </figcaption>
          </figure>
        )}
      </Lightbox>
    </Section>
  );
}

function LightboxButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="border-scale hover:border-brass hover:text-brass grid size-10 place-items-center rounded-sm border transition-colors duration-200"
    >
      <span aria-hidden="true">{children}</span>
    </button>
  );
}
