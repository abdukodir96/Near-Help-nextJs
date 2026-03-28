'use client';

import Link from 'next/link';
import {AppBar, Box, Button, Container, Stack, Toolbar, Typography} from '@mui/material';
import {useTranslations} from 'next-intl';
import {LocaleSwitcher} from '@/components/layout/locale-switcher';
import {ThemeToggle} from '@/components/layout/theme-toggle';

const mainLinks = [
  {href: '/', key: 'home'},
  {href: '/services', key: 'services'},
  {href: '/agents', key: 'agents'},
  {href: '/community', key: 'community'},
  {href: '/cs', key: 'cs'},
  {href: '/mypage', key: 'mypage'},
  {href: '/notifications', key: 'notifications'}
] as const;

export const SiteHeader = () => {
  const t = useTranslations('navigation');
  const common = useTranslations('common');

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{backdropFilter: 'blur(14px)', borderBottom: '1px solid', borderColor: 'divider'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{gap: 2, minHeight: 76}}>
          <Typography component={Link} href="/" variant="h5" sx={{textDecoration: 'none', color: 'primary.main', fontWeight: 800, mr: 2}}>
            {common('brand')}
          </Typography>

          <Stack direction="row" spacing={1} sx={{display: {xs: 'none', md: 'flex'}, flexGrow: 1}}>
            {mainLinks.map((link) => (
              <Button key={link.href} component={Link} href={link.href} color="inherit">
                {t(link.key)}
              </Button>
            ))}
          </Stack>

          <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            <LocaleSwitcher />
            <ThemeToggle />
            <Button component={Link} href="/auth/login" variant="text">{t('login')}</Button>
            <Button component={Link} href="/auth/signup" variant="contained">{t('signup')}</Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
