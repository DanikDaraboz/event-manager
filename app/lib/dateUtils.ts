/**
 * Convert an ISO datetime string into the format consumed by
 * `<input type="datetime-local">` (`YYYY-MM-DDTHH:mm`) in local time.
 */
export function toDatetimeLocalValue(iso: string | undefined | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const tzOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
}

/** Convert a `<input type="datetime-local">` value back to an ISO string. */
export function fromDatetimeLocalValue(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString();
}

export function isPastDate(iso: string): boolean {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;
  return date.getTime() < Date.now();
}

/**
 * Locale-independent display format for events: `DD.MM.YYYY, HH:MM` in local
 * time. We avoid `Intl.DateTimeFormat` here because some browser builds lack
 * ICU data for less common locales (e.g. Kazakh) and silently fall back to
 * English month names — using plain numbers gives a consistent result for
 * every language.
 */
export function formatEventDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const dd = pad(date.getDate());
  const mm = pad(date.getMonth() + 1);
  const yyyy = date.getFullYear();
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${dd}.${mm}.${yyyy}, ${hh}:${min}`;
}
