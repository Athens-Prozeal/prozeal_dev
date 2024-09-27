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
    Battery: {
      verbose_name: 'Check & verify Battery & Charger panel lifting and its handling equipment',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    available: {
      verbose_name: 'Check Erection/installation manual available before installation',
     choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    correctness: {
        verbose_name: 'Check for correctness of foundation as per drawing',
       choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
    level: {
        verbose_name: 'Check for level and alignment of the foundation & base frame',
       choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
    Adequate: {
        verbose_name: 'Adequate space should be provided for effective ventilation and to carry out the maintenance work - Refer Approved drawings for installation',
       choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
    equipment: {
        verbose_name: 'Install the equipment as per approved drawings',
       choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
    series: {
        verbose_name: 'Check for series connection of equipment',
       choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
    tightness : {
        verbose_name: ' Check for the tightness of Bus Bars with torque wrench as specified by manufacturer instruction/ design drawings',
       choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      proper: {
        verbose_name: 'Check for proper earthing as per drawing',
       choices: ['Yes', 'No', 'N/A'],
        required: true,
      },

      unused: {
        verbose_name: 'Check that all unused holes are sealed to cover any openings or leaks observed',
       choices: ['Yes', 'No', 'N/A'],
        required: true,
      },

      completion: {
        verbose_name: 'Check completion of all wiring & the cable tags, ferrules are provided as per cable schedule',
       choices: ['Yes', 'No', 'N/A'],
        required: true,
      },

      sources: {
        verbose_name: 'Check for polarity of DC and phase sequence of AC sources',
       choices: ['Yes', 'No', 'N/A'],
        required: true,
      },

      cables: {
        verbose_name: 'Check for all cables are tightened properly',
       choices: ['Yes', 'No', 'N/A'],
        required: true,
      },

      drawing: {
        verbose_name: 'Check door earthing as per drawing',
       choices: ['Yes', 'No', 'N/A'],
        required: true,
      },

      area: {
        verbose_name: 'Check for the Work area displayed with danger boards and necessary barricading provided',
       choices: ['Yes', 'No', 'N/A'],
        required: true,
      },

      painting: {
        verbose_name: 'Touch up painting applied if required',
       choices: ['Yes', 'No', 'N/A'],
        required: true,
      },

      enclosure: {
        verbose_name: 'Labels installed on enclosure as per drawing',
       choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      reports: {
        verbose_name: 'Check for availability of OEM drawing and test reports',
       choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
};

const baseBatteryBankSchema = {
    drawingOrSpecificationNo: z.string().max(155, 'Drawing Or Specification number must be at most 155 characters'),
    siteLocationOrArea: z.string().max(255, 'Project Name must be at most 255 characters'),
    commentsOrRemarks: z.string().max(255, 'comments/Remarks must be at most 255 characters'),
    witness1: z.number().optional(),
    witness2: z.number().optional(),
    witness3: z.number().optional(),
  };

  const batteryBankSchema = z.object(baseBatteryBankSchema);

  type BatteryBankSchemaType = z.infer<typeof batteryBankSchema>;

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
    } = useForm<BatteryBankSchemaType>({
      resolver: zodResolver(batteryBankSchema),
    });

    const onSubmit = async (data: BatteryBankSchemaType) => {
      if (validateForm()) {
        if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
          alert('Witness cannot be same');
          return;
        }

        setBtnDisabled(true);
        axios({
          method: 'POST',
          url: `${config.site.serverURL}/api/inspection/battery-bank-and-battery-charger/?work_site_id=${localStorage.getItem('work-site-id')}`,
          data: {
            drawing_or_specification_no: data.drawingOrSpecificationNo,
            site_location_or_area: data.siteLocationOrArea,
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
              window.alert('Battery Bank & Battery Charger Report Added');
              setTimeout(() => {
                window.location.href = '/menu/inspection/battery-bank-and-battery-charger?status=approved';
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
                name="siteLocationOrArea"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    required
                    helperText={error ? error.message : null}
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    fullWidth
                    label="Site Location/Area"
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
                    label="comments/Remarks"
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
