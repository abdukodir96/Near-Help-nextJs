'use client';

import Cookies from 'js-cookie';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { localeCookieName, locales, type AppLocale } from '@/lib/i18n/config';

const localeLabels: Record<AppLocale, string> = {
  en: 'English',
  ko: 'Korean',
  uz: "Uzbek",
};

type LocaleSwitcherProps = {
  variant?: 'default' | 'topbar';
};

export const LocaleSwitcher = ({ variant = 'default' }: LocaleSwitcherProps) => {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const baseClassName =
    'outline-none transition appearance-none';
  const variantClassName =
    variant === 'topbar'
      ? 'h-auto border-none bg-transparent px-0 py-0 pr-6 text-base font-medium text-white'
      : 'h-11 rounded-full border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 hover:border-slate-300';

  return (
    <select
      value={locale}
      onChange={(event) => {
        Cookies.set(localeCookieName, event.target.value, { expires: 365 });
        router.refresh();
      }}
      className={`${baseClassName} ${variantClassName}`}
      aria-label="Change language"
    >
      {locales.map((item) => (
        <option key={item} value={item}>
          {localeLabels[item]}
        </option>
      ))}
    </select>
  );
};
