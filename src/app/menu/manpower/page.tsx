'use client'

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import Button from '@mui/material/Button';

export default function Manpower() {
    return (
    <Stack spacing={3}>
    <Stack direction="row" spacing={3}>
      <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
        <Typography variant="h4">Manpower</Typography>
      </Stack>
      <div>
        <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
          Add
        </Button>
      </div>
    </Stack>
    </Stack>
    );
}