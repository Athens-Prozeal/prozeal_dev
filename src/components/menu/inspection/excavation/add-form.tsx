'use client';

import React, { useEffect, useState } from 'react';
import { ChecklistSchema } from '@/schemas/checklist';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Autocomplete, Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ChecklistResponseType } from '@/types/checklist';
import { Witness as WitnessType } from '@/types/user';
import { config } from '@/config';

// Checklist Schema Configuration
const preWorkChecklistSchema : ChecklistSchema = {
  any_underground_service_have_been_identified_via_locates_and_as_build: {
    verbose_name: 'Any Underground Service have been Identified Via locates and as-build?',
    choices: ['Yes', 'No', 'N/A'],
    required: true
  },
  all_equipments_required_for_excavation_is_on_site: {
    verbose_name: 'All equipment’s required for excavation is on site?',
    choices: ['Yes', 'No', 'N/A'],
    required:true
  },
  extent_of_excavation_has_been_identified_including_location_depth: {
    verbose_name: 'Extent of excavation has been identified including location, depth?',
    choices: ['Yes', 'No', 'N/A'],
    required: true
  },
  engineering_has_been_completed_for_trenching_if_required: {
    verbose_name: 'Engineering has been completed for trenching if required (if slopes fall within safety restrictions)?',
    choices: ['Yes', 'No', 'N/A'],
    required: true
  },
  soil_has_been_assessed_and_confirmed_not_contaminated: {
    verbose_name: 'Soil has been assessed and confirmed not contaminated. If contaminated, soil disposal technique has been confirmed and is in place?',
    choices: ['Yes', 'No', 'N/A'],
    required: true
  },
};

const postWorkChecklistSchema : ChecklistSchema = {
  soil_has_been_removed_or_protected_with_tarps: {
    verbose_name: 'Soil has been removed from site or is set aside in storage, if required, is protected with tarps?',
    choices: ['Yes', 'No', 'N/A'],
    required: true
  },
  area_has_been_roped_off_with_caution_or_danger_tape: {
    verbose_name: 'Area has been roped off with caution or danger tape. If exposed to public areas, have been secured with fencing?',
    choices: ['Yes', 'No', 'N/A'],
    required: true
  },
  any_exposed_services_have_been_protected_properly: {
    verbose_name: 'Any exposed services have been protected properly?',
    choices: ['Yes', 'No', 'N/A'],
    required: true
  },
  all_excavation_cuts_have_been_made_cleanly: {
    verbose_name: 'All excavation cuts have been made cleanly?',
    choices: ['Yes', 'No', 'N/A'],
    required: true
  },
  removals_have_been_completed_to_the_satisfaction_of_trades: {
    verbose_name: 'Removals have been completed to the satisfaction of trades and general contractor following?',
    choices: ['Yes', 'No', 'N/A'],
    required: true
  },
  the_space_is_clean_and_organized: {
    verbose_name: 'The space is clean and organized.',
    choices: ['Yes', 'No', 'N/A'],
    required: true
  },
  contaminated_materials_have_been_disposed_of_per_requirements: {
    verbose_name: 'Materials, if contaminated, have been disposed of as per requirements?',
    choices: ['Yes', 'No', 'N/A'],
    required: true
  },
};

type CategorizedChecklistResponseType = {
  pre_work: {
    [key: string]: ChecklistResponseType;
  };
  post_work: {
    [key: string]: ChecklistResponseType;
  };
};

const baseExcavationSchema = {
  dateOfChecking: z.string().nonempty('Date is required'),
  projectName: z.string().max(255, 'Project Name must be at most 255 characters'),
  description: z.string(),
  refDrawingNumber: z.string().max(155, 'Ref Drawing Number must be at most 155 characters'),
  witness1: z.number().optional(),
  witness2: z.number().optional(),
  witness3: z.number().optional(),
};

const excavationSchema = z.object(baseExcavationSchema);

type ExcavationSchemaType = z.infer<typeof excavationSchema>;

export const Form = () => {
  const currentDate = new Date().toISOString().split('T')[0];
  const [checklistResponses, setChecklistResponses] = useState<CategorizedChecklistResponseType>({
    pre_work: {},
    post_work: {},
  });
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

  const handleChoiceChange = (category: 'pre_work' | 'post_work', itemKey: string, choice: string) => {
    setChecklistResponses((prevResponses) => ({
      ...prevResponses,
      [category]: {
        ...prevResponses[category],
        [itemKey]: {
          ...prevResponses[category][itemKey],
          choice,
        },
      },
    }));
  };

  const handleRemarkChange = (category: 'pre_work' | 'post_work', itemKey: string, remark: string) => {
    setChecklistResponses((prevResponses) => ({
      ...prevResponses,
      [category]: {
        ...prevResponses[category],
        [itemKey]: {
          ...prevResponses[category][itemKey],
          remark,
        },
      },
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    // Validate pre-work checklist
    Object.keys(preWorkChecklistSchema).forEach((key) => {
      if (preWorkChecklistSchema[key].required && !checklistResponses.pre_work[key]?.choice) {
        errors.push(preWorkChecklistSchema[key].verbose_name);
      }
    });

    // Validate post-work checklist
    Object.keys(postWorkChecklistSchema).forEach((key) => {
      if (postWorkChecklistSchema[key].required && !checklistResponses.post_work[key]?.choice) {
        errors.push(postWorkChecklistSchema[key].verbose_name);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExcavationSchemaType>({
    resolver: zodResolver(excavationSchema),
    defaultValues: {
      dateOfChecking: currentDate,
    },
  });

  const onSubmit = async (data: ExcavationSchemaType) => {
    if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
      alert('Witness cannot be same');
      return;
    }

    if(validateForm()){
      setBtnDisabled(true);
      axios({
        method: 'POST',
        url: `${config.site.serverURL}/api/inspection/excavation/?work_site_id=${localStorage.getItem('work-site-id')}`,
        data: {
          date_of_checking: data.dateOfChecking,
          project_name: data.projectName,
          description: data.description,
          ref_drawing_no: data.refDrawingNumber,
          witness_1: data.witness1,
          witness_2: data.witness2,
          witness_3: data.witness3,
          checklists: checklistResponses,
        },
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
      })
        .then((response) => {
          if (response.status === 201) {
            window.alert('Excavation Report Added');
            setTimeout(() => {
              window.location.href = '/menu/inspection/excavation?status=approved';
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
          {/* Form Fields */}
          <Grid item xs={12} sm={4} md={6}>
            <Controller
              name="dateOfChecking"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Date"
                  variant="outlined"
                  fullWidth
                  error={!!errors.dateOfChecking}
                  helperText={errors.dateOfChecking?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={6}>
            <Controller
              name="projectName"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Project Name"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Description"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Controller
              name="refDrawingNumber"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Ref Drawing Number"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <br />
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h6">Items to be checked</Typography>
          </Grid>
          <br />

          {/* Pre-Work Checklist */}
          <Grid item xs={12}>
            <Typography variant="h6">Pre-Work Checklist</Typography>
          </Grid>
          {Object.keys(preWorkChecklistSchema).map((key) => (
            <Grid item xs={12} key={key}>
              <Typography gutterBottom>{preWorkChecklistSchema[key].verbose_name}</Typography>
              <ToggleButtonGroup
                color="primary"
                value={checklistResponses.pre_work[key]?.choice || ''}
                exclusive
                onChange={(event, newValue) => handleChoiceChange('pre_work', key, newValue)}
                aria-label={preWorkChecklistSchema[key].verbose_name}
              >
                {preWorkChecklistSchema[key].choices.map((choice) => (
                  <ToggleButton key={choice} value={choice}>
                    {choice}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <TextField
                label="Remark"
                variant="standard"
                fullWidth
                value={checklistResponses.pre_work[key]?.remark || ''}
                onChange={(e) => handleRemarkChange('pre_work', key, e.target.value)}
              />
            </Grid>
          ))}
          <br />

          {/* Post-Work Checklist */}
          <Grid item xs={12}>
            <Typography variant="h6">Post-Work Checklist</Typography>
          </Grid>
          {Object.keys(postWorkChecklistSchema).map((key) => (
            <Grid item xs={12} key={key}>
              <Typography gutterBottom>{postWorkChecklistSchema[key].verbose_name}</Typography>
              <ToggleButtonGroup
                color="primary"
                value={checklistResponses.post_work[key]?.choice || ''}
                exclusive
                onChange={(event, newValue) => handleChoiceChange('post_work', key, newValue)}
                aria-label={postWorkChecklistSchema[key].verbose_name}
              >
                {postWorkChecklistSchema[key].choices.map((choice) => (
                  <ToggleButton key={choice} value={choice}>
                    {choice}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <TextField
                label="Remark"
                variant="standard"
                fullWidth
                value={checklistResponses.post_work[key]?.remark || ''}
                onChange={(e) => handleRemarkChange('post_work', key, e.target.value)}
              />
            </Grid>
          ))}
          <br />

         { /* Witness */}
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h6">Witnesses</Typography>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="witness1"
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
                      error={!!errors.witness1}
                      helperText={errors.witness1?.message}
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

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="witness2"
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
                      error={!!errors.witness2}
                      helperText={errors.witness2?.message}
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

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="witness3"
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
                      error={!!errors.witness3}
                      helperText={errors.witness3?.message}
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
