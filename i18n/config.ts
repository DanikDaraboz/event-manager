/**
 * Locale codes used inside the app: cookie value, JSON file names,
 * the language switcher and `useLocale()` consumers.
 *
 * We use standard ISO 639-1 codes everywhere (`kk` for Kazakh), so the same
 * value is consumed by `Intl.*` APIs (date / number formatting) and by the
 * `<html lang>` attribute without any mapping.
 */
export const APP_LOCALES = ["en", "ru", "kk"] as const;
export type AppLocale = (typeof APP_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "ru";

/** Cookie name used to persist the user's locale across sessions. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Display label shown in the language switcher. */
export const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "English",
  ru: "Русский",
  kk: "Қазақша",
};

export function isAppLocale(value: string | undefined): value is AppLocale {
  return typeof value === "string" && (APP_LOCALES as readonly string[]).includes(value);
}
