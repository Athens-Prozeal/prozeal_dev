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
    civil_structure: {
      verbose_name: 'Check for transmission line layout drawings and ensure that no fouling with civil/structure',
      choices: ['Yes', 'No'],
      required: true,
    },
    handling_equipment: {
      verbose_name: 'Check & verify TL assembly lifting and its handling equipment',
      choices: ['Yes', 'No'],
      required: true,
    },
    approved_drawing: {
      verbose_name: 'Check that Poles shall have proper earthing as per approved drawing',
      choices: ['Yes', 'No'],
      required: true,
    },
    rust: {
        verbose_name: 'Check Transmission line parts free from rust.',
        choices: ['Yes', 'No'],
        required: true,
      },
    properly_before_installation: {
        verbose_name: 'Check that Insulators and other hardware fittings cleaned properly before installation',
        choices: ['Yes', 'No'],
        required: true,
      },
    ground_hard_surfaces: {
        verbose_name: 'Check for proper arrangements made to avoid rubbing of conductor on ground/hard surfaces',
        choices: ['Yes', 'No'],
        required: true,
      },
    cracks_damages: {
        verbose_name: 'Check that Insulators free from cracks / damages',
        choices: ['Yes', 'No'],
        required: true,
      },
    drawing_specifications: {
        verbose_name: 'Use of correct sizes & Nos. of disc insulator, U clamp and conductor as per drawing / specifications',
        choices: ['Yes', 'No'],
        required: true,
      },
    drawings_specifications: {
        verbose_name: 'Check that poles erected with base plate & full concreting as per drawings/specifications',
        choices: ['Yes', 'No'],
        required: true,
      },
    Transmission_line: {
        verbose_name: 'Check for fixing of cross arms, DP structure member, Transmission line conductor as per drawings',
        choices: ['Yes', 'No'],
        required: true,
      },
      Required_sag: {
        verbose_name: 'Required sag and tension have been maintained as per the day temperature and sag tension chart (Refer IS / design specifications)',
        choices: ['Yes', 'No'],
        required: true,
      },
    over_tensioning: {
        verbose_name: 'Check that Care has been taken to avoid any over tensioning',
        choices: ['Yes', 'No'],
        required: true,
      },
    instruction_specifications: {
        verbose_name: 'All nuts & bolts of jumper fittings have tightened as per manufacturer instruction / specifications',
        choices: ['Yes', 'No'],
        required: true,
      },
    specification: {
        verbose_name: 'Check for Danger boards or Barbed wires shall be installed as per specification, wherever applicable',
        choices: ['Yes', 'No'],
        required: true,
      },
    railway_crossing: {
        verbose_name: 'Check for Lines are provided with Guard wire protection wherever required, such as railway crossing , road crossing, etc.',
        choices: ['Yes', 'No'],
        required: true,
      },
    poles: {
        verbose_name: 'Numerical or indicative marking is provided on the poles',
        choices: ['Yes', 'No'],
        required: true,
      },
    white_washing: {
        verbose_name: 'Check the pole copping & white washing',
        choices: ['Yes', 'No'],
        required: true,
      },
};

const baseTransmissionLinesSchema = {
    drawingOrSpecificationNo: z.string().max(155, 'Drawing Or Specification number must be at most 155 characters'),
    siteLocationOrArea: z.string().max(255, 'Project Name must be at most 255 characters'),
    commentsOrRemarks: z.string().max(255, 'Comments/Remarks must be at most 255 characters'),
    witness1: z.number().optional(),
    witness2: z.number().optional(),
  };

  const transmissionlinesSchema = z.object(baseTransmissionLinesSchema);

  type TransmissionLinesSchemaType = z.infer<typeof transmissionlinesSchema>;

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
    } = useForm<TransmissionLinesSchemaType>({
      resolver: zodResolver(transmissionlinesSchema),
    });

    const onSubmit = async (data: TransmissionLinesSchemaType) => {
      if (validateForm()) {
        if (data.witness1 === data.witness2 ) {
          alert('Witness cannot be same');
          return;
        }

        setBtnDisabled(true);
        axios({
          method: 'POST',
          url: `${config.site.serverURL}/api/inspection/transmission-lines/?work_site_id=${localStorage.getItem('work-site-id')}`,
          data: {
            drawing_or_specification_no: data.drawingOrSpecificationNo,
            site_location_or_area: data.siteLocationOrArea,
            comments_or_remarks: data.commentsOrRemarks,
            witness_1: data.witness1,
            witness_2: data.witness2,
            checklists: checklistResponses,
          },
          headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
        })
          .then((response) => {
            if (response.status === 201) {
              window.alert('Transmission Lines Report Added');
              setTimeout(() => {
                window.location.href = '/menu/inspection/transmission-lines?status=approved';
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
                    label="comments/Remarks"
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
