'use client';

import { Box, Stack, Typography } from '@mui/material';

import PaintingDetail from '@/components/menu/inspection/painting/view-detail';

const Page = () => {
  return (
    <Stack spacing={3} sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ flexWrap: 'wrap' }}>
        <Stack spacing={5} sx={{ flex: '1 1 auto', maxWidth: '100%' }}>
          <Typography variant="h5">Painting Inspection Report</Typography>
          <Box sx={{ flexGrow: 1 }}>
            <PaintingDetail />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Page;
