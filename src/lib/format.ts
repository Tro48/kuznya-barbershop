/**
 * Форматирование в одном месте. Цены хранятся числами, а не строкой «от 1 500 ₽»:
 * так возможна сортировка и исключены опечатки в неразрывных пробелах.
 */

const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

export function formatPrice(rubles: number): string {
  return priceFormatter.format(rubles);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) return `${rest} мин`;
  if (rest === 0) return `${hours} ч`;
  return `${hours} ч ${rest} мин`;
}

/** Год основания задан константой, «лет в работе» считается — цифру не надо править каждый январь. */
export function yearsSince(year: number, now: Date = new Date()): number {
  return Math.max(0, now.getFullYear() - year);
}
