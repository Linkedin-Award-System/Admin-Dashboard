import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { uploadService } from '@/features/uploads/services/upload-service';

interface ImageManagerProps {
  onImageSelect?: (imageUrl: string) => void;
}

interface UploadedImage {
  id: string;
  url: string;
  name: string;
  uploadedAt: string;
}

export const ImageManager = ({ onImageSelect }: ImageManagerProps) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateImageUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('content-type');
      return response.ok && !!contentType?.startsWith('image/');
    } catch {
      return false;
    }
  };

  const handleAddImageUrl = async () => {
    setUrlError('');
    
    if (!imageUrl) {
      setUrlError('Please enter an image URL');
      return;
    }

    try {
      new URL(imageUrl);
    } catch {
      setUrlError('Please enter a valid URL');
      return;
    }

    const isValid = await validateImageUrl(imageUrl);
    if (!isValid) {
      setUrlError('URL is not accessible or does not point to an image');
      return;
    }

    const newImage: UploadedImage = {
      id: Date.now().toString(),
      url: imageUrl,
      name: imageUrl.split('/').pop() || 'image',
      uploadedAt: new Date().toISOString(),
    };

    setImages([newImage, ...images]);
    setImageUrl('');
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError('');
    
    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      setIsUploading(false);
      return;
    }

    try {
      const response = await uploadService.uploadImage(file, 'GENERAL');
      
      const newImage: UploadedImage = {
        id: Date.now().toString(),
        url: response.url,
        name: file.name,
        uploadedAt: new Date().toISOString(),
      };

      setImages((prev) => [newImage, ...prev]);
    } catch {
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  const handleSelectImage = (image: UploadedImage) => {
    onImageSelect?.(image.url);
  };

  const handleDeleteImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <p className="text-gray-600 mb-4">
              Drag and drop an image here, or click to select
            </p>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Select Image'}
            </Button>
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="image-url">Or enter image URL</Label>
            <div className="flex gap-2">
              <Input
                id="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1"
              />
              <Button type="button" onClick={handleAddImageUrl}>
                Add
              </Button>
            </div>
            {urlError && (
              <p className="text-sm text-red-600">{urlError}</p>
            )}
            {uploadError && (
              <p className="text-sm text-red-600">{uploadError}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Gallery */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative group border rounded-lg overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-32 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleSelectImage(image)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Select
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteImage(image.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Delete
                    </Button>
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-xs text-gray-600 truncate">{image.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
