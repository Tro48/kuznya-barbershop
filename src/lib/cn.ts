/**
 * Склейка классов. Без `tailwind-merge`: конфликтующие утилиты в этом проекте
 * не приходят из двух источников — варианты компонентов не пересекаются по свойствам.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
