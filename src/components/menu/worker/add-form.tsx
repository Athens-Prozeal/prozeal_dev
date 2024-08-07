'use client';

import React from 'react';
import { WorkerRequestHandler } from 'next/dist/server/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Grid, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';

import { config } from '@/config';
import { PopUp } from '@/components/core/alert';

const workerSchema = z.object({
  inductionDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  name: z.string().max(150, 'Topic must be at most 150 characters'),
  fatherName: z.string().max(150, 'Father Name must be at most 150 characters'),
  gender: z.string().refine((val) => ['M', 'F', 'O'].includes(val), {
    message: 'Invalid gender value',
  }),
  dateOfBirth: z.string().refine(
    (val) => {
      const currentDate = new Date();
      const dob = new Date(val);
      const age = currentDate.getFullYear() - dob.getFullYear();
      return age >= 14;
    },
    {
      message: 'Worker must be at least 14 years old',
    }
  ),
  bloodGroup: z.string().refine((val) => ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(val), {
    message: 'Invalid blood group value',
  }),
  designation: z.string().max(150, 'Designation must be at most 150 characters'),
  mobileNumber: z
    .string()
    .refine((val) => /^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/g.test(val), {
      message: 'Invalid mobile number format',
    }),
  emergencyContactNumber: z
    .string()
    .refine((val) => /^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/g.test(val), {
      message: 'Invalid emergency contact number format',
    }),
  identityMarks: z.string(),
  address: z.string(),
  city: z.string().max(150, 'City must be at most 150 characters'),
  state: z.string().max(150, 'State must be at most 150 characters'),
  country: z.string().refine((val) => ['IN', 'AE', 'BR'].includes(val), {
    message: 'Invalid gender value',
  }),
  pincode: z.string().max(15, 'Pincode must be at most 15 characters'),
  medicalFitness: z.instanceof(File).refine((file) => file instanceof File, {
    message: 'Invalid file format',
  }),
  aadhar: z.instanceof(File).refine((file) => file instanceof File, {
    message: 'Invalid file format',
  }),
});

type workerSchemaType = z.infer<typeof workerSchema>;

const WorkerForm: React.FC = () => {
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState<'error' | 'success'>('success');
  const [alertKey, setAlertKey] = React.useState(0);
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const currentDate = new Date().toISOString().split('T')[0];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<workerSchemaType>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      inductionDate: currentDate
    },
  });

  const onSubmit = async (data: workerSchemaType) => {
    const formdata = new FormData();
    formdata.append('induction_date', data.inductionDate);
    formdata.append('name', data.name);
    formdata.append('father_name', data.fatherName);
    formdata.append('gender', data.gender);
    formdata.append('date_of_birth', data.dateOfBirth);
    formdata.append('blood_group', data.bloodGroup);
    formdata.append('designation', data.designation);
    formdata.append('mobile_number', data.mobileNumber);
    formdata.append('emergency_contact_number', data.emergencyContactNumber);
    formdata.append('identity_marks', data.identityMarks);
    formdata.append('address', data.address);
    formdata.append('city', data.city);
    formdata.append('state', data.state);
    formdata.append('country', data.country);
    formdata.append('pincode', data.pincode);
    formdata.append('medical_fitness', data.medicalFitness);
    formdata.append('aadhar', data.aadhar);

    axios({
      method: 'POST',
      url: `${config.site.serverURL}/api/worker/?work_site_id=${localStorage.getItem('work-site-id')}`,
      data: formdata,
      headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
    })
      .then((response) => {
        if (response.status === 201) {
          setAlertSeverity('success');
          setAlertMessage('Worker added successfully');
          setAlertKey((prev) => prev + 1);
          setAlertOpen(true);
          setTimeout(() => {
            window.location.href = '/menu/worker/';
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

      setButtonDisabled(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="inductionDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Induction date"
                  variant="outlined"
                  fullWidth
                  error={!!errors.inductionDate}
                  helperText={errors.inductionDate?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Name"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="fatherName"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Father Name"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Gender"
                  variant="outlined"
                  fullWidth
                  error={!!errors.gender}
                  helperText={errors.gender?.message}
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                  <MenuItem value="O">Other</MenuItem>
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Date of Birth"
                  variant="outlined"
                  fullWidth
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="bloodGroup"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Blood Group"
                  variant="outlined"
                  fullWidth
                  error={!!errors.bloodGroup}
                  helperText={errors.bloodGroup?.message}
                >
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="designation"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Designation"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="mobileNumber"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Mobile Number"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="emergencyContactNumber"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Emergency Contact Number"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="identityMarks"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Identity Marks"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="address"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Address"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="city"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="City"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="state"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="State"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Country"
                  variant="outlined"
                  fullWidth
                  error={!!errors.country}
                  helperText={errors.country?.message}
                >
                  <MenuItem value="IN">India</MenuItem>
                  <MenuItem value="AE">Dubai</MenuItem>
                  <MenuItem value="BR">Brazil</MenuItem>
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="pincode"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Pincode"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="medicalFitness"
              control={control}
              render={({ field }) => (
                <TextField
                  helperText={errors.medicalFitness ? errors.medicalFitness.message : null}
                  error={!!errors.medicalFitness}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    accept: 'image/*',
                  }}
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.files?.[0])}
                  fullWidth
                  label="Medical Fitness"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="aadhar"
              control={control}
              render={({ field }) => (
                <TextField
                  helperText={errors.aadhar ? errors.aadhar.message : null}
                  error={!!errors.aadhar}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    accept: 'image/*',
                  }}
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.files?.[0])}
                  fullWidth
                  label="Aadhar"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} container justifyContent="flex-start">
            <Button variant="contained" color="primary" type="submit" disabled={buttonDisabled}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      <PopUp key={alertKey} open={alertOpen} alertSeverity={alertSeverity} alertMessage={alertMessage} />
    </Box>
  );
};

export default WorkerForm;
