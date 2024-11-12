import { Stack, Typography } from '@mui/material';

import  { Form }  from '@/components/menu/inspection/earthing-system/add-forms';

export default function Page() {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={3} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">EARTHING SYSTEM</Typography>
          <Form/>
        </Stack>
      </Stack>
    </Stack>
  );
}
