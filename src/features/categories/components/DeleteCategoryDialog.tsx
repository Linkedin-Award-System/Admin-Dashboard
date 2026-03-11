import { useDeleteCategory } from '../hooks/use-categories';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import type { Category } from '../types';

interface DeleteCategoryDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const DeleteCategoryDialog = ({
  category,
  open,
  onOpenChange,
  onSuccess,
}: DeleteCategoryDialogProps) => {
  const deleteMutation = useDeleteCategory();

  const handleDelete = async () => {
    if (!category) return;

    try {
      await deleteMutation.mutateAsync(category.id);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      // Error is handled by React Query and displayed in the dialog
      console.error('Delete error:', error);
    }
  };

  if (!category) return null;

  const hasNominees = category.nomineeCount > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {hasNominees ? 'Cannot Delete Category' : 'Delete Category'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {hasNominees ? (
              <>
                This category cannot be deleted because it has{' '}
                <strong>{category.nomineeCount}</strong>{' '}
                {category.nomineeCount === 1 ? 'nominee' : 'nominees'} associated with it.
                Please remove all nominees from this category before deleting it.
              </>
            ) : (
              <>
                Are you sure you want to delete the category{' '}
                <strong>"{category.name}"</strong>? This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteMutation.error && (
          <div className="rounded-md bg-red-50 p-3 border border-red-200">
            <p className="text-sm text-red-800">
              {deleteMutation.error instanceof Error
                ? deleteMutation.error.message
                : 'An error occurred while deleting the category.'}
            </p>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            {hasNominees ? 'Close' : 'Cancel'}
          </AlertDialogCancel>
          {!hasNominees && (
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
