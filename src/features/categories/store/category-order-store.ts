import { create } from 'zustand';

const STORAGE_KEY = 'category-order';

interface CategoryOrderState {
  order: string[];
  setOrder: (ids: string[]) => void;
  loadFromStorage: () => void;
}

export const useCategoryOrderStore = create<CategoryOrderState>((set) => ({
  order: [],

  setOrder: (ids: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // quota exceeded or other write error — update in-memory state only
    }
    set({ order: ids });
  },

  loadFromStorage: () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return;
    try {
      const parsed = JSON.parse(raw) as string[];
      set({ order: parsed });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      // leave order as empty array
    }
  },
}));
