'use client';


import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  Button,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the schema using Zod
const formSchema = z.object({
  site_name: z.string().max(155, 'Site name is too long').min(1, 'Site name is required'),
  equipment_make: z.string().max(155, 'Equipment make is too long').min(1, 'Equipment make is required'),
  serial_no: z.string().max(155, 'Serial number is too long').min(1, 'Serial number is required'),
  calibration_date: z.string().max(155, 'Calibration date is too long').min(1, 'Calibration date is required'),
  inverter: z.array(z.object({
    string_inverter_no: z.string().optional(),
    date: z.string().optional(),
    time: z.string().optional(),
    entry: z.array(z.object({
      voc_string: z.string().optional(),
      polarity_string: z.string().optional(),
      floating_voltage: z.string().optional(),
    })).optional(),
  })).optional(),
  project_engineer_sign: z.string().optional(),
  qhse_engineer_sign: z.string().optional(),
  client_sign: z.string().optional(),
});

export const Form = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data) => {
    console.log('Submitted Data:', data);
    reset(); // Reset the form after submission
  };

  // State to manage inverter array
  const [inverters, setInverters] = useState([{ entry: [] }]);

  const addInverter = () => {
    setInverters([...inverters, { entry: [] }]);
  };

  const removeInverter = (index) => {
    const updatedInverters = inverters.filter((_, i) => i !== index);
    setInverters(updatedInverters);
  };

  const addEntry = (index) => {
    const updatedInverters = [...inverters];
    updatedInverters[index].entry.push({});
    setInverters(updatedInverters);
  };

  const removeEntry = (inverterIndex, entryIndex) => {
    const updatedInverters = [...inverters];
    updatedInverters[inverterIndex].entry.splice(entryIndex, 1);
    setInverters(updatedInverters);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Site Name */}
            <Grid item xs={12}>
              <Controller
                name="site_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Site Name"
                    fullWidth
                    sx={{ margin: '5px 0' }} // Added margin
                    error={!!errors.site_name}
                    helperText={errors.site_name ? errors.site_name.message : ''}
                  />
                )}
              />
            </Grid>

            {/* Equipment Make */}
            <Grid item xs={12}>
              <Controller
                name="equipment_make"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Equipment Make"
                    fullWidth
                    sx={{ margin: '5px 0' }} // Added margin
                    error={!!errors.equipment_make}
                    helperText={errors.equipment_make ? errors.equipment_make.message : ''}
                  />
                )}
              />
            </Grid>

            {/* Serial Number */}
            <Grid item xs={12}>
              <Controller
                name="serial_no"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Serial Number"
                    fullWidth
                    sx={{ margin: '5px 0' }} // Added margin
                    error={!!errors.serial_no}
                    helperText={errors.serial_no ? errors.serial_no.message : ''}
                  />
                )}
              />
            </Grid>

            {/* Calibration Date */}
            <Grid item xs={12}>
              <Controller
                name="calibration_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Calibration Date"
                    type="date"
                    fullWidth
                    sx={{ margin: '5px 0' }} // Added margin
                    error={!!errors.calibration_date}
                    helperText={errors.calibration_date ? errors.calibration_date.message : ''}
                    InputLabelProps={{
                      shrink: true, // Ensure the label shrinks when date is selected
                    }}
                  />
                )}
              />
            </Grid>

            {/* Inverter Entries */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>PCU / String Inverter Entries</Typography>
              {inverters.map((inverter, inverterIndex) => (
                <Box key={inverterIndex} sx={{ mb: 2, border: '1px solid #ccc', p: 2 }}>
                  <Typography variant="subtitle1">PCU / String Inverter {inverterIndex + 1}</Typography>

                  <Controller
                    name={`inverter.${inverterIndex}.string_inverter_no`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="String Inverter No."
                        fullWidth
                        sx={{ margin: '5px 0' }} // Added margin
                      />
                    )}
                  />

                  <Controller
                    name={`inverter.${inverterIndex}.date`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Date"
                        type="date"
                        fullWidth
                        sx={{ margin: '5px 0' }} // Added margin
                        InputLabelProps={{
                          shrink: true, // Ensure the label shrinks when date is selected
                        }}
                      />
                    )}
                  />

                  <Controller
                    name={`inverter.${inverterIndex}.time`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Time"
                        type="time"
                        fullWidth
                        sx={{ margin: '5px 0' }} // Added margin
                        InputLabelProps={{
                          shrink: true, // Ensure the label shrinks when date is selected
                        }}
                      />
                    )}
                  />

                  {/* Entry Entries */}
                  {inverter.entry.map((entry, entryIndex) => (
                    <Box key={entryIndex} sx={{ mb: 1, border: '1px solid #eee', p: 1 }}>
                      <Typography variant="subtitle2">Entry {entryIndex + 1}</Typography>


                      <Controller
                        name={`inverter.${inverterIndex}.entry.${entryIndex}.voc_string`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Voc String"
                            fullWidth
                            sx={{ margin: '5px 0' }} // Added margin
                          />
                        )}
                      />

                      <Controller
                        name={`inverter.${inverterIndex}.entry.${entryIndex}.polarity_string`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Polarity String"
                            fullWidth
                            sx={{ margin: '5px 0' }} // Added margin
                          />
                        )}
                      />

                      <Controller
                        name={`inverter.${inverterIndex}.entry.${entryIndex}.floating_voltage`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Floating Voltage"
                            fullWidth
                            sx={{ margin: '5px 0' }} // Added margin
                          />
                        )}
                      />

                      <Button variant="outlined" color="secondary" onClick={() => removeEntry(inverterIndex, entryIndex)}>
                        Remove Entry
                      </Button>
                    </Box>
                  ))}

                  <Button variant="outlined" onClick={() => addEntry(inverterIndex)}>Add Entry</Button>
                  <Button variant="outlined" color="secondary" onClick={() => removeInverter(inverterIndex)}>
                    Remove Inverter
                  </Button>
                </Box>
              ))}
              <Button variant="outlined" onClick={addInverter}>Add Inverter</Button>
            </Grid>

            {/* Project Engineer Sign */}
            <Grid item xs={12}>
              <Controller
                name="project_engineer_sign"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Project Engineer Sign"
                    fullWidth
                    sx={{ margin: '5px 0' }} // Added margin
                  />
                )}
              />
            </Grid>

            {/* QHSE Engineer Sign */}
            <Grid item xs={12}>
              <Controller
                name="qhse_engineer_sign"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="QHSE Engineer Sign"
                    fullWidth
                    sx={{ margin: '5px 0' }} // Added margin
                  />
                )}
              />
            </Grid>

            {/* Client Sign */}
            <Grid item xs={12}>
              <Controller
                name="client_sign"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Client Sign"
                    fullWidth
                    sx={{ margin: '5px 0' }} // Added margin
                  />
                )}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};
