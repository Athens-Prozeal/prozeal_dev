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
    Erection_installation: {
    verbose_name: 'Check Erection/installation manual available before installation',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  DCDB_Panel: {
    verbose_name: 'Check DCDB Panel & Make as per approved drawings / specifications',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  physical_damage_of_equipment: {
    verbose_name: 'Check for physical damage of equipment',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Panel_lifting_and_its_handling_equipment: {
    verbose_name: 'Panel lifting and its handling equipment shall be verified',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  panel_installed_at_correct_location: {
    verbose_name: 'Panel installed at correct location & identified with labels as per drawings/SLD',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  grouting_and_coupling_of_panels: {
    verbose_name: 'Check proper grouting & coupling of panels',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  correct_position_and_alignment_of_DB: {
    verbose_name: 'Check for correct position & alignment of DB as per SLD/drawings',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  check_clearances_from_all_sides_while_installation_of_DB: {
    verbose_name: 'check for clearances from all sides while installation of DB, as per approved drawing / IS standard',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  cables_installed_should_be_of_correct_type_and_routed_in_correct_section: {
    verbose_name: 'Cables installed should be of correct type and routed in correct section as per drawing / SLD',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  cables_supported_and_clamped: {
    verbose_name: 'Cables supported & clamped, above/below the LT panel as per drawings/specifications',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  cable_bending_radius_strictly: {
    verbose_name: 'Check the cable bending radius strictly as per IS / Specifications (Avoid sharp cable bends)',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  cables_protected_and_secured_from_physical_damage: {
    verbose_name: 'Cables protected & secured from physical damage and at all sharp edges',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  crimping_tool_and_DeOxidation_compound_applied: {
    verbose_name: 'All cable terminations should be done as per manufacturer installation instruction. Use correct crimping tool and De-Oxidation compound applied during terminations',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  cable_terminations_so_that_it_shall_not_create_load_or_stress: {
    verbose_name: 'Check for cable terminations so that it shall not create load/ stress on termination ends and Gland plates supporting it',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  cable_terminations_tightened: {
    verbose_name: 'Cable terminations tightened as per manufacturer torque specifications (Using Nut-bolt & spring washers)',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Tightness_of_Power_and_Earth_Busbar: {
    verbose_name: 'Check for tightness of Power & Earth Busbar as per torque value specified by manufacturer',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Gland_plate_fixing_arrangement: {
    verbose_name: "Check for Gland plate fixing arrangement after the cable terminations shall be as per Manufacturer's guidelines/ Approved drawings",
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Electrical_connections_or_terminations: {
    verbose_name: 'Electrical connections/terminations should be clearly marked as per SLD/drawing',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Ensure_Gland_hole_size: {
    verbose_name: 'Ensure Gland hole size as per specified cable size',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  cables_correctly_labeled_as_per_drawing_or_specifications: {
    verbose_name: 'Cables correctly labeled as per drawing/specifications',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  DB_dressing_with_wires_identified: {
    verbose_name: 'Check for DB dressing with wires identified by ferruling',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Enclosure_should_be_sealed_to_cover_any_openings_or_leaks_observed: {
    verbose_name: 'Enclosure should be sealed to cover any openings or leaks observed',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Breaker_or_MCCB_operation: {
    verbose_name: 'Check Breaker / MCCB operation Open – Close check Continuity',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Indication_and_Meter_connection: {
    verbose_name: 'Check Indication & Meter connection properly as per design & scheme',
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
  Panel_internal_Components_or_Accessories: {
    verbose_name: 'Check for Panel internal Components/ Accessories and Door earthing connections as per drawing',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Labels_installed_on_enclosure: {
    verbose_name: 'Labels installed on enclosure as per drawing',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Panel_earthing_done: {
    verbose_name: 'Panel earthing done as per drawings/specifications',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  IR_Value_of_cable_Phase_to_Earth: {
    verbose_name: 'Check the IR Value of cable Phase to Earth, Phase to Neutral, Neutral to Earth values',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
};

const baseDcdbSchema = {
    drawingOrSpecificationNo: z.string().max(155, 'Drawing Or Specification number must be at most 155 characters'),
    siteLocationOrArea: z.string().max(255, 'Project Name must be at most 255 characters'),
    comments: z.string().max(255, 'Comments must be at most 255 characters'),
    witness1: z.number().optional(),
    witness2: z.number().optional(),
    witness3: z.number().optional(),
  };
  
  const dcdbSchema = z.object(baseDcdbSchema);
  
  type DcdbSchemaType = z.infer<typeof dcdbSchema>;
  
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
    } = useForm<DcdbSchemaType>({
      resolver: zodResolver(dcdbSchema),
    });
  
    const onSubmit = async (data: DcdbSchemaType) => {
      if (validateForm()) {
        if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
          alert('Witness cannot be same');
          return;
        }
  
        setBtnDisabled(true);
        axios({
          method: 'POST',
          url: `${config.site.serverURL}/api/inspection/dcdb/?work_site_id=${localStorage.getItem('work-site-id')}`,
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
              window.alert('DCDB Report Added');
              setTimeout(() => {
                window.location.href = '/menu/inspection/dcdb?status=approved';
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
  