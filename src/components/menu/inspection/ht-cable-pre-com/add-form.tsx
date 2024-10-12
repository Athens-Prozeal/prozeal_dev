'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { Controller, set, useForm } from 'react-hook-form';
import zod from 'zod';

import { Witness as WitnessType } from '@/types/user';
import { config } from '@/config';

// Define validation schema
const formSchema = zod.object({
  name_of_client: zod.string().min(1, 'Name of client is required').max(155, 'Name of client is too long'),
  location: zod.string().min(1, 'Location is required').max(155, 'Location is too long'),
  date_of_test: zod.string(),
  make: zod.string().min(1, 'Make is required').max(155, 'Make is too long'),
  cable_rating: zod.string().min(1, 'Cable rating is required').max(155, 'Cable rating is too long'),
  data: zod.object({
    insulation_resistance: zod.object({
      before_hv_test: zod.object({
        R_E: zod.string().min(1, 'R_E is required').max(155, 'R_E is too long'),
        Y_E: zod.string().min(1, 'Y_E is required').max(155, 'Y_E is too long'),
        B_E: zod.string().min(1, 'B_E is required').max(155, 'B_E is too long'),
        R_Y: zod.string().min(1, 'R_Y is required').max(155, 'R_Y is too long'),
        Y_B: zod.string().min(1, 'Y_B is required').max(155, 'Y_B is too long'),
        B_R: zod.string().min(1, 'B_R is required').max(155, 'B_R is too long'),
      }),
      after_hv_test: zod.object({
        R_E: zod.string().min(1, 'R_E is required').max(155, 'R_E is too long'),
        Y_E: zod.string().min(1, 'Y_E is required').max(155, 'Y_E is too long'),
        B_E: zod.string().min(1, 'B_E is required').max(155, 'B_E is too long'),
        R_Y: zod.string().min(1, 'R_Y is required').max(155, 'R_Y is too long'),
        Y_B: zod.string().min(1, 'Y_B is required').max(155, 'Y_B is too long'),
        B_R: zod.string().min(1, 'B_R is required').max(155, 'B_R is too long'),
      }),
      found_healthy: zod.string().default('No'),
      general_inspection: zod.string().default('No'),
      remarks: zod.string().optional(),
    }),
    hi_pot_test: zod.object({
      R_PH: zod.object({
        injected_voltage: zod.string().min(1, 'Injected voltage is required').max(155, 'Injected voltage is too long'),
        leakage_current: zod.string().min(1, 'Leakage current is required').max(155, 'Leakage current is too long'),
        time: zod.string().min(1, 'Time is required').max(155, 'Time is too long'),
      }),
      Y_PH: zod.object({
        injected_voltage: zod.string().min(1, 'Injected voltage is required').max(155, 'Injected voltage is too long'),
        leakage_current: zod.string().min(1, 'Leakage current is required').max(155, 'Leakage current is too long'),
        time: zod.string().min(1, 'Time is required').max(155, 'Time is too long'),
      }),
      B_PH: zod.object({
        injected_voltage: zod.string().min(1, 'Injected voltage is required').max(155, 'Injected voltage is too long'),
        leakage_current: zod.string().min(1, 'Leakage current is required').max(155, 'Leakage current is too long'),
        time: zod.string().min(1, 'Time is required').max(155, 'Time is too long'),
      }),
      withstood_the_test: zod.string().default('No'),
      cable_found_healthy: zod.string().default('No'),
    }),
  }),
  witness_1: zod.number().optional(),
  witness_2: zod.number().optional(),
  witness_3: zod.number().optional(),
});

// Define form data type
type FormData = zod.infer<typeof formSchema>;

const Form = () => {
  const [witnesses, setWitnesses] = useState<WitnessType[]>([]);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const currentDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/auth/user/witness/?work_site_id=${localStorage.getItem('work-site-id')}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
      })
      .then((response) => {
        setWitnesses(response.data);
      });
  }, []);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date_of_test: currentDate,
    }
  });

  const onSubmit = (data: FormData) => {
    setBtnDisabled(true);
    if (data.witness_1 === data.witness_2 || data.witness_2 === data.witness_3 || data.witness_3 === data.witness_1) {
      alert('Witness cannot be same');
      return;
    }

    axios({
      method: 'POST',
      url: `${config.site.serverURL}/api/inspection/ht-cable-pre-com/?work_site_id=${localStorage.getItem('work-site-id')}`,
      data: data,
      headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
    })
      .then((response) => {
        if (response.status === 201) {
          window.alert('HT Cable Pre-Commissioning Checklist Added');
          setTimeout(() => {
            window.location.href = '/menu/inspection/ht-cable-pre-com?status=approved';
          }, 500);
        }
      })
      .catch((error) => {
        setBtnDisabled(false);
        window.alert('Something went wrong!');
      });
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Controller
              name="name_of_client"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name of Client"
                  fullWidth
                  error={!!errors.name_of_client}
                  helperText={errors.name_of_client?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Location"
                  fullWidth
                  error={!!errors.location}
                  helperText={errors.location?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="date_of_test"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Date of Test"
                  fullWidth
                  error={!!errors.date_of_test}
                  helperText={errors.date_of_test?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="make"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Make" fullWidth error={!!errors.make} helperText={errors.make?.message} />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="cable_rating"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Cable Rating"
                  fullWidth
                  error={!!errors.cable_rating}
                  helperText={errors.cable_rating?.message}
                />
              )}
            />
          </Grid>
        </Grid>

        <Typography marginTop={5} variant="h5">
          Insulation Resistance Test:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Before HV Test</Typography>
          </Grid>
          {['R_E', 'Y_E', 'B_E', 'R_Y', 'Y_B', 'B_R'].map((fieldName) => (
            <Grid item xs={12} md={6} lg={4} key={fieldName}>
              <Controller
                name={`data.insulation_resistance.before_hv_test.${fieldName}` as keyof FormData}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={fieldName.replace('_', '-')}
                    fullWidth
                    error={
                      !!errors.data?.insulation_resistance?.before_hv_test?.[
                        fieldName as keyof typeof errors.data.insulation_resistance.before_hv_test
                      ]
                    }
                    helperText={
                      errors.data?.insulation_resistance?.before_hv_test?.[
                        fieldName as keyof typeof errors.data.insulation_resistance.before_hv_test
                      ]?.message
                    }
                  />
                )}
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <Typography variant="subtitle1">After HV Test</Typography>
          </Grid>
          {['R_E', 'Y_E', 'B_E', 'R_Y', 'Y_B', 'B_R'].map((fieldName) => (
            <Grid item xs={12} md={6} lg={4} key={fieldName}>
              <Controller
                name={`data.insulation_resistance.after_hv_test.${fieldName}` as keyof FormData}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={fieldName.replace('_', '-')}
                    fullWidth
                    error={
                      !!errors.data?.insulation_resistance?.after_hv_test?.[
                        fieldName as keyof typeof errors.data.insulation_resistance.after_hv_test
                      ]
                    }
                    helperText={
                      errors.data?.insulation_resistance?.after_hv_test?.[
                        fieldName as keyof typeof errors.data.insulation_resistance.after_hv_test
                      ]?.message
                    }
                  />
                )}
              />
            </Grid>
          ))}
        </Grid>
        <br />
        <Typography>
          <b>Note: Test certificate will be submitted at the time of testing.</b>
        </Typography>
        <br />
        <Grid item xs={12}>
          <Typography variant="subtitle1">Cables Found Healthy:</Typography>
          <Controller
            name="data.insulation_resistance.found_healthy"
            control={control}
            render={({ field: { onChange, value } }) => (
              <ToggleButtonGroup value={value || 'No'} exclusive onChange={(_, newValue) => onChange(newValue)}>
                <ToggleButton value="Yes">Yes</ToggleButton>
                <ToggleButton value="No">No</ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Grid>
        <br />
        <Grid item xs={12}>
          <Typography variant="subtitle1">General Inspection & Erection Completion checked : </Typography>
          <Controller
            name="data.insulation_resistance.general_inspection"
            control={control}
            render={({ field: { onChange, value } }) => (
              <ToggleButtonGroup
                value={value || 'No'} // Default value is 'No'
                exclusive
                onChange={(_, newValue) => onChange(newValue)}
              >
                <ToggleButton value="Yes">Yes</ToggleButton>
                <ToggleButton value="No">No</ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Grid>
        <Grid marginTop={5} item xs={12}>
          <Controller
            name="data.insulation_resistance.remarks"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Remarks"
                fullWidth
                error={!!errors.data?.insulation_resistance?.remarks}
                helperText={errors.data?.insulation_resistance?.remarks?.message}
              />
            )}
          />
        </Grid>

        <Typography marginTop={5} variant="h5">
          Hi-Pot Test:
        </Typography>
        {['R_PH', 'Y_PH', 'B_PH'].map((phase) => (
          <React.Fragment key={phase}>
            <Grid my={2} marginTop={2} item xs={12}>
              <Typography variant="subtitle1">{phase.replace('_', '-')}</Typography>
            </Grid>
            <Grid container spacing={2}>
              {['injected_voltage', 'leakage_current', 'time'].map((fieldName) => (
                <Grid item xs={12} md={6} lg={4} key={fieldName}>
                  <Controller
                    name={`data.hi_pot_test.${phase}.${fieldName}` as keyof FormData}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        {...(fieldName === 'time' ? { type: 'time' } : {})} // Set input type to number for 'time' field
                        label={fieldName.replace('_', ' ').toUpperCase()}
                        fullWidth
                        {...(fieldName === 'time' ? { InputLabelProps: { shrink: true } } : {})} // Set input label to shrink for 'time' field
                        error={
                          !!errors.data?.hi_pot_test?.[phase as 'R_PH' | 'Y_PH' | 'B_PH']?.[
                            fieldName as 'injected_voltage' | 'leakage_current' | 'time'
                          ]
                        }
                        helperText={
                          errors.data?.hi_pot_test?.[phase as 'R_PH' | 'Y_PH' | 'B_PH']?.[
                            fieldName as 'injected_voltage' | 'leakage_current' | 'time'
                          ]?.message
                        }
                      />
                    )}
                  />
                </Grid>
              ))}
            </Grid>
          </React.Fragment>
        ))}

        <Grid marginTop={2} container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">The cable withstood the test :</Typography>
            <Controller
              name="data.hi_pot_test.withstood_the_test"
              control={control}
              render={({ field: { onChange, value } }) => (
                <ToggleButtonGroup value={value || 'No'} exclusive onChange={(_, newValue) => onChange(newValue)}>
                  <ToggleButton value="Yes">Yes</ToggleButton>
                  <ToggleButton value="No">No</ToggleButton>
                </ToggleButtonGroup>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Cables found healthy:</Typography>
            <Controller
              name="data.hi_pot_test.cable_found_healthy"
              control={control}
              render={({ field: { onChange, value } }) => (
                <ToggleButtonGroup value={value || 'No'} exclusive onChange={(_, newValue) => onChange(newValue)}>
                  <ToggleButton value="Yes">Yes</ToggleButton>
                  <ToggleButton value="No">No</ToggleButton>
                </ToggleButtonGroup>
              )}
            />
          </Grid>
        </Grid>

        {/* Witness */}
        <Grid container spacing={3} sx={{ marginTop: '5px' }}>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h6">Witnesses</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} >
            <Controller
              name="witness_1"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={witnesses}
                  getOptionLabel={(witness) => `${witness.username} (${witness.company})`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Witness 1"
                      variant="outlined"
                      fullWidth
                      error={!!errors.witness_1}
                      helperText={errors.witness_1?.message}
                    />
                  )}
                  value={field.value !== null ? witnesses.find((witness) => witness.id === field.value) : null}
                  onChange={(e, newValue) => {
                    field.onChange(newValue?.id || null);
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} >
            <Controller
              name="witness_2"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={witnesses}
                  getOptionLabel={(witness) => `${witness.username} (${witness.company})`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Witness 2"
                      variant="outlined"
                      fullWidth
                      error={!!errors.witness_2}
                      helperText={errors.witness_2?.message}
                    />
                  )}
                  value={field.value !== null ? witnesses.find((witness) => witness.id === field.value) : null}
                  onChange={(e, newValue) => {
                    field.onChange(newValue?.id || null);
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} >
            <Controller
              name="witness_3"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={witnesses}
                  getOptionLabel={(witness) => `${witness.username} (${witness.company})`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Witness 3"
                      variant="outlined"
                      fullWidth
                      error={!!errors.witness_3}
                      helperText={errors.witness_3?.message}
                    />
                  )}
                  value={field.value !== null ? witnesses.find((witness) => witness.id === field.value) : null}
                  onChange={(e, newValue) => {
                    field.onChange(newValue?.id || null);
                  }}
                />
              )}
            />
          </Grid>
        </Grid>

        <Box my={5}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Form;
