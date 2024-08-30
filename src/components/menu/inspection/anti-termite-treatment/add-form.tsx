'use client';

import React, { useEffect, useState } from 'react';
import { ChecklistSchema } from '@/schemas/checklist';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ChecklistResponseType } from '@/types/checklist';
import { Witness as WitnessType } from '@/types/user';
import { config } from '@/config';

const preparationChecklistSchema: ChecklistSchema = {
  check_the_orientation_of_footing_and_dimensions: {
    verbose_name: 'Check the orientation of footing and dimensions',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  check_the_center_line_of_columns_or_footings: {
    verbose_name: 'Check the center line of columns/footings with reference to gridline and drawing',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  check_the_reinforcement_of_footing_mat: {
    verbose_name: 'Check the reinforcement of footing mat with respect to BBS/Drawing',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  check_column_rebars_dia_and_no_of_longitudinal_bars: {
    verbose_name:
      'Check column rebar’s dia and no. of longitudinal bars and column L provided with respect to BBS/Drawing',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  check_column_ties_dia_spacing_and_configuration: {
    verbose_name: 'Check the dia of column ties, spacing and tie configuration',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  check_plumb_of_column_cage_and_necessary_arrangements: {
    verbose_name: 'Check the plumb of the column cage and necessary arrangements to hold the same',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  check_cover_blocks_chairs_and_binding_of_bars: {
    verbose_name: 'Check cover blocks, chairs & binding of bars',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  check_shuttering_rigidity_line_plumb_leak_proof_and_applying_of_deshuttering_oil: {
    verbose_name: 'Check the shuttering for its rigidity, line, plumb, leak proof and applying of de-shuttering oil',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
};

const generalChecklistSchema: ChecklistSchema = {
  verify_test_certificates_reports_of_cement_steel_and_materials: {
    verbose_name: 'Verify test certificates/reports of cement, steel & materials',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  concrete_top_level_marking: {
    verbose_name: 'Concrete top level marking - checked',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  check_adequacy_of_men_materials_equipment_and_arrangement_for_concrete: {
    verbose_name: 'Check adequacy of men, materials, equipment’s and arrangement for concrete',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
};

const inProcessChecklistSchema: ChecklistSchema = {
  production_and_workability_of_concrete: {
    verbose_name: 'Production and workability of concrete - checked',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  placing_and_compaction_of_concrete: {
    verbose_name: 'Placing and compaction of concrete - checked',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  cubes_cast_for_testing: {
    verbose_name: 'Cubes cast for testing (Mention no. of cubes cast at remarks column)',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
};

const afterConcretingChecklistSchema: ChecklistSchema = {
  soffit_and_pour_top_level: {
    verbose_name: 'Soffit and pour top level checked',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  curing: {
    verbose_name: 'Curing - checked',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  concrete_condition_on_form_removal: {
    verbose_name: 'Concrete condition on form removal',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  test_cube_results: {
    verbose_name: 'Test cube results (7 day/28)',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
};

type CategorizedChecklistResponseType = {
  preparation: {
    [key: string]: ChecklistResponseType;
  };
  general: {
    [key: string]: ChecklistResponseType;
  };
  in_process: {
    [key: string]: ChecklistResponseType;
  };
  after_concreting: {
    [key: string]: ChecklistResponseType;
  };
};

const baseAntiTermiteTreatmentSchema = {
  dateOfChecking: z.string().nonempty('Date is required'),
  projectName: z.string().max(255, 'Project Name must be at most 255 characters'),
  description: z.string(),
  refDrawingNumber: z.string().max(155, 'Ref Drawing Number must be at most 155 characters'),
  gradeOfConcrete: z.string().max(155, 'Grade of Concrete must be at most 155 characters'),
  sourceOfConcrete: z.string().max(155, 'Source of Concrete must be at most 155 characters'),
  comments: z.string().max(255, 'Comments must be at most 255 characters'),
  witness1: z.number(),
  witness2: z.number(),
  witness3: z.number(),
};

const antiTermiteTermiteSchema = z.object(baseAntiTermiteTreatmentSchema);

type antiTermiteTermiteSchemaType = z.infer<typeof antiTermiteTermiteSchema>;

export const Form = () => {
  const currentDate = new Date().toISOString().split('T')[0];
  const [checklistResponses, setChecklistResponses] = useState<CategorizedChecklistResponseType>({
    preparation: {},
    general: {},
    in_process: {},
    after_concreting: {},
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

  const handleChoiceChange = (
    category: 'preparation' | 'general' | 'in_process' | 'after_concreting',
    itemKey: string,
    choice: string
  ) => {
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

  const handleRemarkChange = (
    category: 'preparation' | 'general' | 'in_process' | 'after_concreting',
    itemKey: string,
    remark: string
  ) => {
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

    // Validate preparation checklist
    Object.keys(preparationChecklistSchema).forEach((key) => {
      if (preparationChecklistSchema[key].required && !checklistResponses.preparation[key]?.choice) {
        errors.push(preparationChecklistSchema[key].verbose_name);
      }
    });

    // Validate general checklist
    Object.keys(generalChecklistSchema).forEach((key) => {
      if (generalChecklistSchema[key].required && !checklistResponses.general[key]?.choice) {
        errors.push(generalChecklistSchema[key].verbose_name);
      }
    });

    // Validate in-process checklist
    Object.keys(inProcessChecklistSchema).forEach((key) => {
      if (inProcessChecklistSchema[key].required && !checklistResponses.in_process[key]?.choice) {
        errors.push(inProcessChecklistSchema[key].verbose_name);
      }
    });

    // Validate after concreting checklist
    Object.keys(afterConcretingChecklistSchema).forEach((key) => {
      if (afterConcretingChecklistSchema[key].required && !checklistResponses.after_concreting[key]?.choice) {
        errors.push(afterConcretingChecklistSchema[key].verbose_name);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<antiTermiteTermiteSchemaType>({
    resolver: zodResolver(antiTermiteTermiteSchema),
    defaultValues: {
      dateOfChecking: currentDate,
    },
  });

  const onSubmit = async (data: antiTermiteTermiteSchemaType) => {
    if (validateForm()) {
      if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
        alert('Witness cannot be same');
        return;
      }

      setBtnDisabled(true);
      axios({
        method: 'POST',
        url: `${config.site.serverURL}/api/inspection/antitermitetreatment/?work_site_id=${localStorage.getItem('work-site-id')}`,
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
            window.alert('Anti Termite Treatment Report Added');
            setTimeout(() => {
              window.location.href = '/menu/inspection/anti-termite-treatment?status=approved';
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

          {/* Pre-Work Checklist */}
          <Grid item xs={12}>
            <Typography variant="h6">Pre-Work Checklist</Typography>
          </Grid>
          {Object.keys(preparationChecklistSchema).map((key) => (
            <Grid item xs={12} key={key}>
              <Typography gutterBottom>{preparationChecklistSchema[key].verbose_name}</Typography>
              <ToggleButtonGroup
                color="primary"
                value={checklistResponses.preparation[key]?.choice || ''}
                exclusive
                onChange={(event, newValue) => handleChoiceChange('preparation', key, newValue)}
                aria-label={preparationChecklistSchema[key].verbose_name}
              >
                {preparationChecklistSchema[key].choices.map((choice) => (
                  <ToggleButton key={choice} value={choice}>
                    {choice}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <TextField
                label="Remark"
                variant="standard"
                fullWidth
                value={checklistResponses.preparation[key]?.remark || ''}
                onChange={(e) => handleRemarkChange('preparation', key, e.target.value)}
              />
            </Grid>
          ))}
          <br />

          {/* General Checklist */}
          <Grid item xs={12}>
            <Typography variant="h6">General Checklist</Typography>
          </Grid>
          {Object.keys(generalChecklistSchema).map((key) => (
            <Grid item xs={12} key={key}>
              <Typography gutterBottom>{generalChecklistSchema[key].verbose_name}</Typography>
              <ToggleButtonGroup
                color="primary"
                value={checklistResponses.general[key]?.choice || ''}
                exclusive
                onChange={(event, newValue) => handleChoiceChange('general', key, newValue)}
                aria-label={generalChecklistSchema[key].verbose_name}
              >
                {generalChecklistSchema[key].choices.map((choice) => (
                  <ToggleButton key={choice} value={choice}>
                    {choice}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <TextField
                label="Remark"
                variant="standard"
                fullWidth
                value={checklistResponses.general[key]?.remark || ''}
                onChange={(e) => handleRemarkChange('general', key, e.target.value)}
              />
            </Grid>
          ))}
          <br />

          {/* In-Process Checklist */}
          <Grid item xs={12}>
            <Typography variant="h6">In-Process Checklist</Typography>
          </Grid>
          {Object.keys(inProcessChecklistSchema).map((key) => (
            <Grid item xs={12} key={key}>
              <Typography gutterBottom>{inProcessChecklistSchema[key].verbose_name}</Typography>
              <ToggleButtonGroup
                color="primary"
                value={checklistResponses.in_process[key]?.choice || ''}
                exclusive
                onChange={(event, newValue) => handleChoiceChange('in_process', key, newValue)}
                aria-label={inProcessChecklistSchema[key].verbose_name}
              >
                {inProcessChecklistSchema[key].choices.map((choice) => (
                  <ToggleButton key={choice} value={choice}>
                    {choice}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <TextField
                label="Remark"
                variant="standard"
                fullWidth
                value={checklistResponses.in_process[key]?.remark || ''}
                onChange={(e) => handleRemarkChange('in_process', key, e.target.value)}
              />
            </Grid>
          ))}
          <br />

          {/* After Concreting Checklist */}
          <Grid item xs={12}>
            <Typography variant="h6">After Concreting Checklist</Typography>
          </Grid>
          {Object.keys(afterConcretingChecklistSchema).map((key) => (
            <Grid item xs={12} key={key}>
              <Typography gutterBottom>{afterConcretingChecklistSchema[key].verbose_name}</Typography>
              <ToggleButtonGroup
                color="primary"
                value={checklistResponses.after_concreting[key]?.choice || ''}
                exclusive
                onChange={(event, newValue) => handleChoiceChange('after_concreting', key, newValue)}
                aria-label={afterConcretingChecklistSchema[key].verbose_name}
              >
                {afterConcretingChecklistSchema[key].choices.map((choice) => (
                  <ToggleButton key={choice} value={choice}>
                    {choice}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <TextField
                label="Remark"
                variant="standard"
                fullWidth
                value={checklistResponses.after_concreting[key]?.remark || ''}
                onChange={(e) => handleRemarkChange('after_concreting', key, e.target.value)}
              />
            </Grid>
          ))}
          <br />

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
