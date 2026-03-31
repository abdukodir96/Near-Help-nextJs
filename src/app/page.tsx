import Link from 'next/link';

const routeCards = [
  {
    href: '/services',
    title: 'Services',
    description: 'Browse repair, plumbing, electrical, remodeling and cleaning flows.',
  },
  {
    href: '/agents',
    title: 'Agents',
    description: 'Connect agent profile, ranking, portfolio and follow experiences.',
  },
  {
    href: '/community',
    title: 'Community',
    description: 'Wire articles, comments, replies and likes to the backend.',
  },
  {
    href: '/mypage',
    title: 'My Page',
    description: 'Expose bookings, favorites, recent visits, followers and account tools.',
  },
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-hero-grid">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-10 lg:px-10">
        <header className="flex flex-col gap-6 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-teal">NearHelp</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight text-brand-ink md:text-6xl">
              Clean frontend foundation is ready. Now we build the real marketplace on top of it.
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/services"
              className="rounded-full bg-brand-teal px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Open services
            </Link>
            <Link
              href="/community"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Open community
            </Link>
          </div>
        </header>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {routeCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-brand-ember/40"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-sand text-lg font-bold text-brand-ember">
                {card.title.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-brand-ink transition group-hover:text-brand-teal">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
              <span className="mt-6 inline-flex text-sm font-semibold text-brand-teal">Go to page</span>
            </Link>
          ))}
        </div>

        <section className="mt-8 grid gap-6 rounded-[2rem] border border-slate-200 bg-brand-ink px-6 py-8 text-white shadow-soft lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-200">Next step</p>
            <h2 className="mt-3 text-3xl font-black leading-tight">
              We can now wire auth, GraphQL, and route layouts without fighting the old template.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              This project is now a clean Next.js App Router base with Tailwind ready for styling.
              From here, we can layer in Apollo Client, i18n, and backend-connected pages in a controlled way.
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-white/10 p-5">
            <p className="text-sm font-semibold text-teal-100">Suggested build order</p>
            <ol className="mt-4 space-y-3 text-sm text-slate-200">
              <li>1. Shared app providers and route layouts</li>
              <li>2. Login and signup wired to backend auth</li>
              <li>3. Services list and service detail pages</li>
              <li>4. Agents, community, my page and notifications</li>
            </ol>
          </div>
        </section>
      </section>
    </main>
  );
}
