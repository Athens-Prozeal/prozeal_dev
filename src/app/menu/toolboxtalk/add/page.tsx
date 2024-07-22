'use client';

import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import axios from 'axios';

import { config } from '@/config';

export default function Page() {
  const authToken = `Bearer ${localStorage.getItem('access-token')}`;
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/tbt/?work_site_id=${localStorage.getItem('work-site-id')}`, {
        headers: {
          Authorization: authToken,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        setRowData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">Add Tool Box Talk</Typography>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}></Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
