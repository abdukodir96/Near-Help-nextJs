import Link from 'next/link';

export const AuthShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-6 py-10 text-white">
      <div className="absolute inset-0 bg-hero-grid opacity-70" />
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div className="hidden rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-soft backdrop-blur lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-200">NearHelp</p>
          <h1 className="mt-4 text-5xl font-black leading-tight">
            Trusted home service marketplace for repairs, remodeling and support.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300">
            We are rebuilding the frontend on a clean foundation, so auth and dashboard flows can now be connected
            to the real backend without template debt.
          </p>
          <Link href="/" className="mt-8 inline-flex rounded-full border border-white/20 px-5 py-3 text-sm font-semibold">
            Back to home
          </Link>
        </div>
        <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/95 p-6 text-slate-900 shadow-soft backdrop-blur md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};
