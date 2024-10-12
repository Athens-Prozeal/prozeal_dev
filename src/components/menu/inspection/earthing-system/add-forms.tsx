'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Box, Button, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import zod from 'zod';

import { Witness as WitnessType } from '@/types/user';
import { config } from '@/config';

const formSchema = zod.object({
  name_of_client: zod.string().min(1, 'Name of client is required').max(155, 'Name of client is too long'),
  location: zod.string().min(1, 'Location is required').max(155, 'Location is too long'),
  date_of_test: zod.string(),
  earth_tester_details: zod.object({
    make: zod.string().min(1, 'Make is required').max(155, 'Make is too long'),
    sl_no: zod.string().min(1, 'Sl No is required').max(155, 'Sl No is too long'),
    range: zod.string().min(1, 'Range is required').max(155, 'Range is too long'),
    calib_details: zod.string().min(1, 'Calib details is required').max(155, 'Calib details is too long'),
    earth_details: zod
      .array(
        zod.object({
          ep_connection_with_grid: zod
            .string()
            .min(1, 'EP connection with grid is required')
            .max(155, 'EP connection with grid is too long'),
          ep_connection_without_grid: zod
            .string()
            .min(1, 'EP connection without grid is required')
            .max(155, 'EP connection without grid is too long'),
          earth_pit_cover: zod.string().min(1, 'Earth pit cover is required').max(155, 'Earth pit cover is too long'),
          remarks: zod.string().max(155, 'Remarks is too long').optional(),
        })
      )
      .length(16, { message: 'Earth details must have 4 items' }),
  }),
  observation_or_comments: zod.string().optional(),
  witness_1: zod.number().optional(),
  witness_2: zod.number().optional(),
  witness_3: zod.number().optional(),
});

type FormDataType = zod.infer<typeof formSchema>;

export const Form = () => {
  const currentDate = new Date().toISOString().split('T')[0];
  const [witnesses, setWitnesses] = useState<WitnessType[]>([]);
  const [btnDisabled, setBtnDisabled] = useState(false);

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
  } = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date_of_test: currentDate,
    }
  });

  const onSubmit = (data: FormDataType) => {
    setBtnDisabled(true);
    if (data.witness_1 === data.witness_2 || data.witness_2 === data.witness_3 || data.witness_3 === data.witness_1) {
      alert('Witness cannot be same');
      return;
    }

    setBtnDisabled(true);
    axios({
      method: 'POST',
      url: `${config.site.serverURL}/api/inspection/earthing-system/?work_site_id=${localStorage.getItem('work-site-id')}`,
      data: data,
      headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
    })
      .then((response) => {
        if (response.status === 201) {
          window.alert('Earthing System Report Added');
          setTimeout(() => {
            window.location.href = '/menu/inspection/earthing-system?status=approved';
          }, 500);
        }
      })
      .catch(() => {
        setBtnDisabled(false);
        window.alert('Something went wrong!');
      });
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Controller
              name="name_of_client"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name of Client"
                  fullWidth
                  error={!!errors?.name_of_client}
                  helperText={
                    String(errors?.name_of_client?.message) === 'undefined' ? '' : String(errors?.name_of_client?.message)
                  }
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
                  error={!!errors?.location}
                  helperText={
                    String(errors?.location?.message) === 'undefined' ? '' : String(errors?.location?.message)
                  }
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
                  error={!!errors?.date_of_test}
                  helperText={
                    String(errors?.date_of_test?.message) === 'undefined' ? '' : String(errors?.date_of_test?.message)
                  }
                />
              )}
            />
          </Grid>
        </Grid>
        <br />
        <Typography variant="h6">Earth Tester Details:</Typography>
        <Grid container spacing={2} sx={{ marginTop: '5px' }}>
          <Grid item xs={12} md={6}>
            <Controller
              name="earth_tester_details.make"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Make"
                  fullWidth
                  error={!!errors?.earth_tester_details?.make}
                  helperText={
                    String(errors?.earth_tester_details?.make?.message) === 'undefined'
                      ? ''
                      : String(errors?.earth_tester_details?.make?.message)
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="earth_tester_details.sl_no"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Sl No"
                  fullWidth
                  error={!!errors?.earth_tester_details?.sl_no}
                  helperText={
                    String(errors?.earth_tester_details?.sl_no?.message) === 'undefined'
                      ? ''
                      : String(errors?.earth_tester_details?.sl_no?.message)
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="earth_tester_details.range"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Range"
                  fullWidth
                  error={!!errors?.earth_tester_details?.range}
                  helperText={
                    String(errors?.earth_tester_details?.range?.message) === 'undefined'
                      ? ''
                      : String(errors?.earth_tester_details?.range?.message)
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="earth_tester_details.calib_details"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Calib Details"
                  fullWidth
                  error={!!errors?.earth_tester_details?.calib_details}
                  helperText={
                    String(errors?.earth_tester_details?.calib_details?.message) === 'undefined'
                      ? ''
                      : String(errors?.earth_tester_details?.calib_details?.message)
                  }
                />
              )}
            />
          </Grid>
        </Grid>
        <br />
        <Typography variant="h6">Earth Details:</Typography>
        {[...Array(16)].map((_, index) => (
          <Grid container spacing={1} key={index} sx={{ marginBottom: '5px' }}>
            <Grid item xs={12}>
              <Typography> EP - {index + 1}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name={`earth_tester_details.earth_details.${index}.ep_connection_with_grid`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="EP Connection with Grid"
                    fullWidth
                    error={!!errors?.earth_tester_details?.earth_details?.[index]?.ep_connection_with_grid}
                    helperText={
                      String(errors?.earth_tester_details?.earth_details?.[index]?.ep_connection_with_grid?.message) ===
                      'undefined'
                        ? ''
                        : String(errors?.earth_tester_details?.earth_details?.[index]?.ep_connection_with_grid?.message)
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name={`earth_tester_details.earth_details.${index}.ep_connection_without_grid`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="EP Connection without Grid"
                    fullWidth
                    error={!!errors?.earth_tester_details?.earth_details?.[index]?.ep_connection_without_grid}
                    helperText={
                      String(errors?.earth_tester_details?.earth_details?.[index]?.ep_connection_without_grid?.message) ===
                      'undefined'
                        ? ''
                        : String(errors?.earth_tester_details?.earth_details?.[index]?.ep_connection_without_grid?.message)
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name={`earth_tester_details.earth_details.${index}.earth_pit_cover`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Earth Pit Cover"
                    fullWidth
                    error={!!errors?.earth_tester_details?.earth_details?.[index]?.earth_pit_cover}
                    helperText={
                      String(errors?.earth_tester_details?.earth_details?.[index]?.earth_pit_cover?.message) === 'undefined'
                        ? ''
                        : String(errors?.earth_tester_details?.earth_details?.[index]?.earth_pit_cover?.message)
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name={`earth_tester_details.earth_details.${index}.remarks`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Remarks"
                    fullWidth
                    error={!!errors?.earth_tester_details?.earth_details?.[index]?.remarks}
                    helperText={
                      String(errors?.earth_tester_details?.earth_details?.[index]?.remarks?.message) === 'undefined'
                        ? ''
                        : String(errors?.earth_tester_details?.earth_details?.[index]?.remarks?.message)
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        ))}
        <br /> <br />
        <Controller
          name="observation_or_comments"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Observation/Comments"
              fullWidth
              multiline
              rows={2}
              error={!!errors.observation_or_comments}
              helperText={errors.observation_or_comments?.message}
            />
          )}
        />
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
          <Button type="submit" variant="contained" color="primary" disabled={btnDisabled}>
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};
