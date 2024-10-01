'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Button, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';

import { config } from '@/config';

const SafetyObservationDetail: React.FC = () => {
  const searchParams = useSearchParams();
  const workSiteId = localStorage.getItem('work-site-id');
  const safetyObservationId = searchParams.get('safetyObservationId');
  const [data, setData] = useState<any>();
  const [correctiveActionUrl, setcorrectiveActionUrl] = useState<string | null>(null);
  const [verifyUrl, setVerifyUrl] = useState<string | null>(null);
  const [rejectUrl, setRejectUrl] = useState<string | null>(null);
  const [correctiveActionBtnDisabled, setcorrectiveActionBtnDisabled] = useState<boolean>(false);
  const [verifyBtnDisabled, setVerifyBtnDisabled] = useState<boolean>(false);
  const [rejectBtnDisabled, setRejectBtnDisabled] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/safety-observation/${safetyObservationId}/?work_site_id=${workSiteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
      .then((response) => {
        setData(response.data);
        for (const action of response.data.actions) {
          if (action.name === 'corrective_action') {
            setcorrectiveActionUrl(action.url);
          }
          if (action.name === 'verify') {
            setVerifyUrl(action.url);
          }
          if (action.name === 'reject') {
            setRejectUrl(action.url);
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [safetyObservationId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setcorrectiveActionBtnDisabled(true);

    if (correctiveActionUrl) {
      const formData = new FormData();
      formData.append('corrective_action_taken', (event.target as HTMLFormElement).corrective_action_taken.value);
      formData.append('after_image', (event.target as HTMLFormElement).after_image.files[0]);

      axios({
        method: 'put',
        url: `${config.site.serverURL}${correctiveActionUrl}`,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
        .then(() => {
          alert('Corrective action submitted successfully');
          window.location.href = '/menu/safety-observation/';
        })
        .catch((error) => {
          console.error('Error submitting corrective action:', error);
          alert('Error submitting corrective action');
          setcorrectiveActionBtnDisabled(false);
        });
    } else {
      console.error('Corrective action URL is null');
    }
  };

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setVerifyBtnDisabled(true);
    setRejectBtnDisabled(true);

    axios({
      method: 'put',
      url: `${config.site.serverURL}${verifyUrl}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access-token')}`,
      },
    })
      .then(() => {
        alert('Safety observation verified successfully');
        window.location.href = '/menu/safety-observation/';
      })
      .catch((error) => {
        console.error('Error approving safety observation:', error);
        alert('Error approving safety observation');
        setVerifyBtnDisabled(false);
        setRejectBtnDisabled(false);
      });
  };

  const handleReject = async (event: React.FormEvent) => {
    event.preventDefault();
    setRejectBtnDisabled(true);
    setVerifyBtnDisabled(true);

    axios({
      method: 'put',
      url: `${config.site.serverURL}${rejectUrl}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access-token')}`,
      },
    })
      .then(() => {
        alert('Safety observation rejected');
        window.location.href = '/menu/safety-observation/';
      })
      .catch((error) => {
        console.error('Error rejecting safety observation:', error);
        alert('Error rejecting safety observation');
        setRejectBtnDisabled(false);
        setVerifyBtnDisabled(false);
      });
  };

  return (
    <Box display="flex" justifyContent="center" minHeight="100vh" flexDirection="column">
      <Paper elevation={2} style={{ padding: '32px', width: '100%' }}>
        <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '24px' }}>
          {data?.topic}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Date:</strong> {data?.date}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Time:</strong> {data?.time}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Work Location:</strong> {data?.work_location}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Reported By:</strong> {data?.reported_by_full_name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Assigned To:</strong> {data?.corrective_action_assigned_to_full_name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Department:</strong> {data?.department_name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Sub Contractor:</strong> {data?.sub_contractor_full_name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Type Of Observation:</strong> {data?.type_of_observation}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Classification:</strong> {data?.classification}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Risk Rated:</strong> {data?.risk_rated}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Safety Observation Found :</strong> {data?.safety_observation_found}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Activity Performed :</strong> {data?.activity_performed}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Corrective Action Required :</strong> {data?.corrective_action_required}
            </Typography>
          </Grid>
          {data?.observation_status === 'closed' && (
            <Grid item xs={12}>
              <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
                <strong>Corrective Action Taken:</strong> {data?.corrective_action_taken}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Remarks :</strong> {data?.remarks}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>Before Image:</strong>
              <br />
              <img src={data?.before_image} alt="Before Image" style={{ maxWidth: '512px' }} />
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {data?.actions.map((action: any) => {
        if (action.name === 'corrective_action') {
          return (
            <form onSubmit={handleSubmit} key={action.name} style={{ marginTop: 15 }}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <TextField
                  required
                  label="Corrective Action Required"
                  variant="outlined"
                  name="corrective_action_taken"
                  fullWidth
                />

                <TextField
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    accept: 'image/*',
                  }}
                  type="file"
                  name="after_image"
                  label="After Image"
                  variant="outlined"
                />

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={correctiveActionBtnDisabled}
                  sx={{ maxWidth: { xs: '100%', sm: 250 } }}
                >
                  Submit
                </Button>
              </Stack>
            </form>
          );
        } else if (action.name == 'verify') {
          return (
            <form onSubmit={handleSubmit} key={action.name} style={{ marginTop: 15 }}>
              <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
                <strong>Corrective Action Taken:</strong> {data?.corrective_action_taken}
              </Typography>
              <Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px' }}>
              <strong>After Image:</strong>
              <br />
              <img src={data?.after_image} alt="After Image" style={{ maxWidth: '512px' }} />
            </Typography>

              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={verifyBtnDisabled}
                  sx={{ maxWidth: { xs: '100%', sm: 250 } }}
                  onClick={handleVerify}
                >
                  Verify
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  type="submit"
                  disabled={rejectBtnDisabled}
                  sx={{ maxWidth: { xs: '100%', sm: 250 } }}
                  onClick={handleReject}
                >
                  Reject
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
