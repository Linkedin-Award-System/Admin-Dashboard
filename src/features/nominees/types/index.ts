export interface Nominee {
  id: string;
  fullName: string;
  linkedInProfileUrl: string;
  shortBiography: string;
  organization?: string;
  profileImageUrl?: string;
  categories: Array<{ id: string; name: string }>;
  voteCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface NomineeFormData {
  fullName: string;
  linkedInProfileUrl: string;
  shortBiography: string;
  organization?: string;
  profileImageUrl?: string;
  categoryIds: string[];
}
