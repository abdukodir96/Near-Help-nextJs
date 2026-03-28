'use client';

import Link from 'next/link';
import {Box, Button, Chip, Paper, Stack, Typography} from '@mui/material';

export const PagePlaceholder = ({
  eyebrow,
  title,
  description,
  links
}: {
  eyebrow?: string;
  title: string;
  description: string;
  links?: Array<{href: string; label: string}>;
}) => {
  return (
    <Paper elevation={0} sx={{border: '1px solid', borderColor: 'divider', p: {xs: 3, md: 5}}}>
      <Stack spacing={3}>
        {eyebrow ? <Chip label={eyebrow} color="primary" sx={{width: 'fit-content'}} /> : null}
        <Box>
          <Typography variant="h3" sx={{fontWeight: 800, mb: 1.5}}>{title}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{maxWidth: 860}}>{description}</Typography>
        </Box>
        {links?.length ? (
          <Stack direction="row" spacing={1.5} flexWrap="wrap">
            {links.map((link) => (
              <Button key={link.href} component={Link} href={link.href} variant="contained">
                {link.label}
              </Button>
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  );
};
