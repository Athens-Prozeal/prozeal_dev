'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Grid, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';

import { config } from '@/config';
import { PopUp } from '@/components/core/alert';

const workerSchema = z.object({
  inductionDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  name: z.string().max(150, 'Topic must be at most 150 characters'),
  fatherName: z.string().max(150, 'Father Name must be at most 150 characters'),
  gender: z.string().refine((val) => ['M', 'F', 'O'].includes(val), {
    message: 'Invalid gender value',
  }),
  dateOfBirth: z.string().refine(
    (val) => {
      const currentDate = new Date();
      const dob = new Date(val);
      const age = currentDate.getFullYear() - dob.getFullYear();
      return age >= 14;
    },
    {
      message: 'Worker must be at least 14 years old',
    }
  ),
  bloodGroup: z.string().refine((val) => ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(val), {
    message: 'Invalid blood group value',
  }),
  designation: z.string().max(150, 'Designation must be at most 150 characters'),
  mobileNumber: z
    .string()
    .refine((val) => /^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/g.test(val), {
      message: 'Invalid mobile number format',
    }),
  emergencyContactNumber: z
    .string()
    .refine((val) => /^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/g.test(val), {
      message: 'Invalid emergency contact number format',
    }),
  identityMarks: z.string(),
  address: z.string(),
  city: z.string().max(150, 'City must be at most 150 characters'),
  state: z.string().max(150, 'State must be at most 150 characters'),
  country: z.string().refine((val) => ['IN', 'AE', 'BR'].includes(val), {
    message: 'Invalid gender value',
  }),
  pincode: z.string().max(15, 'Pincode must be at most 15 characters'),
  profilePic: z.any().optional(),
  medicalFitness: z.any().optional(),
  aadhar: z.any().optional(),
});

type WorkerSchemaType = z.infer<typeof workerSchema>;

export const Form = () => {
  const searchParams = useSearchParams();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'success'>('success');
  const [alertKey, setAlertKey] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [currentProfilePic, setCurrentProfilePic] = useState<string | null>(null);
  const [currentMedicalFitness, setCurrentMedicalFitness] = useState<string | null>(null);
  const [currentAadhar, setCurrentAadhar] = useState<string | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [medicalFitnessPreview, setMedicalFitnessPreview] = useState<string | null>(null);
  const [aadharPreview, setAadharPreview] = useState<string | null>(null);

  const workerId = searchParams.get('workerId');

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WorkerSchemaType>({
    resolver: zodResolver(workerSchema),
  });

  useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/worker/${workerId}?work_site_id=${localStorage.getItem('work-site-id')}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
      })
      .then((response) => {
        const data = response.data;
        setValue('inductionDate', data.induction_date);
        setValue('name', data.name);
        setValue('fatherName', data.father_name);
        setValue('gender', data.gender);
        setValue('dateOfBirth', data.date_of_birth);
        setValue('bloodGroup', data.blood_group);
        setValue('designation', data.designation);
        setValue('mobileNumber', data.mobile_number);
        setValue('emergencyContactNumber', data.emergency_contact_number);
        setValue('identityMarks', data.identity_marks);
        setValue('address', data.address);
        setValue('city', data.city);
        setValue('state', data.state);
        setValue('country', data.country);
        setValue('pincode', data.pincode);
        setCurrentProfilePic(data.profile_pic);
        setCurrentMedicalFitness(data.medical_fitness);
        setCurrentAadhar(data.aadhar);
      })
      .catch((error) => {
        window.alert('Some error occurred');
      });
  }, [setValue]);

  const onSubmit = (data: WorkerSchemaType) => {
    setButtonDisabled(true);
    const formData = new FormData();
    formData.append('inductionDate', data.inductionDate);
    formData.append('name', data.name);
    formData.append('father_name', data.fatherName);
    formData.append('gender', data.gender);
    formData.append('date_of_birth', data.dateOfBirth);
    formData.append('blood_group', data.bloodGroup);
    formData.append('designation', data.designation);
    formData.append('mobile_number', data.mobileNumber);
    formData.append('emergency_contact_number', data.emergencyContactNumber);
    formData.append('identity_marks', data.identityMarks);
    formData.append('address', data.address);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('country', data.country);
    formData.append('pincode', data.pincode);
    if (data.profilePic instanceof File) {
      formData.append('profile_pic', data.profilePic);
    }
    if (data.medicalFitness instanceof File) {
      formData.append('medical_fitness', data.medicalFitness);
    }
    if (data.aadhar instanceof File) {
      formData.append('aadhar', data.aadhar);
    }

    axios({
      method: 'PATCH',
      url: `${config.site.serverURL}/api/worker/${workerId}/?work_site_id=${localStorage.getItem('work-site-id')}`,
      data: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        'Content-Type': 'multipart/form-data', // Ensure binary data is sent correctly
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setAlertSeverity('success');
          setAlertMessage('Worker Report updated successfully');
          setAlertKey((prev) => prev + 1);
          setAlertOpen(true);
          setTimeout(() => {
            window.location.href = '/menu/worker';
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

  const handleProfilePicChange = (file: File | null) => {
    setProfilePicPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleMedicalFitnessChange = (file: File | null) => {
    setMedicalFitnessPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleAadharChange = (file: File | null) => {
    setAadharPreview(file ? URL.createObjectURL(file) : null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="inductionDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Induction date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  fullWidth
                  error={!!errors.inductionDate}
                  helperText={errors.inductionDate?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Name"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="fatherName"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Father Name"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Gender"
                  fullWidth
                  error={!!errors.gender}
                  helperText={errors.gender?.message}
                  value={field.value || ''}
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                  <MenuItem value="O">Other</MenuItem>
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Date of Birth"
                   InputLabelProps={{ shrink: true }}
                  type="date"
                  fullWidth
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="bloodGroup"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Blood Group"
                  fullWidth
                  error={!!errors.bloodGroup}
                  helperText={errors.bloodGroup?.message}
                  value={field.value || ''}
                >
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="designation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Designation"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  error={!!errors.designation}
                  helperText={errors.designation?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="mobileNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mobile Number"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  error={!!errors.mobileNumber}
                  helperText={errors.mobileNumber?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="emergencyContactNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Emergency Contact Number"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  error={!!errors.emergencyContactNumber}
                  helperText={errors.emergencyContactNumber?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="identityMarks"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Identity Marks"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  error={!!errors.identityMarks}
                  helperText={errors.identityMarks?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="City"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="State"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  error={!!errors.state}
                  helperText={errors.state?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Country"
                  fullWidth
                  error={!!errors.country}
                  helperText={errors.country?.message}
                  value={field.value || ''}
                >
                  <MenuItem value="IN">India</MenuItem>
                  <MenuItem value="AE">United Arab Emirates</MenuItem>
                  <MenuItem value="BR">Brazil</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="pincode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Pincode"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  error={!!errors.pincode}
                  helperText={errors.pincode?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="profilePic"
              control={control}
              render={({ field }) => (
                <TextField
                  error={!!errors.profilePic}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: 'image/*' }}
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0] || null;
                    field.onChange(file);
                    handleProfilePicChange(file);
                  }}
                  fullWidth
                  label="Profile Picture"
                  variant="outlined"
                />
              )}
            />
            <div>
              Current Profile Picture: <br />
              {currentProfilePic && <img src={currentProfilePic} style={{ maxWidth: '250px' }} />}
              {profilePicPreview && (
                <>
                  <p>Preview:</p>
                  <img src={profilePicPreview} style={{ maxWidth: '250px' }} />
                </>
              )}
            </div>
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="medicalFitness"
              control={control}
              render={({ field }) => (
                <TextField
                  error={!!errors.medicalFitness}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: 'image/*' }}
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0] || null;
                    field.onChange(file);
                    handleMedicalFitnessChange(file);
                  }}
                  fullWidth
                  label="Medical Fitness"
                  variant="outlined"
                />
              )}
            />
            <div>
              Current Medical Fitness: <br />
              {currentMedicalFitness && <img src={currentMedicalFitness} style={{ maxWidth: '250px' }} />}
              {medicalFitnessPreview && (
                <>
                  <p>Preview:</p>
                  <img src={medicalFitnessPreview} style={{ maxWidth: '250px' }} />
                </>
              )}
            </div>
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="aadhar"
              control={control}
              render={({ field }) => (
                <TextField
                  error={!!errors.aadhar}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: 'image/*' }}
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0] || null;
                    field.onChange(file);
                    handleAadharChange(file);
                  }}
                  fullWidth
                  label="Aadhar"
                  variant="outlined"
                />
              )}
            />
            <div>
              Current Aadhar: <br />
              {currentAadhar && <img src={currentAadhar} style={{ maxWidth: '250px' }} />}
              {aadharPreview && (
                <>
                  <p>Preview:</p>
                  <img src={aadharPreview} style={{ maxWidth: '250px' }} />
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
    </Box>
  );
};
