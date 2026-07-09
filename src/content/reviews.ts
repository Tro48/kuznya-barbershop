import type { MasterSlug } from "./masters";

export type Review = {
  id: string;
  author: string;
  /** ISO-дата: форматируется через Intl, а не пишется строкой. */
  date: string;
  source: string;
  masterSlug?: MasterSlug;
  text: string;
};

export const reviews = [
  {
    id: "r1",
    author: "Кирилл М.",
    date: "2026-05-18",
    source: "Яндекс.Карты",
    masterSlug: "kovalev",
    text: "Пришёл после трёх лет одного и того же места, где меня стригли по инерции. Игорь минут пять смотрел, как волос лежит, и только потом взял машинку. Разница видна на второй неделе: форма не поплыла.",
  },
  {
    id: "r2",
    author: "Антон Ш.",
    date: "2026-04-02",
    source: "2ГИС",
    masterSlug: "streltsov",
    text: "Брился опасной впервые, готовился терпеть. Никакого раздражения на следующий день — а у меня оно после станка всегда. Спрашивал, чем обрабатывали, записал.",
  },
  {
    id: "r3",
    author: "Сергей и Тимур (5 лет)",
    date: "2026-03-27",
    source: "Яндекс.Карты",
    masterSlug: "ashurov",
    text: "Сын до этого орал в любом кресле. Давид дал ему подержать расчёску и минут десять просто разговаривал. Постриглись. Второй раз пришли уже без уговоров.",
  },
  {
    id: "r4",
    author: "Максим Р.",
    date: "2026-06-09",
    source: "Отзыв в Telegram",
    text: "Записался через сайт в 23:40, не рассчитывал ни на что. Перезвонили в 10:05 утра. Мелочь, но именно из-за таких мелочей я сюда хожу.",
  },
] as const satisfies readonly Review[];

const reviewDateFormatter = new Intl.DateTimeFormat("ru-RU", {
  month: "long",
  year: "numeric",
});

export function formatReviewDate(isoDate: string): string {
  return reviewDateFormatter.format(new Date(isoDate));
}
