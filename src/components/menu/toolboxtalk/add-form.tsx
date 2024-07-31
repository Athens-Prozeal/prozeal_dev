import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Grid, TextField } from '@mui/material';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { config } from '@/config';
import { PopUp } from '@/components/core/alert';

// Define the schema using Zod
const toolBoxTalkSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  topic: z.string().max(255, 'Topic must be at most 255 characters'),
  numberOfParticipants: z
    .string()
    .min(1, 'Number of workers must be at least 1')
    .transform((val) => Number(val)),
  agencyName: z.string().min(2, 'Agency name must be atleast 2 characters'),
  evidence: z.instanceof(File).refine((file) => file instanceof File, {
    message: 'Invalid file format',
  }),
  attendance: z.instanceof(File).refine((file) => file instanceof File, {
    message: 'Invalid file format',
  }),
});

type ToolBoxTalkSchemaType = z.infer<typeof toolBoxTalkSchema>;

const ToolBoxTalkForm: React.FC = () => {
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState<'error' | 'success'>('success');
  const [alertKey, setAlertKey] = React.useState(0);
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const currentDate = new Date().toISOString().split('T')[0];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ToolBoxTalkSchemaType>({
    resolver: zodResolver(toolBoxTalkSchema),
    defaultValues: {
      date: currentDate,
    },
  });

  const onSubmit = async (data: ToolBoxTalkSchemaType) => {
    console.log('Form Data:', data);
    const formdata = new FormData();
    formdata.append('topic', data.topic);
    formdata.append('date', data.date);
    formdata.append('number_of_participants', String(data.numberOfParticipants));
    formdata.append('agency_name', data.agencyName);
    formdata.append('evidence', data.evidence);
    formdata.append('attendance', data.attendance);

    axios({
      method: 'POST',
      url: `${config.site.serverURL}/api/tbt/?work_site_id=${localStorage.getItem('work-site-id')}`,
      data: formdata,
      headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
    })
      .then((response) => {
        if (response.status === 201) {
          setAlertSeverity('success');
          setAlertMessage('Manpower Report added successfully');
          setAlertKey((prev) => prev + 1);
          setAlertOpen(true);
          setTimeout(() => {
            window.location.href = '/menu/toolboxtalk/';
          }, 500);

        }
      })
      .catch((error) => {
        setAlertSeverity('error');
        setButtonDisabled(false);
        if (error.response.data.non_field_errors) {
          setAlertMessage(error.response.data.non_field_errors[0]);
        } else {
          setAlertMessage('Something went wrong');
        }
        setAlertKey((prev) => prev + 1);
        setAlertOpen(true);
      });
    setButtonDisabled(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={12} sm={4} md={4}>
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

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="topic"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Topic"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="numberOfParticipants"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Number Of Participants"
                  variant="outlined"
                  fullWidth
                  error={!!errors.numberOfParticipants}
                  helperText={errors.numberOfParticipants?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="agencyName"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Agency Name"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="evidence"
              control={control}
              render={({ field }) => (
                <TextField
                  helperText={errors.evidence ? errors.evidence.message : null}
                  error={!!errors.evidence}
                  InputLabelProps={{ shrink: true }}  
                  inputProps={{
                    accept: 'image/*',
                  }}
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.files?.[0])}
                  fullWidth
                  label="Evidence"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="attendance"
              control={control}
              render={({ field }) => (
                <TextField
                  helperText={errors.attendance ? errors.attendance.message : null}
                  error={!!errors.attendance}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    accept: 'image/*',
                  }}
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.files?.[0])}
                  fullWidth
                  label="Attendance"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} container justifyContent="flex-start">
            <Button variant="contained" color="primary" type="submit" disabled={buttonDisabled}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      <PopUp key={alertKey} open={alertOpen} alertSeverity={alertSeverity} alertMessage={alertMessage} />
    </Box>
  );
};

export default ToolBoxTalkForm;
