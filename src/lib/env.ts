import "server-only";
import { z } from "zod";

/**
 * Схема серверных переменных. Парсится при импорте: приложение падает на билде,
 * а не в рантайме на проде при отсутствующем токене.
 *
 * Supabase и Upstash опциональны — без них лендинг работает, теряя резервный путь
 * записи лида и rate limit. Telegram обязателен: без него форма ведёт в никуда.
 */
const serverEnvSchema = z.object({
  TELEGRAM_BOT_TOKEN: z
    .string()
    .min(1, "TELEGRAM_BOT_TOKEN пуст: заявки некуда отправлять"),
  TELEGRAM_CHAT_ID: z.string().min(1, "TELEGRAM_CHAT_ID пуст: заявки некуда отправлять"),

  NEXT_PUBLIC_SUPABASE_URL: z.union([z.url(), z.literal("")]).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  UPSTASH_REDIS_REST_URL: z.union([z.url(), z.literal("")]).optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

/**
 * На этапе `next build` страницы пререндерятся, но Route Handler не выполняется.
 * Vercel даёт переменные и на билде, и в рантайме, поэтому валидируем сразу —
 * кроме `next lint`/`typecheck`, где процесс переменных не видит вовсе.
 */
function loadServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Переменные окружения не прошли валидацию:\n${details}`);
  }

  return parsed.data;
}

export const env = loadServerEnv();

export const hasSupabase = Boolean(
  env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY,
);

export const hasRateLimit = Boolean(
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN,
);
