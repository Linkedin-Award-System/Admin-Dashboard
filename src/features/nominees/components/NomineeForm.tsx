import { useEffect, useRef, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nomineeSchema, type NomineeSchemaType } from '../schemas/nominee-schema';
import { useCreateNominee, useUpdateNominee } from '../hooks/use-nominees';
import { useCategories } from '@/features/categories/hooks/use-categories';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/design-system/components/Input/Input';
import { uploadService } from '@/features/uploads/services/upload-service';
import type { Nominee } from '../types';
import { Upload, X, User } from 'lucide-react';

const RAILWAY_BASE = 'https://linkedin-creative-awards-api-production.up.railway.app';
function resolveImageUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('blob:')) return url;
  // Rewrite absolute Railway URLs to relative so the proxy handles them
  if (url.startsWith(RAILWAY_BASE)) return url.slice(RAILWAY_BASE.length);
  if (url.startsWith('/')) return url;
  return `/uploads/${url}`;
}

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

  // Store the pending file — upload happens at submit time, not on select
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(resolveImageUrl(nominee?.profileImageUrl));
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string>('');
  const [uploadFailed, setUploadFailed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (nominee) {
      reset({
        fullName: nominee.fullName,
        linkedInProfileUrl: nominee.linkedInProfileUrl,
        organization: nominee.organization || '',
        shortBiography: nominee.shortBiography,
        profileImageUrl: nominee.profileImageUrl || '',
        categoryIds: nominee.categories?.map(c => c.id) || [],
      });
      setImagePreview(resolveImageUrl(nominee.profileImageUrl));
      setPendingFile(null);
      setImageError('');
    }
  }, [nominee, reset]);

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = selectedCategories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];
    setValue('categoryIds', newCategories, { shouldValidate: true });
  };

  const processFile = useCallback((file: File) => {
    setImageError('');
    setUploadFailed(false);
    const validation = uploadService.validateImage(file);
    if (!validation.valid) {
      setImageError(validation.error || 'Invalid file');
      return;
    }
    // Show local preview immediately — actual upload deferred to submit
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    setPendingFile(file);
    // Use a non-empty placeholder so Zod doesn't reject the field
    setValue('profileImageUrl', 'pending-upload');
  }, [setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setPendingFile(null);
    setValue('profileImageUrl', '');
    setImageError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (data: NomineeSchemaType) => {
    try {
      let finalImageUrl = data.profileImageUrl === 'pending-upload'
        ? (nominee?.profileImageUrl || '')
        : (data.profileImageUrl || '');

      // Upload the pending file now at submit time
      if (pendingFile) {
        try {
          setImageUploading(true);
          setUploadFailed(false);
          const result = await uploadService.uploadImage(pendingFile, 'NOMINEE_PROFILE');
          finalImageUrl = result.url;
        } catch {
          // Upload failed — preserve the existing image URL if there was one
          finalImageUrl = nominee?.profileImageUrl || '';
          setUploadFailed(true);
          setImageError(
            'Profile image upload failed (server error 500). ' +
            (finalImageUrl
              ? 'The previous image has been kept.'
              : 'The nominee will be saved without a profile image. You can try uploading the image again later.')
          );
          setImageUploading(false);
          // Don't block saving — just warn and continue with old/no image
        } finally {
          setImageUploading(false);
        }
      }

      const submitData: import('../types').NomineeFormData = {
        fullName: data.fullName,
        linkedInProfileUrl: data.linkedInProfileUrl,
        shortBiography: data.shortBiography,
        organization: data.organization || undefined,
        profileImageUrl: finalImageUrl || undefined,
        categoryIds: data.categoryIds,
      };

      if (isEditMode) {
        await updateMutation.mutateAsync({ id: nominee.id, data: submitData });
      } else {
        await createMutation.mutateAsync(submitData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const mutation = isEditMode ? updateMutation : createMutation;
  const isLoading = isSubmitting || mutation.isPending || imageUploading;

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

      <div className="space-y-2">
        <label htmlFor="shortBiography" className="block mb-2 text-sm font-medium text-gray-900">
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
          <p className="mt-1.5 text-xs text-red-500" role="alert">{errors.shortBiography.message}</p>
        )}
      </div>

      {/* Profile Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">
          Profile Image <span className="text-gray-400 font-normal">(Optional)</span>
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="hidden"
          id="profileImageFile"
        />

        {imagePreview ? (
          <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <img
              src={imagePreview}
              alt="Profile preview"
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600 truncate">
                {imageUploading ? 'Uploading...' : pendingFile ? pendingFile.name : 'Image selected'}
              </p>
              {imageUploading && (
                <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full animate-pulse w-2/3" />
                </div>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                disabled={imageUploading}
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-gray-400 hover:text-red-500 transition-colors"
                disabled={imageUploading}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all text-gray-500 hover:text-blue-600"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <User size={20} className="text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium flex items-center gap-1.5">
                <Upload size={14} /> Upload profile image
              </p>
              <p className="text-xs text-gray-400 mt-0.5">JPEG, PNG, GIF or WebP · Max 5MB</p>
            </div>
          </button>
        )}

        {imageError && (
          <div className={`flex items-start gap-2 p-3 rounded-lg text-xs ${uploadFailed ? 'bg-amber-50 border border-amber-200 text-amber-800' : 'bg-red-50 border border-red-200 text-red-700'}`} role="alert">
            <span className="shrink-0 mt-0.5">{uploadFailed ? '⚠️' : '❌'}</span>
            <span>{imageError}</span>
          </div>
        )}
      </div>

      {/* Categories */}
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
          <p className="mt-1.5 text-xs text-red-500" role="alert">{errors.categoryIds.message}</p>
        )}
      </div>

      {mutation.error && (
        <div className="rounded-md bg-red-50 p-3 border border-red-200">
          <p className="text-sm text-red-800">
            {mutation.error instanceof Error ? mutation.error.message : 'An error occurred. Please try again.'}
          </p>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            style={{ backgroundColor: '#ffffff', color: '#085299', border: '2px solid #085299' }}
            className="hover:bg-primary-50 transition-all duration-200"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          style={{ backgroundColor: '#085299', color: '#ffffff' }}
        >
          {isLoading
            ? (isEditMode ? 'Updating...' : 'Creating...')
            : (isEditMode ? 'Update Nominee' : 'Create Nominee')
          }
        </Button>
      </div>
    </form>
  );
};
