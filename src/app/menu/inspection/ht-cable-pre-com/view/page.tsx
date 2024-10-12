'use client';

import { Box, Stack, Typography } from '@mui/material';

import ViewDetails from '@/components/menu/inspection/ht-cable-pre-com/view-details';

const Page = () => {
  return (
    <Stack spacing={3} sx={{ p: { xs: 2, sm: 3 },overflowX:"scroll"  }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ flexWrap: 'wrap' }}>
        <Stack spacing={5} sx={{ flex: '1 1 auto', maxWidth: '100%'}}>
          <Typography variant="h5">HT CABLE PRE COM</Typography>
            <Box sx={{overflowX : "scroll",minWidth:"100%"}} >
            <ViewDetails  />
            </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Page;
