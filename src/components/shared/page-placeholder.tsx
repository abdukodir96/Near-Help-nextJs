import Link from 'next/link';

type PagePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  links?: Array<{ href: string; label: string }>;
};

export const PagePlaceholder = ({ eyebrow, title, description, links = [] }: PagePlaceholderProps) => {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-14 lg:px-10">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-teal">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-black leading-tight text-brand-ink dark:text-white">{title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>

        {links.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
