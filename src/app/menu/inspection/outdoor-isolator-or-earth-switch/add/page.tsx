import { Stack, Typography } from '@mui/material';

import { Form } from '@/components/menu/inspection/outdoor-isolator-or-earth-switch/add-form';

export default function Page() {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={5} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">Outdoor Isolator And Earth Switch Inspector</Typography>
          <Form/>
        </Stack>
      </Stack>
    </Stack>
  );
}
