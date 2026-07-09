import { describe, expect, it } from "vitest";
import { leadSchema, looksLikeBot, MIN_FILL_MS, type LeadInput } from "./lead";
import { normalizePhone } from "@/lib/phone";

/** Валидная заявка, отрисованная минуту назад. От неё отталкиваются все кейсы. */
const base = {
  name: "Пётр-Иван",
  phone: "+79991234567",
  service: "haircut",
  consent: true as const,
  renderedAt: Date.now() - 60_000,
};

const parse = (patch: Record<string, unknown> = {}) =>
  leadSchema.safeParse({ ...base, ...patch });

describe("leadSchema", () => {
  it("принимает нормализованный телефон", () => {
    expect(parse().success).toBe(true);
  });

  it("не принимает телефон с пробелами и скобками — нормализовать должен клиент", () => {
    expect(parse({ phone: "+7 (999) 123-45-67" }).success).toBe(false);
    expect(normalizePhone("+7 (999) 123-45-67")).toBe("+79991234567");
  });

  it("не принимает восьмёрку вместо +7, но нормализация её чинит", () => {
    expect(parse({ phone: "89991234567" }).success).toBe(false);
    expect(normalizePhone("8 (999) 123-45-67")).toBe("+79991234567");
  });

  it("не принимает короткий телефон", () => {
    expect(parse({ phone: "+7999123456" }).success).toBe(false);
  });

  it("не принимает имя из одного символа", () => {
    expect(parse({ name: "П" }).success).toBe(false);
  });

  it("не отправляется без согласия на обработку данных", () => {
    expect(parse({ consent: false }).success).toBe(false);
    expect(parse({ consent: undefined }).success).toBe(false);
  });

  it("не принимает неизвестную услугу", () => {
    expect(parse({ service: "tattoo" }).success).toBe(false);
  });

  it("принимает опциональные поля: мастер, время, комментарий", () => {
    const result = parse({
      master: "kovalev",
      preferredTime: "evening",
      comment: "Первый раз",
    });
    expect(result.success).toBe(true);
  });

  it("не принимает комментарий длиннее 500 символов", () => {
    expect(parse({ comment: "а".repeat(501) }).success).toBe(false);
  });
});

describe("looksLikeBot", () => {
  const lead = (patch: Partial<LeadInput> = {}): LeadInput => ({
    ...base,
    ...patch,
  });

  it("ловит заполненный honeypot", () => {
    expect(looksLikeBot(lead({ website: "https://spam.example" }))).toBe(true);
  });

  it("пропускает пустой honeypot", () => {
    expect(looksLikeBot(lead({ website: "" }))).toBe(false);
  });

  it("ловит отправку быстрее трёх секунд после отрисовки", () => {
    const now = Date.now();
    expect(looksLikeBot(lead({ renderedAt: now - (MIN_FILL_MS - 1) }), now)).toBe(true);
  });

  it("пропускает человека, заполнявшего форму дольше трёх секунд", () => {
    const now = Date.now();
    expect(looksLikeBot(lead({ renderedAt: now - (MIN_FILL_MS + 1) }), now)).toBe(false);
  });
});
