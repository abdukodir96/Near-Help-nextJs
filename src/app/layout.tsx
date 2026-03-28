import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../styles/animate.css';
import '../../styles/flaticon.css';
import '../../styles/font-awesome.min.css';
import '../../styles/themify-icons.css';
import '../../styles/sass/style.scss';
import './globals.css';

import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import {AppProviders} from '@/components/providers/app-providers';

export const metadata = {
  title: 'NearHelp',
  description: 'NearHelp home services marketplace frontend'
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
