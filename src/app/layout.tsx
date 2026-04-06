import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import localFont from 'next/font/local';
import './globals.css';
import { AppProviders } from '@/components/providers/app-providers';
import { defaultLocale, isAppLocale, localeCookieName, type AppLocale } from '@/lib/i18n/config';
import enMessages from '@/messages/en.json';
import koMessages from '@/messages/ko.json';
import uzMessages from '@/messages/uz.json';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const messageMap = {
  en: enMessages,
  ko: koMessages,
  uz: uzMessages,
} as const satisfies Record<AppLocale, typeof enMessages>;

const APP_TIME_ZONE = 'Asia/Seoul';

export const metadata: Metadata = {
  title: 'NearHelp',
  description: 'NearHelp home services marketplace frontend',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '66x66' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-icon.png', type: 'image/png', sizes: '66x66' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieLocale = cookies().get(localeCookieName)?.value;
  const locale = isAppLocale(cookieLocale) ? cookieLocale : defaultLocale;
  const messages = messageMap[locale];

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <AppProviders locale={locale} messages={messages} timeZone={APP_TIME_ZONE}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
