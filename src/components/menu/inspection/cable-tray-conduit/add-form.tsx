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
    ensure_cable_tray_material_should_be_as_per_drg: {
        verbose_name: 'Ensure Cable tray material should be as per drg.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    ensure_cable_tray_routing_is_as_per_drg: {
        verbose_name: 'Ensure Cable tray routing is as per drg.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    cable_tray_joint_should_be_fixed_with_specified_nut_bolt: {
        verbose_name: 'Cable tray joint should be fixed with specified nut bolt.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    DC_cable_tray_or_conduit_installation_tightening: {
        verbose_name: 'DC Cable tray/Conduit installation & tightening.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    AC_cable_tray_or_conduit_installation_tightening: {
        verbose_name: 'AC Cable tray/Conduit installation & tightening.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    conduit_clamping_at_every_meter: {
        verbose_name: 'Conduit clamping at every meter',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    use_of_L_T_bend_conduit_in_corners_with_tapping: {
        verbose_name: 'Use of L/T bend conduit in corners with tapping.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    sealing_at_sharp_edges_in_tray: {
        verbose_name: 'Sealing at Sharp edges in tray',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    DC_cable_quantity_mentioned_in_drg: {
        verbose_name: 'Size of tray used as per DC cable quantity mentioned in Drg.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    AC_cable_quantity_mentioned_in_drg: {
        verbose_name: 'Size of tray used as per AC cable quantity mentioned in Drg.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    distance_maintained_between_AC_cable_more_than_one_running_parallelly_in_common_tray: {
        verbose_name: 'Distance maintained between AC cable more than one running parallelly in common tray.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    cable_dressing_tying: {
        verbose_name: 'Cable dressing & tying.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    table_to_table_exposed_string_shall_pass_through_conduit_clamped: {
        verbose_name: 'Table to table exposed string shall pass through conduit & clamped.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    unwanted_space_gap_sealing_in_tray_area: {
        verbose_name: 'Unwanted space/gap sealing in tray area.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    no_exposed_cable_on_roof_hanging_on_wall_etc: {
        verbose_name: 'No exposed cable on roof, hanging on wall etc.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },
    buried_Cable_at_crossing_shall_pass_through_conduit_hume_pipes: {
        verbose_name: 'No exposed cable on roof, hanging on wall etc.',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
    },

};

const baseCableTrayConduitSchema = {
    projectName: z.string().max(155, 'Project Name must be at most 155 characters'),
    customerDetails: z.string().max(255, 'Customer Details must be at most 255 characters'),
    location: z.string().max(255, 'Location Area must be at most 255 characters'),
    comments: z.string().max(255, 'Comments must be at most 255 characters'),
    pgepl: z.string().max(255, 'PGEPL QHSE must be at most 255 characters'),
    witness1: z.number().optional(),
    witness2: z.number().optional(),
    witness3: z.number().optional(),
  };
  
  const cableTrayConduitSchema = z.object(baseCableTrayConduitSchema);
  
  type CableTrayConduitSchemaType = z.infer<typeof cableTrayConduitSchema>;
  
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
    } = useForm<CableTrayConduitSchemaType>({
      resolver: zodResolver(cableTrayConduitSchema),
    });
  
    const onSubmit = async (data: CableTrayConduitSchemaType) => {
      if (validateForm()) {
        if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
          alert('Witness cannot be same');
          return;
        }
  
        setBtnDisabled(true);
        axios({
          method: 'POST',
          url: `${config.site.serverURL}/api/inspection/cable-tray-conduit/?work_site_id=${localStorage.getItem('work-site-id')}`,
          data: {
            project_name: data.projectName,
            location: data.location,
            customer_details: data.customerDetails,
            pgepl: data.pgepl,
            witness_1: data.witness1,
            witness_2: data.witness2,
            witness_3: data.witness3,
            checklists: checklistResponses,
          },
          headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
        })
          .then((response) => {
            if (response.status === 201) {
              window.alert('Cable Tray Conduit Report Added');
              setTimeout(() => {
                window.location.href = '/menu/inspection/cable-tray-conduit?status=approved';
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
                name="projectName"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    required
                    helperText={error ? error.message : null}
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    fullWidth
                    label="Project Name:"
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={6}>
              <Controller
                name="customerDetails"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    required
                    helperText={error ? error.message : null}
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    fullWidth
                    label="Customer Details"
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={6}>
              <Controller
                name="location"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    required
                    helperText={error ? error.message : null}
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    fullWidth
                    label="Location Area:"
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

            <Grid item xs={12} sm={12} md={6}>
              <Controller
                name="pgepl"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    required
                    helperText={error ? error.message : null}
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    fullWidth
                    label="PGEPL QHSE"
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
  