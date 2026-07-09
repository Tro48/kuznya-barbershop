import { expect, test } from "@playwright/test";

test.describe("prefers-reduced-motion: reduce", () => {
  test("контент виден без анимаций, счётчик показывает конечное число", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // Стартовое состояние Reveal — opacity: 0. Если анимацию просто отключить,
    // контент останется невидимым. Здесь он обязан быть виден.
    await expect(page.getByRole("heading", { name: "Услуги" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Отзывы" })).toBeVisible();

    // Отсчёт вверх не запускается: в DOM сразу конечное число, а не «0 лет».
    // exact обязателен: без него «0 лет» находится подстрокой внутри «10 лет».
    const years = new Date().getFullYear() - 2016;
    const facts = page.getByRole("region", { name: "Коротко о барбершопе" });
    await expect(facts.getByText(`${years} лет`, { exact: true })).toBeVisible();
    await expect(facts.getByText("0 лет", { exact: true })).toHaveCount(0);
  });
});

test("карта не тянет ни одного запроса к yandex.ru до клика", async ({ page }) => {
  const yandexRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("yandex.ru")) yandexRequests.push(request.url());
  });

  await page.goto("/");
  await page.getByRole("heading", { name: "Как добраться" }).scrollIntoViewIfNeeded();
  expect(yandexRequests).toHaveLength(0);

  await page.getByRole("button", { name: "Показать карту" }).click();
  await expect(page.locator("iframe")).toBeVisible();
});

test("лайтбокс: Esc закрывает и возвращает фокус на карточку", async ({ page }) => {
  await page.goto("/");

  const card = page.locator("#works li button").first();
  await card.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(card).toBeFocused();
});

test("галерея фильтруется по мастеру", async ({ page }) => {
  await page.goto("/");

  const cards = page.locator("#works li");
  await expect(cards).toHaveCount(10);

  const filters = page.getByRole("group", { name: "Фильтр по мастеру" });
  await filters.getByRole("button", { name: "Артём Стрельцов" }).click();
  await expect(cards).toHaveCount(4);

  await filters.getByRole("button", { name: "Все работы" }).click();
  await expect(cards).toHaveCount(10);
});
