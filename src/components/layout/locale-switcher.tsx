'use client';

import {FormControl, MenuItem, Select, SelectChangeEvent} from '@mui/material';
import {useLocale} from 'next-intl';
import {useRouter} from 'next/navigation';
import {localeCookieName} from '@/i18n/config';

export const LocaleSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();

  const handleChange = (event: SelectChangeEvent) => {
    const nextLocale = event.target.value;
    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };

  return (
    <FormControl size="small" sx={{minWidth: 110}}>
      <Select value={locale} onChange={handleChange} sx={{backgroundColor: 'background.paper'}}>
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="ko">한국어</MenuItem>
      </Select>
    </FormControl>
  );
};
