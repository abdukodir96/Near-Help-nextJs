'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  FacebookLogo,
  InstagramLogo,
  PaperPlaneTilt,
  PhoneCall,
  TwitterLogo,
} from 'phosphor-react';

const popularSearchLinks = [
  { href: '/services', label: 'Emergency plumbing' },
  { href: '/services', label: 'Gas line services' },
  { href: '/services', label: 'Bathroom remodeling' },
  { href: '/services', label: 'Clean-up services' },
] as const;

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Our Services' },
  { href: '/agents', label: 'Agents' },
  { href: '/community', label: 'Community' },
  { href: '/cs', label: 'Contact Support' },
  { href: '/cs/faq', label: 'FAQs' },
] as const;

const discoverLinks = [
  { href: '/services', label: 'Seoul' },
  { href: '/services', label: 'Gyeonggido' },
  { href: '/services', label: 'Busan' },
  { href: '/services', label: 'Jejudo' },
] as const;

const socialLinks = [
  { href: '#', label: 'Facebook', icon: FacebookLogo },
  { href: '#', label: 'Telegram', icon: PaperPlaneTilt },
  { href: '#', label: 'Instagram', icon: InstagramLogo },
  { href: '#', label: 'Twitter', icon: TwitterLogo },
] as const;

export const SiteFooter = () => {
  return (
    <footer className="bg-[#1b1d23] text-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-16 xl:grid-cols-[0.9fr_1.35fr] xl:gap-24">
          <div className="space-y-12">
            <Link prefetch={false} href="/" className="inline-flex items-center" aria-label="NearHelp home">
              <Image
                src="/branding/near-help.png"
                alt="NearHelp"
                width={3444}
                height={1691}
                className="h-16 w-auto object-contain brightness-0 invert lg:h-[4.6rem]"
              />
            </Link>

            <div className="space-y-10 text-white/72">
              <div className="space-y-1.5">
                <p className="text-[1.05rem] font-medium">Total Free Customer Care</p>
                <a
                  href="tel:+821048672909"
                  className="inline-flex items-center gap-2 text-[1.8rem] font-semibold tracking-tight text-white transition hover:text-[#66b3ff]"
                >
                  <PhoneCall size={20} weight="duotone" className="text-[#66b3ff]" />
                  +82 10 4867 2909
                </a>
              </div>

              <div className="space-y-1.5">
                <p className="text-[1.05rem] font-medium">Need Live Support?</p>
                <a
                  href="tel:+821048672909"
                  className="block text-[1.8rem] font-semibold tracking-tight text-white transition hover:text-[#66b3ff]"
                >
                  +82 10 4867 2909
                </a>
                <p className="text-[1.02rem] leading-7 text-white/58">
                  We help homeowners with urgent bookings, project updates, and service questions every day.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-[1.7rem] font-extrabold tracking-tight text-white">Follow Us On Social Media</h3>
              <div className="mt-5 flex flex-wrap gap-4">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/72 transition duration-300 hover:-translate-y-1 hover:border-[#0052da] hover:bg-[#0052da] hover:text-white"
                  >
                    <Icon size={22} weight="fill" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-14">
            <div>
              <h3 className="text-[1.8rem] font-extrabold tracking-tight text-white">Keep Yourself Up To Date</h3>
              <form className="mt-6 flex flex-col gap-3 rounded-[1.75rem] bg-white/5 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:flex-row sm:items-center">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="min-h-[4.6rem] flex-1 rounded-[1.3rem] border border-transparent bg-transparent px-6 text-lg text-white placeholder:text-white/35 focus:border-[#0052da] focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex min-h-[4.6rem] items-center justify-center rounded-[1.3rem] bg-[#0052da] px-8 text-lg font-semibold text-white transition duration-300 hover:bg-[#0a46aa] hover:shadow-[0_18px_30px_rgba(0,82,218,0.26)]"
                >
                  Subscribe
                </button>
              </form>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-3">
              <div>
                <h4 className="text-[1.45rem] font-extrabold tracking-tight text-white">Popular Search</h4>
                <ul className="mt-6 space-y-4 text-[1.06rem] text-white/64">
                  {popularSearchLinks.map((link) => (
                    <li key={link.label}>
                      <Link prefetch={false} href={link.href} className="transition hover:text-[#66b3ff]">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[1.45rem] font-extrabold tracking-tight text-white">Quick Links</h4>
                <ul className="mt-6 space-y-4 text-[1.06rem] text-white/64">
                  {quickLinks.map((link) => (
                    <li key={link.label}>
                      <Link prefetch={false} href={link.href} className="transition hover:text-[#66b3ff]">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[1.45rem] font-extrabold tracking-tight text-white">Discover</h4>
                <ul className="mt-6 space-y-4 text-[1.06rem] text-white/64">
                  {discoverLinks.map((link) => (
                    <li key={link.label}>
                      <Link prefetch={false} href={link.href} className="transition hover:text-[#66b3ff]">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/6 pt-8 text-[1rem] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© NearHelp - All rights reserved. NearHelp 2026</p>
          <div className="flex flex-wrap items-center gap-3">
            <a href="#" className="transition hover:text-[#66b3ff]">
              Privacy
            </a>
            <span className="text-white/20">•</span>
            <a href="#" className="transition hover:text-[#66b3ff]">
              Terms
            </a>
            <span className="text-white/20">•</span>
            <a href="#" className="transition hover:text-[#66b3ff]">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
