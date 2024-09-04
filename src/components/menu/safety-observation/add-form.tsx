'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Grid, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';

import { SubContractor as SubContractorType } from '@/types/user';
import { config } from '@/config';
import { PopUp } from '@/components/core/alert';

// Define the schema using Zod
const safetyObservationSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  time: z.string(),
  workLocation: z.string().max(255, 'Work location must be at most 155 characters'),
  department: z.enum(['electrical', 'civil', 'mechanical', 'stores']),
  activityPerformed: z.string().min(2, 'Activity Performed must be atleast 2 characters'),
  subContractor: z.number(),
  safetyObservationFound: z.string().min(2, 'Safety Observation Found must be atleast 2 characters'),
  typeOfObservation: z.enum(['unsafe_act', 'unsafe_condition']),
  classification: z.string(),
  riskRated: z.enum(['high', 'significant', 'medium', 'low']),
  actionTakenOrRequired: z.string().min(2, 'Action Taken or Required must be atleast 2 characters'),
  reportedBy: z.string().max(155, 'Reported By must be at most 155 characters'),
  correctiveActionAssignedTo: z.number(),
  observationStatus: z.enum(['open', 'closed']),
  closingDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  beforeImage: z.instanceof(File).refine((file) => file instanceof File, {
    message: 'Invalid file format',
  }),
  afterImage: z.instanceof(File).refine((file) => file instanceof File, {
    message: 'Invalid file format',
  }),
  remarks: z.string().min(2, 'Remarks must be atleast 2 characters'),
});

type SafetyObservationSchemaType = z.infer<typeof safetyObservationSchema>;

const SafetyObservationForm: React.FC = () => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'success'>('success');
  const [alertKey, setAlertKey] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  const [subContractors, setSubContractors] = useState<SubContractorType[]>([]);
  const [correctiveActionUsers, setCorrectiveActionUsers] = useState<
    {
      id: number;
      username: string;
    }[]
  >([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SafetyObservationSchemaType>({
    resolver: zodResolver(safetyObservationSchema),
    defaultValues: {
      date: currentDate,
    },
  });

  useEffect(() => {
    axios
      .get(
        `${config.site.serverURL}/api/auth/user/sub-contractor/?work_site_id=${localStorage.getItem('work-site-id')}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` } }
      )
      .then((response) => {
        setSubContractors(response.data);
      });

    axios
      .get(
        `${config.site.serverURL}/api/auth/user/corrective-action-user/?work_site_id=${localStorage.getItem('work-site-id')}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` } }
      )
      .then((response) => {
        setCorrectiveActionUsers(response.data);
      });
  }, []);

  const onSubmit = async (data: SafetyObservationSchemaType) => {
    const formdata = new FormData();
    formdata.append('date', data.date);

    axios({
      method: 'POST',
      url: `${config.site.serverURL}/api/tbt/?work_site_id=${localStorage.getItem('work-site-id')}`,
      data: formdata,
      headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
    })
      .then((response) => {
        if (response.status === 201) {
          setAlertSeverity('success');
          setAlertMessage('Safety Observation added successfully');
          setAlertKey((prev) => prev + 1);
          setAlertOpen(true);
          setTimeout(() => {
            window.location.href = '/menu/safety-observation/';
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
              name="date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Date"
                  variant="outlined"
                  fullWidth
                  error={!!errors.date}
                  helperText={errors.date?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="workLocation"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Work Location"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  {...field}
                  fullWidth
                  label="Department"
                  variant="outlined"
                  error={!!errors.department}
                  helperText={errors.department?.message}
                >
                  {['electrical', 'civil', 'mechanical', 'stores'].map((department) => (
                    <MenuItem key={department} value={department}>
                      {department}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="subContractor"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Sub Contractors"
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


          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="typeOfObservation"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  {...field}
                  fullWidth
                  label="Type of Observation"
                  variant="outlined"
                  error={!!errors.typeOfObservation}
                  helperText={errors.typeOfObservation?.message}
                >
                  {['unsafe_act', 'unsafe_condition'].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="classification"
              control={control}
              render={({ field }) => (
                <TextField
                  helperText={errors.classification ? errors.classification.message : null}
                  error={!!errors.classification}
                  fullWidth
                  label="Classification"
                  variant="outlined"
                  {...field}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <Controller
              name="safetyObservationFound"
              control={control}
              render={({ field }) => (
                <TextField
                  helperText={errors.safetyObservationFound ? errors.safetyObservationFound.message : null}
                  error={!!errors.safetyObservationFound}
                  fullWidth
                  label="Safety Observation Found"
                  variant="outlined"
                  {...field}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <Controller
              name="activityPerformed"
              control={control}
              render={({ field }) => (
                <TextField
                  helperText={errors.activityPerformed ? errors.activityPerformed.message : null}
                  error={!!errors.activityPerformed}
                  fullWidth
                  label="Activity Performed"
                  variant="outlined"
                  {...field}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="riskRated"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  {...field}
                  fullWidth
                  label="Risk Rated"
                  variant="outlined"
                  error={!!errors.riskRated}
                  helperText={errors.riskRated?.message}
                >
                  {['high', 'significant', 'medium', 'low'].map((risk) => (
                    <MenuItem key={risk} value={risk}>
                      {risk}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="actionTakenOrRequired"
              control={control}
              render={({ field }) => (
                <TextField
                  helperText={errors.actionTakenOrRequired ? errors.actionTakenOrRequired.message : null}
                  error={!!errors.actionTakenOrRequired}
                  fullWidth
                  label="Action Taken or Required"
                  variant="outlined"
                  {...field}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="reportedBy"
              control={control}
              render={({ field }) => (
                <TextField
                  helperText={errors.reportedBy ? errors.reportedBy.message : null}
                  error={!!errors.reportedBy}
                  fullWidth
                  label="Reported By"
                  variant="outlined"
                  {...field}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="correctiveActionAssignedTo"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  {...field}
                  fullWidth
                  label="Corrective Action Assigned To"
                  variant="outlined"
                  error={!!errors.correctiveActionAssignedTo}
                  helperText={errors.correctiveActionAssignedTo?.message}
                >
                  {correctiveActionUsers?.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.username}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="observationStatus"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  {...field}
                  fullWidth
                  label="Observation Status"
                  variant="outlined"
                  error={!!errors.observationStatus}
                  helperText={errors.observationStatus?.message}
                >
                  {['open', 'closed'].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="closingDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Closing Date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  fullWidth
                  error={!!errors.closingDate}
                  helperText={errors.closingDate?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="remarks"
              control={control}
              render={({ field }) => (
                <TextField
                  helperText={errors.remarks ? errors.remarks.message : null}
                  error={!!errors.remarks}
                  fullWidth
                  label="Remarks"
                  variant="outlined"
                  {...field}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="beforeImage"
              control={control}
              render={({ field }) => (
                <TextField
                  helperText={errors.beforeImage ? errors.beforeImage.message : null}
                  error={!!errors.beforeImage}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    accept: 'image/*',
                  }}
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.files?.[0])}
                  fullWidth
                  label="Before Image"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="afterImage"
              control={control}
              render={({ field }) => (
                <TextField
                  helperText={errors.afterImage ? errors.afterImage.message : null}
                  error={!!errors.afterImage}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    accept: 'image/*',
                  }}
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.files?.[0])}
                  fullWidth
                  label="After Image"
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

export default SafetyObservationForm;
