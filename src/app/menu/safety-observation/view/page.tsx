'use client';

import { Box, Stack, Typography } from '@mui/material';

import SafetyObservationDetail from '@/components/menu/safety-observation/view-detail';

const Page = () => {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={5} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">Safety Observation</Typography>
          <Box sx={{ flexGrow: 1 }}>
            <SafetyObservationDetail />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Page;
