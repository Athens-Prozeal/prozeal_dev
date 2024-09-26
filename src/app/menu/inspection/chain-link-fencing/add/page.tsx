import { Stack, Typography } from '@mui/material';

import { Form } from '@/components/menu/inspection/chain-link-fencing/add-form';

export default function Page() {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={5} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">Chain Link Fencing</Typography>
          <Form/>
        </Stack>
      </Stack>
    </Stack>
  );
}
