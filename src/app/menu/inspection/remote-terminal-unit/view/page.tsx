'use client';

import { Box, Stack, Typography } from '@mui/material';

import RemoteTerminalUnitDetail from '@/components/menu/inspection/remote-terminal-unit/view-detail';

const Page = () => {
  return (
    <Stack spacing={3} sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ flexWrap: 'wrap' }}>
        <Stack spacing={5} sx={{ flex: '1 1 auto', maxWidth: '100%' }}>
          <Typography variant="h5">Remote Terminal Unit Inspection Report</Typography>
          <Box sx={{ flexGrow: 1 }}>
            <RemoteTerminalUnitDetail />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Page;
