'use client';

import { ApolloProvider } from '@apollo/client/react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { NextIntlClientProvider } from 'next-intl';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createApolloClient } from '@/lib/apollo/client';
import type { AbstractIntlMessages } from 'next-intl';
import type { AppLocale } from '@/lib/i18n/config';

export type ThemeMode = 'light' | 'dark';

type ThemeModeContextValue = {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);
const THEME_STORAGE_KEY = 'nearhelp-theme-mode';

export const AppProviders = ({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: AppLocale;
  messages: AbstractIntlMessages;
}) => {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const apolloClient = useMemo(() => createApolloClient(), []);

  useEffect(() => {
    const storedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
    const nextMode = storedMode === 'dark' ? 'dark' : 'light';
    setModeState(nextMode);
    document.documentElement.classList.toggle('dark', nextMode === 'dark');
  }, []);

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
    document.documentElement.classList.toggle('dark', nextMode === 'dark');
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }, [mode, setMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#0f766e',
          },
          secondary: {
            main: '#f97316',
          },
          background: {
            default: mode === 'light' ? '#f8fafc' : '#020617',
            paper: mode === 'light' ? '#ffffff' : '#0f172a',
          },
        },
        shape: {
          borderRadius: 18,
        },
        typography: {
          fontFamily: 'var(--font-geist-sans), sans-serif',
        },
      }),
    [mode],
  );

  const value = useMemo(() => ({ mode, toggleMode, setMode }), [mode, setMode, toggleMode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ApolloProvider client={apolloClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </ApolloProvider>
      </NextIntlClientProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error('useThemeMode must be used inside AppProviders');
  }

  return context;
};
