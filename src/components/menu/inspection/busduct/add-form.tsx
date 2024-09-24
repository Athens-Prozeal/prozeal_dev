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
    Check_for_mechanical_damage: {
    verbose_name: 'Check for mechanical damage',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Check_bus_bar_and_connection_links_are_tightened_to_specified_torque_as_per_standard: {
    verbose_name: 'Check bus bar and connection links are tightened to specified torque as per standard',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Check_phase_identification_at_INV_and_IDT_side: {
    verbose_name: 'Check phase identification at INV & IDT side',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Check_bus_duct_foundation_support: {
    verbose_name: 'Check bus duct foundation support',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Check_bus_duct_alignment: {
    verbose_name: 'Check bus duct alignment',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Inverter_side_alignment_and_tightness_to_be_check: {
    verbose_name: 'Inverter side alignment & tightness to be check',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  IDT_LV_alignment_and_tightness_to_be_check: {
    verbose_name: '  IDT LV alignment & tightness to be check: {',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Check_bi_metallic_sheet_used_at_wherever_applicable: {
    verbose_name: 'Check bi metallic sheet used at wherever applicable',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Check_bus_duct_internally_and_externally_should_be_clean: {
    verbose_name: 'Check bus duct internally and externally should be clean',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Check_equipment_grounded_according_to_drawing: {
    verbose_name: 'Check equipment grounded according to drawing',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Check_Auxiliary_cable_entry_to_be_sealed: {
    verbose_name: 'Check Auxiliary cable entry to be sealed',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Check_Auxiliary_cables_and_wires_arrangement: {
    verbose_name: 'Check Auxiliary cables and wires arrangement',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Check_protection_covers_and_enclosure: {
    verbose_name: 'Check protection covers and enclosure',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Check_entire_assemble_for_damage_or_missing_parts: {
    verbose_name: 'Check entire assemble for damage or missing parts',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Check_bus_bar_insulators_for_damage_or_missing_parts: {
    verbose_name: 'Check bus bar insulators for damage or missing parts',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  Check_all_bus_bar_joints_are_bolted_with_high_tensile_bolts: {
    verbose_name: 'Check all bus bar joints are bolted with high-tensile bolts',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  No_openings_in_bus_duct_section_joints: {
    verbose_name: 'No openings in bus duct section joints',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },
  check_inside_bus_duct_prior_to_closing: {
    verbose_name: 'check inside bus duct prior to closing',
    choices: ['Yes', 'No', 'N/A'],
    required: true,
  },

};

const baseBusductSchema = {
  drawingOrSpecificationNo: z.string().max(155, 'Drawing Or Specification number must be at most 155 characters'),
  siteLocationOrArea: z.string().max(255, 'Project Name must be at most 255 characters'),
  commentsOrRemarks: z.string().max(255, 'Comments/Remarks must be at most 255 characters'),
  witness1: z.number().optional(),
  witness2: z.number().optional(),
  witness3: z.number().optional(),
};

const busductSchema = z.object(baseBusductSchema);

type BusductSchemaType = z.infer<typeof busductSchema>;

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
  } = useForm<BusductSchemaType>({
    resolver: zodResolver(busductSchema),
  });

  const onSubmit = async (data: BusductSchemaType) => {
    if (validateForm()) {
      if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
        alert('Witness cannot be same');
        return;
      }

      setBtnDisabled(true);
      axios({
        method: 'POST',
        url: `${config.site.serverURL}/api/inspection/busduct/?work_site_id=${localStorage.getItem('work-site-id')}`,
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
            window.alert('Busduct Report Added');
            setTimeout(() => {
              window.location.href = '/menu/inspection/busduct?status=approved';
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
