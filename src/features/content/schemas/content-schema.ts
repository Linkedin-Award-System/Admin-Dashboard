import { z } from 'zod';

// Helper function to validate image URLs
const isValidImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && (response.headers.get('content-type')?.startsWith('image/') ?? false);
  } catch {
    return false;
  }
};

// Helper function to validate HTML structure
const isValidHtml = (html: string): boolean => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const parserErrors = doc.querySelector('parsererror');
    return !parserErrors;
  } catch {
    return false;
  }
};

export const contentSchema = z.object({
  hero: z.object({
    heading: z.string().min(1, 'Hero heading is required').max(200, 'Hero heading must be at most 200 characters'),
    subheading: z.string().min(1, 'Hero subheading is required').max(500, 'Hero subheading must be at most 500 characters'),
    imageUrl: z.string().url('Must be a valid URL').min(1, 'Hero image URL is required'),
  }),
  about: z.object({
    text: z.string().min(1, 'About text is required').refine(
      (val) => isValidHtml(val),
      'About text contains invalid HTML'
    ),
  }),
  categories: z.object({
    heading: z.string().min(1, 'Categories heading is required').max(200, 'Categories heading must be at most 200 characters'),
    description: z.string().min(1, 'Categories description is required').max(1000, 'Categories description must be at most 1000 characters'),
  }),
});

export type ContentSchemaType = z.infer<typeof contentSchema>;

// Async validation for image URLs (to be used separately)
export const validateImageUrls = async (data: ContentSchemaType): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];
  
  const isHeroImageValid = await isValidImageUrl(data.hero.imageUrl);
  if (!isHeroImageValid) {
    errors.push('Hero image URL is broken or not accessible');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};
