"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Container } from "@/components/layout/Container";
import { facts } from "@/content/facts";
import { prefersReducedMotion } from "@/lib/reduced-motion";

/**
 * Счётчик пишет в DOM напрямую, минуя state: перерисовывать React шестьдесят раз
 * в секунду ради одного числа незачем.
 *
 * В разметку сразу попадает конечное значение — так его видят поисковик, читатель
 * без JS и пользователь с `prefers-reduced-motion`. Обнуление происходит в
 * layout-эффекте, до отрисовки: подмены «10 → 0 → 10» на экране не видно.
 *
 * Медиа-запрос читается синхронно, а не через хук: хук отдал бы `false` на первом
 * рендере при гидрации, и layout-эффект успел бы обнулить число тому, кто просил
 * не анимировать.
 */
function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const willAnimate = useRef(false);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  useLayoutEffect(() => {
    willAnimate.current = !prefersReducedMotion();
    if (!willAnimate.current || !ref.current) return;
    ref.current.textContent = `0${suffix}`;
  }, [suffix]);

  useEffect(() => {
    if (!willAnimate.current || !inView || !ref.current) return;

    const node = ref.current;
    const controls = animate(0, to, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => {
        node.textContent = `${Math.round(value)}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [inView, to, suffix]);

  return (
    <span ref={ref} className="tnum">
      {to}
      {suffix}
    </span>
  );
}

export function Facts() {
  return (
    <section aria-label="Коротко о барбершопе" className="border-scale border-y">
      <Container>
        <dl className="divide-scale grid divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
          {facts.map((fact) => (
            <div key={fact.id} className="px-0 py-10 md:px-8 md:py-14 md:first:pl-0">
              <dt className="font-display text-h2 leading-none font-semibold">
                {fact.value.kind === "count" ? (
                  <CountUp to={fact.value.to} suffix={fact.value.suffix} />
                ) : (
                  fact.value.text
                )}
              </dt>
              <dd className="text-ash text-small mt-3">{fact.label}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
