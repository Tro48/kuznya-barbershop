export type Master = {
  /** Ключ фильтра галереи и значение селекта «мастер» в форме. */
  slug: string;
  name: string;
  experienceYears: number;
  specialization: string;
  /** Строка «о себе» — одна, от первого лица. Три абзаца никто не читает. */
  quote: string;
  photo: string;
  photoAlt: string;
};

export const masters = [
  {
    slug: "kovalev",
    name: "Игорь Ковалёв",
    experienceYears: 12,
    specialization: "Фейд и машинная работа",
    quote: "Плохой фейд видно за десять шагов. Хороший не видно вообще — видно человека.",
    photo: "/images/masters/kovalev.webp",
    photoAlt: "Игорь Ковалёв ведёт машинку по волосам клиента",
  },
  {
    slug: "streltsov",
    name: "Артём Стрельцов",
    experienceYears: 8,
    specialization: "Опасная бритва, оформление бороды",
    quote:
      "Бритва не прощает спешки. Сорок пять минут — это не долго, это ровно столько.",
    photo: "/images/masters/streltsov.webp",
    photoAlt: "Артём Стрельцов со сложенной опасной бритвой в руках",
  },
  {
    slug: "ashurov",
    name: "Давид Ашуров",
    experienceYears: 6,
    specialization: "Ножницы, классические формы, дети",
    quote: "С детьми главное — не торопить. Стрижка подождёт, доверие нет.",
    photo: "/images/masters/ashurov.webp",
    photoAlt: "Давид Ашуров стрижёт ножницами, склонившись над креслом",
  },
] as const satisfies readonly Master[];

export type MasterSlug = (typeof masters)[number]["slug"];

export const masterBySlug = new Map<string, Master>(
  masters.map((master) => [master.slug, master]),
);
