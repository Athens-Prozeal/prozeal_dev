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

import { WorkSiteRole } from '@/types/worksite';
import { authClient } from '@/lib/auth/client';

export function SelectWorkSiteForm() {
  const [selectedWorkSite, setSelectedWorkSite] = React.useState('');
  const [workSites, setWorkSites] = React.useState<WorkSiteRole[]>();

  React.useEffect(() => {
    authClient.getUser().then(({ data }) => {
      setWorkSites(data?.workSites);
    });
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedWorkSite(event.target.value as string);
  };

  const handleSubmit = () => {
    if (!selectedWorkSite) {
      return;
    }

    for (const workSite of workSites || []) {
      if (workSite.id == selectedWorkSite) {
        localStorage.setItem('work-site-id', selectedWorkSite);
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
            value={selectedWorkSite}
            label="Age"
            onChange={handleChange}
          >
            {workSites?.map((workSite: WorkSiteRole) => (
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
