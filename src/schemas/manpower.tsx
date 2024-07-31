import { z } from 'zod';

export const manpowerSchema = z.object({
  selectedDate: z.string().nonempty('Date is required'),
  numberOfWorkers: z.string().min(1, 'Number of workers must be at least 1').transform((val) => Number(val)),
  subContractor: z.number().optional(),
  verificationStatus: z.enum(['Verified', 'Revise', 'Not Verified']),
});

export type ManpowerFormData = z.infer<typeof manpowerSchema>;
