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
    NIFPS_Panel_and_make_as_per_approved_drawings_specifications: {
        verbose_name: 'Check NIFPS Panel & Make as per approved drawings / specifications',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    physical_damage_of_equipment: {
        verbose_name: 'Check for physical damage of equipment',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    panels_installed_at_correct_location: {
        verbose_name: 'Panels installed at correct location & identified with labels as per drawings/SLD',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    proper_grouting_and_coupling_of_panel: {
        verbose_name: 'Check proper grouting & coupling of panel',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    correct_position_and_alignment_of_outdoor_unit_and_control_box: {
        verbose_name: 'Check for correct position & alignment of Outdoor unit and Control Box as per SLD/drawings',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    correct_size_of_pipes_are_used_for_main_line: {
        verbose_name: 'Check correct size of pipes are used for main line and branch as per drawing',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    no_leakage_in_pipeline: {
        verbose_name: 'Check there must be no leakage in pipeline',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    Is_welded_portion_of_pipe: {
        verbose_name: 'Is welded portion of pipe must be treated properly?',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    adequate_number_of_supports_provided: {
        verbose_name: 'Are adequate number of supports provided?',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    Nitrogen_gas_pressure_in_outdoor_unit: {
        verbose_name: 'Check Nitrogen gas pressure in Outdoor unit is as per instruction manual',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    cables_installed_should_be_of_correct_type_and_routed_in_correct_section: {
        verbose_name: 'Cables installed should be of correct type and routed in correct section as per drawing / SLD',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    cables_supported_and_clamped_above_or_below_the_control_panel: {
        verbose_name: 'Cables supported & clamped, above/below the Control panel as per drawings.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    cables_protected_and_secured_from_physical_damage: {
        verbose_name: 'Cables protected & secured from physical damage and at all sharp edges',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    cable_terminations_tightened: {
        verbose_name: 'Cable terminations tightened as per manufacturer torque specifications.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    Electrical_connections_or_terminations: {
        verbose_name: 'Electrical connections/terminations should be clearly marked as per SLD/drawing',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    cables_correctly_labelled_as_per_drawing_or_specifications: {
        verbose_name: 'Cables correctly labelled as per drawing/specifications',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    dressing_with_wires_identified_by_ferruling: {
        verbose_name: 'Check for dressing with wires identified by ferruling',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    Enclosure_should_be_sealed_to_cover: {
        verbose_name: 'Enclosure should be sealed to cover any openings or leaks observed',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    Enclosure_cleaned_out_and_vacuumed: {
        verbose_name: 'Enclosure cleaned out & vacuumed',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    Touch_up_painting_applied_if_required: {
        verbose_name: 'Touch up painting applied if required',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    Labels_installed_on_enclosure_as_per_drawing: {
        verbose_name: 'Labels installed on enclosure as per drawing',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    Panel_Earthing_done_as_per_drawings: {
        verbose_name: 'Panel Earthing done as per drawings/specifications',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },

};

const baseNifpsSchema = {
    drawingOrSpecificationNo: z.string().max(155, 'Drawing Or Specification number must be at most 155 characters'),
    serialNo: z.string().max(155, 'Serial No must be at most 155 characters'),
    siteLocationOrArea: z.string().max(255, 'Project Name must be at most 255 characters'),
    comments: z.string().max(255, 'Comments must be at most 255 characters'),
    witness1: z.number().optional(),
    witness2: z.number().optional(),
    witness3: z.number().optional(),
  };
  
  const nifpsSchema = z.object(baseNifpsSchema);
  
  type NifpsSchemaType = z.infer<typeof nifpsSchema>;
  
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
    } = useForm<NifpsSchemaType>({
      resolver: zodResolver(nifpsSchema),
    });
  
    const onSubmit = async (data: NifpsSchemaType) => {
      if (validateForm()) {
        if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
          alert('Witness cannot be same');
          return;
        }
  
        setBtnDisabled(true);
        axios({
          method: 'POST',
          url: `${config.site.serverURL}/api/inspection/nifps/?work_site_id=${localStorage.getItem('work-site-id')}`,
          data: {
            drawing_or_specification_no: data.drawingOrSpecificationNo,
            serial_no: data.serialNo,
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
              window.alert('NIFPS Report Added');
              setTimeout(() => {
                window.location.href = '/menu/inspection/nifps?status=approved';
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
                    label="Serial. No:"
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
  