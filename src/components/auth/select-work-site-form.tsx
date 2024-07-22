'use client';

import * as React from 'react';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { WorkSite as workSiteType } from '@/types/user';
import { authClient } from '@/lib/auth/client';

export function SelectWorkSiteForm() {
  const [SelectedWorkSite, setSelectedWorkSite] = React.useState('');
  const [WorkSites, setWorkSites] = React.useState<workSiteType[]>();

  React.useEffect(() => {
    authClient.getUser().then(({ data }) => {
      return setWorkSites(data?.workSites);
    });
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedWorkSite(event.target.value as string);
  };

  const handleSubmit = () => {
    if (!SelectedWorkSite) {
      return;
    }

    for (const workSite of WorkSites || []) {
      if (workSite.id == SelectedWorkSite) {
        localStorage.setItem('work-site-id', SelectedWorkSite);
        localStorage.setItem('role', workSite.role);
      }
    }

    window.location.href = '/dashboard';
  };

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Select Work Site</Typography>
      </Stack>
      <Box sx={{ minWidth: 240 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Work Site</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={SelectedWorkSite}
            label="Age"
            onChange={handleChange}
          >
            {WorkSites?.map((workSite: workSiteType) => (
              <MenuItem key={workSite.id} value={workSite.id}>
                {workSite.id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Button variant="contained" onClick={handleSubmit}>
        Enter
      </Button>
    </Stack>
  );
}
