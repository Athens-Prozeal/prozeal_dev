import { Stack, Typography } from '@mui/material';

import { Form } from '@/components/menu/inspection/roof-top-097/add-form';

export default function Page() {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={5} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">Roof Top IMS/FOR/PR/097 Inspection</Typography>
          <Form/>
        </Stack>
      </Stack>
    </Stack>
  );
}
