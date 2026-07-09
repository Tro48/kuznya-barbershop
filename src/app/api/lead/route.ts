import "server-only";
import { NextResponse } from "next/server";
import { masterBySlug } from "@/content/masters";
import { serviceBySlug } from "@/content/services";
import { dedupeKey } from "@/lib/dedupe";
import { escapeMd } from "@/lib/markdown";
import { claimLead, checkRateLimit, releaseLead } from "@/lib/redis";
import { leadSchema, looksLikeBot, preferredTimeLabels } from "@/lib/schemas/lead";
import { saveLeadToSupabase } from "@/lib/supabase";
import { sendTelegramMessage } from "@/lib/telegram";
import type { LeadInput } from "@/lib/schemas/lead";

const ok = () => NextResponse.json({ ok: true });

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function formatLead(lead: LeadInput): string {
  const service = serviceBySlug.get(lead.service);
  const master =
    lead.master && lead.master !== "any" ? masterBySlug.get(lead.master) : null;

  return [
    "🔥 *Новая заявка — Кузня*",
    `Имя: ${escapeMd(lead.name)}`,
    `Телефон: \`${lead.phone}\``,
    `Услуга: ${escapeMd(service?.title ?? lead.service)}`,
    master ? `Мастер: ${escapeMd(master.name)}` : "Мастер: не важно",
    lead.preferredTime
      ? `Время: ${escapeMd(preferredTimeLabels[lead.preferredTime])}`
      : null,
    lead.comment ? `Комментарий: ${escapeMd(lead.comment)}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Zod → honeypot и time\-trap → rate limit → идемпотентность → Telegram.
 * Если Telegram отказал — пишем в Supabase и всё равно отдаём успех:
 * заявка не теряется, а пользователю незачем знать про наш Telegram.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const lead = parsed.data;

  // Боту отвечаем «успех»: узнав про 400, он подберёт обход.
  if (looksLikeBot(lead)) return ok();

  if (!(await checkRateLimit(clientIp(request)))) {
    return NextResponse.json(
      { error: "rate_limit", message: "Слишком много заявок. Позвоните нам." },
      { status: 429 },
    );
  }

  const key = dedupeKey(lead.phone, lead.service);
  const isFirstSubmission = await claimLead(key);
  // Второй клик по кнопке не создаёт вторую заявку — и не пугает пользователя ошибкой.
  if (!isFirstSubmission) return ok();

  if (await sendTelegramMessage(formatLead(lead))) return ok();

  if (await saveLeadToSupabase(lead)) return ok();

  await releaseLead(key);
  return NextResponse.json(
    {
      error: "unavailable",
      message: "Не смогли принять заявку. Позвоните нам — ответим сразу.",
    },
    { status: 503 },
  );
}
