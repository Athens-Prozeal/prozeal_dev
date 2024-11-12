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
  approved_drawings_specifications: {
      verbose_name: 'Check Inverter type, Rating & Make as per as per approved drawings / specifications',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    physical_damage_of_equipment: {
      verbose_name: 'Check for physical damage of equipment',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    location_identified_with_labels_as_per_drawings_SLD: {
      verbose_name: 'Inverter installed at correct location & identified with labels as per drawings/SLD',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    installation_room_as_per_drawings: {
      verbose_name: 'Provide proper space for operation & maintenance in inverter installation room as per drawings',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    correct_section_as_per_drawing: {
      verbose_name: 'Cables installed should be of correct type and routed in correct section as per drawing / SLD',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    physical_damage_and_at_all_sharp_edges: {
      verbose_name: 'Cables protected & secured from physical damage and at all sharp edges',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    drawings_specifications: {
      verbose_name: 'Cables arranged & supported as per drawings/specifications',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    Specifications: {
      verbose_name: 'Check the cable bending radius strictly as per IS / Specifications (Avoid sharp cable bends)',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    during_terminations: {
      verbose_name: 'All cable terminations should be done as per manufacturer installation instruction. Use correct crimping tool and De-Oxidation compound applied during terminations',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    torque_specifications: {
      verbose_name: 'All Cable terminations tightened as per manufacturer torque specifications',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    drawing_specifications: {
      verbose_name: 'Cables correctly laid as per drawing/specifications',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    drawing: {
      verbose_name: 'Check all meters & control wiring connected as per drawing',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    leaving_no_gap: {
      verbose_name: 'Check for proper gland hole for input (DC) cables ensure fitting and sealing on completion leaving no gap.',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    leaks_observed: {
      verbose_name: 'Enclosure should be sealed to cover any openings or leaks observed',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    vacuumed: {
      verbose_name: 'Enclosure cleaned out & vacuumed',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    installed_on_enclosure: {
      verbose_name: 'Warning & Arc flash labels installed on enclosure',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    drawings_specification: {
      verbose_name: 'Enclosure grounded as per drawings/specification',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    if_required: {
      verbose_name: 'Touch up painting applied if required',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    SPD_earthing: {
      verbose_name: 'Check the Inverter Body and SPD earthing',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    insulated: {
      verbose_name: 'Check all live parts must be insulated',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    tightness_to_be_check: {
      verbose_name: 'Inverter AC side bus alignment & tightness to be check',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    closed_tightened: {
      verbose_name: 'Busduct properly closed & tightened',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
  };

  const baseInverterSchema = {
    drawingOrSpecificationNo: z.string().max(155, 'Drawing Or Specification number must be at most 155 characters'),
    serialNo: z.string().max(255, 'serial No must be at most 255 characters'),
    siteLocationOrArea: z.string().max(255, 'Project Name must be at most 255 characters'),
    commentsOrRemarks: z.string().max(255, 'Comments/Remarks must be at most 255 characters'),
    witness1: z.number().optional(),
    witness2: z.number().optional(),
    witness3: z.number().optional(),
  };

  const inverterSchema = z.object(baseInverterSchema);

  type InverterSchemaType = z.infer<typeof inverterSchema>;

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
    } = useForm<InverterSchemaType>({
      resolver: zodResolver(inverterSchema),
    });

    const onSubmit = async (data: InverterSchemaType) => {
      if (validateForm()) {
        if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
          alert('Witness cannot be same');
          return;
        }

        setBtnDisabled(true);
        axios({
          method: 'POST',
          url: `${config.site.serverURL}/api/inspection/inverter/?work_site_id=${localStorage.getItem('work-site-id')}`,
          data: {
            drawing_or_specification_no: data.drawingOrSpecificationNo,
            serial_no: data.serialNo,
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
              window.alert('Inverter Report Added');
              setTimeout(() => {
                window.location.href = '/menu/inspection/inverter?status=approved';
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
