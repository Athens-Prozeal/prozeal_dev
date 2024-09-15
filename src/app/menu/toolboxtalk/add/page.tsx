import React from 'react';
import type { Metadata } from 'next';
import { Box, Stack, Typography } from '@mui/material';

import { config } from '@/config';
import ToolBoxTalkForm from '@/components/menu/toolboxTalk/add-form';

export const metadata = { title: `Toolbox Talk | Add | ${config.site.name}` } satisfies Metadata;

const Page = () => {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={5} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">Add Toolbox Talk</Typography>
          <Box sx={{ flexGrow: 1 }}>
            <ToolBoxTalkForm />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Page;
