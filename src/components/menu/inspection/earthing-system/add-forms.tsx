'use client'

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import zod from 'zod';

const formSchema = zod.object({
  nameOfClient: zod.string().min(1, 'Name of client is required').max(155, 'Name of client is too long'),
  location: zod.string().min(1, 'Location is required').max(155, 'Location is too long'),
  dateOfTest: zod.string().min(1, 'Date of test is required').max(155, 'Date of test is too long'),
  testerDetails: zod.object({
    make: zod.string().min(1, 'Make is required').max(155, 'Make is too long'),
    slNo: zod.string().min(1, 'Sl No is required').max(155, 'Sl No is too long'),
    range: zod.string().min(1, 'Range is required').max(155, 'Range is too long'),
    calibDetails: zod.string().min(1, 'Calib details is required').max(155, 'Calib details is too long'),
    earthDetails: zod
      .array(
        zod.object({
          epConnectionWithGrid: zod
            .string()
            .min(1, 'EP connection with grid is required')
            .max(155, 'EP connection with grid is too long'),
          epConnectionWithoutGrid: zod
            .string()
            .min(1, 'EP connection without grid is required')
            .max(155, 'EP connection without grid is too long'),
          earthPitCover: zod.string().min(1, 'Earth pit cover is required').max(155, 'Earth pit cover is too long'),
          remarks: zod.string().max(155, 'Remarks is too long').optional(),
        })
      )
      .length(4, { message: 'Earth details must have 16 items' }),
  }),
  observationOrComments: zod.string().optional(),
});

type FormDataType = zod.infer<typeof formSchema>;

export const Form = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormDataType) => {
    console.log(data);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Controller
              name="nameOfClient"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name of Client"
                  fullWidth
                  error={!!errors?.nameOfClient}
                  helperText={
                    String(errors?.nameOfClient?.message) === 'undefined'
                      ? ''
                      : String(errors?.nameOfClient?.message)
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
              name="dateOfTest"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Date of Test"
                  fullWidth
                  error={!!errors?.dateOfTest}
                  helperText={
                    String(errors?.dateOfTest?.message) === 'undefined' ? '' : String(errors?.dateOfTest?.message)
                  }
                />
              )}
            />
          </Grid>
        </Grid>
        <br />

        <Typography variant="h6">Earth Tester Details:</Typography>
        <Grid container spacing={2} sx={{'marginTop':'5px'}}>
          <Grid item xs={12} md={6}>
            <Controller
              name="testerDetails.make"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Make"
                  fullWidth
                  error={!!errors?.testerDetails?.make}
                  helperText={
                    String(errors?.testerDetails?.make?.message) === 'undefined'
                      ? ''
                      : String(errors?.testerDetails?.make?.message)
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="testerDetails.slNo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Sl No"
                  fullWidth
                  error={!!errors?.testerDetails?.slNo}
                  helperText={
                    String(errors?.testerDetails?.slNo?.message) === 'undefined'
                      ? ''
                      : String(errors?.testerDetails?.slNo?.message)
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="testerDetails.range"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Range"
                  fullWidth
                  error={!!errors?.testerDetails?.range}
                  helperText={
                    String(errors?.testerDetails?.range?.message) === 'undefined'
                      ? ''
                      : String(errors?.testerDetails?.range?.message)
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="testerDetails.calibDetails"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Calib Details"
                  fullWidth
                  error={!!errors?.testerDetails?.calibDetails}
                  helperText={
                    String(errors?.testerDetails?.calibDetails?.message) === 'undefined'
                      ? ''
                      : String(errors?.testerDetails?.calibDetails?.message)
                  }
                />
              )}
            />
          </Grid>
        </Grid>
        <br />

        <Typography variant="h6">Earth Details:</Typography>
        {[...Array(16)].map((_, index) => (
          <Grid container spacing={1} key={index} sx={{marginBottom:'5px'}}>
            <Grid item xs={12}>
              <Typography> EP - {index + 1}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name={`testerDetails.earthDetails.${index}.epConnectionWithGrid`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="EP Connection with Grid"
                    fullWidth
                    error={!!errors?.testerDetails?.earthDetails?.[index]?.epConnectionWithGrid}
                    helperText={
                      String(errors?.testerDetails?.earthDetails?.[index]?.epConnectionWithGrid?.message) ===
                      'undefined'
                        ? ''
                        : String(errors?.testerDetails?.earthDetails?.[index]?.epConnectionWithGrid?.message)
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name={`testerDetails.earthDetails.${index}.epConnectionWithoutGrid`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="EP Connection without Grid"
                    fullWidth
                    error={!!errors?.testerDetails?.earthDetails?.[index]?.epConnectionWithoutGrid}
                    helperText={
                      String(errors?.testerDetails?.earthDetails?.[index]?.epConnectionWithoutGrid?.message) ===
                      'undefined'
                        ? ''
                        : String(errors?.testerDetails?.earthDetails?.[index]?.epConnectionWithoutGrid?.message)
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name={`testerDetails.earthDetails.${index}.earthPitCover`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Earth Pit Cover"
                    fullWidth
                    error={!!errors?.testerDetails?.earthDetails?.[index]?.earthPitCover}
                    helperText={
                      String(errors?.testerDetails?.earthDetails?.[index]?.earthPitCover?.message) === 'undefined'
                        ? ''
                        : String(errors?.testerDetails?.earthDetails?.[index]?.earthPitCover?.message)
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name={`testerDetails.earthDetails.${index}.remarks`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Remarks"
                    fullWidth
                    error={!!errors?.testerDetails?.earthDetails?.[index]?.remarks}
                    helperText={
                      String(errors?.testerDetails?.earthDetails?.[index]?.remarks?.message) === 'undefined'
                        ? ''
                        : String(errors?.testerDetails?.earthDetails?.[index]?.remarks?.message)
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        ))}

        <br /> <br />
        <Controller
          name="observationOrComments"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Observation/Comments"
              fullWidth
              multiline
              rows={2}
              error={!!errors.observationOrComments}
              helperText={errors.observationOrComments?.message}
            />
          )}
        />

        <Box my={5}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>
    </Container>
  );
};
