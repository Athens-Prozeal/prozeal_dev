'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Grid, TextField } from '@mui/material';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';

import { config } from '@/config';
import { PopUp } from '@/components/core/alert';

const toolboxTalkSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  topic: z.string().max(255, 'Topic must be at most 255 characters'),
  numberOfParticipants: z
    .string()
    .min(1, 'Number of workers must be at least 1')
    .transform((val) => Number(val)),
  agencyName: z.string().min(2, 'Agency name must be at least 2 characters'),
  evidence: z.any().optional(),
  attendance: z.any().optional(),
});

type ToolBoxTalkSchemaType = z.infer<typeof toolboxTalkSchema>;

export const Form = () => {
  const searchParams = useSearchParams();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'success'>('success');
  const [alertKey, setAlertKey] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [currentEvidence, setCurrentEvidence] = useState<string | null>(null);
  const [currentAttendance, setCurrentAttendance] = useState<string | null>(null);
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);
  const [attendancePreview, setAttendancePreview] = useState<string | null>(null);

  const toolboxTalkId = searchParams.get('toolboxTalkId');

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ToolBoxTalkSchemaType>({
    resolver: zodResolver(toolboxTalkSchema),
  });

  useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/tbt/${toolboxTalkId}?work_site_id=${localStorage.getItem('work-site-id')}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
      })
      .then((response) => {
        const data = response.data;
        setValue('date', data.date);
        setValue('topic', data.topic);
        setValue('numberOfParticipants', data.number_of_participants.toString());
        setValue('agencyName', data.agency_name);
        setCurrentEvidence(data.evidence);
        setCurrentAttendance(data.attendance);
      })
      .catch((error) => {
        window.alert('Some error occurred');
      });
  }, [setValue]);

  const onSubmit = async (data: ToolBoxTalkSchemaType) => {
    setButtonDisabled(true);

    // Create FormData object to handle binary files
    const formData = new FormData();
    formData.append('date', data.date);
    formData.append('topic', data.topic);
    formData.append('number_of_participants', data.numberOfParticipants.toString());
    formData.append('agency_name', data.agencyName);

    if (data.evidence instanceof File) {
      formData.append('evidence', data.evidence);
    }
    if (data.attendance instanceof File) {
      formData.append('attendance', data.attendance);
    }

    axios({
      method: 'PATCH',
      url: `${config.site.serverURL}/api/tbt/${toolboxTalkId}/?work_site_id=${localStorage.getItem('work-site-id')}`,
      data: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        'Content-Type': 'multipart/form-data', // Ensure binary data is sent correctly
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setAlertSeverity('success');
          setAlertMessage('Toolbox Talk Report updated successfully');
          setAlertKey((prev) => prev + 1);
          setAlertOpen(true);
          setTimeout(() => {
            window.location.href = '/menu/toolboxTalk';
          }, 500);
        }
      })
      .catch((error) => {
        setAlertSeverity('error');
        setButtonDisabled(false);
        setAlertMessage(error.response?.data?.non_field_errors?.[0] || 'Something went wrong');
        setAlertKey((prev) => prev + 1);
        setAlertOpen(true);
      });
  };

  // Handlers for file previews
  const handleEvidenceChange = (file: File | null) => {
    setEvidencePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleAttendanceChange = (file: File | null) => {
    setAttendancePreview(file ? URL.createObjectURL(file) : null);
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
                  required
                  type="date"
                  label="Date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  fullWidth
                  error={!!errors.date}
                  helperText={errors.date?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="topic"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  required
                  error={!!error}
                  InputLabelProps={{ shrink: true }}
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
                  required
                  type="number"
                  label="Number Of Participants"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  fullWidth
                  error={!!errors.numberOfParticipants}
                  helperText={errors.numberOfParticipants?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="agencyName"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  required
                  helperText={error ? error.message : null}
                  error={!!error}
                  InputLabelProps={{ shrink: true }}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Agency Name"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          {/* Evidence input */}
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="evidence"
              control={control}
              render={({ field }) => (
                <TextField
                  error={!!errors.evidence}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: 'image/*' }}
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0] || null;
                    field.onChange(file);
                    handleEvidenceChange(file);
                  }}
                  fullWidth
                  label="New Evidence"
                  variant="outlined"
                />
              )}
            />
            <div>
              Current Evidence: <br />
              {currentEvidence && <img src={currentEvidence} style={{ maxWidth: '250px' }} />}
              {evidencePreview && (
                <>
                  <p>Preview:</p>
                  <img src={evidencePreview} style={{ maxWidth: '250px' }} />
                </>
              )}
            </div>
          </Grid>

          {/* Attendance input */}
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="attendance"
              control={control}
              render={({ field }) => (
                <TextField
                  error={!!errors.attendance}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: 'image/*' }}
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0] || null;
                    field.onChange(file);
                    handleAttendanceChange(file);
                  }}
                  fullWidth
                  label="New Attendance"
                  variant="outlined"
                />
              )}
            />
            <div>
              Current Attendance: <br />
              {currentAttendance && <img src={currentAttendance} style={{ maxWidth: '250px' }} />}
              {attendancePreview && (
                <>
                  <p>Preview:</p>
                  <img src={attendancePreview} style={{ maxWidth: '250px' }} />
                </>
              )}
            </div>
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
