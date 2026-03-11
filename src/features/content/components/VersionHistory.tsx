import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
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
import { useVersionHistory, useRevertContent } from '../hooks/use-content';
import type { LandingContent } from '../types';

interface VersionHistoryProps {
  onVersionSelect?: (version: LandingContent) => void;
}

export const VersionHistory = ({ onVersionSelect }: VersionHistoryProps) => {
  const { data: versions, isLoading, error } = useVersionHistory();
  const revertContent = useRevertContent();
  const [revertDialogOpen, setRevertDialogOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<LandingContent | null>(null);

  const handleRevertClick = (version: LandingContent) => {
    setSelectedVersion(version);
    setRevertDialogOpen(true);
  };

  const handleRevertConfirm = async () => {
    if (!selectedVersion) return;

    try {
      await revertContent.mutateAsync(selectedVersion.id);
      setRevertDialogOpen(false);
      setSelectedVersion(null);
    } catch (error) {
      console.error('Failed to revert content:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Loading version history...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-600">Failed to load version history</p>
        </CardContent>
      </Card>
    );
  }

  if (!versions || versions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">No version history available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {versions.map((version) => (
              <div
                key={version.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">
                        Version {version.version}
                      </span>
                      {version.isPublished && (
                        <Badge variant="default">Published</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Created by: {version.createdBy}</p>
                      <p>Date: {formatDate(version.createdAt)}</p>
                    </div>
                    <div className="mt-3 text-sm text-gray-700">
                      <p className="font-medium">Content Summary:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Hero: {version.content.hero.heading}</li>
                        <li>Categories: {version.content.categories.heading}</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onVersionSelect?.(version)}
                    >
                      View
                    </Button>
                    {!version.isPublished && (
                      <Button
                        size="sm"
                        onClick={() => handleRevertClick(version)}
                        loading={revertContent.isPending}
                      >
                        Revert
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revert Confirmation Dialog */}
      <AlertDialog open={revertDialogOpen} onOpenChange={setRevertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revert to Previous Version?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revert to version {selectedVersion?.version}?
              This will replace the current published content with this version.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRevertDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevertConfirm}
              loading={revertContent.isPending}
            >
              Revert
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
