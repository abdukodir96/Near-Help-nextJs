export const locales = ['en', 'ko', 'uz'] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = 'en';
export const localeCookieName = 'nearhelp-locale';

export const isAppLocale = (value: string | undefined | null): value is AppLocale => {
  return Boolean(value && locales.includes(value as AppLocale));
};
