import { expect, test } from "@playwright/test";

/**
 * Один сценарий на проект, не E2E на всё подряд: открыть страницу, заполнить
 * форму, замокать сеть, увидеть экран успеха.
 */
test("заявка из формы доводит до экрана успеха", async ({ page }) => {
  const leadRequests: unknown[] = [];

  await page.route("**/api/lead", async (route) => {
    leadRequests.push(route.request().postDataJSON());
    await route.fulfill({ json: { ok: true } });
  });

  await page.goto("/");

  // Карточка услуги предзаполняет форму и скроллит к ней.
  await page
    .getByRole("button", { name: "Записаться на услугу «Бритьё опасной бритвой»" })
    .click();
  await expect(page.getByLabel("Услуга")).toHaveValue("shave");

  await page.getByLabel("Имя").fill("Пётр-Иван");
  // Вставка из буфера в человеческом формате: маска нормализует сама.
  await page.getByLabel("Телефон").fill("8 (999) 123-45-67");
  await expect(page.getByLabel("Телефон")).toHaveValue("+7 (999) 123-45-67");

  await page.getByRole("button", { name: "Вечер" }).click();
  await page.getByLabel("Комментарий").fill("Первый раз, стригусь коротко");

  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Отправить заявку" }).click();

  await expect(page.getByRole("status")).toContainText("Пётр-Иван, записали");
  // Экран успеха заменяет форму: повторно отправить нечего.
  await expect(page.locator("#booking form")).toHaveCount(0);

  expect(leadRequests).toHaveLength(1);
  expect(leadRequests[0]).toMatchObject({
    name: "Пётр-Иван",
    phone: "+79991234567",
    service: "shave",
    preferredTime: "evening",
    consent: true,
  });
});

test("маска телефона: посимвольный ввод, вставка из буфера, backspace по разделителю", async ({
  page,
}) => {
  await page.goto("/#booking");
  const phone = page.getByLabel("Телефон");

  // Человек набирает восьмёрку — маска ведёт его к +7, не мешая.
  await phone.pressSequentially("89991234567", { delay: 10 });
  await expect(phone).toHaveValue("+7 (999) 123-45-67");

  // Backspace по цифре убирает цифру.
  await phone.press("Backspace");
  await expect(phone).toHaveValue("+7 (999) 123-45-6");

  // Backspace по разделителю «-» не топчется на месте, а удаляет цифру перед ним.
  await phone.press("Backspace");
  await phone.press("Backspace");
  await expect(phone).toHaveValue("+7 (999) 123-4");

  // Вставка из буфера в любом формате нормализуется целиком.
  await phone.fill("");
  await phone.fill("+7 999 123 45 67");
  await expect(phone).toHaveValue("+7 (999) 123-45-67");
});

test("форма не отправляется без согласия на обработку данных", async ({ page }) => {
  let requests = 0;
  await page.route("**/api/lead", async (route) => {
    requests += 1;
    await route.fulfill({ json: { ok: true } });
  });

  await page.goto("/#booking");

  await page.getByLabel("Имя").fill("Иван");
  await page.getByLabel("Телефон").fill("+79991234567");
  await page.getByLabel("Услуга").selectOption("haircut");
  await page.getByRole("button", { name: "Отправить заявку" }).click();

  await expect(page.getByText("Нужно согласие на обработку данных")).toBeVisible();
  expect(requests).toBe(0);
});

test("при недоступном канале приёма заявок пользователь видит телефон, а не Error 500", async ({
  page,
}) => {
  await page.route("**/api/lead", (route) =>
    route.fulfill({ status: 503, json: { error: "unavailable" } }),
  );

  await page.goto("/#booking");

  await page.getByLabel("Имя").fill("Иван");
  await page.getByLabel("Телефон").fill("+79991234567");
  await page.getByLabel("Услуга").selectOption("haircut");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Отправить заявку" }).click();

  // Не getByRole("alert") на всю страницу: Next держит свой route announcer с той же ролью.
  await expect(page.locator("#booking [role=alert]")).toContainText("Позвоните нам");
  await expect(page.getByRole("status")).toHaveCount(0);
});
