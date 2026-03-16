import { useDeleteNominee } from '../hooks/use-nominees';
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
import type { Nominee } from '../types';

interface DeleteNomineeDialogProps {
  nominee: Nominee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const DeleteNomineeDialog = ({
  nominee,
  open,
  onOpenChange,
  onSuccess,
}: DeleteNomineeDialogProps) => {
  const deleteMutation = useDeleteNominee();

  const handleDelete = async () => {
    if (!nominee) return;

    try {
      await deleteMutation.mutateAsync(nominee.id);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (!nominee) return null;

  const hasVotes = nominee.voteCount > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {hasVotes ? 'Cannot Delete Nominee' : 'Delete Nominee'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {hasVotes ? (
              <>
                This nominee cannot be deleted because they have received{' '}
                <strong>{nominee.voteCount}</strong>{' '}
                {nominee.voteCount === 1 ? 'vote' : 'votes'}.
                Nominees with existing votes cannot be removed to maintain voting integrity.
              </>
            ) : (
              <>
                Are you sure you want to delete the nominee{' '}
                <strong>"{nominee.fullName}"</strong>? This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteMutation.error && (
          <div className="rounded-md bg-red-50 p-3 border border-red-200">
            <p className="text-sm text-red-800">
              {deleteMutation.error instanceof Error
                ? deleteMutation.error.message
                : 'An error occurred while deleting the nominee.'}
            </p>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            {hasVotes ? 'Close' : 'Cancel'}
          </AlertDialogCancel>
          {!hasVotes && (
            <AlertDialogAction
              onClick={handleDelete}
              loading={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
