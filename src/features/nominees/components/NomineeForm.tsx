import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nomineeSchema, type NomineeSchemaType } from '../schemas/nominee-schema';
import { useCreateNominee, useUpdateNominee } from '../hooks/use-nominees';
import { useCategories } from '@/features/categories/hooks/use-categories';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/design-system/components/Input/Input';
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
      fullName: nominee?.fullName || '',
      linkedInProfileUrl: nominee?.linkedInProfileUrl || '',
      organization: nominee?.organization || '',
      shortBiography: nominee?.shortBiography || '',
      profileImageUrl: nominee?.profileImageUrl || '',
      categoryIds: nominee?.categories?.map(c => c.id) || [],
    },
  });

  const selectedCategories = watch('categoryIds');

  // Reset form when nominee changes
  useEffect(() => {
    if (nominee) {
      reset({
        fullName: nominee.fullName,
        linkedInProfileUrl: nominee.linkedInProfileUrl,
        organization: nominee.organization,
        shortBiography: nominee.shortBiography,
        profileImageUrl: nominee.profileImageUrl || '',
        categoryIds: nominee.categories?.map(c => c.id) || [],
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
      // Clean up empty profileImageUrl
      const submitData = {
        ...data,
        profileImageUrl: data.profileImageUrl || undefined,
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
      <Input
        id="fullName"
        label="Full Name"
        {...register('fullName')}
        placeholder="Enter nominee full name"
        error={errors.fullName?.message}
        aria-invalid={errors.fullName ? 'true' : 'false'}
      />

      <Input
        id="linkedInProfileUrl"
        label="LinkedIn Profile URL"
        {...register('linkedInProfileUrl')}
        placeholder="https://linkedin.com/in/username"
        error={errors.linkedInProfileUrl?.message}
        aria-invalid={errors.linkedInProfileUrl ? 'true' : 'false'}
      />

      <Input
        id="organization"
        label="Organization"
        {...register('organization')}
        placeholder="Enter organization name"
        error={errors.organization?.message}
        aria-invalid={errors.organization ? 'true' : 'false'}
      />

      <div className="space-y-2">
        <label
          htmlFor="shortBiography"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Short Biography
        </label>
        <textarea
          id="shortBiography"
          {...register('shortBiography')}
          placeholder="Enter nominee biography"
          className="flex min-h-[100px] w-full rounded-lg border px-3 py-3 text-sm bg-white transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:border-2 focus:border-primary-600 focus:ring-0 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300"
          aria-invalid={errors.shortBiography ? 'true' : 'false'}
        />
        {errors.shortBiography && (
          <p className="mt-1.5 text-xs text-red-500" role="alert">
            {errors.shortBiography.message}
          </p>
        )}
      </div>

      <Input
        id="profileImageUrl"
        label="Profile Image URL (Optional)"
        {...register('profileImageUrl')}
        placeholder="https://example.com/image.jpg"
        error={errors.profileImageUrl?.message}
        aria-invalid={errors.profileImageUrl ? 'true' : 'false'}
      />

      <div className="space-y-2">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Categories (Select at least one)
        </label>
        <div className="border border-gray-300 rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
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
          <p className="mt-1.5 text-xs text-red-500" role="alert">
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
          <Button type="button" variant="outline" onClick={onCancel} style={{ backgroundColor: '#ffffff', color: '#085299', border: '2px solid #085299' }} className="hover:bg-primary-50 transition-all duration-200">
            Cancel
          </Button>
        )}
        <Button type="submit" loading={isSubmitting || mutation.isPending} style={{ backgroundColor: '#085299', color: '#ffffff' }}>
          {isEditMode ? 'Update Nominee' : 'Create Nominee'}
        </Button>
      </div>
    </form>
  );
};
