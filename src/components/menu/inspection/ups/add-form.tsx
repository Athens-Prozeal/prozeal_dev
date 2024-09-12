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
    correctness_of_foundation: {
    verbose_name: 'Check for correctness of foundation as per drawing',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  level_and_alignment_of_the_foundation_and_base_frame: {
    verbose_name: 'Check for level and alignment of the foundation & base frame',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  alignment_of_equipment: {
    verbose_name: 'Check for alignment of equipment',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  proper_equipment_earthing: {
    verbose_name: 'Check for proper equipment earthing as per drawing',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  unused_holes_sealed_to_cover_any_openings_or_leaks_observed: {
    verbose_name: 'Check that all unused holes sealed to cover any openings or leaks observed',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  completion_of_all_wiring_and_the_cable_tags: {
    verbose_name: 'Check completion of all wiring & the cable tags, ferrules provided as per cable schedule',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  polarity_of_DC_and_phase_sequence_of_AC_sources: {
    verbose_name: 'Check for polarity of DC and phase sequence of AC sources',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  cables_tightened_properly: {
    verbose_name: 'Check for all cables tightened properly',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  door_earthing_as_per_drawing: {
    verbose_name: 'Check door earthing as per drawing',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Ensure_that_the_panel_cleaned_and_closed_in_all_respect: {
    verbose_name: 'Ensure that the panel cleaned and closed in all respect',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Touch_up_painting_applied_if_required: {
    verbose_name: 'Touch up painting applied if required',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Labels_installed_on_enclosure: {
    verbose_name: 'Labels installed on enclosure as per drawing',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Check_all_live_parts_must_insulated: {
    verbose_name: 'Check all live parts must insulated',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
 
};

const baseUPSSchema = {
    drawingOrSpecificationNo: z.string().max(155, 'Drawing Or Specification number must be at most 155 characters'),
    serialNo: z.string().max(255, 'Serial No must be at most 255 characters'),
    comments: z.string().max(255, 'Comments must be at most 255 characters'),
    witness1: z.number().optional(),
    witness2: z.number().optional(),
    witness3: z.number().optional(),
  };
  
  const upsSchema = z.object(baseUPSSchema);
  
  type UPSSchemaType = z.infer<typeof upsSchema>;
  
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
    } = useForm<UPSSchemaType>({
      resolver: zodResolver(upsSchema),
    });
  
    const onSubmit = async (data: UPSSchemaType) => {
      if (validateForm()) {
        if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
          alert('Witness cannot be same');
          return;
        }
  
        setBtnDisabled(true);
        axios({
          method: 'POST',
          url: `${config.site.serverURL}/api/inspection/ups/?work_site_id=${localStorage.getItem('work-site-id')}`,
          data: {
            drawing_or_specification_no: data.drawingOrSpecificationNo,
            serial_no: data.serialNo,
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
              window.alert('UPS Report Added');
              setTimeout(() => {
                window.location.href = '/menu/inspection/ups?status=approved';
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
                name="serialNo"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    required
                    helperText={error ? error.message : null}
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    fullWidth
                    label="Serial. No"
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
  