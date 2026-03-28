'use client';

import {Container} from '@mui/material';
import {SiteFooter} from '@/components/layout/site-footer';
import {SiteHeader} from '@/components/layout/site-header';

export const MainShell = ({children}: {children: React.ReactNode}) => {
  return (
    <>
      <SiteHeader />
      <Container maxWidth="xl" sx={{py: 5}}>
        {children}
      </Container>
      <SiteFooter />
    </>
  );
};
