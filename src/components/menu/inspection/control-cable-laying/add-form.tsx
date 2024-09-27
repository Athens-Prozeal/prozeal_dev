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
    physical_damage_of_the_cables: {
      verbose_name: 'Check for physical damage of the cables',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    cable_make_size_voltage_grade_conductor_insulation_type_as_per_design_specifications: {
      verbose_name: 'Check cable make, size, voltage grade, conductor & insulation type as per design/specifications',
      choices: ['Yes', 'No', 'N/A'],
      required: true,
    },
    cable_route_as_per_drawings: {
        verbose_name: 'Check Cable route as per drawings',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
    adequate_looping_at_the_termination_ends: {
        verbose_name: 'Adequate looping at the termination ends ',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
    DWC_Pipes_Should_be_sealed: {
        verbose_name: 'Check that DWC Pipes Should be sealed',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
    Dressing_of_the_cables: {
        verbose_name: 'Check for proper Dressing of the cables',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
    cable_should_be_laid_on_blocks: {
        verbose_name: 'Check the cable should be laid on blocks',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
    cable_terminations_at_connection: {
        verbose_name: 'Check tightness of the cable terminations at connection',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      the_cable_gland_tightness_sealed_to_cover_any_openings_or_leaks_observed: {
        verbose_name: 'Check the cable gland tightness sealed to cover any openings or leaks observed',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      feruling_as_per_drawing: {
        verbose_name: 'Check Feruling as per drawing',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      cable_tag_should_as_per_Drawing: {
        verbose_name: 'Check Cable tag should as per Drawing',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
    };

    const baseControlCableLayingSchema = {
      drawingOrSpecificationNo: z.string().max(155, 'Drawing Or Specification number must be at most 155 characters'),
      siteLocationOrArea: z.string().max(255, 'Project Name must be at most 255 characters'),
      commentsOrRemarks: z.string().max(255, 'Comments/Remarks must be at most 255 characters'),
      witness1: z.number().optional(),
      witness2: z.number().optional(),
      witness3: z.number().optional(),
    };

    const ControlCableLayingSchema = z.object(baseControlCableLayingSchema);

type ControlCableLayingSchemaType = z.infer<typeof ControlCableLayingSchema>;

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
  } = useForm<ControlCableLayingSchemaType>({
    resolver: zodResolver(ControlCableLayingSchema),
  });

  const onSubmit = async (data: ControlCableLayingSchemaType) => {
    if (validateForm()) {
      if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
        alert('Witness cannot be same');
        return;
      }

      setBtnDisabled(true);
      axios({
        method: 'POST',
        url: `${config.site.serverURL}/api/inspection/control-cable-laying/?work_site_id=${localStorage.getItem('work-site-id')}`,
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
            window.alert('Control Cable Laying Report Added');
            setTimeout(() => {
              window.location.href = '/menu/inspection/control-cable-laying?status=approved';
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


