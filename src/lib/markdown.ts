/**
 * `parse_mode: MarkdownV2` требует экранирования служебных символов в *любом*
 * тексте, включая пользовательский. Имя «Пётр-Иван» роняет запрос с 400,
 * если дефис не экранирован.
 *
 * Живёт отдельно от `telegram.ts`: та тянет секреты и `server-only`, а это —
 * чистая функция, которую можно покрыть юнит-тестом.
 */
const MARKDOWN_V2_SPECIALS = /[_*[\]()~`>#+\-=|{}.!\\]/g;

export function escapeMd(text: string): string {
  return text.replace(MARKDOWN_V2_SPECIALS, "\\$&");
}
