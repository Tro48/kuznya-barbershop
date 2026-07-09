import { defineConfig, devices } from "@playwright/test";

const PORT = 3210;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL,
    trace: "on-first-retry",
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  /**
   * Прогон по продовому билду, а не по dev-серверу: dev отдаёт другой JS и другие
   * тайминги, и зелёный smoke на нём ничего не гарантирует.
   */
  webServer: {
    command: `pnpm build && pnpm start --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      TELEGRAM_BOT_TOKEN: "e2e-placeholder",
      TELEGRAM_CHAT_ID: "e2e-placeholder",
      NEXT_PUBLIC_SITE_URL: baseURL,
    },
  },
});
