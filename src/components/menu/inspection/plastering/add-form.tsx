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
    preparation: ChecklistSchema;
    in_process: ChecklistSchema;
  };
  
  const checklistSchemas: CategorizedChecklistSchema = {
    preparation: {
        provision_of_plaster_pads_checked: {
        verbose_name: 'Provision of plaster pads – checked.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      ensure_proper_treatment_for_cracks_if_any_in_masonry: {
        verbose_name: 'Ensure proper treatment for cracks if any in masonry.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      cleaning_wetting_hacking_of_plaster_receiving_area_checked: {
        verbose_name: 'Cleaning, wetting & hacking of plaster receiving area – checked.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      check_the_quality_of_sand_ensure_silt_content_is_within_the_permissible_limit: {
        verbose_name: 'Check the quality of sand, ensure silt content is within the permissible limit.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      packing_of_chased_portion_checked: {
        verbose_name: 'Packing of chased portion – checked',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      mesh_fixing_at_chased_portion_and_at_the_junction_of_dissimilar_materials_checked: {
        verbose_name: 'Mesh fixing at chased portion and at the junction of dissimilar materials – checked.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      check_for_electrical_plumbing_clearance_obtained_ensure_the_leak_test_on_concealed_water_pipelines: {
        verbose_name: 'Check for electrical & plumbing clearance obtained & ensure the leak test on concealed water pipelines.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      Adequacy_of_staging_checked_Safety_clearance_obtained: {
        verbose_name: 'Adequacy of staging - checked. Safety clearance obtained.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      
    },
    in_process: {
        mix_proportion_of_mortar_as_per_specification: {
        verbose_name: 'Mix proportion of mortar as per specification -',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      check_the_plumb_line_level_of_plaster: {
        verbose_name: 'Check the plumb, line & level of plaster',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    check_the_thickness_of_the_plaster: {
        verbose_name: 'Check the thickness of the plaster',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    Check_proper_finishing_of_edges_corners_jambs_sills_of_opening_and_around_electrical_boxes: {
        verbose_name: 'Check proper finishing of edges, corners, jambs, sills of opening and around electrical boxes',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    ensure_the_grooves_are_provided_as_per_the_details_check_the_depth_and_finishing_of_grooves: {
        verbose_name: 'Ensure the grooves are provided as per the details. Check the depth and finishing of grooves',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    check_the_plastering_surface_is_made_rough_for_cladding_works_2nd_layer: {
        verbose_name: 'Check the plastering surface is made rough for cladding works/ 2nd layer',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    ensure_the_application_of_lime_while_the_mortar_is_still_green_and_finishing: {
        verbose_name: 'Ensure the application of lime while the mortar is still green and finishing',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    ensure_the_skirting_height_has_been_cut_or_free_from_lime_rendering: {
        verbose_name: 'Ensure the skirting height has been cut or free from lime rendering.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    surface_finishing_checked: {
        verbose_name: 'Surface finishing – checked',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    check_the_provision_of_drip_molding: {
        verbose_name: 'Check the provision of drip molding',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    curing: {
        verbose_name: 'Curing',
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
  
  const basePlasteringSchema = {
    dateOfChecking: z.string().nonempty('Date is required'),
    projectName: z.string().max(255, 'Project Name must be at most 255 characters'),
    description: z.string(),
    refDrawingNumber: z.string().max(155, 'Ref Drawing Number must be at most 155 characters'),
    witness1: z.number().optional(),
    witness2: z.number().optional(),
    witness3: z.number().optional(),
  };
  
  const plasteringSchema = z.object(basePlasteringSchema);
  
  type plasteringSchemaType = z.infer<typeof plasteringSchema>;
  
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
      } = useForm<plasteringSchemaType>({
        resolver: zodResolver(plasteringSchema),
        defaultValues: {
          dateOfChecking: currentDate,
        },
      });
    
      const onSubmit = async (data: plasteringSchemaType) => {
        if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
          alert('Witness cannot be same');
          return;
        }
    
        if (validateForm()) {
          setBtnDisabled(true);
          axios({
            method: 'POST',
            url: `${config.site.serverURL}/api/inspection/plastering/?work_site_id=${localStorage.getItem('work-site-id')}`,
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
                window.alert('Plastering Report Added');
                setTimeout(() => {
                  window.location.href = '/menu/inspection/plastering?status=approved';
                }, 500);
              }
            })
            .catch((error) => {
              setBtnDisabled(false);
              window.alert('Something went wrong!');
            });
        }
      };
    
      function handleRemarkChange(arg0: keyof CategorizedChecklistSchema, key: string, value: string): void {
          throw new Error('Function not implemented.');
      }

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
    