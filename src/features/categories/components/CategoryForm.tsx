import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type CategorySchemaType } from '../schemas/category-schema';
import { useCreateCategory, useUpdateCategory } from '../hooks/use-categories';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/design-system/components/Input/Input';
import type { Category } from '../types';

interface CategoryFormProps {
  category?: Category;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CategoryForm = ({ category, onSuccess, onCancel }: CategoryFormProps) => {
  const isEditMode = !!category;
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CategorySchemaType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
    },
  });

  // Reset form when category changes
  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description,
      });
    }
  }, [category, reset]);

  const onSubmit = async (data: CategorySchemaType) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: category.id,
          data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess?.();
    } catch (error) {
      // Error handling is done by React Query
      console.error('Form submission error:', error);
    }
  };

  const mutation = isEditMode ? updateMutation : createMutation;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="name"
        label="Name"
        {...register('name')}
        placeholder="Enter category name"
        error={errors.name?.message}
        aria-invalid={errors.name ? 'true' : 'false'}
      />

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          placeholder="Enter category description"
          className="flex min-h-[80px] w-full rounded-lg border px-3 py-3 text-sm bg-white transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:border-2 focus:border-primary-600 focus:ring-0 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300"
          aria-invalid={errors.description ? 'true' : 'false'}
        />
        {errors.description && (
          <p className="mt-1.5 text-xs text-red-500" role="alert">
            {errors.description.message}
          </p>
        )}
      </div>

      {mutation.error && (
        <div className="rounded-md bg-red-50 p-3 border border-red-200">
          <p className="text-sm text-red-800">
            {mutation.error instanceof Error
              ? mutation.error.message
              : 'An error occurred. Please try again.'}
          </p>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} style={{ backgroundColor: '#ffffff', color: '#085299', border: '2px solid #085299' }} className="hover:bg-primary-50 transition-all duration-200">
            Cancel
          </Button>
        )}
        <Button type="submit" loading={isSubmitting || mutation.isPending} style={{ backgroundColor: '#085299', color: '#ffffff' }}>
          {isEditMode ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
};
