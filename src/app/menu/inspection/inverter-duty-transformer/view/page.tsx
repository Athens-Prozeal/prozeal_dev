'use client';

import { Box, Stack, Typography } from '@mui/material';

import ViewDetails from '@/components/menu/inspection/inverter-duty-transformer/view-details';

const Page = () => {
  return (
    <Stack spacing={3} sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ flexWrap: 'wrap' }}>
        <Stack spacing={5} sx={{ flex: '1 1 auto', maxWidth: '100%' }}>
          <Typography variant="h5">INVERTER DUTY TRANSFORMER</Typography>
          <Box sx={{ flexGrow: 1 }}>
            <ViewDetails />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Page;
