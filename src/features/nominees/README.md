# Nominees Feature Module

This module provides complete nominee management functionality for the LinkedIn Awards Admin Dashboard.

## Structure

```
nominees/
├── components/
│   ├── NomineeList.tsx          # List view with category filtering
│   ├── NomineeForm.tsx          # Create/edit form with validation
│   ├── DeleteNomineeDialog.tsx  # Delete confirmation with vote check
│   └── index.ts
├── hooks/
│   └── use-nominees.ts          # React Query hooks
├── schemas/
│   └── nominee-schema.ts        # Zod validation schema
├── services/
│   └── nominee-service.ts       # API service layer
├── types/
│   └── index.ts                 # TypeScript interfaces
├── index.ts
└── README.md
```

## Features

### Data Models
- `Nominee`: Complete nominee data with categories and vote count
- `NomineeFormData`: Form submission data structure

### Service Layer
- `getAll(categoryId?)`: Fetch all nominees, optionally filtered by category
- `getById(id)`: Fetch single nominee
- `create(data)`: Create new nominee
- `update(id, data)`: Update existing nominee
- `delete(id)`: Delete nominee (only if no votes)

### React Query Hooks
- `useNominees(categoryId?)`: Query all nominees with optional category filter
- `useNominee(id)`: Query single nominee
- `useCreateNominee()`: Mutation for creating nominees
- `useUpdateNominee()`: Mutation for updating nominees
- `useDeleteNominee()`: Mutation for deleting nominees

### Components

#### NomineeList
Displays nominees grouped by category with:
- Category filter dropdown
- Nominee cards showing name, description, LinkedIn URL, image, and vote count
- Edit and delete actions
- Loading and error states

#### NomineeForm
Form for creating/editing nominees with:
- Name, LinkedIn URL, description, and image URL fields
- Multi-select category checkboxes
- Validation using React Hook Form and Zod
- LinkedIn URL format validation
- Inline error messages

#### DeleteNomineeDialog
Confirmation dialog that:
- Checks for existing votes before allowing deletion
- Shows warning if nominee has votes
- Prevents deletion of nominees with votes
- Handles errors gracefully

## Validation Rules

- Name: Required, max 100 characters
- LinkedIn URL: Required, must be valid URL containing "linkedin.com"
- Description: Required, max 1000 characters
- Image URL: Optional, must be valid URL if provided
- Categories: At least one category must be selected

## Usage Example

```tsx
import { NomineeList, NomineeForm, DeleteNomineeDialog } from '@/features/nominees';

function NomineesPage() {
  const [selectedNominee, setSelectedNominee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <NomineeList
        onEdit={(nominee) => {
          setSelectedNominee(nominee);
          setShowForm(true);
        }}
        onDelete={(nominee) => {
          setSelectedNominee(nominee);
          setShowDeleteDialog(true);
        }}
        onCreate={() => {
          setSelectedNominee(null);
          setShowForm(true);
        }}
      />
      
      {showForm && (
        <NomineeForm
          nominee={selectedNominee}
          onSuccess={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      )}
      
      <DeleteNomineeDialog
        nominee={selectedNominee}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
```

## Requirements Satisfied

- **3.1**: Add nominee with valid data to categories
- **3.2**: Edit nominee and maintain vote associations
- **3.3**: Remove nominee with no votes
- **3.4**: Prevent deletion of nominees with votes
- **3.5**: Validate required fields (name, LinkedIn URL, description)
- **3.6**: Associate nominee with multiple categories
- **3.7**: Display nominees grouped by category
- **3.8**: Display vote count for each nominee
