'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useQuery } from '@apollo/client/react';
import { CaretUp, UsersThree, Wrench, ChatsCircle, Headset } from 'phosphor-react';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';
import { GET_ME } from '@/lib/graphql/queries';
import { getAssetUrl } from '@/lib/config/env';

type NavSection = {
  key: string;
  label: string;
  icon: React.ElementType;
  items: { label: string; href: string }[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    key: 'users',
    label: 'Users',
    icon: UsersThree,
    items: [{ label: 'List', href: '/admin/users' }],
  },
  {
    key: 'services',
    label: 'Services',
    icon: Wrench,
    items: [{ label: 'List', href: '/admin/services' }],
  },
  {
    key: 'community',
    label: 'Community',
    icon: ChatsCircle,
    items: [{ label: 'List', href: '/admin/blog' }],
  },
  {
    key: 'cs',
    label: 'Cs',
    icon: Headset,
    items: [{ label: 'Notice', href: '/admin/cs' }],
  },
];

export const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = !!Cookies.get(ACCESS_TOKEN_KEY);

  const { data, loading } = useQuery<{
    getMember: {
      memberNick: string;
      memberPhone?: string;
      memberImage?: string;
      memberType: string;
    };
  }>(GET_ME, {
    skip: !isLoggedIn,
    fetchPolicy: 'network-only',
  });

  const member = data?.getMember;
  const isAdmin = isLoggedIn && member?.memberType === 'ADMIN';
  const checking = isLoggedIn && loading;

  const defaultOpen = NAV_SECTIONS.find((s) =>
    s.items.some((i) => pathname.startsWith(i.href)),
  )?.key ?? NAV_SECTIONS[0].key;

  const [openSection, setOpenSection] = useState<string>(defaultOpen);

  useEffect(() => {
    if (checking) return;
    if (!isAdmin) router.replace('/');
  }, [checking, isAdmin, router]);

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-semibold text-slate-400">Checking access...</p>
      </div>
    );
  }

  const avatarUrl = getAssetUrl(member?.memberImage) || '/theme/images/team/2.jpg';

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* ── Sidebar ── */}
      <aside className="flex w-[260px] shrink-0 flex-col border-r border-slate-200 bg-white">
        {/* Header title */}
        <div className="px-6 pt-7 pb-1">
          <p className="text-[0.7rem] font-black tracking-[0.3em] text-slate-700 uppercase">Admin Panel</p>
        </div>

        {/* Logo circle */}
        <div className="flex items-center justify-center py-6">
          <div
            className="flex h-[140px] w-[140px] items-center justify-center rounded-full p-[3px]"
            style={{ background: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #a855f7 100%)' }}
          >
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
              <Image
                src="/branding/near-help.png"
                alt="NearHelp"
                width={110}
                height={54}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto px-4 pb-6">
          {NAV_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isOpen = openSection === section.key;
            const hasActive = section.items.some((i) => pathname.startsWith(i.href));

            return (
              <div key={section.key} className="mb-5">
                {/* Section header */}
                <button
                  type="button"
                  onClick={() => setOpenSection(isOpen ? '' : section.key)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-4 transition-colors ${
                    hasActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <Icon
                      size={24}
                      weight={hasActive ? 'fill' : 'regular'}
                      className={hasActive ? 'text-slate-800' : 'text-slate-400'}
                    />
                    <span className="text-base font-semibold">{section.label}</span>
                  </span>
                  <CaretUp
                    size={16}
                    weight="bold"
                    className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-0' : 'rotate-180'}`}
                  />
                </button>

                {/* Sub-items */}
                {isOpen && (
                  <div className="ml-10 mt-2 flex flex-col gap-1">
                    {section.items.map((item) => {
                      const active = pathname === item.href || pathname.startsWith(item.href + '/');
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          prefetch={false}
                          className={`rounded-xl px-4 py-2.5 text-sm transition-colors ${
                            active
                              ? 'font-bold text-slate-900'
                              : 'font-medium text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom: back to site */}
        <div className="border-t border-slate-100 px-4 py-4">
          <Link
            href="/mypage"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
          >
            <span>← Back to My Page</span>
          </Link>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
          <p className="text-sm font-semibold text-slate-500">
            {NAV_SECTIONS.find((s) => s.items.some((i) => pathname.startsWith(i.href)))?.label ?? 'Dashboard'}
          </p>
          <Link href="/mypage" className="flex items-center gap-2.5">
            <span className="text-sm font-semibold text-slate-700">{member?.memberNick}</span>
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-slate-200">
              <Image src={avatarUrl} alt={member?.memberNick ?? 'Admin'} fill className="object-cover" />
            </div>
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};
