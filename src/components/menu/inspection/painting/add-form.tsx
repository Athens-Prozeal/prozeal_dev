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
    plastering_work_been_completed_in_all_respects_and_are_the_walls_dried_after_the_curing_period: {
    verbose_name: 'Has plastering work been completed in all respects and are the walls dried after the curing period?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
    },
    the_surface_cleaned_from_dirt_dust_etc_and_has_any_crack_damage_etc_been_rectified: {
    verbose_name: 'Is the surface cleaned from dirt, dust, etc and has any crack, damage etc. been rectified?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
    },
    the_type_shade_and_make_of_the_paint_approved_and_is_the_sample_work_also_approved: {
    verbose_name: 'Is the type, shade, and make of the paint approved and is the sample work also approved?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
    },
    Is_any_color_specified: {
    verbose_name: 'Is any color specified?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
    },
    Are_the_surface_of_doors_windows_floors_and_other_appliances_protected_from_being_splashed_upon: {
    verbose_name: 'Are the surface of doors, windows, floors, and other appliances protected from being splashed upon?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
    },
    Are_the_painting_materials_in_good_condition_and_within_the_expiry_date: {
    verbose_name: 'Are the painting materials in good condition and within the expiry date?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
    },
    Is_the_priming_coat_applied_to_the_wall_as_specified: {
    verbose_name: 'Is the priming coat applied to the wall as specified?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
    },
    get_an_even_and_smooth_surface: {
    verbose_name: 'Is it checked that the application of the putty (if specified) to get an even and smooth surface?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
    },
    making_of_beam_column_and_wall_corners_with_putty: {
    verbose_name: 'Check for making of beam, column and wall corners with putty?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
    },
    level_the_uneven_rough_surface_of_putty_with_the_help_of_Sand_Paper: {
    verbose_name: 'Level the uneven & rough surface of putty with the help of Sand Paper?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
    },
    Is_the_mix_proportion_of_the_paint_as_per_the_manufactures_specification: {
    verbose_name: 'Is the mix proportion of the paint as per the manufactures specification?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
    },
    Is_the_application_of_the_paint_done_as_per_the_specified_method: {
    verbose_name: 'Is the application of the paint done as per the specified method (by brush, roller or spray)?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
    },
    any_brush_or_roller_marks_visible_after_painting: {
    verbose_name: 'Are there any brush/roller marks visible after painting?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
    },
    ensured_that_the_final_coat_of_paint_is_applied: {
    verbose_name: 'Is it ensured that the final coat of paint is applied after 6 – 8 hours of first coat?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
    },
    the_finished_surface_have_evenly_spread_of_paint_with_smooth_surface_and_uniform_color: {
    verbose_name: 'Does the finished surface have evenly spread of paint with smooth surface and uniform color?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
    },
    proper_safety_equipments_and_working_platforms_been_arranged_for_the_work: {
    verbose_name: 'Have proper safety equipment’s and working platforms been arranged for the work?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
    },
};
   

const basePaintingSchema = {
    drawingOrSpecificationNo: z.string().max(155, 'Drawing Or Specification number must be at most 155 characters'),
    siteLocationOrArea: z.string().max(255, 'Project Name must be at most 255 characters'),
    comments: z.string().max(255, 'Comments must be at most 255 characters'),
    witness1: z.number().optional(),
    witness2: z.number().optional(),
    witness3: z.number().optional(),
  };
  
  const paintingSchema = z.object(basePaintingSchema);
  
  type PaintingSchemaType = z.infer<typeof paintingSchema>;
  
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
    } = useForm<PaintingSchemaType>({
      resolver: zodResolver(paintingSchema),
    });
  
    const onSubmit = async (data: PaintingSchemaType) => {
      if (validateForm()) {
        if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
          alert('Witness cannot be same');
          return;
        }
  
        setBtnDisabled(true);
        axios({
          method: 'POST',
          url: `${config.site.serverURL}/api/inspection/painting/?work_site_id=${localStorage.getItem('work-site-id')}`,
          data: {
            drawing_or_specification_no: data.drawingOrSpecificationNo,
            site_location_or_area: data.siteLocationOrArea,
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
              window.alert('Painting Report Added');
              setTimeout(() => {
                window.location.href = '/menu/inspection/painting?status=approved';
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
  