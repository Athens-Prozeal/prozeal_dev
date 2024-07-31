'use client'

import React, { useState } from 'react';
import { Box, Button, Grid, MenuItem, TextField } from '@mui/material';
import axios from 'axios';

import { SubContractor as SubContractorType } from '@/types/user';
import { config } from '@/config';
import { PopUp } from '@/components/core/alert';

export const Form = () => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'success'>('success');
  const [alertKey, setAlertKey] = useState(0);

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const role = localStorage.getItem('role');
  const url = `${config.site.serverURL}/api/manpower/?work_site_id=${localStorage.getItem('work-site-id')}`;
  const currentDate = new Date().toISOString().split('T')[0];

  // Make it form kind of submit
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [numberOfWorkers, setNumberOfWorkers] = useState<Number>();
  const [subContractor, setSubContractor] = useState<SubContractorType>();
  const [verificationStatus, setVerificationStatus] = useState('Not Verified');
  const [subContractors, setSubContractors] = useState<SubContractorType[]>([]);

  React.useEffect(() => {
    if (role !== 'sub_contractor') {
      axios
        .get(
          `${config.site.serverURL}/api/auth/sub-contractors/?work_site_id=${localStorage.getItem('work-site-id')}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
          }
        )
        .then((response) => {
          setSubContractors(response.data);
        });
    }

    if (role === 'epc_admin' || role === 'epc') {
      setVerificationStatus('Verified');
    }
  }, []);

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonDisabled(true);
    axios({
      method: 'POST',
      url: url,
      data: {
        date: selectedDate,
        number_of_workers: numberOfWorkers,
        sub_contractor: subContractor?.id,
        verification_status: verificationStatus,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access-token')}`,
      },
    })
      .then((response) => {
        if (response.status === 201) {
          setAlertSeverity('success');
          setAlertMessage('Manpower Report added successfully');
          setAlertOpen(true);
          setAlertKey(prevKey => prevKey + 1);  // Update the key
          window.location.href = '/menu/manpower';
        }
      })
      .catch((error) => {
        setAlertSeverity('error');
        setButtonDisabled(false);
        if (error.response.data.non_field_errors) {
          setAlertMessage(error.response.data.non_field_errors[0]);
        } else {
          setAlertMessage('Something went wrong');
        }
        setAlertOpen(true);
        setAlertKey(prevKey => prevKey + 1);  // Update the key
        console.log(error);
      });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={submitForm}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              type="date"
              label="Date"
              value={selectedDate}
              required
              variant="outlined"
              sx={{ width: '100%' }}
              onChange={(e) => {
                setSelectedDate(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              type="number"
              required
              fullWidth
              label="Number Of Workers"
              variant="outlined"
              onChange={(e) => {
                setNumberOfWorkers(parseInt(e.target.value));
              }}
            />
          </Grid>
          {role !== 'sub_contractor' && (
            <Grid item xs={12} sm={4} md={4}>
              <TextField
                select
                required
                fullWidth
                label="Sub Contractors"
                variant="outlined"
                defaultValue={subContractor?.id}
                onChange={(e) => {
                  setSubContractor(
                    subContractors?.find((subContractor) => subContractor.id === parseInt(e.target.value))
                  );
                }}
              >
                {subContractors?.map((subContractor) => {
                  return (
                    <MenuItem key={subContractor.id} value={subContractor.id}>
                      {subContractor.username}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
          )}
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              disabled={role === 'sub_contractor'}
              select
              fullWidth
              label="Verification Status"
              variant="outlined"
              required
              value={verificationStatus}
              onChange={(e) => {
                setVerificationStatus(e.target.value);
              }}
            >
              <MenuItem key={'Verified'} value={'Verified'}>
                {'Verified'}
              </MenuItem>
              <MenuItem key={'Revise'} value={'Revise'}>
                {'Revise'}
              </MenuItem>
              <MenuItem key={'Not Verified'} value={'Not Verified'}>
                {'Not Verified'}
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} container justifyContent="flex-start">
            <Button disabled={buttonDisabled} variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>

      <PopUp key={alertKey} open={alertOpen} alertSeverity={alertSeverity} alertMessage={alertMessage} />
    </Box>
  );
};
