export type Service = {
  /** Совпадает со значением в селекте формы: карточка предзаполняет форму по slug. */
  slug: string;
  title: string;
  /** Рубли, целое число. Форматирование — через `formatPrice`, не строкой. */
  priceFrom: number;
  durationMin: number;
  description: string;
};

export const services = [
  {
    slug: "haircut",
    title: "Мужская стрижка",
    priceFrom: 2200,
    durationMin: 60,
    description:
      "Разбираем форму головы и то, как волос ложится сам. Машинка там, где нужна машинка, ножницы — где нужны ножницы.",
  },
  {
    slug: "beard",
    title: "Стрижка бороды",
    priceFrom: 1400,
    durationMin: 40,
    description:
      "Контур, длина, переход к бакенбардам. Заканчиваем горячим полотенцем и маслом — иначе кожа под бородой шелушится.",
  },
  {
    slug: "haircut-beard",
    title: "Стрижка и борода",
    priceFrom: 3200,
    durationMin: 90,
    description:
      "Голова и борода за один визит и одним мастером. Так они собираются в одну форму, а не в две отдельные.",
  },
  {
    slug: "shave",
    title: "Бритьё опасной бритвой",
    priceFrom: 1800,
    durationMin: 45,
    description:
      "Два прохода: по росту волоса и против. Компрессы до и после. Гладко держится дольше, чем после станка.",
  },
  {
    slug: "camouflage",
    title: "Камуфляж седины",
    priceFrom: 1200,
    durationMin: 30,
    description:
      "Не закрашиваем в чёрный. Приглушаем седину на два-три тона, чтобы она читалась как свет, а не как возраст.",
  },
  {
    slug: "kids",
    title: "Детская стрижка",
    priceFrom: 1500,
    durationMin: 45,
    description:
      "С трёх лет, отдельное кресло у окна. Если ребёнок передумал на середине — доделываем в следующий раз бесплатно.",
  },
] as const satisfies readonly Service[];

export type ServiceSlug = (typeof services)[number]["slug"];

export const serviceBySlug = new Map<string, Service>(
  services.map((service) => [service.slug, service]),
);
