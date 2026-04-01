'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CaretDown, Clock, List, PhoneCall, X } from 'phosphor-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';

const mainLinks = [
  { href: '/', key: 'home' },
  { href: '/services', key: 'services' },
  { href: '/agents', key: 'agents' },
  { href: '/community', key: 'community' },
  { href: '/cs', key: 'cs' },
  { href: '/mypage', key: 'mypage' },
] as const;

export const SiteHeader = () => {
  const t = useTranslations('navigation');
  const common = useTranslations('common');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(16,24,40,0.06)]">
      <div className="hidden bg-[#253041] text-white lg:block">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3 text-[1.05rem] font-medium text-white/95">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white text-[#0fb5ff]">
              <Clock size={22} weight="duotone" />
            </span>
            <span>Sun - Fri || 8:00 - 7:00</span>
          </div>

          <div className="flex items-center gap-5 text-[1.05rem] text-white/95">
            <div className="flex items-center gap-3">
              <PhoneCall size={26} className="text-[#08c2ff]" weight="duotone" />
              <span className="font-medium">+82 10 2469 4424</span>
            </div>
            <span className="h-7 w-px bg-white/30" />
            <div className="relative flex items-center">
              <LocaleSwitcher variant="topbar" />
              <CaretDown
                size={14}
                weight="bold"
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-white/90"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-6 py-5 lg:px-10">
        <Link href="/" className="flex items-center" aria-label={common('brand')}>
          <Image
            src="/branding/near-help.png"
            alt={common('brand')}
            width={320}
            height={157}
            priority
            className="h-[4.4rem] w-auto object-contain lg:h-[4.9rem]"
          />
        </Link>

        <nav className="hidden items-center gap-3 xl:flex">
          {mainLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-[1.15rem] font-semibold transition ${
                  active ? 'text-[#0052da]' : 'text-[#253041] hover:text-[#0052da]'
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 xl:flex">
          <Link
            href="/#booking"
            className="inline-flex min-h-[4.25rem] min-w-[11rem] items-center justify-center rounded-2xl bg-[#0052da] px-7 text-lg font-semibold text-white transition hover:bg-[#0246b7]"
          >
            GET FREE QUOTE
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-700 xl:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-5 xl:hidden">
          <div className="flex flex-col gap-2">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-4 py-3 text-base font-semibold text-[#253041] transition hover:bg-slate-100"
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <div className="relative">
              <LocaleSwitcher />
              <CaretDown
                size={14}
                weight="bold"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>
            <Link href="/auth/login" className="text-sm font-semibold text-[#253041]">
              {t('login')}
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-full bg-[#0052da] px-5 py-2 text-sm font-semibold text-white"
            >
              {t('signup')}
            </Link>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <Clock size={18} />
            <span>Sun - Fri || 8:00 - 7:00</span>
          </div>
        </div>
      )}
    </header>
  );
};
