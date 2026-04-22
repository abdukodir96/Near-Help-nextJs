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
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-teal">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-black leading-tight text-brand-ink">{title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>

        {links.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                prefetch={false}
                href={link.href}
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
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
