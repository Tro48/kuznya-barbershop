import { yearsSince } from "@/lib/format";

export const FOUNDED_YEAR = 2016;

/**
 * Факты вместо прилагательных. Заменяют блок «Почему мы»: иконка ножниц с подписью
 * «качество» не убеждает никого.
 */
export type Fact = {
  id: string;
  /**
   * `count` анимируется отсчётом вверх — единственная «дорогая» анимация лендинга.
   * Остальные факты статичны: три счётчика в ряд превращаются в аттракцион.
   */
  value: { kind: "count"; to: number; suffix: string } | { kind: "text"; text: string };
  label: string;
};

export const facts: readonly Fact[] = [
  {
    id: "since",
    value: { kind: "count", to: yearsSince(FOUNDED_YEAR), suffix: " лет" },
    label: `в работе с ${FOUNDED_YEAR} года, на одном месте`,
  },
  {
    id: "walk-in",
    value: { kind: "text", text: "до 12:00" },
    label: "по будням стрижём без записи",
  },
  {
    id: "kids",
    value: { kind: "text", text: "с 3 лет" },
    label: "детская стрижка, отдельное кресло",
  },
];
