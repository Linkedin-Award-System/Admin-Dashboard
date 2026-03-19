import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nomineeSchema, type NomineeSchemaType } from '../schemas/nominee-schema';
import { useCreateNominee, useUpdateNominee } from '../hooks/use-nominees';
import { useCategories } from '@/features/categories/hooks/use-categories';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/design-system/components/Input/Input';
import type { Nominee } from '../types';
import { User, AlertTriangle, Upload } from 'lucide-react';
import { uploadService } from '@/features/uploads/services/upload-service';

const RAILWAY_BASE = 'https://linkedin-creative-awards-api-production.up.railway.app';

/** Resolves a stored URL to one the browser can load (Railway absolute → relative proxy path) */
function resolveImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('blob:')) return url;
  if (url.startsWith(RAILWAY_BASE)) return url.slice(RAILWAY_BASE.length);
  return url;
}

/** Returns true if the URL is a LinkedIn CDN URL that the backend cannot store */
function isLinkedInCdnUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes('licdn.com') || parsed.hostname.includes('media.linkedin.com');
  } catch {
    return false;
  }
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

  const [imgError, setImgError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isFetchingLinkedIn, setIsFetchingLinkedIn] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = uploadService.validateImage(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    try {
      const result = await uploadService.uploadImage(file, 'NOMINEE_PROFILE');
      setValue('profileImageUrl', result.url, { shouldValidate: true });
      setImgError(false);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      // Reset so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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
  const profileImageUrl = watch('profileImageUrl');

  // Reset imgError when URL changes so a new URL gets a fresh attempt
  useEffect(() => {
    setImgError(false);
  }, [profileImageUrl]);

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
      setImgError(false);
    }
  }, [nominee, reset]);

  const handleFetchAndUpload = async () => {
    const url = profileImageUrl;
    if (!url || !isLinkedInCdnUrl(url)) return;

    setUploadError(null);
    setIsFetchingLinkedIn(true);
    try {
      const proxyRes = await fetch(`/api/fetch-image?url=${encodeURIComponent(url)}`);
      if (!proxyRes.ok) {
        const err = await proxyRes.json().catch(() => ({ error: 'Failed to fetch image' }));
        throw new Error(err.error || `Fetch failed (${proxyRes.status})`);
      }
      const blob = await proxyRes.blob();
      const contentType = proxyRes.headers.get('content-type') || 'image/jpeg';
      const ext = contentType.split('/')[1]?.split(';')[0] || 'jpg';
      const file = new File([blob], `linkedin-profile.${ext}`, { type: contentType });
      const result = await uploadService.uploadImage(file, 'NOMINEE_PROFILE');
      setValue('profileImageUrl', result.url, { shouldValidate: true });
      setImgError(false);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to fetch and upload image');
    } finally {
      setIsFetchingLinkedIn(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = selectedCategories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];
    setValue('categoryIds', newCategories, { shouldValidate: true });
  };

  const onSubmit = async (data: NomineeSchemaType) => {
    try {
      const submitData: import('../types').NomineeFormData = {
        fullName: data.fullName,
        linkedInProfileUrl: data.linkedInProfileUrl,
        shortBiography: data.shortBiography,
        organization: data.organization || undefined,
        // Don't send LinkedIn CDN URLs — they expire and the backend rejects them
        profileImageUrl: (data.profileImageUrl && !isLinkedInCdnUrl(data.profileImageUrl))
          ? data.profileImageUrl
          : undefined,
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
  const isLoading = isSubmitting || mutation.isPending;

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

      {/* Profile Image URL */}
      <div className="space-y-2">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              id="profileImageUrl"
              label="Profile Image URL (Optional)"
              {...register('profileImageUrl')}
              placeholder="https://example.com/photo.jpg"
              error={errors.profileImageUrl?.message}
              aria-invalid={errors.profileImageUrl ? 'true' : 'false'}
            />
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleFileUpload}
              aria-label="Upload profile photo"
            />
            <Button
              type="button"
              variant="outline"
              disabled={isUploading || isFetchingLinkedIn}
              onClick={() => fileInputRef.current?.click()}
              style={{ backgroundColor: '#ffffff', color: '#085299', border: '2px solid #085299' }}
              className="hover:bg-primary-50 transition-all duration-200 whitespace-nowrap"
            >
              <Upload size={14} className="mr-1.5" />
              {isUploading ? 'Uploading...' : 'Upload Photo'}
            </Button>
          </div>
        </div>

        {uploadError && (
          <p className="text-xs text-red-500" role="alert">{uploadError}</p>
        )}

        {profileImageUrl && isLinkedInCdnUrl(profileImageUrl) && (
          <div className="flex items-start gap-2 p-3 border border-amber-200 rounded-lg bg-amber-50">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-amber-800">
                LinkedIn CDN URLs expire and cannot be saved directly. Click "Fetch &amp; Upload" to convert this image to a permanent URL.
              </p>
              <Button
                type="button"
                variant="outline"
                disabled={isFetchingLinkedIn || isUploading}
                onClick={handleFetchAndUpload}
                style={{ backgroundColor: '#ffffff', color: '#085299', border: '2px solid #085299' }}
                className="mt-2 hover:bg-primary-50 transition-all duration-200 text-xs"
              >
                <Upload size={12} className="mr-1.5" />
                {isFetchingLinkedIn ? 'Fetching...' : 'Fetch & Upload'}
              </Button>
            </div>
          </div>
        )}

        {profileImageUrl && !isLinkedInCdnUrl(profileImageUrl) && (
          <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
            {!imgError ? (
              <img
                src={resolveImageUrl(profileImageUrl)}
                alt="Profile preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shrink-0"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center shrink-0">
                <User size={24} className="text-gray-400" />
              </div>
            )}
            <p className="text-xs text-gray-500 truncate flex-1">
              {imgError ? 'Image could not be loaded' : 'Preview'}
            </p>
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
