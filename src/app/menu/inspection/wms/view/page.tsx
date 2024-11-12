'use client';

import { Box, Stack, Typography } from '@mui/material';

import WmsDetail from '@/components/menu/inspection/wms/view-detail';

const Page = () => {
  return (
    <Stack spacing={3} sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ flexWrap: 'wrap' }}>
        <Stack spacing={5} sx={{ flex: '1 1 auto', maxWidth: '100%' }}>
          <Typography variant="h5">Wms Inspection Report</Typography>
          <Box sx={{ flexGrow: 1 }}>
            <WmsDetail />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Page;
