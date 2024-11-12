'use client'

import * as React from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import  UpdatePasswordForm  from '@/components/dashboard/settings/update-password-form';
import { Users } from '@/components/dashboard/settings/user';

export default function Page(): React.JSX.Element {
  const role = localStorage.getItem('role');

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Settings</Typography>
      {role === 'epc_admin' && <Users />}
      <UpdatePasswordForm />
    </Stack>
  );
}
