'use client';

import Link from 'next/link';
import {Box, Container, Stack, Typography} from '@mui/material';

export const SiteFooter = () => {
  return (
    <Box component="footer" sx={{borderTop: '1px solid', borderColor: 'divider', py: 4, mt: 8}}>
      <Container maxWidth="xl">
        <Stack direction={{xs: 'column', md: 'row'}} spacing={2} justifyContent="space-between" alignItems={{xs: 'flex-start', md: 'center'}}>
          <Typography variant="body2" color="text.secondary">
            NearHelp frontend foundation is now ready for backend integration.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Typography component={Link} href="/cs/notice" sx={{textDecoration: 'none', color: 'text.secondary'}}>
              Notice
            </Typography>
            <Typography component={Link} href="/cs/faq" sx={{textDecoration: 'none', color: 'text.secondary'}}>
              FAQ
            </Typography>
            <Typography component={Link} href="/admin" sx={{textDecoration: 'none', color: 'text.secondary'}}>
              Admin
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
