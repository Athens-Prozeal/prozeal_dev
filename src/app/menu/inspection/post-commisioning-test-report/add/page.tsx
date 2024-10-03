import { Stack, Typography } from '@mui/material';

import { Form } from '@/components/menu/inspection/post-commissioning-test-report/add-form';

export default function Page() {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={5} sx={{ flex: '1 1 auto', width:"95%"}}>
          <Typography variant="h5">Post Commissioning Test Report- Roof Top Project </Typography>
          <Form/>
        </Stack>
      </Stack>
    </Stack>
  );
}
