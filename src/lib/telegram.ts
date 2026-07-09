import "server-only";
import { env } from "./env";

/** Без таймаута зависший запрос держит функцию до лимита Vercel, а пользователь — спиннер. */
const TELEGRAM_TIMEOUT_MS = 5_000;

export async function sendTelegramMessage(text: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text,
          parse_mode: "MarkdownV2",
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
      },
    );

    if (!response.ok) {
      console.error("Telegram отказал:", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Telegram недоступен:", error);
    return false;
  }
}
