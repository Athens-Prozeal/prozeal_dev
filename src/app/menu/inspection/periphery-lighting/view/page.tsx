'use client';

import { Box, Stack, Typography } from '@mui/material';

import PeripheryLightingDetail from '@/components/menu/inspection/periphery-lighting/view-detail';

const Page = () => {
  return (
    <Stack spacing={3} sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ flexWrap: 'wrap' }}>
        <Stack spacing={5} sx={{ flex: '1 1 auto', maxWidth: '100%' }}>
          <Typography variant="h5">Periphery Lighting Inspection Report</Typography>
          <Box sx={{ flexGrow: 1 }}>
            <PeripheryLightingDetail />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Page;
