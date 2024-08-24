'use client';

import { Box, Stack, Typography } from '@mui/material';

import ExcavationDetail from '@/components/menu/inspection/excavation/view-detail';

const Page = () => {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={5} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">Excavation Inspection Report</Typography>
          <Box sx={{ flexGrow: 1 }}>
            <ExcavationDetail />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Page;
