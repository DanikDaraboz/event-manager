import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isAppLocale } from "./config";

/**
 * Cookie-based locale resolution — no URL prefixes, no middleware required.
 * The user's choice lives in the `NEXT_LOCALE` cookie set by the LocaleSwitcher.
 */
export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale = isAppLocale(cookieValue) ? cookieValue : DEFAULT_LOCALE;

  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
