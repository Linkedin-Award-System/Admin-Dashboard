# Content Management Feature

This feature module provides comprehensive landing page content management capabilities for the LinkedIn Awards Admin Dashboard.

## Overview

The content management module allows administrators to:
- Edit landing page content (hero, about, and categories sections)
- Upload and manage images
- Preview content before publishing
- Maintain version history
- Revert to previous versions

## Components

### ContentEditor
Rich text editor for managing landing page content with validation.

**Features:**
- Structured form for hero, about, and categories sections
- HTML support for about text
- Image URL validation (checks for broken links)
- Form validation with error display
- Integration with React Hook Form and Zod

**Usage:**
```tsx
import { ContentEditor } from '@/features/content';

<ContentEditor
  initialData={currentContent}
  onSuccess={() => console.log('Content saved')}
/>
```

### ImageManager
Image upload and management interface with drag-and-drop support.

**Features:**
- Drag-and-drop file upload
- Image URL input with validation
- Image gallery display
- Image selection for content
- Delete uploaded images

**Usage:**
```tsx
import { ImageManager } from '@/features/content';

<ImageManager
  onImageSelect={(url) => console.log('Selected:', url)}
/>
```

### ContentPreview
Preview component that renders content matching the public landing page layout.

**Features:**
- Hero section preview with heading, subheading, and image
- About section with HTML rendering
- Categories section preview
- Responsive layout

**Usage:**
```tsx
import { ContentPreview } from '@/features/content';

<ContentPreview content={formData} />
```

### VersionHistory
Display and manage content version history.

**Features:**
- List all content versions with timestamps and authors
- Current published version indicator
- Revert functionality with confirmation dialog
- Version comparison view

**Usage:**
```tsx
import { VersionHistory } from '@/features/content';

<VersionHistory
  onVersionSelect={(version) => console.log('Selected:', version)}
/>
```

## Hooks

### useCurrentContent
Fetch the current published landing page content.

```tsx
const { data: content, isLoading, error } = useCurrentContent();
```

### useVersionHistory
Fetch all content versions.

```tsx
const { data: versions, isLoading, error } = useVersionHistory();
```

### useUpdateContent
Update landing page content (creates a new version).

```tsx
const updateContent = useUpdateContent();
await updateContent.mutateAsync(contentData);
```

### usePublishContent
Publish a specific content version.

```tsx
const publishContent = usePublishContent();
await publishContent.mutateAsync(versionId);
```

### useRevertContent
Revert to a previous content version.

```tsx
const revertContent = useRevertContent();
await revertContent.mutateAsync(versionId);
```

## Services

### contentService
Low-level API service for content operations.

**Methods:**
- `getCurrent()`: Get current published content
- `getVersionHistory()`: Get all versions
- `update(content)`: Create new version
- `publish(versionId)`: Publish a version
- `revert(versionId)`: Revert to a version

## Types

### LandingContent
```typescript
interface LandingContent {
  id: string;
  version: number;
  content: {
    hero: {
      heading: string;
      subheading: string;
      imageUrl: string;
    };
    about: {
      text: string;
    };
    categories: {
      heading: string;
      description: string;
    };
  };
  isPublished: boolean;
  createdAt: string;
  createdBy: string;
}
```

### ContentFormData
```typescript
interface ContentFormData {
  hero: {
    heading: string;
    subheading: string;
    imageUrl: string;
  };
  about: {
    text: string;
  };
  categories: {
    heading: string;
    description: string;
  };
}
```

## Validation

The module includes comprehensive validation:

### Form Validation (Zod Schema)
- Hero heading: Required, max 200 characters
- Hero subheading: Required, max 500 characters
- Hero image URL: Required, valid URL format
- About text: Required, valid HTML
- Categories heading: Required, max 200 characters
- Categories description: Required, max 1000 characters

### Image URL Validation
- Checks if URL is accessible
- Verifies content type is an image
- Prevents publishing with broken links

### HTML Validation
- Validates HTML structure using DOMParser
- Prevents invalid HTML from being published

## API Endpoints

The module expects the following API endpoints:

- `GET /content/current` - Get current published content
- `GET /content/versions` - Get version history
- `POST /content` - Create new content version
- `POST /content/:versionId/publish` - Publish a version
- `POST /content/:versionId/revert` - Revert to a version

## Requirements Validation

This module validates the following requirements:

- **Requirement 6.1**: Content format validation before publishing
- **Requirement 6.2**: Persist changes and update public landing page
- **Requirement 6.3**: Preview before publishing
- **Requirement 6.4**: Support editing text content (headings, paragraphs, lists)
- **Requirement 6.5**: Support uploading and managing images
- **Requirement 6.6**: Maintain version history
- **Requirement 6.7**: Support reverting to previous versions
- **Requirement 6.8**: Prevent publishing with broken image links or invalid HTML

## Example Page Integration

```tsx
import { useState } from 'react';
import {
  ContentEditor,
  ImageManager,
  ContentPreview,
  VersionHistory,
  useCurrentContent,
} from '@/features/content';

export const ContentManagementPage = () => {
  const { data: currentContent } = useCurrentContent();
  const [previewData, setPreviewData] = useState(null);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Landing Page Content</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ContentEditor
            initialData={currentContent?.content}
            onSuccess={() => console.log('Saved')}
          />
          <ImageManager />
        </div>
        
        <div className="space-y-6">
          {previewData && <ContentPreview content={previewData} />}
          <VersionHistory />
        </div>
      </div>
    </div>
  );
};
```
