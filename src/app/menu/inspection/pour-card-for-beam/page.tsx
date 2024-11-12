'use client';

import * as React from 'react';
import RouterLink from 'next/link'; // Use this for layout to not reload the page
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import PourCardForPlinthBeam from '@/components/menu/inspection/pour-card-for-beam/table';

export default function Page() {
  const role = localStorage.getItem('role');

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">Pour Card / Pour Card For Plinth Beam/Lintel Beam/Roof Beam</Typography>
        </Stack>
        <div>
          {role === 'epc_admin' || role === 'epc' || role === 'quality_inspector' ? (
            <Button
              component={RouterLink}
              href={'/menu/inspection/pour-card-for-beam/add'}
              startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
              variant="contained"
            >
              Add
            </Button>
          ) : null}
        </div>
      </Stack>
      <Stack>
        <PourCardForPlinthBeam />
      </Stack>
    </Stack>
  );
}
