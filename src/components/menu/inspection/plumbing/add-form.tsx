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
  ir_value_check: {
    verbose_name: 'Check the IR value of cable before laying',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Are_the_pipes_and_fittings_conforming_to_specifications: {
    verbose_name: 'Are the pipes & fittings conforming to specifications?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Are_the_fixtures_as_per_the_approved_samples: {
    verbose_name: 'Are the fixtures as per the approved samples?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Have_you_checked_whether_the_pipes_GI_specials_CP_Fittings_etc_are_without_any_visual_cracks: {
    verbose_name: 'Have you checked whether the pipes, GI specials, CP Fittings, etc. are without any visual cracks?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Is_the_plumbing_layout_marked_as_per_the_approveddrawings: {
    verbose_name: 'Is the plumbing layout marked as per the approveddrawings?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Is_chasing_done_using_proper_tools_and_is_the_size_of_the_chasing_as_per_requirement: {
    verbose_name: 'Is chasing done using proper tools and is the size of thechasing as per requirement?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Is_the_finish_floor_level_and_the_level_of_fixtures_marked_asper_approved_drawings: {
    verbose_name: 'Is the finish floor level and the level of fixtures marked asper approved drawings?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Has_joining_of_the_pipes_been_done_as_per_the_approved_methodology: {
    verbose_name: 'Has joining of the pipes been done as per the approved methodology?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Are_the_pipes_clamped_properly_to_prevent_any_dis_Location_while_filling_and_tiling: {
    verbose_name: 'Are the pipes clamped properly to prevent any dis‐ Location while filling and tiling?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  During_plumbing_work_surface_finish_freedom_from_crackand_other_defects: {
    verbose_name: 'During plumbing work surface finish freedom from crackand other defects?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Are_the_branch_connections_of_threaded_pipe_linesprovided_with_unions_flanges_for_easy_maintenance: {
    verbose_name: 'Are the branch connections of threaded pipe linesprovided with unions/flanges for easy maintenance?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Are_the_concealed_GI_lines_painted_with_bituminouspaints: {
    verbose_name: 'Are the concealed GI lines painted with bituminouspaints?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Are_outlet_connections_of_the_water_tanks_provided_withisolation_valves: {
    verbose_name: 'Are outlet connections of the water tanks provided withisolation valves?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Are_all_vertical_lines_true_in_plumb_an_levels_maintained_for_horizontal_lines: {
    verbose_name: 'Are all vertical lines true in plumb and levels maintained for horizontal lines?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Are_all_hot_water_lines_wrapped_with_elastomeric_insulation: {
    verbose_name: 'Are all hot water lines wrapped with elastomeric insulation?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Has_pressure_testing_been_done_up_to_7_kg_cm2_for_a_min_of_24_hrs_and_recorded_in_the_presence_of_clients: {
    verbose_name: 'Has pressure testing been done up to 7 kg/cm2 for a min of 24 hrs. & recorded in the presence of clients?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Are_all_plumbing_lines_at_least_30P_mm_inside_from_the_finished_wall_surface: {
    verbose_name: 'Are all plumbing lines at least 30 mm inside from the finished wall surface?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Water_pressure_test_and_if_any_other_test_to_be_required: {
    verbose_name: 'Water pressure test and if any other test to be required?',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },


};

const basePlumbingSchema = {
  drawingOrSpecificationNo: z.string().max(155, 'Drawing Or Specification number must be at most 155 characters'),
  siteLocationOrArea: z.string().max(255, 'Project Name must be at most 255 characters'),
  commentsOrRemarks: z.string().max(255, 'Comments/Remarks must be at most 255 characters'),
  witness1: z.number().optional(),
  witness2: z.number().optional(),
  witness3: z.number().optional(),
};

const PlumbingSchema = z.object(basePlumbingSchema);

type PlumbingSchemaType = z.infer<typeof PlumbingSchema>;

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
  } = useForm<PlumbingSchemaType>({
    resolver: zodResolver(PlumbingSchema),
  });

  const onSubmit = async (data: PlumbingSchemaType) => {
    if (validateForm()) {
      if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
        alert('Witness cannot be same');
        return;
      }

      setBtnDisabled(true);
      axios({
        method: 'POST',
        url: `${config.site.serverURL}/api/inspection/plumbing/?work_site_id=${localStorage.getItem('work-site-id')}`,
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
            window.alert('Plumbing Report Added');
            setTimeout(() => {
              window.location.href = '/menu/inspection/plumbing?status=approved';
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
