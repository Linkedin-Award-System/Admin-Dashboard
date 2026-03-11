import { useState, useMemo } from 'react';
import { useNominees } from '../hooks/use-nominees';
import { useCategories } from '@/features/categories/hooks/use-categories';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Pencil, Trash2, Plus, ExternalLink } from 'lucide-react';
import { NomineeListSkeleton } from './NomineeListSkeleton';
import type { Nominee } from '../types';

interface NomineeListProps {
  onEdit?: (nominee: Nominee) => void;
  onDelete?: (nominee: Nominee) => void;
  onCreate?: () => void;
}

export const NomineeList = ({ onEdit, onDelete, onCreate }: NomineeListProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const { data: nominees, isLoading, error } = useNominees(selectedCategoryId || undefined);
  const { data: categories } = useCategories();

  // Group nominees by category
  const groupedNominees = useMemo(() => {
    if (!nominees || !categories) return new Map();

    const grouped = new Map<string, { categoryName: string; nominees: Nominee[] }>();

    nominees.forEach((nominee) => {
      nominee.categories.forEach((categoryId) => {
        const category = categories.find((c) => c.id === categoryId);
        if (category) {
          if (!grouped.has(categoryId)) {
            grouped.set(categoryId, { categoryName: category.name, nominees: [] });
          }
          grouped.get(categoryId)!.nominees.push(nominee);
        }
      });
    });

    // Sort categories alphabetically
    return new Map([...grouped.entries()].sort((a, b) => a[1].categoryName.localeCompare(b[1].categoryName)));
  }, [nominees, categories]);

  if (isLoading) {
    return <NomineeListSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Nominees</h2>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Nominees</CardTitle>
            <CardDescription className="text-red-600">
              {error instanceof Error ? error.message : 'An error occurred while loading nominees'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold">Nominees</h2>
        {onCreate && (
          <Button onClick={onCreate} aria-label="Add new nominee" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Add Nominee
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Label htmlFor="category-filter" className="sm:whitespace-nowrap">Filter by Category:</Label>
        <select
          id="category-filter"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 flex-1 sm:flex-initial"
          aria-label="Filter nominees by category"
        >
          <option value="">All Categories</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {groupedNominees.size === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Nominees Found</CardTitle>
            <CardDescription>
              {selectedCategoryId
                ? 'No nominees found for the selected category.'
                : 'Get started by creating your first nominee.'}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-6">
          {Array.from(groupedNominees.entries()).map(([categoryId, { categoryName, nominees }]) => (
            <section key={categoryId} aria-labelledby={`category-${categoryId}`}>
              <h3 id={`category-${categoryId}`} className="text-xl font-semibold mb-3">{categoryName}</h3>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label={`Nominees in ${categoryName}`}>
                {nominees.map((nominee: Nominee) => (
                  <Card key={nominee.id} className="hover:shadow-md transition-shadow" role="listitem">
                    <CardHeader>
                      {nominee.imageUrl && (
                        <img
                          src={nominee.imageUrl}
                          alt={`Profile photo of ${nominee.name}`}
                          className="w-full h-48 object-cover rounded-md mb-2"
                        />
                      )}
                      <CardTitle className="text-xl">{nominee.name}</CardTitle>
                      <CardDescription>
                        {nominee.voteCount} {nominee.voteCount === 1 ? 'vote' : 'votes'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">{nominee.description}</p>
                      <a
                        href={nominee.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                        aria-label={`View ${nominee.name}'s LinkedIn profile (opens in new tab)`}
                      >
                        View LinkedIn Profile
                        <ExternalLink className="ml-1 h-3 w-3" aria-hidden="true" />
                      </a>
                      <div className="flex justify-end space-x-2">
                        {onEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(nominee)}
                            aria-label={`Edit ${nominee.name} nominee`}
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(nominee)}
                            aria-label={`Delete ${nominee.name} nominee`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
