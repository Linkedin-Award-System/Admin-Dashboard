export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  nomineeCount: number;
}

export interface CategoryFormData {
  name: string;
  description: string;
}
