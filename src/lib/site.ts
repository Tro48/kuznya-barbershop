/**
 * Публичные константы. Читаются и на клиенте, поэтому только `NEXT_PUBLIC_*`
 * и обращение к `process.env.X` строкой-литералом — иначе Next не подставит значение.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const site = {
  name: "Кузня",
  legalName: "Барбершоп «Кузня»",
  slogan: "Работа по стали и волосу",
  description:
    "Барбершоп «Кузня»: стрижка, борода, бритьё опасной бритвой. Запись за минуту — администратор перезвонит в течение 15 минут.",
  phone: "+79995558814",
  phoneFormatted: "+7 (999) 555-88-14",
  email: "hi@kuznya.example",
  address: {
    street: "Кузнецкий переулок, 7",
    city: "Санкт-Петербург",
    postalCode: "191014",
    landmark: "Вход со двора, вторая дверь слева",
  },
  geo: { lat: 59.9386, lon: 30.3141 },
  hours: [
    { days: "Пн — Пт", time: "10:00 — 22:00" },
    { days: "Сб — Вс", time: "11:00 — 21:00" },
  ],
  social: [
    { label: "Telegram", href: "https://t.me/" },
    { label: "VK", href: "https://vk.com/" },
    { label: "WhatsApp", href: "https://wa.me/79995558814" },
  ],
} as const;

/** Ссылка `tel:` требует номер без пробелов и скобок. */
export const telHref = `tel:${site.phone}`;
