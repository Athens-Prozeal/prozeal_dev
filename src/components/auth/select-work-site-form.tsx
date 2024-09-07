'use client';

import * as React from 'react';
import { Button, Box, TextField, MenuItem } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { WorkSiteRole } from '@/types/worksite';
import { authClient } from '@/lib/auth/client';

export function SelectWorkSiteForm() {
  const [selectedWorkSite, setSelectedWorkSite] = React.useState('');
  const [workSiteRoles, setWorkSiteRoles] = React.useState<WorkSiteRole[]>([]);

  React.useEffect(() => {
    authClient.getUser().then(({ data }) => {
      setWorkSiteRoles(data?.workSiteRoles || []);
    });
  }, []);

  const handleWorkSiteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedWorkSite(event.target.value);
  };

  const handleSubmit = () => {
    if (!selectedWorkSite) {
      return;
    }

    const selectedRole = workSiteRoles.find(
      (workSite) => workSite.id === selectedWorkSite
    );

    if (selectedRole) {
      localStorage.setItem('work-site-id', selectedWorkSite);
      localStorage.setItem('role', selectedRole.role);
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
          <TextField
            select
            label="Work Site"
            value={selectedWorkSite}
            onChange={handleWorkSiteChange} // Added onChange handler
          >
            {workSiteRoles.map((workSite: WorkSiteRole) => (
              <MenuItem key={workSite.id} value={workSite.id}>
                {workSite.id}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      </Box>
      <Button variant="contained" onClick={handleSubmit}>
        Enter
      </Button>
    </Stack>
  );
}
