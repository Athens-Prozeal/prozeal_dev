'use client';

import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

import ToolBoxTalkForm from '@/components/menu/toolboxtalk/add-form';

const Page = () => {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={5} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">Add Tool Box Talk</Typography>
          <Box sx={{ flexGrow: 1 }}>
            <ToolBoxTalkForm />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Page;
