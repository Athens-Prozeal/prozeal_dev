'use client';

import { Fragment, useEffect, useState } from 'react';
import { ChecklistSchema } from '@/schemas/checklist';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Autocomplete, Box, Button, Grid, TextField, Typography } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ChecklistResponseType } from '@/types/checklist';
import { Witness as WitnessType } from '@/types/user';
import { config } from '@/config';

type CategorizedChecklistSchema = {
  [key: string]: ChecklistSchema;
  preparation: ChecklistSchema;
  in_process: ChecklistSchema;
};

const checklistSchemas: CategorizedChecklistSchema = {
  preparation: {
    checkthe_line_and_level_of_beam_with_reference_to_drawing: {
      verbose_name: 'Check the line and level of beam with reference to drawing.',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    adequacy_of_scaffolding_rigidity_of_base_checked: {
      verbose_name: 'Adequacy of scaffolding, Rigidity of base - checked',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    check_the_quality_of_shuttering_material_used: {
      verbose_name: 'Check the quality of shuttering material used.',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    check_the_dimensions_plumb_and_line: {
      verbose_name: 'Check the dimensions, plumb and line.',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    check_side_shuttering_is_adequately_supported_to_prevent_bulging: {
      verbose_name: 'Check side shuttering is adequately supported to prevent bulging',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    check_for_gaps_in_shuttering_ensure_gaps_are_properly_closed_to_prevent_leakage_of_the_slurry: {
      verbose_name: 'Check for gaps in shuttering, ensure gaps are roperly closed to prevent leakage of the slurry',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    check_the_reinforcement_with_reference_to_drawing_BBS: {
      verbose_name: 'Check the reinforcement with reference to drawing/BBS',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    check_for_provision_of_sleeves_conduits_if_any: {
      verbose_name: 'Check for provision of sleeves/ conduits if any',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    check_the_fixing_of_anchorage_bars_dowels_if_any: {
      verbose_name: 'Check the fixing of anchorage bars/ dowels if any',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
  },
  in_process: {
    check_the_production_placing_and_compaction_of_concrete: {
      verbose_name: 'Check the production, placing and compaction of concrete.',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    check_the_slum_pand_cast_concrete_cubes_for_testing: {
      verbose_name: 'Check the slump and cast concrete cubes for testing.',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    check_for_adequate_curing: {
      verbose_name: 'Check for adequate curing.',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
  },
};

type CategorizedChecklistResponseType = {
  [category: string]: {
    [key: string]: ChecklistResponseType;
  };
};

const basePourCardForPlinthBeamSchema = {
  dateOfChecking: z.string().nonempty('Date is required'),
  projectName: z.string().max(255, 'Project Name must be at most 255 characters'),
  description: z.string(),
  level: z.string(),
  refDrawingNumber: z.string().max(155, 'Ref Drawing Number must be at most 155 characters'),
  gradeOfConcrete: z.string().max(155, 'Grade of Concrete must be at most 155 characters'),
  sourceOfConcrete: z.string().max(155, 'Source of Concrete must be at most 155 characters'),
  comments: z.string().max(255, 'Comments must be at most 255 characters'),
  witness1: z.number().optional(),
  witness2: z.number().optional(),
  witness3: z.number().optional(),
};

const pourCardForPlinthBeamSchema = z.object(basePourCardForPlinthBeamSchema);

type PourCardForPlinthBeamSchemaType = z.infer<typeof pourCardForPlinthBeamSchema>;

export const Form = () => {
  const currentDate = new Date().toISOString().split('T')[0];
  const [checklistResponses, setChecklistResponses] = useState<CategorizedChecklistResponseType>({});
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

  const handleChoiceChange = (category: keyof CategorizedChecklistSchema, itemKey: string, choice: string) => {
    setChecklistResponses((prevResponses) => ({
      ...prevResponses,
      [category]: {
        ...prevResponses[category],
        [itemKey]: {
          ...(prevResponses[category]?.[itemKey] || {}),
          choice,
          verbose_name: checklistSchemas[category][itemKey].verbose_name, // Include verbose_name
        },
      },
    }));
  };

  const handleRemarkChange = (category: keyof CategorizedChecklistSchema, itemKey: string, remark: string) => {
    setChecklistResponses((prevResponses) => ({
      ...prevResponses,
      [category]: {
        ...prevResponses[category],
        [itemKey]: {
          ...(prevResponses[category]?.[itemKey] || {}),
          remark,
          verbose_name: checklistSchemas[category][itemKey].verbose_name, // Include verbose_name
        },
      },
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    Object.keys(checklistSchemas).forEach((category) => {
      const categoryKey = category as keyof CategorizedChecklistSchema;
      Object.keys(checklistSchemas[categoryKey]).forEach((key) => {
        if (checklistSchemas[categoryKey][key].required && !checklistResponses[categoryKey]?.[key]?.choice) {
          errors.push(checklistSchemas[categoryKey][key].verbose_name);
        }
      });
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PourCardForPlinthBeamSchemaType>({
    resolver: zodResolver(pourCardForPlinthBeamSchema),
    defaultValues: {
      dateOfChecking: currentDate,
    },
  });

  const onSubmit = async (data: PourCardForPlinthBeamSchemaType) => {
    if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
      alert('Witness cannot be same');
      return;
    }

    if (validateForm()) {
      setBtnDisabled(true);
      axios({
        method: 'POST',
        url: `${config.site.serverURL}/api/inspection/pour-card-for-beam/?work_site_id=${localStorage.getItem('work-site-id')}`,
        data: {
          date_of_checking: data.dateOfChecking,
          project_name: data.projectName,
          description: data.description,
          level: data.level,
          ref_drawing_no: data.refDrawingNumber,
          grade_of_concrete: data.gradeOfConcrete,
          source_of_concrete: data.sourceOfConcrete,
          comments: data.comments,
          witness_1: data.witness1,
          witness_2: data.witness2,
          witness_3: data.witness3,
          checklists: checklistResponses,
        },
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
      })
        .then((response) => {
          if (response.status === 201) {
            window.alert('Pour Card For Plinth Beam Report Added');
            setTimeout(() => {
              window.location.href = '/menu/inspection/pour-card-for-beam?status=approved';
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
              name="level"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Level"
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
          <Grid item xs={12} sm={12} md={6}>
            <Controller
              name="gradeOfConcrete"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Grade of Concrete"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Controller
              name="sourceOfConcrete"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Source of Concrete"
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

          {Object.keys(checklistSchemas).map((category) => (
            <Fragment key={category}>
              <Grid item xs={12}>
                <Typography variant="h6">
                  {category
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}{' '}
                </Typography>
              </Grid>
              {Object.keys(checklistSchemas[category]).map((key) => (
                <Grid item xs={12} key={key}>
                  <Typography gutterBottom>{checklistSchemas[category][key].verbose_name}</Typography>
                  <ToggleButtonGroup
                    color="primary"
                    value={checklistResponses[category]?.[key]?.choice || ''}
                    exclusive
                    onChange={(event, newValue) =>
                      handleChoiceChange(category as keyof CategorizedChecklistSchema, key, newValue)
                    }
                    aria-label={checklistSchemas[category][key].verbose_name}
                  >
                    {checklistSchemas[category][key].choices.map((choice) => (
                      <ToggleButton key={choice} value={choice}>
                        {choice}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                  <TextField
                    label="Remark"
                    variant="standard"
                    fullWidth
                    value={checklistResponses[category]?.[key]?.remark || ''}
                    onChange={(e) =>
                      handleRemarkChange(category as keyof CategorizedChecklistSchema, key, e.target.value)
                    }
                  />
                </Grid>
              ))}
            </Fragment>
          ))}

          <Grid item xs={12} sm={12} md={6}>
            <Controller
              name="comments"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  required
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Comments"
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
