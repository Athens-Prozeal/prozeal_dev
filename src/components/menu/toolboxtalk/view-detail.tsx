'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';

import { config } from '@/config';

const ToolBoxTalkDetail: React.FC = () => {
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>();
  const workSiteId = localStorage.getItem('work-site-id');
  const toolboxTalkId = searchParams.get('toolboxTalkId');

  useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/tbt/${toolboxTalkId}/?work_site_id=${workSiteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [toolboxTalkId]);

  return (
    <Box display="flex" justifyContent="center" minHeight="100vh">
      <Paper elevation={2} style={{ padding: '32px', maxWidth: '800px', width: '100%' }}>
        <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '24px' }}>
          {data?.topic}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Date:</strong> {data?.date}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Topic:</strong> {data?.topic}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Number of Participants:</strong> {data?.number_of_participants}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Agency Name:</strong> {data?.agency_name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Evidence:</strong>
              <br />
              <img src={data?.evidence} alt="Evidence" style={{ maxWidth: '75%' }} />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Attendance:</strong>
              <br />
              <img src={data?.attendance} alt="Attendance" style={{ maxWidth: '75%' }} />
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ToolBoxTalkDetail;
