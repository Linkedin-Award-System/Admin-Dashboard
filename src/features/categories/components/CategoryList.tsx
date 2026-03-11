import { useState, useMemo } from 'react';
import { useCategories } from '../hooks/use-categories';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { ExportButton } from '@/features/exports/components/ExportButton';
import { exportService } from '@/features/exports/services/export-service';
import { CategoryListSkeleton } from './CategoryListSkeleton';
import type { Category } from '../types';

interface CategoryListProps {
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onCreate?: () => void;
}

export const CategoryList = ({ onEdit, onDelete, onCreate }: CategoryListProps) => {
  const { data: categories, isLoading, error } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort categories
  const filteredAndSortedCategories = useMemo(() => {
    if (!categories) return [];

    let filtered = categories;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort alphabetically by name
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, searchTerm]);

  if (isLoading) {
    return <CategoryListSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Categories</h2>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Categories</CardTitle>
            <CardDescription className="text-red-600">
              {error instanceof Error ? error.message : 'An error occurred while loading categories'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold">Categories</h2>
        {onCreate && (
          <Button onClick={onCreate} aria-label="Add new category" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Add Category
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Input
          type="search"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 sm:max-w-sm"
          aria-label="Search categories by name or description"
        />
        <ExportButton
          onExport={exportService.exportCategories}
          filename="categories"
          label="Export"
          aria-label="Export categories to CSV"
          className="w-full sm:w-auto"
        />
      </div>

      {filteredAndSortedCategories.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Categories Found</CardTitle>
            <CardDescription>
              {searchTerm
                ? 'No categories match your search criteria.'
                : 'Get started by creating your first category.'}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Categories list">
          {filteredAndSortedCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow" role="listitem">
              <CardHeader>
                <CardTitle className="text-xl">{category.name}</CardTitle>
                <CardDescription>
                  {category.nomineeCount} {category.nomineeCount === 1 ? 'nominee' : 'nominees'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                <div className="flex justify-end space-x-2">
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(category)}
                      aria-label={`Edit ${category.name} category`}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(category)}
                      aria-label={`Delete ${category.name} category`}
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
      )}
    </div>
  );
};
