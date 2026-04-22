'use client';

import { ApolloProvider } from '@apollo/client/react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { NextIntlClientProvider } from 'next-intl';
import { useMemo } from 'react';
import { createApolloClient } from '@/lib/apollo/client';
import type { AbstractIntlMessages } from 'next-intl';
import type { AppLocale } from '@/lib/i18n/config';

export const AppProviders = ({
  children,
  locale,
  messages,
  timeZone,
}: {
  children: React.ReactNode;
  locale: AppLocale;
  messages: AbstractIntlMessages;
  timeZone: string;
}) => {
  const apolloClient = useMemo(() => createApolloClient(), []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: '#0f766e',
          },
          secondary: {
            main: '#f97316',
          },
          background: {
            default: '#f8fafc',
            paper: '#ffffff',
          },
        },
        shape: {
          borderRadius: 18,
        },
        typography: {
          fontFamily: 'var(--font-geist-sans), sans-serif',
        },
      }),
    [],
  );

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ApolloProvider>
    </NextIntlClientProvider>
  );
};
