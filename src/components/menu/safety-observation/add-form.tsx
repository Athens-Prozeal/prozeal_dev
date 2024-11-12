'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material';
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
  department: z.number(),
  activityPerformed: z.string().min(2, 'Activity Performed must be atleast 2 characters'),
  subContractor: z.number(),
  safetyObservationFound: z.string().min(2, 'Safety Observation Found must be atleast 2 characters'),
  typeOfObservation: z.enum(['unsafe_act', 'unsafe_condition']),
  classification: z.string(),
  riskRated: z.enum(['high', 'significant', 'medium', 'low']),
  correctiveActionTaken: z.string().optional(),
  correctiveActionRequired: z
    .string()
    .min(2, 'Corrective Action Taken or Required must be atleast 2 characters')
    .optional(),
  correctiveActionAssignedTo: z.number(),
  observationStatus: z.enum(['open', 'closed']),
  beforeImage: z.instanceof(File).refine((file) => file instanceof File, {
    message: 'Invalid file format',
  }),
  afterImage: z
    .instanceof(File)
    .refine((file) => file instanceof File, {
      message: 'Invalid file format',
    })
    .optional(),
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
  const [observationStatus, setObservationStatus] = useState<string>('');
  const [departments, setDepartments] = useState<{id: number, name: string}[]>([]);
  const [subContractors, setSubContractors] = useState<SubContractorType[]>([]);
  const [classification, setClassification] = useState<{ name: string }[]>([]);
  const [correctiveActionUsers, setCorrectiveActionUsers] = useState<{ id: number; username: string }[]>([]);

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
    // Get subcontractors
    axios
      .get(
        `${config.site.serverURL}/api/auth/user/sub-contractor/?work_site_id=${localStorage.getItem('work-site-id')}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` } }
      )
      .then((response) => {
        setSubContractors(response.data);
      });

    // Get corrective action users
    axios
      .get(
        `${config.site.serverURL}/api/auth/user/corrective-action-user/?work_site_id=${localStorage.getItem('work-site-id')}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` } }
      )
      .then((response) => {
        setCorrectiveActionUsers(response.data);
      });

    // Get departments
    axios
      .get(`${config.site.serverURL}/api/auth/my-departments/?work_site_id=${localStorage.getItem('work-site-id')}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
      })
      .then((response) => {
        setDepartments(response.data);
      });

    // Get classification
    axios
      .get(
        `${config.site.serverURL}/api/safety-observation/classification/?work_site_id=${localStorage.getItem('work-site-id')}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
        }
      )
      .then((response) => {
        setClassification(response.data);
      });
  }, []);

  const onSubmit = async (data: SafetyObservationSchemaType) => {
    setButtonDisabled(true);

    const formdata = new FormData();
    formdata.append('date', data.date);
    formdata.append('time', data.time);
    formdata.append('work_location', data.workLocation);
    formdata.append('department', data.department.toString());
    formdata.append('activity_performed', data.activityPerformed);
    formdata.append('sub_contractor', data.subContractor.toString());
    formdata.append('safety_observation_found', data.safetyObservationFound);
    formdata.append('type_of_observation', data.typeOfObservation);
    formdata.append('classification', data.classification);
    formdata.append('risk_rated', data.riskRated);
    if (data.correctiveActionTaken) {
      formdata.append('corrective_action_taken', data.correctiveActionTaken);
    }
    formdata.append('corrective_action_required', data?.correctiveActionRequired ?? '');
    formdata.append('corrective_action_assigned_to', data.correctiveActionAssignedTo.toString());
    formdata.append('observation_status', data.observationStatus);

    formdata.append('before_image', data.beforeImage);
    if (data.afterImage) {
      formdata.append('after_image', data.afterImage);
    }
    formdata.append('remarks', data.remarks);

    axios({
      method: 'POST',
      url: `${config.site.serverURL}/api/safety-observation/?work_site_id=${localStorage.getItem('work-site-id')}`,
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
                  required
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
              name="time"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  type="time"
                  label="Time"
                  variant="outlined"
                  fullWidth
                  error={!!errors.time}
                  helperText={errors.time?.message}
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
                  required
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
                  {...field}
                  required
                  select
                  label="Department"
                  variant="outlined"
                  fullWidth
                  error={!!errors.department}
                  helperText={errors.department?.message}
                >
                  {departments?.map((department) => (
                    <MenuItem key={department.id} value={department.id}>
                      {department.name}
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
                  required
                  select
                  label="Sub Contractor"
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
                  required
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
                  select
                  {...field}
                  required
                  fullWidth
                  label="Classification"
                  variant="outlined"
                  error={!!errors.classification}
                  helperText={errors.classification?.message}
                >
                  {classification?.map((classf) => (
                    <MenuItem key={classf.name} value={classf.name}>
                      {classf.name}
                    </MenuItem>
                  ))}
                </TextField>
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
                  required
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

          <Grid item xs={12} sm={12} md={12}>
            <Controller
              name="safetyObservationFound"
              control={control}
              render={({ field }) => (
                <TextField
                  required
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
                  required
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

          <Grid item xs={12} sm={12} md={12}>
            <Controller
              name="correctiveActionRequired"
              control={control}
              render={({ field }) => (
                <TextField
                  helperText={errors.correctiveActionRequired ? errors.correctiveActionRequired.message : null}
                  error={!!errors.correctiveActionRequired}
                  fullWidth
                  label="Corrective Action Required"
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
                  required
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
                  required
                  fullWidth
                  label="Observation Status"
                  variant="outlined"
                  error={!!errors.observationStatus}
                  helperText={errors.observationStatus?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    setObservationStatus(e.target.value);

                  }}
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
              name="remarks"
              control={control}
              render={({ field }) => (
                <TextField
                  required
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
                  required
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
          <br />

          <Grid item xs={12} sm={12} md={12}>
            {observationStatus === 'closed' && (
              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography> Closure Action: </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Controller
                    name="correctiveActionTaken"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        required
                        helperText={errors.correctiveActionTaken ? errors.correctiveActionTaken.message : null}
                        error={!!errors.correctiveActionTaken}
                        fullWidth
                        label="Corrective Action Taken"
                        variant="outlined"
                        {...field}
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
                        required
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
              </Grid>
            )}
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
