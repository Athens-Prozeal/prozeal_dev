'use client';

import { Box, Stack, Typography } from '@mui/material';

import GeneralPTWDetail from '@/components/menu/permit-to-work/general/view-details';

const Page = () => {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={5} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">General Permit To work</Typography>
          <Box sx={{ flexGrow: 1 }}>
            <GeneralPTWDetail />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Page;
