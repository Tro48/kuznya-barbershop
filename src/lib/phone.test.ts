import { describe, expect, it } from "vitest";
import { applyPhoneEdit, formatPhone, normalizePhone } from "./phone";

describe("normalizePhone", () => {
  it("приводит вставку из буфера к +7XXXXXXXXXX", () => {
    expect(normalizePhone("8 (999) 123-45-67")).toBe("+79991234567");
    expect(normalizePhone("+7 (999) 123-45-67")).toBe("+79991234567");
    expect(normalizePhone("7 999 123 45 67")).toBe("+79991234567");
  });

  it("достраивает код страны к номеру без него", () => {
    expect(normalizePhone("9991234567")).toBe("+79991234567");
  });

  it("отбрасывает лишние цифры сверх одиннадцати", () => {
    expect(normalizePhone("+799912345678888")).toBe("+79991234567");
  });

  it("возвращает пустую строку на пустом вводе", () => {
    expect(normalizePhone("")).toBe("");
    expect(normalizePhone("не телефон")).toBe("");
  });
});

describe("formatPhone", () => {
  it("показывает номер человеку, а не машине", () => {
    expect(formatPhone("+79991234567")).toBe("+7 (999) 123-45-67");
  });

  it("форматирует частичный ввод, не дорисовывая лишнего", () => {
    expect(formatPhone("9")).toBe("+7 (9");
    expect(formatPhone("999")).toBe("+7 (999)");
    expect(formatPhone("99912")).toBe("+7 (999) 12");
  });
});

describe("applyPhoneEdit", () => {
  it("вставка из буфера проходит целиком", () => {
    expect(applyPhoneEdit("", "8 (999) 123-45-67")).toBe("+7 (999) 123-45-67");
  });

  it("backspace по цифре удаляет цифру", () => {
    expect(applyPhoneEdit("+7 (999) 123-45-67", "+7 (999) 123-45-6")).toBe(
      "+7 (999) 123-45-6",
    );
  });

  it("backspace по разделителю удаляет цифру перед ним, а не топчется на месте", () => {
    // Пользователь стёр «)» — цифры не изменились, курсор уперся бы в маску.
    expect(applyPhoneEdit("+7 (999)", "+7 (999")).toBe("+7 (99");
  });
});
