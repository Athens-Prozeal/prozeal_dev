'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import zod from 'zod';
import { valueOrDefault } from 'chart.js/dist/helpers/helpers.core';

const formSchema = zod.object({
  project_name: zod.string().min(1, 'Project name is required'),
  description: zod.string().min(1, 'Description is required'),
  date_of_checking: zod.string().min(1, 'Date of checking is required'),
  ref_drawing_no: zod.string().min(1, 'Reference drawing number is required'),
  preparation: zod
    .array(
      zod.object({
        yes_or_no: zod.string().default('N/A'),
        remarks: zod.string().optional(),
      })
    )
    .length(4, 'Preparation should have 4 items'),
  inprocess_to_be_checked: zod
    .array(
      zod.object({
        yes_or_no: zod.string().default('N/A'),
        remarks: zod.string().optional(),
      })
    )
    .length(12, 'Inprocess to be checked should have 12 items'),
  courses: zod
    .array(
      zod.object({
        yes_or_no: zod.string().default('N/A'),
        remarks: zod.string().optional(),
      })
    )
    .length(6, 'Courses should have 6 items'),
  comments: zod.string(),
});

export const Form = () => {
  const [count,setCount] = useState(0);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: any) => {
    setCount(count+1);
    console.log(data);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid my={3} container spacing={2}>
          <Grid item xs={12} md={6}>
            <Controller
              name="project_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Project Name"
                  fullWidth
                  error={!!errors?.project_name}
                  helperText={
                    String(errors?.project_name?.message) === 'undefined' ? '' : String(errors?.project_name?.message)
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Project Description"
                  fullWidth
                  error={!!errors?.description}
                  helperText={
                    String(errors?.description?.message) === 'undefined'
                      ? ''
                      : String(errors?.description?.message)
                  }
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid my={3} container spacing={2}>
          <Grid item xs={12} md={6}>
            <Controller
              name="date_of_checking"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Date of Checking"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  error={!!errors?.date_of_checking}
                  helperText={
                    String(errors?.date_of_checking?.message) === 'undefined'
                      ? ''
                      : String(errors?.date_of_checking?.message)
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="ref_drawing_no"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Reference Drawing Number"
                  fullWidth
                  error={!!errors?.ref_drawing_no}
                  helperText={
                    String(errors?.ref_drawing_no?.message) === 'undefined'
                      ? ''
                      : String(errors?.ref_drawing_no?.message)
                  }
                />
              )}
            />
          </Grid>
        </Grid>
        <Typography variant="h5">Items to be checked</Typography>

        <Typography my={5} variant="h5">
          Preparation
        </Typography>
        {[
          'Cleaning, and hacking of receiving area-checked',
          'Alignment, level & dimensions – checked',
          'Quality of bricks/blocks & sand conforming to specification – checked',
          'Adequacy of scaffolding checked & safety clearance obtained.',
        ].map((item, index) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [displaytoggle, setDisplaytoggle] = useState(false);

          return (
            <Box my={4}>
              <Typography>{item}</Typography>
              <Grid xs={12} md={6}>

                <Controller
                  name={`preparation.${index}.yes_or_no`}
                  control={control}
                  render={({ field }) => (
                    <ToggleButtonGroup
                      exclusive
                      value={field.value }
                      onChange={(_, newValue) => {
                        field.onChange(newValue);
                        if (newValue != 'N/A' || newValue == null) {
                          setDisplaytoggle(true);
                        } else {
                          setDisplaytoggle(false);
                        }
                      }}
                    >
                      {['Yes', 'No', 'N/A'].map((value) => (
                        <ToggleButton key={value} value={value}>
                          {value}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  )}
                />
                


              </Grid>

                <Grid xs={12} md={6}>
                  <Controller
                    name={`preparation.${index}.remarks`}
                    control={control}
                    render={({ field }) => <TextField {...field} label="Remarks" fullWidth variant="standard" />}
                  />
                </Grid>

            </Box>
          );
        })}

        <Typography variant="h5">In process to be checked </Typography>
        {[
          'Soaking of bricks/ wetting of blocks',
          'Thickness of wall & laying of bricks with frogs upward',
          'Mortar mix proportion',
          'Mortar joint thickness, packing, raking of joints & staggering of vertical joints',
          'Plumb, line & level',
          'Opening size & location',
          'Interlocking of even courses at wall junctions',
          'Concrete band/ provision of bars in partition wall',
          'Sill level & sill concrete',
          'Lintel level',
          'Packing between masonry and concrete',
          'Curing',
        ].map((item, index) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [displaytoggle, setDisplaytoggle] = useState(false);
          return (
            <Box my={4}>
              <Typography>{item}</Typography>
              <Grid xs={12} md={6}>
                <Controller
                  name={`inprocess_to_be_checked.${index}.yes_or_no`}
                  control={control}
                  render={({ field }) => (
                    <ToggleButtonGroup
                      exclusive
                      value={field.value }
                      onChange={(_, newValue) => {
                        field.onChange(newValue);
                        if (newValue != 'N/A' || newValue == null) {
                          setDisplaytoggle(true);
                        } else {
                          setDisplaytoggle(false);
                        }
                      }}
                    >
                      {['Yes', 'No', 'N/A'].map((value) => (
                        <ToggleButton key={value} value={value}>
                          {value}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  )}
                />
              </Grid>

                <Grid xs={12} md={6}>
                  <Controller
                    name={`inprocess_to_be_checked.${index}.remarks`}
                    control={control}
                    render={({ field }) => <TextField {...field} label="Remarks" fullWidth variant="standard" />}
                  />
                </Grid>

            </Box>
          );
        })}
        <Typography variant="h6">Courses</Typography>
        {['course 1', 'course 2', 'course 3', 'course 4', 'course 5', 'course 6'].map((item, index) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [displaytoggle, setDisplaytoggle] = useState(false);
          return (
            <Box my={4}>
              <Typography>
                {item} {index == 0 ? 'course laid as per drawing, aligned,plumbed & Commencement of work approved' : ''}
              </Typography>
              <Grid xs={12} md={6}>
                <Controller
                  name={`courses.${index}.yes_or_no`}
                  control={control}
                  render={({ field }) => (
                    <ToggleButtonGroup
                      exclusive
                      value={field.value }
                      onChange={(_, newValue) => {
                        field.onChange(newValue);
                        if (newValue != 'N/A' || newValue == null) {
                          setDisplaytoggle(true);
                        } else {
                          setDisplaytoggle(false);
                        }
                      }}
                    >
                      {['Yes', 'No', 'N/A'].map((value) => (
                        <ToggleButton key={value} value={value}>
                          {value}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  )}
                />
              </Grid>

                <Grid xs={12} md={6}>
                  <Controller
                    name={`courses.${index}.remarks`}
                    control={control}
                    render={({ field }) => <TextField {...field} label="Remarks" fullWidth variant="standard" />}
                  />
                </Grid>

            </Box>
          );
        })}
        <Typography variant="h5">Comments</Typography>
        <Grid item xs={12} md={6}>
          <Controller
            name="comments"
            control={control}
            render={({ field }) => <TextField {...field} label="Comment" fullWidth />}
          />
        </Grid>

        <Box my={5}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>
    </Container>
  );
};

