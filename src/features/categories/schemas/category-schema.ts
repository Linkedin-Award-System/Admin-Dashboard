import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be at most 500 characters'),
});

export type CategorySchemaType = z.infer<typeof categorySchema>;
