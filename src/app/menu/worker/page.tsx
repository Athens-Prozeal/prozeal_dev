'use client';

import * as React from 'react';
import RouterLink from 'next/link'; // Use this for layout to not reload the page
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import WorkerTable, { WorkerHandles } from '@/components/menu/worker/table';

export default function Page() {
  const exportRef = React.useRef<WorkerHandles>(null);

  const onBtnExport = () => {
    if (exportRef.current) {
      exportRef.current.triggerClick();
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">Worker</Typography>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />} onClick={onBtnExport}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
        <Button
            component={RouterLink}
            href={'/menu/worker/add'}
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
          >
            Add
          </Button>
        </div>
      </Stack>
      <Stack>
        <WorkerTable  ref={exportRef} />
      </Stack>
    </Stack>
  );
}
