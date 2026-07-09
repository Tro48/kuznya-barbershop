import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env, hasSupabase } from "./env";
import type { LeadInput } from "./schemas/lead";

/**
 * Insert только отсюда, с service role ключом. С анонимным ключом и insert-политикой
 * любой посетитель пишет в таблицу из консоли браузера в цикле, а rate limit на
 * своём эндпоинте мы контролируем.
 *
 * RLS включён, политик для `anon` нет вообще — ни select, ни insert.
 */
function getClient() {
  if (!hasSupabase || !env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Резервный путь: Telegram недоступен — заявка не теряется. */
export async function saveLeadToSupabase(lead: LeadInput): Promise<boolean> {
  const supabase = getClient();
  if (!supabase) return false;

  const { error } = await supabase.from("leads").insert({
    name: lead.name,
    phone: lead.phone,
    service: lead.service,
    master: lead.master ?? null,
    preferred_time: lead.preferredTime ?? null,
    comment: lead.comment ?? null,
  });

  if (error) {
    console.error("Supabase отказал:", error.message);
    return false;
  }
  return true;
}
