'use client';

import Link from 'next/link';
import {Box, Button, Container, Divider, Paper, Stack, Typography} from '@mui/material';

const adminLinks = [
  {href: '/admin', label: 'Overview'},
  {href: '/admin/users', label: 'Users'},
  {href: '/admin/services', label: 'Services'},
  {href: '/admin/community', label: 'Community'},
  {href: '/admin/cs', label: 'CS'}
];

export const AdminShell = ({children}: {children: React.ReactNode}) => {
  return (
    <Container maxWidth="xl" sx={{py: 5}}>
      <Stack direction={{xs: 'column', lg: 'row'}} spacing={3} alignItems="flex-start">
        <Paper elevation={0} sx={{p: 2, border: '1px solid', borderColor: 'divider', width: {xs: '100%', lg: 260}}}>
          <Typography variant="h6" sx={{fontWeight: 700, mb: 2}}>NearHelp Admin</Typography>
          <Divider sx={{mb: 2}} />
          <Stack spacing={1}>
            {adminLinks.map((link) => (
              <Button
                key={link.href}
                href={link.href}
                LinkComponent={Link}
                color="inherit"
                sx={{justifyContent: 'flex-start'}}
              >
                {link.label}
              </Button>
            ))}
          </Stack>
        </Paper>
        <Box sx={{flex: 1, width: '100%'}}>{children}</Box>
      </Stack>
    </Container>
  );
};
