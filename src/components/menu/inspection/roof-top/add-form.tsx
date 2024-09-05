'use client';

import { useEffect, useState, Fragment } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Autocomplete, Box, Button, Grid, TextField, Typography } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Witness as WitnessType } from '@/types/user';
import { ChecklistResponseType } from '@/types/checklist';
import { ChecklistSchema } from '@/schemas/checklist';
import { config } from '@/config';

type CategorizedChecklistSchema = {
    [key: string]: ChecklistSchema;
    description: ChecklistSchema;
  };

const checklistSchemas: CategorizedChecklistSchema = {
    description: {
      dimensions_at_bottom_checked: {
        verbose_name: 'Dimensions at bottom checked (W____mm X L___mm X B___mm), tolerance ±___mm',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      chipping_at_bottom_checked: {
        verbose_name: 'Chipping at bottom checked',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      chipped_area_cleaned_and_free_from_unwanted_waste: {
        verbose_name: 'Chipped area cleaned and free from unwanted waste',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      shuttering_done_properly: {
        verbose_name: 'Shuttering done properly',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      rcc_proposition_checked: {
        verbose_name: 'RCC proposition checked',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      rcc_laid_to_level_and_vibration_poking_of_rcc_checked: {
        verbose_name: 'RCC laid to level and Vibration/Poking of RCC checked',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },
      rcc_cured_as_per_requirementd: {
        verbose_name: 'RCC cured as per requirement',
        choices: ['Yes', 'No', 'N/A'],
        required: true,
      },    
    },
};

type CategorizedChecklistResponseType = {
    [category: string]: {
      [key: string]: ChecklistResponseType;
    };
  };
  
  const baseRoofTopSchema = {
    dateOfChecking: z.string().nonempty('Date is required'),
    projectName: z.string().max(255, 'Project Name must be at most 255 characters'),
    location: z.string(),
    customer: z.string().max(155, 'Customer must be at most 155 characters'),
    remarks: z.string().max(255, 'Remarks must be at most 255 characters'),
    witness1: z.number().optional(),
    witness2: z.number().optional(),
    witness3: z.number().optional(),
  };
  
  const roofTopSchema = z.object(baseRoofTopSchema);
  
  type RoofTopSchemaType = z.infer<typeof roofTopSchema>;
  
  export const Form = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const [checklistResponses, setChecklistResponses] = useState<CategorizedChecklistResponseType>({});
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
  
    const handleChoiceChange = (category: keyof CategorizedChecklistSchema, itemKey: string, choice: string) => {
      setChecklistResponses((prevResponses) => ({
        ...prevResponses,
        [category]: {
          ...prevResponses[category],
          [itemKey]: {
            ...(prevResponses[category]?.[itemKey] || {}),
            choice,
            verbose_name: checklistSchemas[category][itemKey].verbose_name, // Include verbose_name
          },
        },
      }));
    };
  
    const handleRemarkChange = (category: keyof CategorizedChecklistSchema, itemKey: string, remark: string) => {
      setChecklistResponses((prevResponses) => ({
        ...prevResponses,
        [category]: {
          ...prevResponses[category],
          [itemKey]: {
            ...(prevResponses[category]?.[itemKey] || {}),
            remark,
            verbose_name: checklistSchemas[category][itemKey].verbose_name, // Include verbose_name
          },
        },
      }));
    };
  
  
    const validateForm = () => {
      const errors: string[] = [];
  
      Object.keys(checklistSchemas).forEach((category) => {
        const categoryKey = category as keyof CategorizedChecklistSchema;
        Object.keys(checklistSchemas[categoryKey]).forEach((key) => {
          if (checklistSchemas[categoryKey][key].required && !checklistResponses[categoryKey]?.[key]?.choice) {
            errors.push(checklistSchemas[categoryKey][key].verbose_name);
          }
        });
      });
  
      setValidationErrors(errors);
      return errors.length === 0;
    };
  
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<RoofTopSchemaType>({
      resolver: zodResolver(roofTopSchema),
      defaultValues: {
        dateOfChecking: currentDate,
      },
    });
  
    const onSubmit = async (data: RoofTopSchemaType) => {
      if (data.witness1 === data.witness2 || data.witness2 === data.witness3 || data.witness3 === data.witness1) {
        alert('Witness cannot be same');
        return;
      }
  
      if (validateForm()) {
        setBtnDisabled(true);
        axios({
          method: 'POST',
          url: `${config.site.serverURL}/api/inspection/roof-top/?work_site_id=${localStorage.getItem('work-site-id')}`,
          data: {
            date_of_checking: data.dateOfChecking,
            project_name: data.projectName,
            location: data.location,
            customer: data.customer,
            remarks: data.remarks,
            witness_1: data.witness1,
            witness_2: data.witness2,
            witness_3: data.witness3,
            checklists: checklistResponses,
          },
          headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
        })
          .then((response) => {
            if (response.status === 201) {
              window.alert('Roof Top Report Added');
              setTimeout(() => {
                window.location.href = '/menu/inspection/roof-top?status=approved';
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
                  name="dateOfChecking"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      label="Date"
                      variant="outlined"
                      fullWidth
                      error={!!errors.dateOfChecking}
                      helperText={errors.dateOfChecking?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={6}>
                <Controller
                  name="projectName"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      helperText={error ? error.message : null}
                      error={!!error}
                      onChange={onChange}
                      value={value}
                      fullWidth
                      label="Project Name"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Controller
                  name="location"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      helperText={error ? error.message : null}
                      error={!!error}
                      onChange={onChange}
                      value={value}
                      fullWidth
                      label="Location/Area"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Controller
                  name="customer"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      helperText={error ? error.message : null}
                      error={!!error}
                      onChange={onChange}
                      value={value}
                      fullWidth
                      label="customer"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              
              <br />
              <Grid item xs={12} sm={12} md={12}>
                <Typography variant="h6">Items to be checked</Typography>
              </Grid>
              <br />
    
              {Object.keys(checklistSchemas).map((category) => (
                <Fragment key={category}>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      {category
                        .split('_')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}{' '}
                    </Typography>
                  </Grid>
                  {Object.keys(checklistSchemas[category]).map((key) => (
                    <Grid item xs={12} key={key}>
                      <Typography gutterBottom>{checklistSchemas[category][key].verbose_name}</Typography>
                      <ToggleButtonGroup
                        color="primary"
                        value={checklistResponses[category]?.[key]?.choice || ''}
                        exclusive
                        onChange={(event, newValue) =>
                          handleChoiceChange(category as keyof CategorizedChecklistSchema, key, newValue)
                        }
                        aria-label={checklistSchemas[category][key].verbose_name}
                      >
                        {checklistSchemas[category][key].choices.map((choice) => (
                          <ToggleButton key={choice} value={choice}>
                            {choice}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                      <TextField
                        label="Remark"
                        variant="standard"
                        fullWidth
                        value={checklistResponses[category]?.[key]?.remark || ''}
                        onChange={(e) =>
                          handleRemarkChange(category as keyof CategorizedChecklistSchema, key, e.target.value)
                        }
                      />
                    </Grid>
                  ))}
                </Fragment>
              ))}
    
    
              <Grid item xs={12} sm={12} md={6}>
                <Controller
                  name="remarks"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      required
                      helperText={error ? error.message : null}
                      error={!!error}
                      onChange={onChange}
                      value={value}
                      fullWidth
                      label="Remarks"
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
                    <Autocomplete
                      {...field}
                      options={witnesses}
                      getOptionLabel={(witness) => `${witness.username} (${witness.company})`}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          label="Witness 1"
                          variant="outlined"
                          fullWidth
                          error={!!errors.witness1}
                          helperText={errors.witness1?.message}
                        />
                      )}
                      value={field.value !== null ? witnesses.find((witness) => witness.id === field.value) : null}
                      onChange={(e, newValue) => {
                        field.onChange(newValue?.id || null);
                      }}
                    />
                  )}
                />
              </Grid>
    
              <Grid item xs={12} sm={4} md={4}>
                <Controller
                  name="witness2"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={witnesses}
                      getOptionLabel={(witness) => `${witness.username} (${witness.company})`}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          label="Witness 2"
                          variant="outlined"
                          fullWidth
                          error={!!errors.witness2}
                          helperText={errors.witness2?.message}
                        />
                      )}
                      value={field.value !== null ? witnesses.find((witness) => witness.id === field.value) : null}
                      onChange={(e, newValue) => {
                        field.onChange(newValue?.id || null);
                      }}
                    />
                  )}
                />
              </Grid>
    
              <Grid item xs={12} sm={4} md={4}>
                <Controller
                  name="witness3"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={witnesses}
                      getOptionLabel={(witness) => `${witness.username} (${witness.company})`}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          label="Witness 3"
                          variant="outlined"
                          fullWidth
                          error={!!errors.witness3}
                          helperText={errors.witness3?.message}
                        />
                      )}
                      value={field.value !== null ? witnesses.find((witness) => witness.id === field.value) : null}
                      onChange={(e, newValue) => {
                        field.onChange(newValue?.id || null);
                      }}
                    />
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
    