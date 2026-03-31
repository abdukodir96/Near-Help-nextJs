import Link from 'next/link';

const footerLinks = [
  { href: '/cs/notice', label: 'Notice' },
  { href: '/cs/faq', label: 'FAQ' },
  { href: '/admin', label: 'Admin' },
] as const;

export const SiteFooter = () => {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 lg:flex-row lg:items-center lg:justify-between lg:px-10 dark:text-slate-400">
        <p>NearHelp frontend foundation is now ready for backend integration.</p>
        <div className="flex flex-wrap gap-4">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="font-semibold text-slate-700 dark:text-slate-200">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};
