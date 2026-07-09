import { describe, expect, it } from "vitest";
import { escapeMd } from "./markdown";

describe("escapeMd", () => {
  it("экранирует дефис — иначе имя «Пётр-Иван» роняет запрос с 400", () => {
    expect(escapeMd("Пётр-Иван")).toBe("Пётр\\-Иван");
  });

  it("экранирует все служебные символы MarkdownV2", () => {
    expect(escapeMd("_*[]()~`>#+-=|{}.!")).toBe(
      "\\_\\*\\[\\]\\(\\)\\~\\`\\>\\#\\+\\-\\=\\|\\{\\}\\.\\!",
    );
  });

  it("экранирует обратный слэш", () => {
    expect(escapeMd("C:\\path")).toBe("C:\\\\path");
  });

  it("не трогает обычный текст", () => {
    expect(escapeMd("Стрижка и борода")).toBe("Стрижка и борода");
  });
});
