'use client';

import Link from 'next/link';
import { List, X } from 'phosphor-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { ThemeToggle } from '@/components/layout/theme-toggle';

const mainLinks = [
  { href: '/', key: 'home' },
  { href: '/services', key: 'services' },
  { href: '/agents', key: 'agents' },
  { href: '/community', key: 'community' },
  { href: '/cs', key: 'cs' },
  { href: '/mypage', key: 'mypage' },
  { href: '/notifications', key: 'notifications' },
] as const;

export const SiteHeader = () => {
  const t = useTranslations('navigation');
  const common = useTranslations('common');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <Link href="/" className="text-xl font-black tracking-tight text-brand-ink dark:text-white">
          {common('brand')}
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {mainLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? 'bg-brand-teal text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher />
          <ThemeToggle />
          <Link href="/auth/login" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t('login')}
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-full bg-brand-ember px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-500"
          >
            {t('signup')}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 lg:hidden dark:border-slate-700 dark:text-slate-200"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 px-6 py-4 lg:hidden dark:border-slate-800">
          <div className="flex flex-col gap-2">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <LocaleSwitcher />
            <ThemeToggle />
            <Link href="/auth/login" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {t('login')}
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-full bg-brand-ember px-4 py-2 text-sm font-semibold text-white"
            >
              {t('signup')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
