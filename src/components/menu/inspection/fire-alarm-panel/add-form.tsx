'use client';

import { useEffect, useState } from 'react';
import { ChecklistSchema } from '@/schemas/checklist';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { NakedChecklistResponseType } from '@/types/checklist';
import { Witness as WitnessType } from '@/types/user';
import { config } from '@/config';

const checklistSchemas: ChecklistSchema = {
    Voltage: {
      verbose_name: 'Check for Input A.C Voltage within control 225 V to 235 V',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    Unregulated: {
      verbose_name: ' Check for Unregulated Power Supply (Parameters 225 V to 235 V)',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    Check_Voltage: {
        verbose_name: ' Check for Output DC Voltage as per OEM',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
    Observation: {
        verbose_name: 'Check Voltage Observation as per OEM',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
    Battery: {
        verbose_name: ' Check Battery Voltage as per OEM',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
    hooter: {
        verbose_name: 'Check for hooter condition',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
    smoke: {
        verbose_name: ' Check Are all smoke detectors free of dust',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
    activated: {
        verbose_name: ' Check for all MCP activated',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      automatic: {
        verbose_name: ' Check whether the automatic change over to the battery supply (secondary power supply) is functioning or not.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      initiating: {
        verbose_name: ' Check all the initiating devices (smoke/ heat detectors etc.) on each circuit are functional',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      functional: {
        verbose_name: ' Check out the functional tests for the entire switches',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      Test: {
        verbose_name: ' Check Battery Test',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      Lamp: {
        verbose_name: ' Check Lamp Test',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      Alarm: {
        verbose_name: ' Check Alarm Test',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      isolating: {
        verbose_name: ' Check Any other isolating switches',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
};

const baseFireAlarmPanelSchema = {
    drawingOrSpecificationNo: z.string().max(155, 'Drawing Or Specification number must be at most 155 characters'),
    serialNo: z.string().max(255, 'serial No must be at most 255 characters'),
    commentsOrRemarks: z.string().max(255, 'Comments/Remarks must be at most 255 characters'),
    witness1: z.number().optional(),
    witness2: z.number().optional(),
    witness3: z.number().optional(),
  };

  const fireAlarmPanelSchema = z.object(baseFireAlarmPanelSchema);

  type FireAlarmPanelSchemaType = z.infer<typeof fireAlarmPanelSchema>;

  export const Form = () => {
    const [checklistResponses, setChecklistResponses] = useState<NakedChecklistResponseType>({});
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
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

    const handleChoiceChange = (itemKey: string, choice: string) => {
      setChecklistResponses((prevResponses) => ({
        ...prevResponses,
        [itemKey]: {
          ...prevResponses?.[itemKey],
          choice: choice,
          verbose_name: checklistSchemas[itemKey].verbose_name,
        },
      }));
    };

    const handleRemarkChange = (itemKey: string, remark: string) => {
      setChecklistResponses((prevResponses) => ({
        ...prevResponses,
        [itemKey]: {
          ...prevResponses?.[itemKey],
          remark,
          verbose_name: checklistSchemas[itemKey].verbose_name,
        },
      }));
    };

    const validateForm = () => {
      const errors: string[] = [];

      Object.keys(checklistSchemas).forEach((key) => {
        if (checklistSchemas[key].required && !checklistResponses?.[key]?.choice) {
          errors.push(checklistSchemas[key].verbose_name);
        }
      });

      setValidationErrors(errors);
      return errors.length === 0;
    };

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FireAlarmPanelSchemaType>({
      resolver: zodResolver(fireAlarmPanelSchema),
    });

    const onSubmit = async (data: FireAlarmPanelSchemaType) => {
      if (validateForm()) {
        if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
          alert('Witness cannot be same');
          return;
        }

        setBtnDisabled(true);
        axios({
          method: 'POST',
          url: `${config.site.serverURL}/api/inspection/fire-alarm-panel/?work_site_id=${localStorage.getItem('work-site-id')}`,
          data: {
            drawing_or_specification_no: data.drawingOrSpecificationNo,
            serial_no: data.serialNo,
            comments_or_remarks: data.commentsOrRemarks,
            witness_1: data.witness1,
            witness_2: data.witness2,
            witness_3: data.witness3,
            checklists: checklistResponses,
          },
          headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
        })
          .then((response) => {
            if (response.status === 201) {
              window.alert('Fire Alarm Panel Report Added');
              setTimeout(() => {
                window.location.href = '/menu/inspection/fire-alarm-panel?status=approved';
              }, 500);
            }
          })
          .catch((error) => {
            setBtnDisabled(false);
            window.alert('Something went wrong!');
          });
      }
    };

    return (
      <Box sx={{ flexGrow: 1 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={12} sm={4} md={6}>
              <Controller
                name="drawingOrSpecificationNo"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    required
                    helperText={error ? error.message : null}
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    fullWidth
                    label="Drawing/Specification No."
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={6}>
              <Controller
                name="serialNo"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    required
                    helperText={error ? error.message : null}
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    fullWidth
                    label="Serial.No"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <br />

            <Grid item xs={12} sm={12} md={12}>
              <Typography variant="h6">Items to be checked</Typography>
            </Grid>

            {Object.keys(checklistSchemas).map((key) => (
              <Grid item xs={12} key={key}>
                <Typography gutterBottom>{checklistSchemas[key].verbose_name}</Typography>
                <ToggleButtonGroup
                  color="primary"
                  value={checklistResponses[key]?.choice || ''}
                  exclusive
                  onChange={(event, newValue) => handleChoiceChange(key, newValue)}
                  aria-label={checklistSchemas[key].verbose_name}
                >
                  {checklistSchemas[key].choices.map((choice) => (
                    <ToggleButton key={choice} value={choice}>
                      {choice}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                <TextField
                  label="Remark"
                  variant="standard"
                  fullWidth
                  value={checklistResponses[key]?.remark || ''}
                  onChange={(e) => handleRemarkChange(key, e.target.value)}
                />
              </Grid>
            ))}

            <Grid item xs={12} sm={12} md={6}>
              <Controller
                name="commentsOrRemarks"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    required
                    helperText={error ? error.message : null}
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    fullWidth
                    label="Comments/Remarks"
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            {/* Witness */}
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant="h6">Witnesses</Typography>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Controller
                name="witness1"
                control={control}
                render={({ field }) => (
                  <TextField
                    required
                    {...field}
                    select
                    label="Witness 1"
                    variant="outlined"
                    fullWidth
                    error={!!errors.witness1}
                    helperText={errors.witness1?.message}
                  >
                    {witnesses?.map((witness) => (
                      <MenuItem key={witness.id} value={witness.id}>
                        {witness.username} ({witness.company})
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
              <Controller
                name="witness2"
                control={control}
                render={({ field }) => (
                  <TextField
                    required
                    {...field}
                    select
                    label="Witness 2"
                    variant="outlined"
                    fullWidth
                    error={!!errors.witness2}
                    helperText={errors.witness2?.message}
                  >
                    {witnesses?.map((witness) => (
                      <MenuItem key={witness.id} value={witness.id}>
                        {witness.username} ({witness.company})
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
              <Controller
                name="witness3"
                control={control}
                render={({ field }) => (
                  <TextField
                    required
                    {...field}
                    select
                    label="Witness 3"
                    variant="outlined"
                    fullWidth
                    error={!!errors.witness3}
                    helperText={errors.witness3?.message}
                  >
                    {witnesses?.map((witness) => (
                      <MenuItem key={witness.id} value={witness.id}>
                        {witness.username} ({witness.company})
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Validation Errors Display */}
            {validationErrors.length > 0 && (
              <Grid item xs={12}>
                <Alert severity="error">
                  Please complete the following required fields:
                  <ul>
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </Alert>
              </Grid>
            )}

            <Grid item xs={12} container justifyContent="flex-start">
              <Button variant="contained" color="primary" type="submit" disabled={btnDisabled}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    );
  };
