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
  HT_panel_Make_as_per_approved_drawings_specifications: {
    verbose_name: 'Check HT panel & Make as per approved drawings / specifications',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  physical_damage_of_equipment: {
    verbose_name: 'Check for physical damage of equipment',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  panel_installed_at_correct_location_identified_with_labels_as_per_drawings_SLD: {
    verbose_name: 'Panel installed at correct location & identified with labels as per drawings/SLD',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  proper_grouting_coupling_of_panel: {
    verbose_name: 'Check proper grouting & coupling of panel',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  correct_position_alignment_of_HT_panel_breakers_as_per_SLD_drawings: {
    verbose_name: 'Check for correct position & alignment of HT panel, Breakers as per SLD/drawings',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Cables_installed_should_be_of_correct_type_and_routed_in_correct_section_as_per_drawing_SLD: {
    verbose_name: 'Cables installed should be of correct type and routed in correct section as per drawing / SLD',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  cables_supported_clamped_above_or_below_the_HT_panel_as_per_drawings_specifications: {
    verbose_name: 'Cables supported & clamped, above/below the HT panel as per drawings/specifications',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  cable_bending_radius_strictly_as_per_IS_specifications: {
    verbose_name: 'Check the cable bending radius strictly as per IS / Specifications (Avoid sharp cable bends)',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  cables_protected_secured_from_physical_damage_and_at_all_sharp_edges: {
    verbose_name: 'Cables protected & secured from physical damage and at all sharp edges',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  manufacturer_installation_instruction_and_Deoxidation_compound_applied_at_terminations: {
    verbose_name: 'All cable terminations should be done as per manufacturer installation instruction and De-oxidation compound applied at terminations',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  cable_terminations_tightened_as_per_manufacturer_torque_specifications: {
    verbose_name: 'Cable terminations tightened as per manufacturer torque specifications (Using Nut-bolt & spring washers)',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  electrical_connections_terminations: {
    verbose_name: 'Electrical connections/terminations should be clearly marked as per SLD/drawing',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  cables_correctly_labeled_as_per_drawing_specifications: {
    verbose_name: 'Cables correctly labeled as per drawing/specifications',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  adequate_clearance_in_between_busbars_as_per_OEM: {
    verbose_name: 'Check for the adequate clearance in between busbars as per OEM.',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  phase_sequence_of_the_cables: {
    verbose_name: 'Check for the continuity & phase sequence of the cables',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  shrouding_covers_provided_for_front_of_live_bus_bars: {
    verbose_name: 'Shrouding covers provided for front of live bus bars',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  HDPE_pipes_used_for_control_cable_routing: {
    verbose_name: 'HDPE pipes used for Control cable routing, should be of correct size',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  HDPE_pipe_bend_used_are_uniform_and_free_from_kinks: {
    verbose_name: 'Check the HDPE pipe bend used are uniform and free from kinks',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  proper_pipe_fitting_used_and_adequately_tightened: {
    verbose_name: 'Check that proper pipe fitting used (i.e. Rain tight at wet locations) and adequately tightened',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  enclosure_should_be_sealed_to_cover_any_openings_or_leaks_observed: {
    verbose_name: 'Enclosure should be sealed to cover any openings or leaks observed',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  enclosure_cleaned_out_vacuumed: {
    verbose_name: 'Enclosure cleaned out & vacuumed',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  touch_up_painting_applied_if_required: {
    verbose_name: 'Touch up painting applied if required',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  labels_installed_on_enclosure_as_per_drawing: {
    verbose_name: 'Labels installed on enclosure as per drawing',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  panel_earthing_done_as_per_approved_earthing_layout: {
    verbose_name: 'Panel earthing done as per Approved Earthing layout.',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  nomenclature_of_panel_as_per_drawing: {
    verbose_name: 'Check Nomenclature of Panel as per Drawing',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },

};

const baseICOGPanelSchema = {
    drawingOrSpecificationNo: z.string().max(155, 'Drawing Or Specification number must be at most 155 characters'),
    siteLocationOrArea: z.string().max(255, 'Project Name must be at most 255 characters'),
    comments: z.string().max(255, 'Comments must be at most 255 characters'),
    witness1: z.number().optional(),
    witness2: z.number().optional(),
    witness3: z.number().optional(),
  };

const icogPanelSchema = z.object(baseICOGPanelSchema);

type ICOGPanelSchemaType = z.infer<typeof icogPanelSchema>;

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
  } = useForm<ICOGPanelSchemaType>({
    resolver: zodResolver(icogPanelSchema),
  });

  const onSubmit = async (data: ICOGPanelSchemaType) => {
    if (validateForm()) {
      if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
        alert('Witness cannot be same');
        return;
      }

      setBtnDisabled(true);
      axios({
        method: 'POST',
        url: `${config.site.serverURL}/api/inspection/icog-panel/?work_site_id=${localStorage.getItem('work-site-id')}`,
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
            window.alert('ICOG Panel Report Added');
            setTimeout(() => {
              window.location.href = '/menu/inspection/icog-panel?status=approved';
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