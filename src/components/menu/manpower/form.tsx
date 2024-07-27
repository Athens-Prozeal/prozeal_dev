'use client';

import React, { useState } from 'react';
import { Alert, Box, Button, Collapse, Grid, IconButton, MenuItem, TextField } from '@mui/material';
import { X as CloseIcon } from '@phosphor-icons/react/dist/ssr/X';
import axios from 'axios';

import { SubContractor as SubContractorType } from '@/types/user';

interface FormProps {
  Url: string;
  Method: string;
  Date?: string | null;
  NumberOfWorkers?: number | null;
  VerificationStatus?: string | null;
  SubContractor?: SubContractorType | null;
  SubContractors?: SubContractorType[] | null;
}

export const Form = (props: FormProps) => {
  const role = localStorage.getItem('role');

  const [open, setOpen] = React.useState(false); // Alert
  const [ButtonDisabled, setButtonDisabled] = useState(false);
  const [AlertMessage, setAlertMessage] = useState('');
  const [AlertSeverity, setAlertSeverity] = useState<'error' | 'success'>('success');

  const Url = props.Url;
  const Method = props.Method;
  const Role = localStorage.getItem('role');
  const [Date, setDate] = useState(props.Date);
  const [NumberOfWorkers, setNumberOfWorkers] = useState(props.NumberOfWorkers);
  const [SubContractor, setSubContractor] = useState(props.SubContractor);
  const [VerificationStatus, setVerificationStatus] = useState(props.VerificationStatus);

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonDisabled(true);
    axios({
      method: Method,
      url: Url,
      data: {
        date: Date,
        number_of_workers: NumberOfWorkers,
        sub_contractor: SubContractor?.id,
        verification_status: VerificationStatus,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access-token')}`,
      },
    })
      .then((response) => {
        if (response.status === 201) {
          setAlertSeverity('success');
          setAlertMessage('Manpower Report added successfully');
          setOpen(true);
          window.location.href = '/menu/manpower';
        }
        console.log(response);
        setAlertSeverity('success');
        setAlertMessage('Manpower Report added successfully');
        setOpen(true);
      })
      .catch((error) => {
        setAlertSeverity('error');
        setButtonDisabled(false);
        if (error.response.data.non_field_errors) {
          setAlertMessage(error.response.data.non_field_errors[0]);
        } else {
          setAlertMessage('Something went wrong');
        }
        setOpen(true);
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
              value={Date}
              variant="outlined"
              sx={{ width: '100%' }}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              type="number"
              required
              defaultValue={NumberOfWorkers}
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
                defaultValue={SubContractor?.id}
                onChange={(e) => {
                  setSubContractor(
                    props.SubContractors?.find((subContractor) => subContractor.id === parseInt(e.target.value))
                  );
                }}
              >
                {props.SubContractors?.map((subContractor) => {
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
              disabled={Role === 'sub_contractor'}
              select
              fullWidth
              label="Verification Status"
              variant="outlined"
              defaultValue={VerificationStatus}
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
            <Button disabled={ButtonDisabled} variant="contained" color="primary" type="submit">
              Submit
            </Button>
            <div style={{ position: 'absolute', bottom: 20, right: 20 }}>
              {' '}
              {/* Adjust bottom and right as needed */}
              <Collapse in={open}>
                <Alert
                  severity={AlertSeverity}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{ mb: 2 }}
                >
                  {AlertMessage}
                </Alert>
              </Collapse>
            </div>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
