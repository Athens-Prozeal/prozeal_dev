'use client';

import * as React from 'react';
import RouterLink from 'next/link'; // Use this for layout to not reload the page
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import OutdoorIsolatorTable from '@/components/menu/inspection/outdoor-isolator-or-earth-switch/table';

export default function Page() {
  const role = localStorage.getItem('role');

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">Outdoor Isolator And Earth Switch</Typography>
        </Stack>
        <div>
        {role === 'epc_admin' || role === 'epc' || role === 'quality_inspector' ? (
          <Button
            component={RouterLink}
            href={'/menu/inspection/outdoor-isolator-or-earth-switch/add'}
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
          >
            Add
          </Button>
        ) : null}
        </div>
      </Stack>
      <Stack>
        <OutdoorIsolatorTable />
      </Stack>
    </Stack>
  );
}
