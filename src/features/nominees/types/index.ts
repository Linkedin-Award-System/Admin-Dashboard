export interface Nominee {
  id: string;
  name: string;
  linkedInUrl: string;
  description: string;
  imageUrl?: string;
  categories: string[]; // Category IDs
  voteCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface NomineeFormData {
  name: string;
  linkedInUrl: string;
  description: string;
  imageUrl?: string;
  categoryIds: string[];
}
