import Link from 'next/link';

const adminLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/community', label: 'Community' },
  { href: '/admin/cs', label: 'CS' },
] as const;

export const AdminShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr] lg:px-10">
        <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-teal">NearHelp Admin</p>
          <nav className="mt-6 flex flex-col gap-2">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                prefetch={false}
                href={link.href}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div>{children}</div>
      </div>
    </div>
  );
};
