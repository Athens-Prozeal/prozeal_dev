import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Grid, TextField } from '@mui/material';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';

import { config } from '@/config';
import { PopUp } from '@/components/core/alert';

const workerSchema = z.object({
  inductionDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  name: z.string().max(255, 'Topic must be at most 255 characters'),
  fatherName: z.string().max(255, 'Topic must be at most 255 characters'),
  // gender
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }), // validate worker age
  // blood group
  designation: z.string().max(255, 'Designation must be at most 255 characters'),
  // mobile number
  // emergency_contact_number
  identityMarks: z.string(),
  address: z.string(),
  city: z.string().max(255, 'City must be at most 255 characters'),
  state: z.string().max(255, 'State must be at most 255 characters'),
  // Country
  pincode: z.string().max(15, 'Pincode must be at most 15 characters'),
  medicalFitness: z.instanceof(File).refine((file) => file instanceof File, {
    message: 'Invalid file format',
  }),
  aadhar: z.instanceof(File).refine((file) => file instanceof File, {
    message: 'Invalid file format',
  }),
});


type workerSchemaType = z.infer<typeof workerSchema>



