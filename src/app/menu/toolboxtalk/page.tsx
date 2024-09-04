'use client';

import * as React from 'react';
import { useRef } from 'react';
import RouterLink from 'next/link'; // Use this for layout to not reload the page
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import ToolBoxTalkTable, { ToolBoxTalkTableHandles } from '@/components/menu/toolboxtalk/table';

export default function Page() {
  const role = localStorage.getItem('role');
  const exportRef = useRef<ToolBoxTalkTableHandles>(null);

  const onBtnExport = () => {
    if (exportRef.current) {
      exportRef.current.triggerClick();
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">Toolbox Talk</Typography>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />} onClick={onBtnExport}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          {role === 'epc_admin' || role === 'epc' ? (
            <Button
              component={RouterLink}
              href={'/menu/toolboxtalk/add'}
              startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
              variant="contained"
            >
              Add
            </Button>
          ) : null}
        </div>
      </Stack>
      <Stack>
        <ToolBoxTalkTable ref={exportRef} />
      </Stack>
    </Stack>
  );
}
