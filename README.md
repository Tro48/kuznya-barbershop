# Кузня — лендинг барбершопа

Одностраничный лендинг барбершопа с онлайн-записью: заявка из формы уходит в
Telegram администратору, при отказе канала пишется в Supabase. Галерея работ с
фильтром по мастеру, лайтбокс, карта по клику, своя маска телефона.

**Демо:** https://kuznya-barbershop.vercel.app/

**Демонстрационный проект.** Компания «Кузня», мастера, цены и отзывы вымышлены.

## Стек

Next.js 16 (App Router) · TypeScript `strict` + `noUncheckedIndexedAccess` ·
Tailwind CSS 4 · Motion · React Hook Form · Zod · Supabase · Telegram Bot API · Vercel

## Метрики

![Lighthouse: Performance 61, Accessibility 100, Best Practices 79, SEO 100](./assets/lighthouse-mobile.png)

Lighthouse по задеплоенному URL, мобильный профиль, троттлинг, медиана из 5 прогонов:
**Performance 61 · Accessibility 100 · Best Practices 79 · SEO 100**. CLS — 0, FCP — 1.1 с.

Обе просадки — из-за Яндекс.Метрики: сторонние cookies роняют Best Practices
(аудиты `third-party-cookies` и `inspector-issues`), а `tag.js` добавляет 111 КБ и
~190 мс к bootup. Без аналитики на локальном прод-билде те же метрики дают
93 · 100 · 100 · 100.

Тесты: 32 юнит-теста (Vitest) и 8 e2e-сценариев (Playwright).
CI: `format:check → lint → typecheck → test → build` + e2e отдельным job'ом.

## Запуск

```bash
pnpm install
cp .env.example .env.local   # и заполнить
pnpm dev
```

Обязательны только `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`. Supabase и Upstash
опциональны: без них лендинг поднимается, теряя резервную запись лида и rate limit.

```bash
pnpm test       # юнит-тесты
pnpm test:e2e   # Playwright (сам поднимет продовый билд)
```

## Фотографии

Unsplash, лицензия допускает использование. Авторы — в [`CREDITS.md`](./CREDITS.md).
Шрифт Oswald для OG-картинки — SIL Open Font License.

Люди на фотографиях не имеют отношения к барбершопу «Кузня»: компания, мастера,
цены и отзывы вымышлены.
