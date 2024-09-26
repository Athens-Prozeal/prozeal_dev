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
    priestesses_precast_RCC_column_check: {
    verbose_name: 'Check the Priestesses Precast RCC Column (If applicable)',
    choices: ['Yes', 'No'],
    required: true,
  },
  depth_of_excavation_check: {
    verbose_name: 'Check the Depth of excavation as per approved drawing.',
    choices: ['Yes', 'No'],
    required: true,
  },
  Dia_of_excavation_check: {
    verbose_name: 'Check the Dia. Of excavation as per approved drawing.',
    choices: ['Yes', 'No'],
    required: true,
  },
  no_collapse_of_augured_hole_check: {
    verbose_name: 'Check the no collapse of augured hole – Visual Check',
    choices: ['Yes', 'No'],
    required: true,
  },
  check_the_center_to_center_distance_between_post_post: {
    verbose_name: 'Check the Center-to-Center distance between post-Post.',
    choices: ['Yes', 'No'],
    required: true,
  },
  precast_PCC_column_inside_the_ground_level: {
    verbose_name: 'Check the Precast PCC Column inside the ground Level.',
    choices: ['Yes', 'No'],
    required: true,
  },
  concreting_at_augured_hole_as_per_mix_design: {
    verbose_name: 'Check the Concreting at augured hole as per mix design.',
    choices: ['Yes', 'No'],
    required: true,
  },
  Slump_and_Cast_concrete_cubes: {
    verbose_name: 'Check the Slump and Cast concrete cubes for Testing. (Sample cube as per IS 456)',
    choices: ['Yes', 'No'],
    required: true,
  },
  Production_and_Placing_and_compaction_of_concrete: {
    verbose_name: 'Check the Production, Placing and compaction of concrete.',
    choices: ['Yes', 'No'],
    required: true,
  },
  adequate_curing: {
    verbose_name: 'Check for adequate curing.',
    choices: ['Yes', 'No'],
    required: true,
  },
  slab_alignment_after_concrete_operation: {
    verbose_name: 'Check the slab alignment after concrete operation.',
    choices: ['Yes', 'No'],
    required: true,
  },
  Slab_fixing_at_grooves_of_column_post: {
    verbose_name: 'Check the Slab fixing at grooves of column post.',
    choices: ['Yes', 'No'],
    required: true,
  },
  Groove_B_or_W_pole_and_panel_to_be_filled: {
    verbose_name: 'Check for Groove B/W Pole & Panel to be filled with non- shrink grout.',
    choices: ['Yes', 'No'],
    required: true,
  },
  M_S_Posts_to_paint_with_anti_corrosive_paint: {
    verbose_name: 'Check the M.S. Posts to paint with anti-corrosive Paint.',
    choices: ['Yes', 'No'],
    required: true,
  },

};



const basePlantBoundaryAndFencingSchema = {
  date: z.string().nonempty('Date is required'),
  projectNameAndCapacity: z.string().max(255, 'Project Name & Capacity must be at most 255 characters'),
  clientName: z.string().max(155, 'Client Name must be at most 155 characters'),
  consultantName: z.string().max(155, 'Consultant Name must be at most 155 characters'),
  epcContractorName: z.string().max(155, 'EPC Contractor Name must be at most 155 characters'),
  locationOrArea: z.string().max(255, 'Location / Area must be at most 255 characters'),
  contractorName: z.string().max(255, 'Contractor Name must be at most 255 characters'),
  workSupervisorName: z.string().max(255, 'Work Supervisor Name must be at most 255 characters'),
  anyOtherObservation: z.string().max(255, 'Any Other Observation must be at most 255 characters'),
  witness1: z.number().optional(),
  witness2: z.number().optional(),
  witness3: z.number().optional(),
};

const plantBoundaryAndFencingSchema = z.object(basePlantBoundaryAndFencingSchema);

type PlantBoundaryAndFencingSchemaType = z.infer<typeof plantBoundaryAndFencingSchema>;

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
  } = useForm<PlantBoundaryAndFencingSchemaType>({
    resolver: zodResolver(plantBoundaryAndFencingSchema),
    defaultValues: {
      date: currentDate,
    },
  });

  const onSubmit = async (data: PlantBoundaryAndFencingSchemaType) => {
    if (validateForm()) {
      if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
        alert('Witness cannot be same');
        return;
      }

      setBtnDisabled(true);
      axios({
        method: 'POST',
        url: `${config.site.serverURL}/api/inspection/plant-boundary-and-fencing/?work_site_id=${localStorage.getItem('work-site-id')}`,
        data: {
          date: data.date,
          project_name_and_capacity: data.projectNameAndCapacity,
          client_name: data.clientName,
          consultant_name: data.consultantName,
          epc_contractor_name: data.epcContractorName,
          location_or_area: data.locationOrArea,
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
            window.alert('Plant Boundary and Fencing Report Added');
            setTimeout(() => {
              window.location.href = '/menu/inspection/plant-boundary-and-fencing?status=approved';
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
