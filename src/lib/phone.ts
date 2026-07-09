/**
 * Своя маска вместо библиотеки: библиотечные маски ломают вставку из буфера и
 * autofill. Пятнадцать строк ведут себя предсказуемо.
 *
 * Храним и валидируем номер в нормализованном виде `+7XXXXXXXXXX`,
 * показываем `+7 (999) 123-45-67`.
 */

export const PHONE_PATTERN = /^\+7\d{10}$/;

export function digitsOf(value: string): string {
  return value.replace(/\D/g, "");
}

/** `8 (999) 123-45-67`, `+7 999 1234567`, `9991234567` — всё это один и тот же номер. */
export function normalizePhone(raw: string): string {
  let digits = digitsOf(raw);
  if (!digits) return "";

  // Российская восьмёрка и семёрка — одна и та же страна.
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  // Номер без кода страны: `9991234567`.
  else if (!digits.startsWith("7")) digits = `7${digits}`;

  return `+${digits.slice(0, 11)}`;
}

export function formatPhone(value: string): string {
  const digits = digitsOf(normalizePhone(value));
  if (!digits) return "";

  const subscriber = digits.slice(1);
  let out = "+7";
  if (subscriber.length > 0) out += ` (${subscriber.slice(0, 3)}`;
  if (subscriber.length >= 3) out += ")";
  if (subscriber.length > 3) out += ` ${subscriber.slice(3, 6)}`;
  if (subscriber.length > 6) out += `-${subscriber.slice(6, 8)}`;
  if (subscriber.length > 8) out += `-${subscriber.slice(8, 10)}`;
  return out;
}

/**
 * Backspace по разделителю (`)`, `-`, пробелу) не меняет цифры, и маска тут же
 * возвращает символ на место — курсор упирается. Значит удаляем последнюю цифру сами.
 */
export function applyPhoneEdit(previous: string, next: string): string {
  const isDeletion = next.length < previous.length;
  const sameDigits = digitsOf(next) === digitsOf(previous);

  if (isDeletion && sameDigits) {
    return formatPhone(digitsOf(next).slice(0, -1));
  }
  return formatPhone(next);
}
