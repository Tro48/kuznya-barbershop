import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

type SectionProps = {
  /** Якорь для ссылок вида `#services`. */
  id?: string;
  title: string;
  /** Номер секции — чертёжная нумерация: `02 / Услуги`. */
  index?: string;
  lead?: string;
  /** Заголовок нужен скринридеру, но не нужен глазу — например, в форме. */
  titleHidden?: boolean;
  children: ReactNode;
  className?: string;
};

/**
 * Единственное место, где задаётся вертикальный ритм секций. Секции своих
 * отступов не ставят — иначе ритм расползается на третьей.
 */
export function Section({
  id,
  title,
  index,
  lead,
  titleHidden = false,
  children,
  className,
}: SectionProps) {
  const headingId = id ? `${id}-title` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("py-section scroll-mt-20", className)}
    >
      <Container>
        {titleHidden ? (
          <header className="sr-only">
            <h2 id={headingId}>{title}</h2>
          </header>
        ) : (
          <Reveal>
            <header className="mb-12 md:mb-16">
              {index && (
                <div className="text-ash text-small mb-4 flex items-center gap-4 tracking-[0.2em] uppercase">
                  <span className="tnum">{index}</span>
                  <span className="bg-scale h-px flex-1" aria-hidden="true" />
                </div>
              )}
              <h2 id={headingId} className="text-h2 uppercase">
                {title}
              </h2>
              {lead && <p className="text-ash mt-4 max-w-2xl text-balance">{lead}</p>}
            </header>
          </Reveal>
        )}
        {children}
      </Container>
    </section>
  );
}
