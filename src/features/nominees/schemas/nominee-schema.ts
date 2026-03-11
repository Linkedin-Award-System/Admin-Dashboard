import { z } from 'zod';

export const nomineeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  linkedInUrl: z
    .string()
    .min(1, 'LinkedIn URL is required')
    .url('Must be a valid URL')
    .refine((url) => url.includes('linkedin.com'), {
      message: 'Must be a valid LinkedIn URL (must contain linkedin.com)',
    }),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be at most 1000 characters'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  categoryIds: z.array(z.string()).min(1, 'At least one category must be selected'),
});

export type NomineeSchemaType = z.infer<typeof nomineeSchema>;
