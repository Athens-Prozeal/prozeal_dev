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
  Is_fencing_installed_in_accordance_to_plot_plan: {
    verbose_name: 'Is fencing installed in accordance to plot plan?',
    choices: ['Yes', 'No'],
    required: true,
  },
  Check_the_Depth_of_excavation_as_per_approved_drawing: {
    verbose_name: 'Check the Depth of excavation as per approved drawing.',
    choices: ['Yes', 'No'],
    required: true,
  },
  Check_the_Dia_Of_excavation_as_per_approved_drawing: {
    verbose_name: 'Check the Dia. Of excavation as per approved drawing.',
    choices: ['Yes', 'No'],
    required: true,
  },
  Check_the_no_collapse_of_augured_hole_Visual_Check: {
    verbose_name: 'Check the no collapse of augured hole – Visual Check',
    choices: ['Yes', 'No'],
    required: true,
  },
  Check_the_Center_to_Center_distance_between_post_Post: {
    verbose_name: 'Check the Center-to-Center distance between post-Post.',
    choices: ['Yes', 'No'],
    required: true,
  },
  Are_all_fittings_caps_tension_bars_hinges_and_hardware_installed_properly: {
    verbose_name: 'Are all fittings, caps, tension bars, hinges, and hardware installed properly?',
    choices: ['Yes', 'No'],
    required: true,
  },
  Check_the_Concreting_at_augured_hole_as_per_mix_design: {
    verbose_name: 'Check the Concreting at augured hole as per mix design.',
    choices: ['Yes', 'No'],
    required: true,
  },
  Check_the_Slump_and_Cast_concrete_cubes_for_Testing_Sample_cube_as_per_IS_456: {
    verbose_name: 'Check the Slump and Cast concrete cubes for Testing. (Sample cube as per IS 456)',
    choices: ['Yes', 'No'],
    required: true,
  },
  Check_the_Production_Placing_and_compaction_of_concrete: {
    verbose_name: 'Check the Production, Placing and compaction of concrete.',
    choices: ['Yes', 'No'],
    required: true,
  },
  Check_for_adequate_curing: {
    verbose_name: 'Check for adequate curing.',
    choices: ['Yes', 'No'],
    required: true,
  },
  Check_the_Fencing_angel_alignment_after_concrete_operation: {
    verbose_name: 'Check the Fencing angel alignment after concrete operation.',
    choices: ['Yes', 'No'],
    required: true,
  },
  Are_all_fencing_components_free_from_defects_in_workmanship: {
    verbose_name: 'Are all fencing components free from defects in workmanship?',
    choices: ['Yes', 'No'],
    required: true,
  },
  Does_the_height_of_the_fence_match_specifications_checked_at_random_spots: {
    verbose_name: 'Does the height of the fence match specifications (checked at random spots)?',
    choices: ['Yes', 'No'],
    required: true,
  },
  Check_the_M_S_Posts_to_paint_with_anti_corrosive_Paint: {
    verbose_name: 'Check the M.S. Posts to paint with anti-corrosive Paint.',
    choices: ['Yes', 'No'],
    required: true,
  },
  Are_Nut_and_Bolts_proper_tight_and_corrosion_free_condition: {
    verbose_name: 'Are Nut & Bolts proper tight and corrosion free condition',
    choices: ['Yes', 'No'],
    required: true,
  },
  Are_tension_wires_and_fabrics_the_proper_gage_tight_and_secure: {
    verbose_name: 'Are tension wires and fabrics the proper gage, tight, and secure?',
    choices: ['Yes', 'No'],
    required: true,
  },
  Are_wire_ties_hog_rings_the_same_material_as_fencing_fabric: {
    verbose_name: 'Are wire ties/hog rings the same material as fencing fabric?',
    choices: ['Yes', 'No' ],
    required: true,
  },
};

const baseChainLinkFencingSchema = {
  date: z.string().nonempty('Date is required'),
  projectNameAndCapacity: z.string().max(255, 'Project Name & Capacity must be at most 255 characters'),
  clientName: z.string().max(155, 'Client Name must be at most 155 characters'),
  consultantName: z.string().max(155, 'Consultant Name must be at most 155 characters'),
  epcContractorName: z.string().max(155, 'EPC Contractor Name must be at most 155 characters'),
  locationOrArea: z.string().max(255, 'Location / Area must be at most 255 characters'),
  drawingNo: z.string().max(255, 'Drawing No must be at most 255 characters'),
  contractorName: z.string().max(255, 'Contractor Name must be at most 255 characters'),
  workSupervisorName: z.string().max(255, 'Work Supervisor Name must be at most 255 characters'),
  anyOtherObservation: z.string().max(255, 'Any Other Observation must be at most 255 characters'),
  witness1: z.number().optional(),
  witness2: z.number().optional(),
  witness3: z.number().optional(),
};

const chainLinkFencingSchema = z.object(baseChainLinkFencingSchema);

type ChainLinkFencingSchemaType = z.infer<typeof chainLinkFencingSchema>;

export const Form = () => {
  const currentDate = new Date().toISOString().split('T')[0];
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
  } = useForm<ChainLinkFencingSchemaType>({
    resolver: zodResolver(chainLinkFencingSchema),
    defaultValues: {
      date: currentDate,
    },
  });

  const onSubmit = async (data: ChainLinkFencingSchemaType) => {
    if (validateForm()) {
      if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
        alert('Witness cannot be same');
        return;
      }

      setBtnDisabled(true);
      axios({
        method: 'POST',
        url: `${config.site.serverURL}/api/inspection/chain-link-fencing/?work_site_id=${localStorage.getItem('work-site-id')}`,
        data: {
          date: data.date,
          project_name_and_capacity: data.projectNameAndCapacity,
          client_name: data.clientName,
          consultant_name: data.consultantName,
          epc_contractor_name: data.epcContractorName,
          location_or_area: data.locationOrArea,
          drawing_no: data.drawingNo,
          contractor_name: data.contractorName,
          work_supervisor_name: data.workSupervisorName,
          any_other_observation: data.anyOtherObservation,
          witness_1: data.witness1,
          witness_2: data.witness2,
          witness_3: data.witness3,
          checklists: checklistResponses,
        },
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
      })
        .then((response) => {
          if (response.status === 201) {
            window.alert('Chain Link Fencing Report Added');
            setTimeout(() => {
              window.location.href = '/menu/inspection/chain-link-fencing?status=approved';
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
              name="date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Date"
                  variant="outlined"
                  fullWidth
                  error={!!errors.date}
                  helperText={errors.date?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={6}>
            <Controller
              name="projectNameAndCapacity"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  required
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Project Name & Capacity"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={6}>
            <Controller
              name="clientName"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  required
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Client Name"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={6}>
            <Controller
              name="consultantName"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  required
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Consultant Name"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={6}>
            <Controller
              name="epcContractorName"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  required
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="EPC Contractor Name"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={6}>
            <Controller
              name="locationOrArea"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  required
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Location / Area"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={6}>
            <Controller
              name="drawingNo"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  required
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Drawing No"
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
              name="contractorName"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  required
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Contractor Name"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6}>
            <Controller
              name="workSupervisorName"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  required
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Work Supervisor Name"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6}>
            <Controller
              name="anyOtherObservation"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  required
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Any Other Observation"
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
