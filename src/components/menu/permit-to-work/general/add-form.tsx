'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Grid, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  expiires_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Datetime must be in the format YYYY-MM-DDTHH:MM:SSZ')
    .refine((value) => !isNaN(Date.parse(value)), 'Invalid date format'),
  validity: z.string().min(1, 'Validity is required'),
  section: z.string().min(1, 'Section is required'),
  lock_out_no: z.string().min(1, 'Lock Out No is required'),
  location: z.string().min(1, 'Location is required'),
  work_order_no: z.string().min(1, 'Work Order No is required'),
  job_description: z.string().min(1, 'Job Description is required'),
  issued_to: z.string().min(1, 'Issued To is required'),
  tool_box_talk: z.string().min(1, 'TBT is required').default('n/a'),
  underground_or_overhead_cables_checked: z.string().min(1, 'Underground is required').default('n/a'),
  ppe_required_to_be_used: z
    .array(z.string().min(1, 'PPE Required is required'))
    .length(6, 'PPE Required must have 6 items'),
  other_work_permit_issued_same_location_datetime: z.string().min(1, 'Other Work Permit is required').default('no'),
  other_permit_no: z.string().optional(),
  any_other_safety_precaution_required: z.string().min(1, 'Safety Precautions is required'),
  // site_safety_induction_conducted: z.string().min(1, 'Site safety induction conducted choice is required'),
});

type FormDataType = z.infer<typeof formSchema>;

export const PTWGeneral = () => {
  const [permitNo, setPermitNo] = useState('');
  const [isolationCarried, setIsolationCarried] = useState('');
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data:FormDataType) => {
    console.log(data);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} md={6} lg={4}>
            <Controller
              name="expiires_at"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Datetime"
                  type="datetime-local"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.expiires_at}
                  helperText={errors.expiires_at?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Controller
              name="validity"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Validity"
                  variant="outlined"
                  fullWidth
                  error={!!errors.validity}
                  helperText={errors.validity?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Controller
              name="section"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Section"
                  variant="outlined"
                  fullWidth
                  error={!!errors.section}
                  helperText={errors.section?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Controller
              name="lock_out_no"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Lock Out No"
                  variant="outlined"
                  fullWidth
                  error={!!errors.lock_out_no}
                  helperText={errors.lock_out_no?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Location"
                  variant="outlined"
                  fullWidth
                  error={!!errors.location}
                  helperText={errors.location?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Controller
              name="work_order_no"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Work Order No"
                  variant="outlined"
                  fullWidth
                  error={!!errors.work_order_no}
                  helperText={errors.work_order_no?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="job_description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Job Description"
                  variant="outlined"
                  fullWidth
                  error={!!errors.job_description}
                  helperText={errors.job_description?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="issued_to"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Issued to (Contractor Firm/Supplier Name):"
                  variant="outlined"
                  fullWidth
                  error={!!errors.job_description}
                  helperText={errors.job_description?.message}
                />
              )}
            />
          </Grid>
        </Grid>



        <Typography marginTop={3} variant="h6">
          Following safety measures taken to carry out work:
        </Typography>
        <br />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" marginBottom={1}>
              1. Tool Box Talk (TBT)
            </Typography>
            <Controller
              name="tool_box_talk"
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup
                  value={field.value || 'n/a'}
                  exclusive
                  onChange={(event, newValue) => field.onChange(newValue)}
                  aria-label="TBT Status"
                >
                  <ToggleButton value="yes" aria-label="yes">
                    YES
                  </ToggleButton>
                  <ToggleButton value="no" aria-label="no">
                    NO
                  </ToggleButton>
                  <ToggleButton value="n/a" aria-label="na">
                    N/A
                  </ToggleButton>
                </ToggleButtonGroup>
              )}
            />
            {errors?.tool_box_talk && <Typography color="error">{errors.tool_box_talk.message}</Typography>}
          </Grid>
          <br />

          <Grid item xs={12}>
            <Typography variant="h6" marginBottom={1}>
              2. Underground / overhead cables checked for intervention
            </Typography>
            <Controller
              name="underground_or_overhead_cables_checked"
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup
                  value={field.value || 'n/a'}
                  exclusive
                  onChange={(event, newValue) => field.onChange(newValue)}
                  aria-label="Underground Status"
                >
                  <ToggleButton value="yes" aria-label="yes">
                    YES
                  </ToggleButton>
                  <ToggleButton value="no" aria-label="no">
                    NO
                  </ToggleButton>
                  <ToggleButton value="n/a" aria-label="na">
                    N/A
                  </ToggleButton>
                </ToggleButtonGroup>
              )}
            />
            {errors?.underground_or_overhead_cables_checked && (
              <Typography color="error">{errors.underground_or_overhead_cables_checked.message}</Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography marginTop={3} variant="h6">
              3. Following PPE required to be used
            </Typography>

            <Grid container spacing={2}>
              {[
                'a) Hand/ head/ leg Protection',
                'b) Earth Rod',
                'c) 33 KV hand gloves',
                'd) Hazardous Material',
                'e) Eye/Face',
                'f) Full body harness',
              ].map((item, index) => (
                <Grid item xs={12} key={index}>
                  <Typography marginTop={1}>{item}</Typography>
                  <Controller
                    name={`ppe_required_to_be_used.${index}`}
                    control={control}
                    render={({ field }) => (
                      <ToggleButtonGroup
                        value={field.value}
                        exclusive
                        onChange={(event, newValue) => field.onChange(newValue)}
                        aria-label="PPE Status"
                      >
                        <ToggleButton value="yes" aria-label="yes">
                          YES
                        </ToggleButton>
                        <ToggleButton value="no" aria-label="no">
                          NO
                        </ToggleButton>
                      </ToggleButtonGroup>
                    )}
                  />
                  {errors?.ppe_required_to_be_used?.[index] && (
                    <Typography color="error">{errors.ppe_required_to_be_used[index].message}</Typography>
                  )}
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" marginBottom={1}>
              4. Any other work permit issued for same PVSP/ Feeder/ Bay / Substation on same date time
            </Typography>
            <Controller
              name="other_work_permit_issued_same_location_datetime"
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup
                  value={field.value}
                  exclusive
                  onChange={(event, newValue) => {
                    field.onChange(newValue);
                    setPermitNo(newValue);
                  }}
                  aria-label="Permit Status"
                >
                  <ToggleButton value="yes" aria-label="yes">
                    YES
                  </ToggleButton>
                  <ToggleButton value="no" aria-label="no">
                    NO
                  </ToggleButton>
                </ToggleButtonGroup>
              )}
            />
          </Grid>

          {permitNo === 'yes' && (
            <Grid item xs={12} lg={6}>
              <Controller
                name="other_permit_no"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Permit No" variant="outlined" fullWidth margin="normal" />
                )}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="h6" marginBottom={1}>
              5. Any other safety precaution required
            </Typography>
            <Controller
              name="any_other_safety_precaution_required"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  fullWidth
                  error={!!errors?.any_other_safety_precaution_required}
                  helperText={errors?.any_other_safety_precaution_required?.message}
                />
              )}
            />
          </Grid>
        </Grid>
        <Typography marginTop={3}>
          This certifies that as per JSA / TRA, I HAVE personally completed a safety inspection of the area where this
          work is to be done as well as the surrounding area. I HAVE received all necessary precautions to be taken to
          protect the personnel engaged in this work from accident and injury. I HAVE made sure that assigned personnel
          know the applicable safety rules and that they know what to do in an EMERGENCY.
        </Typography>

        <Box marginTop={5}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};
