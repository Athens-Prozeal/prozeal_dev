  'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';

import { config } from '@/config';

const SafetyObservationDetail: React.FC = () => {
  const searchParams = useSearchParams();
  const workSiteId = localStorage.getItem('work-site-id');
  const safetObservationId = searchParams.get('safeObservationId');
  const [data, setData] = useState<any>();
  const [approveUrl, setApproveUrl] = useState<string | null>(null);
  const [approveBtnDisabled, setApproveBtnDisabled] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/safety-observation/${safetObservationId}/?work_site_id=${workSiteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
      .then((response) => {
        setData(response.data);
        for (const action of response.data.actions) {
          if (action.name === 'approve') {
            setApproveUrl(action.url);
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [safetObservationId]);


  const handleApprove = async (event: React.FormEvent) => {
    event.preventDefault();
    setApproveBtnDisabled(true);
    try {
      const formData = new FormData();

      await axios
        .put(`${config.site.serverURL}${approveUrl}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          if (response.status === 200) {
            alert('Submitted successfully');
            window.location.reload();
          }
        });
    } catch (error) {
      setApproveBtnDisabled(false);
      console.error('Error approving:', error);
    }
  };

  return (
    <Box display="flex" justifyContent="center" minHeight="100vh" flexDirection="column" gap={4}>
      <Paper elevation={2} sx={{ maxWidth: '100%', width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" sx={{ fontSize: { xs: '14px', sm: '16px' }, marginBottom: 2 }}>
              <strong>Site Location / Area:</strong> {data?.site_location_or_area}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" sx={{ fontSize: { xs: '14px', sm: '16px' }, marginBottom: 2 }}>
              <strong>Drawing / Specification No:</strong> {data?.drawing_or_specification_no}
            </Typography>
          </Grid>

        </Grid>
      </Paper>

      {data?.actions.map((action: any) => {
        if (action.name === 'approve') {
          return (
            <form onSubmit={handleApprove} key={action.name}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <TextField
                  required
                  fullWidth
                  label="Corrective Action Required"
                  variant="outlined"
                />

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={approveBtnDisabled}
                  sx={{ maxWidth: { xs: '100%', sm: 250 } }}
                >
                  Submit
                </Button>
              </Stack>
            </form>
          );
        }
      })}
    </Box>
  );
};

export default SafetyObservationDetail;
