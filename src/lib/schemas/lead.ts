import { z } from "zod";
import { masters } from "@/content/masters";
import { services } from "@/content/services";
import { PHONE_PATTERN } from "@/lib/phone";

/** Одна схема на клиент и сервер. Клиентская проверка — это UX, а не защита. */

const serviceSlugs = services.map((service) => service.slug);
const masterSlugs = masters.map((master) => master.slug);

export const ANY_MASTER = "any" as const;
export const preferredTimes = ["morning", "day", "evening"] as const;

export const preferredTimeLabels: Record<(typeof preferredTimes)[number], string> = {
  morning: "Утро",
  day: "День",
  evening: "Вечер",
};

/** Форма отрисована меньше трёх секунд назад — значит это бот, а не человек. */
export const MIN_FILL_MS = 3_000;

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Слишком короткое имя").max(60, "Слишком длинное имя"),
  phone: z.string().regex(PHONE_PATTERN, "Формат: +7XXXXXXXXXX"),
  service: z.enum(serviceSlugs as [string, ...string[]], {
    message: "Выберите услугу",
  }),
  master: z.enum([ANY_MASTER, ...masterSlugs] as [string, ...string[]]).optional(),
  preferredTime: z.enum(preferredTimes).optional(),
  comment: z.string().trim().max(500, "Не больше 500 символов").optional(),
  consent: z.literal(true, { message: "Нужно согласие на обработку данных" }),

  /**
   * Honeypot и time-trap проходят валидацию как обычные поля: решение о том, бот
   * это или нет, принимает `looksLikeBot`, а не Zod. Иначе бот получает `400` и
   * узнаёт, что попался.
   */
  website: z.string().optional(),
  renderedAt: z.number().int().nonnegative(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export function looksLikeBot(lead: LeadInput, now: number = Date.now()): boolean {
  // Скрытое поле видят только боты — человек его не заполняет.
  if (lead.website && lead.website.length > 0) return true;
  // Форма отправлена быстрее, чем человек успевает прочитать первый лейбл.
  if (now - lead.renderedAt < MIN_FILL_MS) return true;
  return false;
}
