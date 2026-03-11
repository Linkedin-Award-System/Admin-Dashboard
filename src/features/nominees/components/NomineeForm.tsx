import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nomineeSchema, type NomineeSchemaType } from '../schemas/nominee-schema';
import { useCreateNominee, useUpdateNominee } from '../hooks/use-nominees';
import { useCategories } from '@/features/categories/hooks/use-categories';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import type { Nominee } from '../types';

interface NomineeFormProps {
  nominee?: Nominee;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const NomineeForm = ({ nominee, onSuccess, onCancel }: NomineeFormProps) => {
  const isEditMode = !!nominee;
  const createMutation = useCreateNominee();
  const updateMutation = useUpdateNominee();
  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<NomineeSchemaType>({
    resolver: zodResolver(nomineeSchema),
    defaultValues: {
      name: nominee?.name || '',
      linkedInUrl: nominee?.linkedInUrl || '',
      description: nominee?.description || '',
      imageUrl: nominee?.imageUrl || '',
      categoryIds: nominee?.categories || [],
    },
  });

  const selectedCategories = watch('categoryIds');

  // Reset form when nominee changes
  useEffect(() => {
    if (nominee) {
      reset({
        name: nominee.name,
        linkedInUrl: nominee.linkedInUrl,
        description: nominee.description,
        imageUrl: nominee.imageUrl || '',
        categoryIds: nominee.categories,
      });
    }
  }, [nominee, reset]);

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = selectedCategories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];
    setValue('categoryIds', newCategories, { shouldValidate: true });
  };

  const onSubmit = async (data: NomineeSchemaType) => {
    try {
      // Clean up empty imageUrl
      const submitData = {
        ...data,
        imageUrl: data.imageUrl || undefined,
      };

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: nominee.id,
          data: submitData,
        });
      } else {
        await createMutation.mutateAsync(submitData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const mutation = isEditMode ? updateMutation : createMutation;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Enter nominee name"
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && (
          <p className="text-sm text-red-600" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedInUrl">LinkedIn URL</Label>
        <Input
          id="linkedInUrl"
          {...register('linkedInUrl')}
          placeholder="https://linkedin.com/in/username"
          aria-invalid={errors.linkedInUrl ? 'true' : 'false'}
        />
        {errors.linkedInUrl && (
          <p className="text-sm text-red-600" role="alert">
            {errors.linkedInUrl.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          {...register('description')}
          placeholder="Enter nominee description"
          className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          aria-invalid={errors.description ? 'true' : 'false'}
        />
        {errors.description && (
          <p className="text-sm text-red-600" role="alert">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL (Optional)</Label>
        <Input
          id="imageUrl"
          {...register('imageUrl')}
          placeholder="https://example.com/image.jpg"
          aria-invalid={errors.imageUrl ? 'true' : 'false'}
        />
        {errors.imageUrl && (
          <p className="text-sm text-red-600" role="alert">
            {errors.imageUrl.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Categories (Select at least one)</Label>
        <div className="border border-gray-300 rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
          {categories?.map((category) => (
            <label
              key={category.id}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="checkbox"
                checked={selectedCategories?.includes(category.id) || false}
                onChange={() => handleCategoryToggle(category.id)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
        {errors.categoryIds && (
          <p className="text-sm text-red-600" role="alert">
            {errors.categoryIds.message}
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || mutation.isPending}>
          {isSubmitting || mutation.isPending
            ? isEditMode
              ? 'Updating...'
              : 'Creating...'
            : isEditMode
            ? 'Update Nominee'
            : 'Create Nominee'}
        </Button>
      </div>
    </form>
  );
};
