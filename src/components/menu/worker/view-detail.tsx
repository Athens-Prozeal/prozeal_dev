'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';

import { config } from '@/config';

const WorkerDetail: React.FC = () => {
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>();
  const workSiteId = localStorage.getItem('work-site-id');
  const workerId = searchParams.get('workerId');

  useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/worker/${workerId}/?work_site_id=${workSiteId}`, {
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
  }, [workerId]);

  return (
    <Box display="flex" justifyContent="center" minHeight="100vh">
      <Paper elevation={2} style={{ padding: '32px', maxWidth: '860px', width: '100%' }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <br />
              <img src={data?.profile_pic} alt="Profile Picture" style={{ maxWidth: '250px' }} />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Name:</strong> {data?.name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Father's Name:</strong> {data?.father_name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Gender:</strong> {data?.gender}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Date of Birth:</strong> {data?.date_of_birth}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Blood Group:</strong> {data?.blood_group}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Designation:</strong> {data?.designation}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Mobile Number:</strong> {data?.mobile_number}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Emergency Contact Number:</strong> {data?.emergency_contact_number}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Identity Marks:</strong> {data?.identity_marks}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Address:</strong> {data?.address}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>City:</strong> {data?.city}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>State:</strong> {data?.state}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Country:</strong> {data?.country}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Pincode:</strong> {data?.pincode}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Medical Fitness:</strong>
              <br />
              <img src={data?.medical_fitness} alt="Medical Fitness" style={{ maxWidth: '75%' }} />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Aadhar:</strong>
              <br />
              <img src={data?.aadhar} alt="Aadhar" style={{ maxWidth: '75%' }} />
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default WorkerDetail;
