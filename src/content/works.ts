import type { MasterSlug } from "./masters";

export type Work = {
  id: string;
  src: string;
  alt: string;
  /** Тип связан с `masters.ts`: опечатку в slug ловит компилятор, а не глаз. */
  masterSlug: MasterSlug;
  caption: string;
};

/** Все работы обрезаны в 4:5 — сетка не прыгает, лайтбокс не дёргается. */
export const WORK_WIDTH = 1000;
export const WORK_HEIGHT = 1250;

export const works = [
  {
    id: "w01",
    src: "/images/works/work-01.webp",
    alt: "Машинка снимает длину на затылке, плотный переход к вискам",
    masterSlug: "kovalev",
    caption: "Фейд на затылке",
  },
  {
    id: "w02",
    src: "/images/works/work-02.webp",
    alt: "Мастер снимает длину бороды ножницами через гребень",
    masterSlug: "streltsov",
    caption: "Борода через гребень",
  },
  {
    id: "w03",
    src: "/images/works/work-03.webp",
    alt: "Классическая укладка с высоким верхом и коротким виском, вид сбоку",
    masterSlug: "ashurov",
    caption: "Классика с высоким верхом",
  },
  {
    id: "w04",
    src: "/images/works/work-04.webp",
    alt: "Мастер ведёт опасную бритву по скуле клиента",
    masterSlug: "streltsov",
    caption: "Скула, опасная бритва",
  },
  {
    id: "w05",
    src: "/images/works/work-05.webp",
    alt: "Мастер укладывает длинный верх после стрижки",
    masterSlug: "kovalev",
    caption: "Текстура на длинном верхе",
  },
  {
    id: "w06",
    src: "/images/works/work-06.webp",
    alt: "Бритьё опасной бритвой по пене, голова запрокинута назад",
    masterSlug: "streltsov",
    caption: "Бритьё в два прохода",
  },
  {
    id: "w07",
    src: "/images/works/work-07.webp",
    alt: "Короткая стрижка с чётким контуром у лба, вид сбоку",
    masterSlug: "ashurov",
    caption: "Короткая форма, чистый контур",
  },
  {
    id: "w08",
    src: "/images/works/work-08.webp",
    alt: "Машинка ведёт линию по затылку в руке с татуировкой",
    masterSlug: "kovalev",
    caption: "Машинка: линия затылка",
  },
  {
    id: "w09",
    src: "/images/works/work-09.webp",
    alt: "Мастер работает с седыми волосами пожилого клиента",
    masterSlug: "ashurov",
    caption: "Седина: работа ножницами",
  },
  {
    id: "w10",
    src: "/images/works/work-10.webp",
    alt: "Триммер и опасная бритва правят контур бороды",
    masterSlug: "streltsov",
    caption: "Финальная правка контура",
  },
] as const satisfies readonly Work[];
