import { useState } from 'react';
import { Button } from '@/shared/design-system/components/Button';
import { Badge } from '@/shared/design-system/components/Badge';
import {
  AlertDialog,
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
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500">Loading version history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <p className="text-sm text-red-600">Failed to load version history</p>
      </div>
    );
  }

  if (!versions || versions.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500">No version history available</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {versions.map((version, index) => (
          <div
            key={version.id}
            className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-semibold text-gray-900">
                    Version {version.version}
                  </span>
                  {version.isPublished && (
                    <Badge variant="success" size="sm">Published</Badge>
                  )}
                  {index === 0 && !version.isPublished && (
                    <Badge variant="info" size="sm">Latest</Badge>
                  )}
                </div>
                <div className="text-xs text-gray-600 space-y-1 mb-3">
                  <p><span className="font-medium">Created by:</span> {version.createdBy}</p>
                  <p><span className="font-medium">Date:</span> {formatDate(version.createdAt)}</p>
                </div>
                <div className="text-xs text-gray-700">
                  <p className="font-medium mb-2">Content Summary:</p>
                  <ul className="space-y-1 pl-4">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">•</span>
                      <span>Hero: {version.content.hero.heading}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">•</span>
                      <span>Roadmap: {version.content.timeline.heading}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">•</span>
                      <span>Partners: {version.content.sponsors.logos.length}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onVersionSelect?.(version)}
                >
                  View
                </Button>
                {!version.isPublished && (
                  <Button
                    size="sm"
                    variant="primary"
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
            <Button
              variant="secondary"
              onClick={() => setRevertDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleRevertConfirm}
              loading={revertContent.isPending}
            >
              Revert
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
