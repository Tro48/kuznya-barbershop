import { describe, expect, it } from "vitest";
import { createMemoryLocks, dedupeKey, DEDUPE_TTL_SEC } from "./dedupe";

const minute = 60_000;

describe("dedupeKey", () => {
  it("две одинаковые заявки в течение минуты дают один ключ", () => {
    const now = 1_700_000_000_000;
    expect(dedupeKey("+79991234567", "shave", now)).toBe(
      dedupeKey("+79991234567", "shave", now + 5_000),
    );
  });

  it("та же заявка в следующую минуту — новый ключ: человек передумал и записался снова", () => {
    const now = 1_700_000_040_000;
    expect(dedupeKey("+79991234567", "shave", now)).not.toBe(
      dedupeKey("+79991234567", "shave", now + minute),
    );
  });

  it("разные телефоны и услуги не схлопываются", () => {
    const now = 1_700_000_000_000;
    expect(dedupeKey("+79991234567", "shave", now)).not.toBe(
      dedupeKey("+79997654321", "shave", now),
    );
    expect(dedupeKey("+79991234567", "shave", now)).not.toBe(
      dedupeKey("+79991234567", "haircut", now),
    );
  });
});

describe("createMemoryLocks", () => {
  it("второй захват того же ключа не проходит", () => {
    const locks = createMemoryLocks();
    expect(locks.claim("k")).toBe(true);
    expect(locks.claim("k")).toBe(false);
  });

  it("ключ отпускается по TTL", () => {
    const locks = createMemoryLocks();
    const now = 1_700_000_000_000;
    expect(locks.claim("k", now)).toBe(true);
    expect(locks.claim("k", now + DEDUPE_TTL_SEC * 1000 - 1)).toBe(false);
    expect(locks.claim("k", now + DEDUPE_TTL_SEC * 1000)).toBe(true);
  });

  it("release отпускает ключ сразу: заявка никуда не доехала, повтор должен пройти", () => {
    const locks = createMemoryLocks();
    expect(locks.claim("k")).toBe(true);
    locks.release("k");
    expect(locks.claim("k")).toBe(true);
  });
});
