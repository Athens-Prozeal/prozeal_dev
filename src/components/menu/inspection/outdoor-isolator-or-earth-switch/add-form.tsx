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
  drawings_specifications: {
    verbose_name: 'Check the Isolator type, Rating & Make as per approved drawings / specifications',
    choices: ['Yes', 'No'],
    required: true,
  },
  Isolator_assembly: {
    verbose_name: 'Check for physical damage of Isolator & assembly',
    choices: ['Yes', 'No'],
    required: true,
  },
  per_drawings: {
    verbose_name: 'Check for correctness of foundation as per drawings',
    choices: ['Yes', 'No'],
    required: true,
  },
  drawing_specifications: {
    verbose_name: 'Check for correctness of structure installation & alignment as per drawing/specifications',
    choices: ['Yes', 'No'],
    required: true,
  },
  handling: {
    verbose_name: 'Check & verify Isolator assembly lifting and its handling equipment',
    choices: ['Yes', 'No'],
    required: true,
  },
  installation: {
    verbose_name: 'Check Erection/installation manual available before installation',
    choices: ['Yes', 'No'],
    required: true,
  },
  damages: {
    verbose_name: 'Check ECheck for foundation bolts for twisting and damages if any',
    choices: ['Yes', 'No'],
    required: true,
  },
  cleaning: {
    verbose_name: 'Check for cleaning of insulator prior to installation',
    choices: ['Yes', 'No'],
    required: true,
  },
  alignment: {
    verbose_name: 'Check for level, alignment & tightness of insulators',
    choices: ['Yes', 'No'],
    required: true,
  },
  erection: {
    verbose_name:
      ' Check for proper erection of poles, main blade & Earth switch drive assembly as per approved drawing',
    choices: ['Yes', 'No'],
    required: true,
  },
  correct: {
    verbose_name: 'Check for correct alignment of equipment',
    choices: ['Yes', 'No'],
    required: true,
  },
  tightness: {
    verbose_name:
      'Check for tightness of equipment base with nut-bolts and correct torque applied as per specifications',
    choices: ['Yes', 'No'],
    required: true,
  },
  Clearance: {
    verbose_name: 'Check for Phase to Phase & Phase to earth Clearance as per drawing/specifications',
    choices: ['Yes', 'No'],
    required: true,
  },
  mounted: {
    verbose_name: 'Earth switch mounted correctly & aligned properly',
    choices: ['Yes', 'No'],
    required: true,
  },
  operation: {
    verbose_name: 'Check for correct operation of Isolator & earth switch',
    choices: ['Yes', 'No'],
    required: true,
  },
  earthing: {
    verbose_name: ' Check for proper earthing of equipment and structures',
    choices: ['Yes', 'No'],
    required: true,
  },
  MOM_box: {
    verbose_name: ' Check for Mounting of MOM box as per drawings',
    choices: ['Yes', 'No'],
    required: true,
  },
  Marshalling: {
    verbose_name: ' Check for Marshalling Box body earthing connection tightness and as per approved drawing',
    choices: ['Yes', 'No'],
    required: true,
  },
  close: {
    verbose_name: ' Check that open and close marking in MOM box matches with field operation',
    choices: ['Yes', 'No'],
    required: true,
  },
  connection: {
    verbose_name: 'Check the connection of Main operating or Gang operating mechanism',
    choices: ['Yes', 'No'],
    required: true,
  },
  Gang: {
    verbose_name: ' Check the interlock connection of Main operating or Gang operating mechanism with earth switch',
    choices: ['Yes', 'No'],
    required: true,
  },
  below: {
    verbose_name: 'Check Isolator alignment & Earth grid/mat below the isolator operating handle to be verified',
    choices: ['Yes', 'No'],
    required: true,
  },
  earth: {
    verbose_name: 'Check the Megger value for Pole to Pole & Pole to Earth',
    choices: ['Yes', 'No'],
    required: true,
  },
  contacts: {
    verbose_name: 'Check whether petroleum jelly applied on Male & Female contacts',
    choices: ['Yes', 'No'],
    required: true,
  },
};

const baseOutdoorIsolatorOrEarthSwitchSchema = {
  drawingOrSpecificationNo: z.string().max(155, 'Drawing Or Specification number must be at most 155 characters'),
  siteLocationOrArea: z.string().max(255, 'Project Name must be at most 255 characters'),
  commentsOrRemarks: z.string().max(255, 'comments/Remarks must be at most 255 characters'),
  witness1: z.number().optional(),
  witness2: z.number().optional(),
};

const outdoorisolatorSchema = z.object(baseOutdoorIsolatorOrEarthSwitchSchema);

type OutdoorIsolatorOrEarthSwitchSchemaType = z.infer<typeof outdoorisolatorSchema>;

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
  } = useForm<OutdoorIsolatorOrEarthSwitchSchemaType>({
    resolver: zodResolver(outdoorisolatorSchema),
  });

  const onSubmit = async (data: OutdoorIsolatorOrEarthSwitchSchemaType) => {
    if (validateForm()) {
      if (data.witness1 === data.witness2) {
        alert('Witness cannot be same');
        return;
      }

      setBtnDisabled(true);
      axios({
        method: 'POST',
        url: `${config.site.serverURL}/api/inspection/outdoor-isolator-or-earth-switch/?work_site_id=${localStorage.getItem('work-site-id')}`,
        data: {
          drawing_or_specification_no: data.drawingOrSpecificationNo,
          site_location_or_area: data.siteLocationOrArea,
          comments_or_remarks: data.commentsOrRemarks,
          witness_1: data.witness1,
          witness_2: data.witness2,
          checklists: checklistResponses,
        },
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
      })
        .then((response) => {
          if (response.status === 201) {
            window.alert('Outdoor Isolator And Earth Switch Report Added');
            setTimeout(() => {
              window.location.href = '/menu/inspection/outdoor-isolator-or-earth-switch?status=approved';
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
