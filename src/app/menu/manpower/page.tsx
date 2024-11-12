'use client';

import RouterLink from 'next/link'; // Use this for layout to not reload the page
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { ManpowerTable } from '@/components/menu/manpower/table';

export default function Page() {
  const role = localStorage.getItem('role');

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">Manpower</Typography>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <Button
              component={RouterLink}
              href={'/menu/manpower/statistics'}
              startIcon={<EyeIcon fontSize="var(--icon-fontSize-md)" />}
              color="inherit"
            >
              View Statistics
            </Button>
          </Stack>
        </Stack>
        <div>
          {role === 'epc_admin' || role === 'epc' || role === 'sub_contractor' ? (
            <Button
              component={RouterLink}
              href={'/menu/manpower/add'}
              startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
              variant="contained"
            >
              Add
            </Button>
          ) : null}
        </div>
      </Stack>
      <Stack>
        <div
          className="ag-theme-quartz" // applying the Data Grid theme
          style={{ height: 500 }} // the Data Grid will fill the size of the parent container
        >
          <ManpowerTable />
        </div>
      </Stack>
    </Stack>
  );
}
