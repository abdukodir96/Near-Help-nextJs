'use client';

import Link from 'next/link';
import {Box, Button, Grid, Paper, Stack, Typography} from '@mui/material';
import {useTranslations} from 'next-intl';

const quickLinks = [
  {href: '/services', title: 'Services', description: 'Wire service list, filters and detail pages to GraphQL.'},
  {href: '/agents', title: 'Agents', description: 'Connect agent list, profile details and follow flow.'},
  {href: '/community', title: 'Community', description: 'Map articles, comments and likes to the backend.'},
  {href: '/mypage', title: 'My Page', description: 'Hook auth, bookings, favorites, recents and personal dashboards.'},
  {href: '/notifications', title: 'Notifications', description: 'Render real-time and fetched notification data.'},
  {href: '/admin', title: 'Admin', description: 'Bring moderation, CS and management screens online.'}
];

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <Stack spacing={4}>
      <Paper elevation={0} sx={{border: '1px solid', borderColor: 'divider', p: {xs: 3, md: 5}}}>
        <Typography variant="h2" sx={{fontWeight: 800, maxWidth: 880, mb: 2}}>
          {t('title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{maxWidth: 820, mb: 3}}>
          {t('subtitle')}
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Button component={Link} href="/services" variant="contained">Browse services</Button>
          <Button component={Link} href="/auth/login" variant="outlined">Connect auth flow</Button>
        </Stack>
      </Paper>

      <Box>
        <Typography variant="h4" sx={{fontWeight: 700, mb: 2}}>
          {t('featured')}
        </Typography>
        <Grid container spacing={2}>
          {quickLinks.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item.href}>
              <Paper elevation={0} sx={{height: '100%', border: '1px solid', borderColor: 'divider', p: 3}}>
                <Typography variant="h6" sx={{fontWeight: 700, mb: 1}}>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>{item.description}</Typography>
                <Button component={Link} href={item.href} variant="text">Open</Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
}
