import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createMemoryLocks, DEDUPE_TTL_SEC } from "./dedupe";
import { env, hasRateLimit } from "./env";

/**
 * Upstash опционален: без него лендинг поднимается локально без единого секрета,
 * теряя rate limit и общую на все инстансы дедупликацию. На проде переменные заданы.
 */
const redis =
  hasRateLimit && env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      prefix: "kuznya:lead",
      analytics: false,
    })
  : null;

export async function checkRateLimit(ip: string): Promise<boolean> {
  if (!ratelimit) return true;
  const { success } = await ratelimit.limit(ip);
  return success;
}

const memoryLocks = createMemoryLocks();

/** @returns `true`, если заявку видим впервые. */
export async function claimLead(key: string): Promise<boolean> {
  if (redis) {
    const result = await redis.set(key, 1, { nx: true, ex: DEDUPE_TTL_SEC });
    return result === "OK";
  }
  return memoryLocks.claim(key);
}

/** Заявка не доехала никуда — ключ надо отпустить, иначе повтор не пройдёт две минуты. */
export async function releaseLead(key: string): Promise<void> {
  if (redis) {
    await redis.del(key);
    return;
  }
  memoryLocks.release(key);
}
