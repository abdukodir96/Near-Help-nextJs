import {cookies} from 'next/headers';
import {getRequestConfig} from 'next-intl/server';
import {defaultLocale, localeCookieName, locales, type AppLocale} from './config';

export default getRequestConfig(async () => {
  const localeFromCookie = cookies().get(localeCookieName)?.value;
  const locale = locales.includes(localeFromCookie as AppLocale)
    ? (localeFromCookie as AppLocale)
    : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
