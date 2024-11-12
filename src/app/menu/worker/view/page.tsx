'use client';

import { Box, Stack, Typography } from '@mui/material';

import WorkerDetail from '@/components/menu/worker/view-detail';

const Page = () => {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={5} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">Worker Detail</Typography>
          <Box sx={{ flexGrow: 1 }}>
            <WorkerDetail />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Page;
