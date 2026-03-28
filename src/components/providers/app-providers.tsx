'use client';

import {CssBaseline, ThemeProvider, createTheme} from '@mui/material';
import {createContext, useCallback, useContext, useMemo, useState} from 'react';
import {ApolloProvider} from '@apollo/client/react';
import {createApolloClient} from '@/lib/apollo/client';

type ColorMode = 'light' | 'dark';

type ThemeModeContextValue = {
  mode: ColorMode;
  toggleMode: () => void;
  setMode: (mode: ColorMode) => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);
const THEME_STORAGE_KEY = 'nearhelp_theme_mode';

const readInitialMode = (): ColorMode => {
  if (typeof window === 'undefined') return 'light';
  const storedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedMode === 'dark' ? 'dark' : 'light';
};

export const AppProviders = ({children}: {children: React.ReactNode}) => {
  const [mode, setModeState] = useState<ColorMode>(readInitialMode);
  const apolloClient = useMemo(() => createApolloClient(), []);

  const setMode = useCallback((value: ColorMode) => {
    setModeState(value);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, value);
    }
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
            main: '#0f766e'
          },
          secondary: {
            main: '#f97316'
          },
          background: {
            default: mode === 'light' ? '#f8fafc' : '#0f172a',
            paper: mode === 'light' ? '#ffffff' : '#111827'
          }
        },
        shape: {
          borderRadius: 16
        },
        typography: {
          fontFamily: 'inherit'
        }
      }),
    [mode]
  );

  const value = useMemo(() => ({mode, toggleMode, setMode}), [mode, setMode, toggleMode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ApolloProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = (): ThemeModeContextValue => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used inside AppProviders');
  }

  return context;
};
