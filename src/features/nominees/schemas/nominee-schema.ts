import { z } from 'zod';

export const nomineeSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Full name must be at most 100 characters'),
  linkedInProfileUrl: z
    .string()
    .min(1, 'LinkedIn URL is required')
    .url('Must be a valid URL')
    .refine((url) => url.includes('linkedin.com'), {
      message: 'Must be a valid LinkedIn URL (must contain linkedin.com)',
    }),
  organization: z
    .string()
    .max(200, 'Organization must be at most 200 characters')
    .optional()
    .or(z.literal('')),
  shortBiography: z
    .string()
    .min(1, 'Biography is required')
    .max(1000, 'Biography must be at most 1000 characters'),
  profileImageUrl: z.string().optional().or(z.literal('')),
  categoryIds: z.array(z.string()).min(1, 'At least one category must be selected'),
});

export type NomineeSchemaType = z.infer<typeof nomineeSchema>;
