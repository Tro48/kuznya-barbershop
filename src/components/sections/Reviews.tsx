import { Section } from "@/components/layout/Section";
import { masterBySlug } from "@/content/masters";
import { formatReviewDate, reviews } from "@/content/reviews";

/**
 * Мобильный — горизонтальный скролл со `scroll-snap`, десктоп — сетка.
 * Серверный компонент: здесь нет ни состояния, ни обработчиков.
 */
export function Reviews() {
  return (
    <Section
      id="reviews"
      index="04"
      title="Отзывы"
      lead="Собраны с Яндекс.Карт и 2ГИС. Для демонстрационного проекта написаны нами — как и всё остальное на этой странице."
    >
      <ul className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
        {reviews.map((review) => {
          const master = review.masterSlug ? masterBySlug.get(review.masterSlug) : undefined;

          return (
            <li
              key={review.id}
              className="w-[85%] shrink-0 snap-center md:w-auto md:shrink"
            >
              <figure className="border-scale bg-anvil flex h-full flex-col rounded-sm border p-6">
                <blockquote className="flex-1 text-small leading-relaxed">
                  {review.text}
                </blockquote>

                <figcaption className="border-scale mt-6 border-t pt-4">
                  <span className="font-display font-semibold tracking-wide uppercase">
                    {review.author}
                  </span>
                  <span className="text-ash mt-1 block text-small">
                    {formatReviewDate(review.date)} · {review.source}
                    {master && ` · мастер ${master.name}`}
                  </span>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
