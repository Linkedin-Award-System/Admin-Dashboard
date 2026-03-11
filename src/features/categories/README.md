# Category Management Module

This module provides complete CRUD functionality for managing award categories in the LinkedIn Awards Admin Dashboard.

## Features

- **List Categories**: Display all categories with search/filter functionality and alphabetical sorting
- **Create Category**: Add new categories with validation
- **Edit Category**: Update existing category information
- **Delete Category**: Remove categories (with nominee count validation)
- **Real-time Updates**: React Query integration with optimistic updates
- **Error Handling**: Comprehensive error states and user feedback

## Structure

```
categories/
├── components/
│   ├── CategoryList.tsx       # List view with search and actions
│   ├── CategoryForm.tsx        # Create/edit form with validation
│   └── DeleteCategoryDialog.tsx # Delete confirmation with constraints
├── hooks/
│   └── use-categories.ts       # React Query hooks
├── schemas/
│   └── category-schema.ts      # Zod validation schema
├── services/
│   └── category-service.ts     # API service layer
├── types/
│   └── index.ts                # TypeScript interfaces
├── index.ts                    # Public exports
└── README.md                   # This file
```

## Usage

### Basic Implementation

```tsx
import { CategoriesPage } from '@/pages/CategoriesPage';

// Use the complete page component
<CategoriesPage />
```

### Using Individual Components

```tsx
import { 
  CategoryList, 
  CategoryForm, 
  DeleteCategoryDialog 
} from '@/features/categories';

// List categories
<CategoryList 
  onCreate={() => {}}
  onEdit={(category) => {}}
  onDelete={(category) => {}}
/>

// Create/edit form
<CategoryForm 
  category={editingCategory}
  onSuccess={() => {}}
  onCancel={() => {}}
/>

// Delete dialog
<DeleteCategoryDialog
  category={deletingCategory}
  open={isOpen}
  onOpenChange={setIsOpen}
  onSuccess={() => {}}
/>
```

### Using Hooks Directly

```tsx
import { 
  useCategories, 
  useCategory,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory 
} from '@/features/categories';

// Fetch all categories
const { data: categories, isLoading, error } = useCategories();

// Fetch single category
const { data: category } = useCategory(categoryId);

// Create category
const createMutation = useCreateCategory();
await createMutation.mutateAsync({ name: 'Best Innovator', description: '...' });

// Update category
const updateMutation = useUpdateCategory();
await updateMutation.mutateAsync({ 
  id: categoryId, 
  data: { name: 'Updated Name', description: '...' } 
});

// Delete category
const deleteMutation = useDeleteCategory();
await deleteMutation.mutateAsync(categoryId);
```

## API Endpoints

- `GET /categories` - Fetch all categories
- `GET /categories/:id` - Fetch single category
- `POST /categories` - Create new category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

## Validation Rules

### Category Name
- Required
- Minimum 1 character
- Maximum 100 characters
- Must be unique (enforced by backend)

### Category Description
- Required
- Minimum 1 character
- Maximum 500 characters

## Business Rules

1. **Alphabetical Sorting**: Categories are always displayed in alphabetical order by name
2. **Nominee Count**: Each category displays the number of associated nominees
3. **Delete Constraint**: Categories with nominees cannot be deleted
4. **Search**: Categories can be filtered by name or description
5. **Optimistic Updates**: UI updates immediately with rollback on error

## React Query Configuration

- **Stale Time**: 60 seconds (categories don't change frequently)
- **Cache Time**: 5 minutes (default)
- **Refetch on Window Focus**: Enabled
- **Retry**: 3 attempts with exponential backoff

## Error Handling

The module handles various error scenarios:

- **Network Errors**: Automatic retry with exponential backoff
- **Validation Errors**: Inline form validation with Zod
- **API Errors**: User-friendly error messages
- **Delete Constraints**: Warning when category has nominees
- **Loading States**: Skeleton loaders during data fetch

## Testing

Run tests with:

```bash
npm test -- categories
```

## Requirements Validation

This module validates the following requirements:

- **Requirement 2.1**: Category creation with valid data
- **Requirement 2.2**: Category editing with identity preservation
- **Requirement 2.3**: Category deletion (when no nominees)
- **Requirement 2.4**: Delete prevention when category has nominees
- **Requirement 2.5**: Unique category name validation
- **Requirement 2.6**: Alphabetical ordering by name
- **Requirement 2.7**: Display nominee count for each category

## Related Modules

- **Nominees Module**: Categories are associated with nominees
- **Voting Module**: Vote statistics are grouped by category
- **Export Module**: Categories can be exported to CSV/PDF
