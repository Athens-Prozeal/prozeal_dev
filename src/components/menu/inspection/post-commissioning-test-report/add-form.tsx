'use client';

import { Fragment, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ExecutionEngineer as ExecutionEngineerType, QualityEngineer as QualityEngineerType } from '@/types/user';
import { config } from '@/config';

// Zod schema
const schema = z.object({
  arrayCapacity: z.string().min(1, 'Please provide the Array Capacity'),
  make: z.string().min(1, 'Please specify the Make of the module'),
  voltageCurrent: z
    .array(
      z.object({
        voltage: z.string().min(1, 'Voltage is required'),
        current: z.string().min(1, 'Current is required'),
      })
    )
    .length(40, 'There must be 25 string entries.'),
  inverters: z
    .array(
      z.object({
        capacity: z.string().min(1, 'Capacity is required'),
        make: z.string().min(1, 'Make is required'),
        acSide: z.object({
          voltageR_N: z.string().min(1, 'Voltage R_N is required'),
          voltageY_N: z.string().min(1, 'Voltage Y_N is required'),
          voltageB_N: z.string().min(1, 'Voltage B_N is required'),
          currentR: z.string().min(1, 'currentR is required'),
          currentY: z.string().min(1, 'currentY is required'),
          currentB: z.string().min(1, 'currentB is required'),
          powerKW: z.string().min(1, 'powerKW is required'),
          frequencyHz: z.string().min(1, 'frequencyHz is required'),
        }),
      })
    )
    .length(5, 'Five inverters are required'),
  acdbPanels: z
    .array(
      z.object({
        incoming: z.object({
          voltage: z.object({
            rN: z.string().min(1, 'Voltage r_N is required'),
            yN: z.string().min(1, 'Voltage y_N is required'),
            bN: z.string().min(1, 'Voltage b_N is required'),
            nE: z.string().min(1, 'Voltage n_E is required'),
          }),
          ampere: z.object({
            rPh: z.string().min(1, 'Ampere r_Ph is required'),
            yPh: z.string().min(1, 'Ampere y_Ph is required'),
            bPh: z.string().min(1, 'Ampere b_Ph is required'),
          }),
          energyMeter: z.object({
            main: z.string().min(1, 'Energy Meter is required'),
            check: z.string().min(1, 'Check is required'),
          }),
        }),
        outgoing: z.object({
          voltage: z.object({
            rN: z.string().min(1, 'Voltage r_N is required'),
            yN: z.string().min(1, 'Voltage y_N is required'),
            bN: z.string().min(1, 'Voltage b_N is required'),
            nE: z.string().min(1, 'Voltage n_E is required'),
          }),
          ampere: z.object({
            rPh: z.string().min(1, 'Ampere r_Ph is required'),
            yPh: z.string().min(1, 'Ampere y_Ph is required'),
            bPh: z.string().min(1, 'Ampere b_Ph is required'),
          }),
          energyMeter: z.object({
            main: z.string().min(1, 'Energy Meter is required'),
            check: z.string().min(1, 'Check is required'),
          }),
        }),
      })
    )
    .length(2, 'Two ACDB panels are required'),
  qualityEngineer: z.number().optional(),
  executionEngineer: z.number().optional(),
  customer: z.string().min(1, 'Please provide the customer name'),
});

type SchemaType = z.infer<typeof schema>;

export const Form = () => {
  const [executionEngineers, setExecutionEngineers] = useState<ExecutionEngineerType[]>([]);
  const [qualityEngineers, setQualityEngineers] = useState<QualityEngineerType[]>([]);

  useEffect(() => {
    axios
      .get(
        `${config.site.serverURL}/api/auth/user/quality-engineer/?work_site_id=${localStorage.getItem('work-site-id')}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
        }
      )
      .then((response) => {
        setQualityEngineers(response.data);
      });
    axios
      .get(
        `${config.site.serverURL}/api/auth/user/execution-engineer/?work_site_id=${localStorage.getItem('work-site-id')}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
        }
      )
      .then((response) => {
        setExecutionEngineers(response.data);
      });
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      arrayCapacity: '',
      make: '',
      voltageCurrent: Array(40).fill({ voltage: '', current: '' }),
      inverters: Array(5).fill({
        capacity: '',
        make: '',
        acSide: {
          voltageR_N: '',
          voltageY_N: '',
          voltageB_N: '',
          currentR: '',
          currentY: '',
          currentB: '',
          powerKW: '',
          frequencyHz: '',
        },
      }),
      acdbPanels: Array(2).fill({
        incoming: {
          voltage: { rN: '', yN: '', bN: '', nE: '' },
          ampere: { rPh: '', yPh: '', bPh: '' },
          energyMeter: { main: '', check: '' },
        },
        outgoing: {
          voltage: { rN: '', yN: '', bN: '', nE: '' },
          ampere: { rPh: '', yPh: '', bPh: '' },
          energyMeter: { main: '', check: '' },
        },
      }),
    },
  });

  const onSubmit = (data: SchemaType) => {
    console.log(data);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box my={4}>
          <Typography variant="h4" align="left" gutterBottom>
            1. Solar PV Array
          </Typography>
          <Typography variant="subtitle1" align="left" gutterBottom>
            Please fill in the details of the Solar PV Array below. Ensure that all required fields are filled out.
          </Typography>
        </Box>

        <Box my={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="arrayCapacity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Array Capacity (kWp)"
                    fullWidth
                    variant="outlined"
                    error={!!errors.arrayCapacity}
                    helperText={errors.arrayCapacity?.message || 'Example: 5 kWp'}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="make"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Make of the Module"
                    fullWidth
                    variant="outlined"
                    error={!!errors.make}
                    helperText={errors.make?.message || 'Example: Polycrystalline'}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider />

        <Box my={4}>
          <Typography variant="h5" gutterBottom>
            String Voltage (Vmp) and Current (Imp)
          </Typography>
          <Typography variant="body1" paragraph>
            Please enter the voltage and current for each string below.
          </Typography>
          <Grid container spacing={3}>
            {Array.from({ length: 40 }).map((_, idx) => (
              <Fragment key={idx}>
                <Grid item xs={12} sm={6} md={3}>
                  <Controller
                    name={`voltageCurrent.${idx}.voltage`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={`Voltage (Vmp) - String ${idx + 1}`}
                        fullWidth
                        variant="outlined"
                        error={!!(errors.voltageCurrent?.[idx] as any)?.voltage}
                        helperText={(errors.voltageCurrent?.[idx] as any)?.voltage?.message || 'Example: 35V'}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Controller
                    name={`voltageCurrent.${idx}.current`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={`Current (Imp) - String ${idx + 1}`}
                        fullWidth
                        variant="outlined"
                        error={!!errors.voltageCurrent?.[idx]?.current}
                        helperText={errors.voltageCurrent?.[idx]?.current?.message || 'Example: 8A'}
                      />
                    )}
                  />
                </Grid>
              </Fragment>
            ))}
          </Grid>
        </Box>

        <Box my={4}>
          <Typography variant="h5" gutterBottom>
            2. GRID-TIE INVERTER
          </Typography>
          {[0, 1, 2, 3, 4].map((inverterIndex) => (
            <Box key={inverterIndex} mt={4}>
              <Typography variant="h6" gutterBottom>
                INVERTER-{inverterIndex + 1}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name={`inverters.${inverterIndex}.capacity`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Inverter Capacity"
                        fullWidth
                        variant="outlined"
                        error={!!errors.inverters?.[inverterIndex]?.capacity}
                        helperText={errors.inverters?.[inverterIndex]?.capacity?.message || 'Example: 5 kW'}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name={`inverters.${inverterIndex}.make`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Inverter Make"
                        fullWidth
                        variant="outlined"
                        error={!!errors.inverters?.[inverterIndex]?.make}
                        helperText={errors.inverters?.[inverterIndex]?.make?.message || 'Example: ABC Inverters'}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                  AC Side Details
                </Typography>
                <Grid container spacing={3}>
                  {[
                    'voltageR_N',
                    'voltageY_N',
                    'voltageB_N',
                    'currentR',
                    'currentY',
                    'currentB',
                    'powerKW',
                    'frequencyHz',
                  ].map((fieldName) => (
                    <Grid item xs={12} md={3} key={fieldName}>
                      <Controller
                        name={`inverters.${inverterIndex}.acSide.${fieldName}` as keyof SchemaType}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={fieldName.replace(/([A-Z])/g, ' $1').toUpperCase()}
                            fullWidth
                            variant="outlined"
                            error={!!errors.inverters?.[inverterIndex]?.acSide?.[fieldName]}
                            helperText={errors.inverters?.[inverterIndex]?.acSide?.[fieldName]?.message}
                          />
                        )}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          ))}
        </Box>

        <Divider />

        <Box my={4}>
          <Typography variant="h5" gutterBottom>
            3. ACDB Panels
          </Typography>
          {[0, 1].map((panelIndex) => (
            <Box key={panelIndex} mt={4}>
              <Typography variant="h6" gutterBottom>
                ACDB PANEL-{panelIndex + 1}
              </Typography>
              <TableContainer component={Paper} elevation={3}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontWeight: 'bold' }}></TableCell>
                      <TableCell colSpan={4} align="center" style={{ fontWeight: 'bold' }}>
                        VOLTAGE
                      </TableCell>
                      <TableCell colSpan={3} align="center" style={{ fontWeight: 'bold' }}>
                        AMPERE
                      </TableCell>
                      <TableCell colSpan={2} align="center" style={{ fontWeight: 'bold' }}>
                        ENERGY METER
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>R-N (V)</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Y-N (V)</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>B-N (V)</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>N-E (V)</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>R ph. (A)</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Y ph. (A)</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>B ph. (A)</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>MAIN METER</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>CHECK METER</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {['incoming', 'outgoing'].map((type) => (
                      <TableRow key={type}>
                        <TableCell style={{ fontWeight: 'bold' }}>{type.toUpperCase()}</TableCell>
                        {['rN', 'yN', 'bN', 'nE'].map((key) => (
                          <TableCell key={key}>
                            <Controller
                              name={`acdbPanels.${panelIndex}.${type}.voltage.${key}`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  size="small"
                                  variant="outlined"
                                  fullWidth
                                  error={!!errors.acdbPanels?.[panelIndex]?.[type]?.voltage?.[key]}
                                  helperText={errors.acdbPanels?.[panelIndex]?.[type]?.voltage?.[key]?.message}
                                />
                              )}
                            />
                          </TableCell>
                        ))}
                        {['rPh', 'yPh', 'bPh'].map((key) => (
                          <TableCell key={key}>
                            <Controller
                              name={`acdbPanels.${panelIndex}.${type}.ampere.${key}`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  size="small"
                                  variant="outlined"
                                  fullWidth
                                  error={!!errors.acdbPanels?.[panelIndex]?.[type]?.ampere?.[key]}
                                  helperText={errors.acdbPanels?.[panelIndex]?.[type]?.ampere?.[key]?.message}
                                />
                              )}
                            />
                          </TableCell>
                        ))}
                        {['main', 'check'].map((key) => (
                          <TableCell key={key}>
                            <Controller
                              name={`acdbPanels.${panelIndex}.${type}.energyMeter.${key}`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  size="small"
                                  variant="outlined"
                                  fullWidth
                                  error={!!errors.acdbPanels?.[panelIndex]?.[type]?.energyMeter?.[key]}
                                  helperText={errors.acdbPanels?.[panelIndex]?.[type]?.energyMeter?.[key]?.message}
                                />
                              )}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}

          <Grid sx={{ marginTop: '20px' }} container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="qualityEngineer"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={qualityEngineers}
                    getOptionLabel={(qualityEngineer) => `${qualityEngineer.username} (${qualityEngineer.company})`}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Quality Engineer"
                        variant="outlined"
                        fullWidth
                        error={!!errors.qualityEngineer}
                        helperText={errors.qualityEngineer?.message}
                      />
                    )}
                    value={
                      field.value !== null
                        ? qualityEngineers.find((qualityEngineer) => qualityEngineer.id === field.value)
                        : null
                    }
                    onChange={(e, newValue) => {
                      field.onChange(newValue?.id || null);
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="executionEngineer"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={executionEngineers}
                    getOptionLabel={(executionEngineer) =>
                      `${executionEngineer.username} (${executionEngineer.company})`
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Execution Engineer"
                        variant="outlined"
                        fullWidth
                        error={!!errors.executionEngineer}
                        helperText={errors.executionEngineer?.message}
                      />
                    )}
                    value={
                      field.value !== null
                        ? qualityEngineers.find((executionEngineer) => executionEngineer.id === field.value)
                        : null
                    }
                    onChange={(e, newValue) => {
                      field.onChange(newValue?.id || null);
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="customer"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Customer Name"
                    fullWidth
                    variant="outlined"
                    error={!!errors.arrayCapacity}
                    helperText={errors.arrayCapacity?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Submit
        </Button>
      </form>
    </Box>
  );
};
