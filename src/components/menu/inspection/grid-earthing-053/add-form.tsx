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
  earth_pits_as_per_drawing_specifications: ChecklistSchema;
  earthing_as_per_drawing_specifications: ChecklistSchema;
};

const checklistSchemas: CategorizedChecklistSchema = {
    earth_pits_as_per_drawing_specifications: {
        location_number_of_pits: {
            verbose_name: 'Location & No. of pits',
            choices: ['Yes', 'No', 'N/A'],
            required: true,
        },
        depth_and_distance_of_earth_pits: {
            verbose_name: 'Depth & Distance of earth pits',
            choices: ['Yes', 'No', 'N/A'],
            required: true,
        },
        electrode_copper_coated_size_as_per_drawing: {
            verbose_name: 'Electrode Copper Coated size as per drawing',
            choices: ['Yes', 'No', 'N/A'],
            required: true,
        },
        earthing_chemical_compound_as_per_drawing: {
            verbose_name: 'Earthing Chemical compound as per drawing',
            choices: ['Yes', 'No', 'N/A'],
            required: true,
        },
        welded_or_nut_bolts_or_brazed_connections_at_joints: {
            verbose_name: 'Welded/Nut-bolts/brazed connections at joints',
            choices: ['Yes', 'No', 'N/A'],
            required: true,
        },
        check_test_link_provided: {
            verbose_name: 'Check Test link provided',
            choices: ['Yes', 'No', 'N/A'],
            required: true,
        },
        check_cover_installed: {
            verbose_name: 'Check Cover installed',
            choices: ['Yes', 'No', 'N/A'],
            required: true,
        },
        check_pit_identification_number_fixed_or_painted: {
            verbose_name: 'Check Pit identification number fixed / painted',
            choices: ['Yes', 'No', 'N/A'],
            required: true,
        },

    },
    earthing_as_per_drawing_specifications: {
        earth_strip_size_as_per_drawing: {
            verbose_name: 'Earth strip size as per drawing',
            choices: ['Yes', 'No', 'N/A'],
            required: true,
        },
        overlap_at_welded_joints_or_Brazing_as_per_drawing: {
            verbose_name: 'Overlap at welded joints/Brazing as per drawing',
            choices: ['Yes', 'No', 'N/A'],
            required: true,
        },
        check_that_welded_joint_must_be_proper_and_no_air_gap: {
            verbose_name: 'Check that welded joint must be proper and no air gap',
            choices: ['Yes', 'No', 'N/A'],
            required: true,
        },
        painting_of_joints_as_per_drawing: {
            verbose_name: 'Painting of Joints as per drawing',
            choices: ['Yes', 'No', 'N/A'],
            required: true,
        },
        tightness_for_bolted_joints_with_torque_wrench: {
            verbose_name: 'Tightness for Bolted Joints with torque wrench',
            choices: ['Yes', 'No', 'N/A'],
            required: true,
        },
        bolted_joints_marked_after_tightening: {
            verbose_name: 'Bolted Joints marked after tightening',
            choices: ['Yes', 'No', 'N/A'],
            required: true,
        },
        laying_or_straightening_or_bending_of_strips: {
            verbose_name: 'Laying / straightening / Bending of strips',
            choices: ['Yes', 'No', 'N/A'],
            required: true,
        },
        removing_of_paint_at_equipment_termination_ends: {
            verbose_name: 'Removing of paint at equipment termination ends',
            choices: ['Yes', 'No', 'N/A'],
            required: true,
        },
        earth_pits_interlinked_with_strip: {
            verbose_name: 'Earth pits interlinked with strip',
            choices: ['Yes', 'No', 'N/A'],
            required: true,
        },
        contact_surfaces_free_from_non_conducting_materials: {
            verbose_name: 'Contact surfaces free from non-conducting materials',
            choices: ['Yes', 'No', 'N/A'],
            required: true,
        },
        LA_directly_connect_with_separate_earth_pit_and_earth_pit_is_not_connected_with_earth_grid: {
            verbose_name: 'LA directly connect with separate earth pit and earth pit is not connected with earth grid',
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
  
  const baseGridEarthingSchema = {
    dateOfChecking: z.string().nonempty('Date is required'),
    drawingSpecificationNo: z.string().max(255, 'Drawing / Specification No must be at most 255 characters'),
    location: z.string(),
    comments: z.string().max(255, 'Comments must be at most 255 characters'),
    witness1: z.number().optional(),
    witness2: z.number().optional(),
    witness3: z.number().optional(),
  };
  
  const gridEarthingSchema = z.object(baseGridEarthingSchema);
  
  type GridEathingSchemaType = z.infer<typeof gridEarthingSchema>;
  
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
    } = useForm<GridEathingSchemaType>({
      resolver: zodResolver(gridEarthingSchema),
      defaultValues: {
        dateOfChecking: currentDate,
      },
    });
  
    const onSubmit = async (data: GridEathingSchemaType) => {
      if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
        alert('Witness cannot be same');
        return;
      }
  
      if (validateForm()) {
        setBtnDisabled(true);
        axios({
          method: 'POST',
          url: `${config.site.serverURL}/api/inspection/grid-earthing-053/?work_site_id=${localStorage.getItem('work-site-id')}`,
          data: {
            date_of_checking: data.dateOfChecking,
            drawing_specification_no: data.drawingSpecificationNo,
            location: data.location,
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
              window.alert('Grid Earthing Report Added');
              setTimeout(() => {
                window.location.href = '/menu/inspection/grid-earthing-053?status=approved';
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
                  name="drawingSpecificationNo"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      helperText={error ? error.message : null}
                      error={!!error}
                      onChange={onChange}
                      value={value}
                      fullWidth
                      label="Drawing / Specification No"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Controller
                  name="location"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      helperText={error ? error.message : null}
                      error={!!error}
                      onChange={onChange}
                      value={value}
                      fullWidth
                      label="Site Location / Area"
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
    