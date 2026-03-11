import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { contentSchema, validateImageUrls, type ContentSchemaType } from '../schemas/content-schema';
import { useUpdateContent } from '../hooks/use-content';
import { useState } from 'react';

interface ContentEditorProps {
  initialData?: ContentSchemaType;
  onSuccess?: () => void;
}

export const ContentEditor = ({ initialData, onSuccess }: ContentEditorProps) => {
  const [imageValidationErrors, setImageValidationErrors] = useState<string[]>([]);
  const [isValidatingImages, setIsValidatingImages] = useState(false);
  const updateContent = useUpdateContent();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContentSchemaType>({
    resolver: zodResolver(contentSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: ContentSchemaType) => {
    // Validate image URLs
    setIsValidatingImages(true);
    setImageValidationErrors([]);
    
    const imageValidation = await validateImageUrls(data);
    setIsValidatingImages(false);
    
    if (!imageValidation.valid) {
      setImageValidationErrors(imageValidation.errors);
      return;
    }

    try {
      await updateContent.mutateAsync(data);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to update content:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero-heading">Heading</Label>
            <Input
              id="hero-heading"
              {...register('hero.heading')}
              placeholder="Enter hero heading"
            />
            {errors.hero?.heading && (
              <p className="text-sm text-red-600">{errors.hero.heading.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-subheading">Subheading</Label>
            <Input
              id="hero-subheading"
              {...register('hero.subheading')}
              placeholder="Enter hero subheading"
            />
            {errors.hero?.subheading && (
              <p className="text-sm text-red-600">{errors.hero.subheading.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-image">Image URL</Label>
            <Input
              id="hero-image"
              {...register('hero.imageUrl')}
              placeholder="https://example.com/image.jpg"
            />
            {errors.hero?.imageUrl && (
              <p className="text-sm text-red-600">{errors.hero.imageUrl.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>About Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="about-text">Text (HTML supported)</Label>
            <textarea
              id="about-text"
              {...register('about.text')}
              placeholder="Enter about text with HTML formatting"
              className="w-full min-h-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.about?.text && (
              <p className="text-sm text-red-600">{errors.about.text.message}</p>
            )}
            <p className="text-sm text-gray-500">
              You can use HTML tags like &lt;h1&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Categories Section */}
      <Card>
        <CardHeader>
          <CardTitle>Categories Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categories-heading">Heading</Label>
            <Input
              id="categories-heading"
              {...register('categories.heading')}
              placeholder="Enter categories heading"
            />
            {errors.categories?.heading && (
              <p className="text-sm text-red-600">{errors.categories.heading.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categories-description">Description</Label>
            <textarea
              id="categories-description"
              {...register('categories.description')}
              placeholder="Enter categories description"
              className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.categories?.description && (
              <p className="text-sm text-red-600">{errors.categories.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Validation Errors */}
      {imageValidationErrors.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="font-semibold text-red-800 mb-2">Image Validation Errors:</p>
          <ul className="list-disc list-inside space-y-1">
            {imageValidationErrors.map((error, index) => (
              <li key={index} className="text-sm text-red-600">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          loading={updateContent.isPending || isValidatingImages}
        >
          {isValidatingImages ? 'Validating...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
