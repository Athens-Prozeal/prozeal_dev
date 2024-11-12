import React from 'react';
import type { Metadata } from 'next';
import { Box, Stack, Typography } from '@mui/material';

import { config } from '@/config';
import {PTWGeneral} from '@/components/menu/permit-to-work/general/add-form';

export const metadata = { title: `Permit To Work | Add | ${config.site.name}` } satisfies Metadata;

const Page = () => {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={5} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">General Permit To Work</Typography>
          <Box sx={{ flexGrow: 1 }}>
            <PTWGeneral />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Page;
