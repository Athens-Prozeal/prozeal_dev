'use client';

import * as React from 'react';
import RouterLink from 'next/link'; // Use this for layout to not reload the page
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import Plastering from '@/components/menu/inspection/plastering/table';

export default function Page() {
  const role = localStorage.getItem('role');

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">Plastering</Typography>
        </Stack>
        <div>
        {role === 'epc_admin' || role === 'epc' || role === 'quality_inspector' ? (
          <Button
            component={RouterLink}
            href={'/menu/inspection/plastering/add'}
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
          >
            Add
          </Button>
        ) : null}
        </div>
      </Stack>
      <Stack>
        <Plastering />
      </Stack>
    </Stack>
  );
}
