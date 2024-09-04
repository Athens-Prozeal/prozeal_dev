'use client';

import { Box, Stack, Typography } from '@mui/material';

import ToolBoxTalkDetail from '@/components/menu/toolboxtalk/view-detail';

const Page = () => {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={5} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">Toolbox Talk Report</Typography>
          <Box sx={{ flexGrow: 1 }}>
            <ToolBoxTalkDetail />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Page;
