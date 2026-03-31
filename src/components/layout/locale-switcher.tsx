'use client';

import Cookies from 'js-cookie';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { localeCookieName, locales, type AppLocale } from '@/lib/i18n/config';

export const LocaleSwitcher = () => {
  const locale = useLocale() as AppLocale;
  const router = useRouter();

  return (
    <select
      value={locale}
      onChange={(event) => {
        Cookies.set(localeCookieName, event.target.value, { expires: 365 });
        router.refresh();
      }}
      className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      aria-label="Change language"
    >
      {locales.map((item) => (
        <option key={item} value={item}>
          {item.toUpperCase()}
        </option>
      ))}
    </select>
  );
};
