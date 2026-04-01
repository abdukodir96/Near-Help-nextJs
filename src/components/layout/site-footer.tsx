import Image from 'next/image';
import Link from 'next/link';

const footerLinks = [
  { href: '/services', label: 'Services' },
  { href: '/agents', label: 'Agents' },
  { href: '/community', label: 'Community' },
  { href: '/cs/faq', label: 'FAQ' },
] as const;

export const SiteFooter = () => {
  return (
    <footer className="bg-[#253041] text-white">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-6 py-14 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="max-w-md">
          <Image
            src="/branding/near-help.png"
            alt="NearHelp"
            width={280}
            height={138}
            className="h-14 w-auto object-contain brightness-[1.15]"
          />
          <p className="mt-4 text-sm leading-7 text-white/75">
            NearHelp helps homeowners discover trusted local pros for urgent repair, remodeling, and clean-up work.
          </p>
        </div>

        <div className="flex flex-wrap gap-5 text-sm font-semibold text-white/90">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-[#32c3ff]">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};
