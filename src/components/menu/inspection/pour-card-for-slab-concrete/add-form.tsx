'use client';

import { useState, useEffect, Fragment } from 'react';
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
    scaffolding: ChecklistSchema;
    form_work: ChecklistSchema;
    reinforcement: ChecklistSchema;
    general: ChecklistSchema;
    concreting_in_process: ChecklistSchema;
    after_Concreting: ChecklistSchema;
  };

const checklistSchemas: CategorizedChecklistSchema = {
    scaffolding: {
        adequacy_of_scaffolding_rigidity_of_base_checked: {
            verbose_name: 'Adequacy of scaffolding, Rigidity of base – checked',
            choices: ['Yes', 'No', 'N/A'],
            required: true,
        },

    },
    form_work:{
        surface_preparation_of_existing_concrete_checked: {
            verbose_name: 'Surface preparation of existing concrete checked',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
        },
        alignment_line_level_dimensions_checked: {
            verbose_name: 'Alignment, line, level & dimensions- checked',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
        },
        surface_evenness_and_application_of_oil_checked: {
            verbose_name: 'Surface evenness and application of oil- checked',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
        },
        openings_cutouts_checked: {
            verbose_name: 'Openings & cutouts- checked',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
        },
        adequate_supports_checked: {
            verbose_name: 'Adequate supports- checked',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
        },
        check_any_gap_in_shuttering: {
            verbose_name: 'Check any gap in shuttering',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
        },
        check_the_adequacy_of_shuttering_supports_at_column_beam_junctionsing: {
            verbose_name: 'Check the adequacy of shuttering & supports at column beam junctions',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
        },
    },
    reinforcement:{
        fabrication_of_rebars_cover_chairs_and_lap_length_location_checked_with_respect_to_BBS_Drawing_and_binding_of_bars: {
            verbose_name: 'Fabrication of rebars ,cover, chairs and lap length & location – checked with respect to BBS/Drawing and binding of bars',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
        },
        end_anchorage_of_bars_at_beams_at_the_junction_of_RC_walls: {
            verbose_name: 'End anchorage of bars at beams & at the junction of RC walls',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
        },
        check_dowel_bars_if_any: {
            verbose_name: 'Check dowel bars if any.',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
        },
        check_cover_and_support_to_column_cage_at_column_beam_junction: {
            verbose_name: 'Check cover and support to column cage at column beam junction',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
        },
    },
    general:{
        Provision_of_fixtures_inserts_conduits_checked: {
            verbose_name: 'Provision of fixtures, inserts & conduits- checked',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
        },
        verify_test_certificates_reports_of_cement_steel_materials: {
            verbose_name: 'Verify test certificates/ reports of cement,steel & materials.',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
        },
        concrete_top_level_marking_checked: {
            verbose_name: 'Concrete top level marking – checked',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
        },
        check_adequacy_of_men_materials_equipments_and_arrangement_for_concrete: {
          verbose_name: 'Check adequacy of men, materials, equipment’s and arrangement for concrete.',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
      },
      supervisory_Staff_allocation_made: {
        verbose_name: 'Supervisory Staff allocation made',
  choices: ['Yes', 'No', 'N/A'],
  required: true,
    },
    temporary_lighting_and_mechanic_presence: {
      verbose_name: 'Temporary lighting and mechanic presence',
  choices: ['Yes', 'No', 'N/A'],
  required: true,
  },
  finishing_masons_available: {
    verbose_name: 'Finishing masons available',
choices: ['Yes', 'No', 'N/A'],
required: true,
      },
      electrical_clearance_obtained: {
        verbose_name: 'Electrical clearance obtained',
  choices: ['Yes', 'No', 'N/A'],
  required: true,
    },
    safety_clearance_obtained: {
      verbose_name: 'Safety clearance obtained',
choices: ['Yes', 'No', 'N/A'],
required: true,
    },
    commencement_for_concreting_Approved: {
      verbose_name: 'Commencement for concreting – Approved',
choices: ['Yes', 'No', 'N/A'],
required: true,
  },
    },
    concreting_in_process:{
      production_and_workability_of_concrete_checked: {
          verbose_name: 'Provision of fixtures, inserts & conduits- checked',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
      },
      placing_and_compaction_of_concrete_checked: {
        verbose_name: 'Placing and compaction of concrete - checked',
  choices: ['Yes', 'No', 'N/A'],
  required: true,
      },
      Cubes_cast_for_testing_Mention_no_of_cubes_cast_at_remarks_column: {
        verbose_name: 'Cubes cast for testing (Mention no. of cubes cast at remarks column)',
  choices: ['Yes', 'No', 'N/A'],
  required: true,
      },
      construction_joint_location_time_if_not_as_per_drawing: {
        verbose_name: 'Construction Joint Location & Time (if not as per Drawing)',
  choices: ['Yes', 'No', 'N/A'],
  required: true,
      },
    },
      after_Concreting:{
        soffit_and_pour_top_level_checked: {
            verbose_name: 'Soffit and pour top level checked',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
        },
        curing_checked: {
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
        verbose_name: 'Test cube results( 7 day/28)',
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

const basePourCardforSlabConcreteSchema = {
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



const PourCardforSlabConcreteSchema = z.object(basePourCardforSlabConcreteSchema);

type PourCardforSlabConcreteSchemaType = z.infer<typeof PourCardforSlabConcreteSchema>;

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
  } = useForm<PourCardforSlabConcreteSchemaType>({
    resolver: zodResolver(PourCardforSlabConcreteSchema),
    defaultValues: {
      dateOfChecking: currentDate,
    },
  });

  const onSubmit = async (data: PourCardforSlabConcreteSchemaType) => {
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
