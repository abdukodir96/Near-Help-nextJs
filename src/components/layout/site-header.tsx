'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CaretDown, Clock, List, PhoneCall, X } from 'phosphor-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTopbar, setShowTopbar] = useState(true);
  const lastScrollYRef = useRef(0);
  const lastToggleAtRef = useRef(0);
  const showTopbarRef = useRef(true);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const syncTopbar = (next: boolean, now: number) => {
      if (showTopbarRef.current === next) {
        return;
      }

      showTopbarRef.current = next;
      lastToggleAtRef.current = now;
      setShowTopbar(next);
    };

    const updateHeaderState = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      const delta = currentScrollY - lastScrollY;
      const absDelta = Math.abs(delta);
      const now = performance.now();

      setIsScrolled(currentScrollY > 32);

      if (currentScrollY <= 24) {
        syncTopbar(true, now);
        lastScrollYRef.current = currentScrollY;
        frameRef.current = null;
        return;
      }

      const canToggle = now - lastToggleAtRef.current > 420;

      if (canToggle && absDelta > 10) {
        if (delta > 0 && currentScrollY > 140) {
          syncTopbar(false, now);
        } else if (delta < 0) {
          syncTopbar(true, now);
        }
      }

      lastScrollYRef.current = currentScrollY;
      frameRef.current = null;
    };

    const handleScroll = () => {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(updateHeaderState);
    };

    lastScrollYRef.current = window.scrollY;
    updateHeaderState();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-slate-200/80 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-500 ${
        isScrolled
          ? 'bg-white/92 shadow-[0_22px_54px_rgba(15,23,42,0.14)] backdrop-blur-xl'
          : 'bg-white shadow-[0_10px_30px_rgba(16,24,40,0.06)]'
      }`}
    >
      <div
        className={`hidden overflow-hidden bg-[#253041] text-white transition-[max-height,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block ${
          showTopbar ? 'max-h-28 translate-y-0 opacity-100' : 'pointer-events-none max-h-0 -translate-y-6 opacity-0'
        }`}
        aria-hidden={!showTopbar}
      >
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

      <div
        className={`mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:px-10 ${
          isScrolled ? 'py-3.5' : 'py-5'
        }`}
      >
        <Link prefetch={false} href="/" className="flex items-center" aria-label={common('brand')}>
          <Image
            src="/branding/near-help.png"
            alt={common('brand')}
            width={320}
            height={157}
            priority
            className={`w-auto object-contain transition-all duration-500 ${
              isScrolled ? 'h-[3.9rem] lg:h-[4.2rem]' : 'h-[4.4rem] lg:h-[4.9rem]'
            }`}
          />
        </Link>

        <nav className="hidden items-center gap-3 xl:flex">
          {mainLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                prefetch={false}
                href={link.href}
                className={`group relative px-3 py-2 text-[1.15rem] font-semibold transition-colors duration-300 ${
                  active ? 'text-[#0052da]' : 'text-[#253041] hover:text-[#0052da]'
                }`}
              >
                <span>{t(link.key)}</span>
                <span
                  className={`absolute bottom-0 left-3 right-3 h-[3px] origin-left rounded-full bg-[#0052da] transition-transform duration-300 ease-out ${
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 xl:flex">
          <Link
            prefetch={false}
            href="/#booking"
            className={`inline-flex min-w-[11rem] items-center justify-center bg-[#0052da] px-7 text-lg font-semibold text-white transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#0246b7] hover:shadow-[0_18px_30px_rgba(0,82,218,0.24)] ${
              isScrolled ? 'min-h-[3.65rem] rounded-[1.35rem]' : 'min-h-[4.25rem] rounded-2xl'
            }`}
          >
            GET FREE QUOTE
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition xl:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-5 xl:hidden">
          <div className="flex flex-col gap-2">
            {mainLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  prefetch={false}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-base font-semibold transition ${
                    active ? 'bg-blue-50 text-[#0052da]' : 'text-[#253041] hover:bg-slate-100'
                  }`}
                >
                  {t(link.key)}
                </Link>
              );
            })}
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
            <Link prefetch={false} href="/auth/login" className="text-sm font-semibold text-[#253041]">
              {t('login')}
            </Link>
            <Link
              prefetch={false}
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
