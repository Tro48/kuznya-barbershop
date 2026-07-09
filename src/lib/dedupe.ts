import { createHash } from "node:crypto";

/**
 * Пользователь жмёт кнопку дважды, потому что не понял, что первый клик сработал.
 * Ключ идемпотентности: тот же телефон, та же услуга, та же минута — та же заявка.
 *
 * Секретов здесь нет, поэтому модуль обходится без `server-only` и покрывается тестом.
 */
export function dedupeKey(
  phone: string,
  service: string,
  now: number = Date.now(),
): string {
  const minute = Math.floor(now / 60_000);
  const hash = createHash("sha256")
    .update(`${phone}|${service}|${minute}`)
    .digest("hex")
    .slice(0, 32);
  return `kuznya:lead:dedupe:${hash}`;
}

export const DEDUPE_TTL_SEC = 120;

export type LeadLocks = {
  /** `true`, если заявку видим впервые. */
  claim: (key: string, now?: number) => boolean;
  release: (key: string) => void;
};

/** Запасной вариант без Redis: живёт в памяти одного инстанса, но лучше, чем ничего. */
export function createMemoryLocks(ttlSec: number = DEDUPE_TTL_SEC): LeadLocks {
  const locks = new Map<string, number>();

  return {
    claim(key, now = Date.now()) {
      for (const [existing, expiresAt] of locks) {
        if (expiresAt <= now) locks.delete(existing);
      }
      if (locks.has(key)) return false;

      locks.set(key, now + ttlSec * 1000);
      return true;
    },
    release(key) {
      locks.delete(key);
    },
  };
}
