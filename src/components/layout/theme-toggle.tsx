'use client';

import { Moon, SunDim } from 'phosphor-react';
import { useThemeMode } from '@/components/providers/app-providers';

export const ThemeToggle = () => {
  const { mode, toggleMode } = useThemeMode();

  return (
    <button
      type="button"
      onClick={toggleMode}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-label="Toggle theme"
    >
      {mode === 'light' ? <Moon size={18} weight="bold" /> : <SunDim size={18} weight="bold" />}
    </button>
  );
};
