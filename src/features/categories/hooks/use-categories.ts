import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/category-service';
import type { CategoryFormData, Category } from '../types';
import { useToast } from '@/shared/hooks/use-toast-hook';

const CATEGORIES_QUERY_KEY = ['categories'];

export const useCategories = () => {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: categoryService.getAll,
    staleTime: 60000, // 60 seconds
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, id],
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: CategoryFormData) => categoryService.create(data),
    onMutate: async (newCategory) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: CATEGORIES_QUERY_KEY });

      // Snapshot previous value
      const previousCategories = queryClient.getQueryData(CATEGORIES_QUERY_KEY);

      // Optimistically update to the new value
      queryClient.setQueryData(CATEGORIES_QUERY_KEY, (old: Category[] | undefined) => {
        const optimisticCategory = {
          id: `temp-${Date.now()}`,
          ...newCategory,
          nomineeCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return old ? [...old, optimisticCategory] : [optimisticCategory];
      });

      return { previousCategories };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      success('Category created', 'The category has been created successfully.');
    },
    onError: (err: Error, _newCategory, context) => {
      // Rollback on error
      if (context?.previousCategories) {
        queryClient.setQueryData(CATEGORIES_QUERY_KEY, context.previousCategories);
      }
      error('Failed to create category', err.message);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) =>
      categoryService.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: CATEGORIES_QUERY_KEY });

      // Snapshot previous value
      const previousCategories = queryClient.getQueryData(CATEGORIES_QUERY_KEY);

      // Optimistically update to the new value
      queryClient.setQueryData(CATEGORIES_QUERY_KEY, (old: Category[] | undefined) => {
        if (!old) return old;
        return old.map((category: Category) =>
          category.id === id
            ? { ...category, ...data, updatedAt: new Date().toISOString() }
            : category
        );
      });

      return { previousCategories };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      success('Category updated', 'The category has been updated successfully.');
    },
    onError: (err: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousCategories) {
        queryClient.setQueryData(CATEGORIES_QUERY_KEY, context.previousCategories);
      }
      error('Failed to update category', err.message);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: CATEGORIES_QUERY_KEY });

      // Snapshot previous value
      const previousCategories = queryClient.getQueryData(CATEGORIES_QUERY_KEY);

      // Optimistically remove the category
      queryClient.setQueryData(CATEGORIES_QUERY_KEY, (old: Category[] | undefined) => {
        if (!old) return old;
        return old.filter((category: Category) => category.id !== id);
      });

      return { previousCategories };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      success('Category deleted', 'The category has been deleted successfully.');
    },
    onError: (err: Error, _id, context) => {
      // Rollback on error
      if (context?.previousCategories) {
        queryClient.setQueryData(CATEGORIES_QUERY_KEY, context.previousCategories);
      }
      error('Failed to delete category', err.message);
    },
  });
};
