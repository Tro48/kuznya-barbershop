/**
 * Склейка классов. Без `tailwind-merge` — но у неё есть цена: если один и тот же
 * CSS-свойство приходит из двух классов (`max-w-[1200px]` компонента и `max-w-3xl`
 * снаружи), победит тот, что стоит позже в собранном CSS, а не тот, что позже
 * в строке. Такие конфликты решаются вложенным элементом, а не пропом `className`.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
