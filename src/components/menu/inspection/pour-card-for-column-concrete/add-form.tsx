'use client';

import { useEffect, useState, Fragment } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Autocomplete, Box, Button, Grid, TextField, Typography } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Witness as WitnessType } from '@/types/user';
import { ChecklistResponseType } from '@/types/checklist';
import { ChecklistSchema } from '@/schemas/checklist';
import { config } from '@/config';

type CategorizedChecklistSchema = {
  [key: string]: ChecklistSchema;
  before_fixing_column_box: ChecklistSchema;
  after_fixing_column_box: ChecklistSchema;
};

const checklistSchemas: CategorizedChecklistSchema = {
  before_fixing_column_box: {
    check_the_quality_of_cast_starter: {
      verbose_name: 'Check the quality of cast starter',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_dia_and_rebar_configuration: {
      verbose_name: 'Check the dia. and rebar configuration of longitudinal bars with respect to drawing and BBS',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_dia_and_spacing_of_ties: {
      verbose_name: 'Check dia and spacing of ties & binding of bars',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_size_of_column_reinforcement_cage: {
      verbose_name: 'Check the size of column reinforcement cage after deducting cover',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_lap_length: {
      verbose_name: 'Check for lap length if any, laps are staggered & location of lapping',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_specified_cover_blocks: {
      verbose_name: 'Check the specified cover blocks are provided',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_dowel_bars: {
      verbose_name: 'Check dowel bars if any',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_construction_joint_surface: {
      verbose_name: 'Check the construction joint surface is rough and free from laitance',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
  },
  after_fixing_column_box: {
    check_gaps_in_shuttering: {
      verbose_name: 'Check any gaps in shuttering',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_plumb_and_size_of_column_box: {
      verbose_name: 'Check the plumb and size of column box',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_supports_the_column_box: {
      verbose_name: 'Check the supports the column box',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_all_round_uniform_cover_to_rebars: {
      verbose_name: 'Check for all round uniform cover to rebar’s',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_protruding_longitudinal_bar: {
      verbose_name:
        'Check the protruding longitudinal bar shall not be less than lap length if column has to be raised',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_test_certificates_of_materials: {
      verbose_name: 'Check the test certificates of materials',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_men_materials_equipments_and_arrangement_for_concrete: {
      verbose_name: 'Check men, materials, equipment’s and arrangement for concrete',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_commencement_for_concreting: {
      verbose_name: 'Check commencement for concreting - Approved',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_concrete_production: {
      verbose_name: 'Check the production of concrete is conforming to mix design',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_pouring_concrete: {
      verbose_name: 'Check concrete is poured by using stands/working platform without disturbing column shuttering',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_slump_and_cast_cubes: {
      verbose_name: 'Check slump and cast cubes for testing',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_proper_compaction: {
      verbose_name:
        'Check proper compaction is done by vibrator and free space for vibrator operation without disturbing column box',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_plumb_after_concreting: {
      verbose_name: 'Check the plumb after concreting',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_pore_top_level: {
      verbose_name: 'Check the pore top level',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_construction_joint_surface_roughened: {
      verbose_name: 'Check the construction joint surface is roughened',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_concrete_condition_on_form_removal: {
      verbose_name: 'Check the concrete condition on form removal',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_curing: {
      verbose_name: 'Check for curing',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },

    check_cube_results: {
      verbose_name: 'Test cube results (7/28)',
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

const basePourCardForColumnConcreteSchema = {
  dateOfChecking: z.string().nonempty('Date is required'),
  projectName: z.string().max(255, 'Project Name must be at most 255 characters'),
  description: z.string(),
  refDrawingNumber: z.string().max(155, 'Ref Drawing Number must be at most 155 characters'),
  gradeOfConcrete: z.string().max(155, 'Grade of Concrete must be at most 155 characters'),
  sourceOfConcrete: z.string().max(155, 'Source of Concrete must be at most 155 characters'),
  comments: z.string().max(255, 'Comments must be at most 255 characters'),
  witness1: z.number().optional(),
  witness2: z.number().optional(),
  witness3: z.number().optional(),
};

const pourCardForColumnConcreteSchema = z.object(basePourCardForColumnConcreteSchema);

type PourCardForColumnConcreteSchemaType = z.infer<typeof pourCardForColumnConcreteSchema>;

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
  } = useForm<PourCardForColumnConcreteSchemaType>({
    resolver: zodResolver(pourCardForColumnConcreteSchema),
    defaultValues: {
      dateOfChecking: currentDate,
    },
  });

  const onSubmit = async (data: PourCardForColumnConcreteSchemaType) => {
    if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
      alert('Witness cannot be same');
      return;
    }

    if (validateForm()) {
      setBtnDisabled(true);
      axios({
        method: 'POST',
        url: `${config.site.serverURL}/api/inspection/pour-card-for-column-concrete/?work_site_id=${localStorage.getItem('work-site-id')}`,
        data: {
          date_of_checking: data.dateOfChecking,
          project_name: data.projectName,
          description: data.description,
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
            window.alert('Pour Card For Column Concrete Report Added');
            setTimeout(() => {
              window.location.href = '/menu/inspection/pour-card-for-column-concrete?status=approved';
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
