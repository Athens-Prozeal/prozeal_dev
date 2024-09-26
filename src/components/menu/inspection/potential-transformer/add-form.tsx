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
    PT_type_and_Rating: {
    verbose_name: 'Check the PT type, Rating & Make as per approved drawings / specifications',
    choices: ['Yes', 'No'],
    required: true,
  },
  Availability_of_OEM_Manuals_and_Test_reports: {
    verbose_name: 'Check for availability of OEM Manuals and Test reports before start of installation',
    choices: ['Yes', 'No'],
    required: true,
  },
  Check_and_verify_PT_and_assembly_lifting_and_its_handling_equipment: {
    verbose_name: 'Check & verify PT & assembly lifting and its handling equipment',
    choices: ['Yes', 'No'],
    required: true,
  },
  physical_damage_of_PT_and_assembly: {
    verbose_name: 'Check for physical damage of PT & assembly',
    choices: ['Yes', 'No'],
    required: true,
  },
  Oil_leakage_and_Oil_marks_and_damage_to_PT_primary_or_secondary_terminals: {
    verbose_name: 'Check for Oil leakage, Oil marks, damage to PT primary/secondary terminals',
    choices: ['Yes', 'No'],
    required: true,
  },
  correctness_of_foundation: {
    verbose_name: 'Check for correctness of foundation as per drawings',
    choices: ['Yes', 'No'],
    required: true,
  },
  correctness_of_structure_or_equipment_installation: {
    verbose_name: 'Check for correctness of structure/equipment installation and alignment as per drawings',
    choices: ['Yes', 'No'],
    required: true,
  },
  insulators_properly_cleaned_and_free_from_damages: {
    verbose_name: 'Check the insulators properly cleaned & free from damages before installations',
    choices: ['Yes', 'No'],
    required: true,
  },
  corona_ring_cleanliness_and_damage: {
    verbose_name: 'Check corona ring cleanliness & damage (if applicable)',
    choices: ['Yes', 'No'],
    required: true,
  },
  tightness_of_equipment_base: {
    verbose_name: 'Check for tightness of equipment base with nut-bolts and correct torque applied as per specifications/manufacturer instructions',
    choices: ['Yes', 'No'],
    required: true,
  },
  Marshalling_box_installation_with_correct_orientation: {
    verbose_name: 'Check Marshalling box installation with correct orientation as per drawing',
    choices: ['Yes', 'No'],
    required: true,
  },
  Marshalling_box_installation_for_mounting_with_structure_and_its_body_earthing_connections: {
    verbose_name: 'Check Marshalling box installation for mounting with structure and its body earthing connections',
    choices: ['Yes', 'No'],
    required: true,
  },
  PT_secondary_termination_tightness: {
    verbose_name: 'Check for PT secondary termination tightness and proper crimping of leads',
    choices: ['Yes', 'No'],
    required: true,
  },
  cable_tags_and_phase_colour_coding_and_ferrules: {
    verbose_name: 'Check the cable tags, phase colour coding and ferrules provided as per drawing/cable schedule',
    choices: ['Yes', 'No'],
    required: true,
  },
  Tan_Delta_terminal_earthed: {
    verbose_name: 'Check that Tan-Delta terminal earthed, if not in use',
    choices: ['Yes', 'No'],
    required: true,
  },
  Phase_to_Phase_and_Phase_to_earth_Clearance: {
    verbose_name: 'Check for Phase to Phase & Phase to earth Clearance',
    choices: ['Yes', 'No'],
    required: true,
  },
  metering_PT_connections_with_meters: {
    verbose_name: 'Check for metering PT connections with meters done as per drawings',
    choices: ['Yes', 'No'],
    required: true,
  },
  proper_earthing_of_equipment_and_structures: {
    verbose_name: 'Check for proper earthing of equipment and structures',
    choices: ['Yes', 'No'],
    required: true,
  },
  PT_Control_panel_or_JB_cable_connections: {
    verbose_name: 'Check for PT Control panel / JB cable connections for tightness and as per drawings',
    choices: ['Yes', 'No'],
    required: true,
  },
  identification_tagging_and_ferruling_of_all_cables: {
    verbose_name: 'Check the identification tagging & ferruling of all cables.',
    choices: ['Yes', 'No'],
    required: true,
  },
  Oil_mark_and_Oil_leakage_and_any_damages_after_erection_of_PT: {
    verbose_name: 'Check Oil mark, Oil leakage and any damages after erection of PT',
    choices: ['Yes', 'No'],
    required: true,
  },
  PT_secondary_start_point_earthed_properly: {
    verbose_name: 'Check that PT secondary start point earthed properly',
    choices: ['Yes', 'No'],
    required: true,
  },
};

const basePotentialTransformerSchema = {
  drawingOrSpecificationNo: z.string().max(155, 'Drawing Or Specification number must be at most 155 characters'),
  siteLocationOrArea: z.string().max(255, 'Project Name must be at most 255 characters'),
  commentsOrRemarks: z.string().max(255, 'Comments/Remarks must be at most 255 characters'),
  witness1: z.number().optional(),
  witness2: z.number().optional(),
  witness3: z.number().optional(),
};

const potentialTransformerSchema = z.object(basePotentialTransformerSchema);

type PotentialTransformerSchemaType = z.infer<typeof potentialTransformerSchema>;

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
  } = useForm<PotentialTransformerSchemaType>({
    resolver: zodResolver(potentialTransformerSchema),
  });

  const onSubmit = async (data: PotentialTransformerSchemaType) => {
    if (validateForm()) {
      if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
        alert('Witness cannot be same');
        return;
      }

      setBtnDisabled(true);
      axios({
        method: 'POST',
        url: `${config.site.serverURL}/api/inspection/potential-transformer/?work_site_id=${localStorage.getItem('work-site-id')}`,
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
            window.alert('Potential Transformer Report Added');
            setTimeout(() => {
              window.location.href = '/menu/inspection/potential-transformer?status=approved';
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
