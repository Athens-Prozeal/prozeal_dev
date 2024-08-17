'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Grid, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { SubContractor as SubContractorType } from '@/types/user';
import { config } from '@/config';
import { PopUp } from '@/components/core/alert';

const manpowerSchema = z.object({
  selectedDate: z.string().nonempty('Date is required'),
  numberOfWorkers: z
    .string()
    .min(1, 'Number of workers must be at least 1')
    .transform((val) => Number(val)),
  subContractor: z.number().optional(),
  verificationStatus: z.enum(['Verified', 'Revise', 'Not Verified', '']),
});

type ManpowerFormData = z.infer<typeof manpowerSchema>;

export const Form = () => {
  const searchParams = useSearchParams();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'success'>('success');
  const [alertKey, setAlertKey] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [subContractors, setSubContractors] = useState<SubContractorType[]>([]);

  const role = localStorage.getItem('role');
  const manpowerId = searchParams.get('manpowerId');

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ManpowerFormData>({
    resolver: zodResolver(manpowerSchema),
    defaultValues: {
      verificationStatus: '',
      subContractor: 0,
    },
  });

  useEffect(() => {
    if (role !== 'sub_contractor') {
      axios
        .get(
          `${config.site.serverURL}/api/auth/user/sub-contractor/?work_site_id=${localStorage.getItem('work-site-id')}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` } }
        )
        .then((response) => {
          setSubContractors(response.data);
        });
    }

    axios
      .get(`${config.site.serverURL}/api/manpower/${manpowerId}?work_site_id=${localStorage.getItem('work-site-id')}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
      })
      .then((response) => {
        const data = response.data;
        setValue('selectedDate', data.date);
        setValue('numberOfWorkers', data.number_of_workers.toString());
        setValue('subContractor', data.sub_contractor);
        setValue('verificationStatus', data.verification_status);

        if (role === 'sub_contractor') {
          setValue('verificationStatus', 'Not Verified');
        }
      })
      .catch((error) => {
        window.alert('Some error occured');
      });
  }, [role, setValue]);

  const onSubmit = async (data: ManpowerFormData) => {
    setButtonDisabled(true);
    axios({
      method: 'PUT',
      url: `${config.site.serverURL}/api/manpower/${manpowerId}/?work_site_id=${localStorage.getItem('work-site-id')}`,
      data: {
        date: data.selectedDate,
        number_of_workers: data.numberOfWorkers,
        sub_contractor: data.subContractor,
        verification_status: data.verificationStatus,
      },
      headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
    })
      .then((response) => {
        if (response.status === 200) {
          setAlertSeverity('success');
          setAlertMessage('Manpower Report updated successfully');
          setAlertKey((prev) => prev + 1);
          setAlertOpen(true);
          setTimeout(() => {
            window.location.href = '/menu/manpower';
          }, 500);
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
        setAlertKey((prev) => prev + 1);
        setAlertOpen(true);
      });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="selectedDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  fullWidth
                  error={!!errors.selectedDate}
                  helperText={errors.selectedDate?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="numberOfWorkers"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Number Of Workers"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  fullWidth
                  error={!!errors.numberOfWorkers}
                  helperText={errors.numberOfWorkers?.message}
                />
              )}
            />
          </Grid>
          {role !== 'sub_contractor' && (
            <Grid item xs={12} sm={4} md={4}>
              <Controller
                name="subContractor"
                control={control}
                render={({ field }) => (
                  <TextField
                    required
                    {...field}
                    select
                    label="Sub Contractors"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                    error={!!errors.subContractor}
                    helperText={errors.subContractor?.message}
                  >
                    {subContractors?.map((subContractor) => (
                      <MenuItem key={subContractor.id} value={subContractor.id}>
                        {subContractor.username}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="verificationStatus"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Verification Status"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  fullWidth
                  disabled={role === 'sub_contractor'}
                  error={!!errors.verificationStatus}
                  helperText={errors.verificationStatus?.message}
                >
                  <MenuItem value="Verified">Verified</MenuItem>
                  <MenuItem value="Revise">Revise</MenuItem>
                  <MenuItem value="Not Verified">Not Verified</MenuItem>
                </TextField>
              )}
            />
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
