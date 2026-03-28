'use client';

import Link from 'next/link';
import {Box, Container, Paper, Typography} from '@mui/material';

export const AuthShell = ({children}: {children: React.ReactNode}) => {
  return (
    <Box sx={{minHeight: '100vh', display: 'grid', placeItems: 'center', px: 2, py: 6}}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{p: {xs: 3, md: 5}, border: '1px solid', borderColor: 'divider'}}>
          <Typography component={Link} href="/" variant="h4" sx={{textDecoration: 'none', color: 'primary.main', fontWeight: 800}}>
            NearHelp
          </Typography>
          <Box sx={{mt: 3}}>{children}</Box>
        </Paper>
      </Container>
    </Box>
  );
};
