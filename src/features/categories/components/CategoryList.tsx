import { useState, useMemo } from 'react';
import { useCategories } from '../hooks/use-categories';
import { Input } from '@/shared/components/ui/input';
import { Button, Card, PageHeader } from '@/shared/design-system';
import { Badge } from '@/shared/components/ui/badge';
import { Pencil, Trash2, Plus, FolderOpen, Search, Filter } from 'lucide-react';
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

  const filteredAndSortedCategories = useMemo(() => {
    if (!categories) return [];

    let filtered = categories;

    if (searchTerm) {
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, searchTerm]);

  if (isLoading) {
    return <CategoryListSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-border-light shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">Categories</h2>
        </div>
        <div className="p-8 rounded-3xl border border-red-100 bg-red-50/50 backdrop-blur-sm text-center">
          <h3 className="text-xl font-semibold text-red-800">Error Loading Categories</h3>
          <p className="text-red-600 mt-2 max-w-md mx-auto">
            {error instanceof Error ? error.message : 'An error occurred while loading categories'}
          </p>
          <Button variant="secondary" className="mt-6 border-red-200 text-red-700 hover:bg-red-100" onClick={() => window.location.reload()}>
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section - Using PageHeader component */}
      <PageHeader
        title="Categories"
        subtitle="Manage and organize your award categories"
        actions={
          <div className="flex items-center gap-3">
            <ExportButton
              onExport={exportService.exportCategories}
              filename="categories"
              label="Export Data"
              className="rounded-2xl border-border-light hover:bg-bg-tertiary font-semibold"
            />
            {onCreate && (
              <Button onClick={onCreate} variant="primary" style={{ backgroundColor: '#085299', color: '#ffffff' }} className="rounded-2xl shadow-lg shadow-primary-500/20 px-6 h-12 font-medium transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Plus className="mr-2 h-5 w-5 stroke-[3px]" />
                New Category
              </Button>
            )}
          </div>
        }
      />

      {/* Filters Section */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary-500 transition-colors" size={20} />
          <Input
            type="search"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 rounded-2xl border-border-light bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm font-medium"
          />
        </div>
        <Button variant="ghost" className="h-14 w-14 rounded-2xl border border-border-light hover:bg-bg-tertiary group">
          <Filter size={22} className="text-text-tertiary group-hover:text-text-primary transition-colors" strokeWidth={2.5} />
        </Button>
      </div>

      {/* Content Section */}
      {filteredAndSortedCategories.length === 0 ? (
        <div className="py-20 text-center bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-border-light border-dashed">
          <div className="w-20 h-20 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="text-text-tertiary" size={40} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No Categories Found</h3>
          <p className="text-text-tertiary mt-2">
            {searchTerm
              ? `No categories match "${searchTerm}"`
              : 'Start building your dashboard by adding your first category.'}
          </p>
          {searchTerm && (
            <Button variant="ghost" onClick={() => setSearchTerm('')} className="mt-2 text-primary-600 font-medium underline-offset-4">
              Clear search filter
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {filteredAndSortedCategories.map((category, index) => (
            <Card
              key={category.id}
              hoverable
              className="group relative animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Category Icon/Initial */}
              <div className="flex items-start justify-between mb-6">
                <div className="h-14 w-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 font-semibold text-2xl shadow-inner group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  {category.name.charAt(0)}
                </div>
                <Badge variant="secondary" className="bg-bg-tertiary/50 text-text-secondary font-medium px-3 py-1 rounded-full border-none ring-1 ring-inset ring-black/5 group-hover:bg-primary-50 group-hover:text-primary-700 transition-colors">
                  {category.nomineeCount} Nominees
                </Badge>
              </div>

              {/* Title & Description */}
              <div className="space-y-2 mb-8">
                <h3 className="text-base font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-text-tertiary line-clamp-3 leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* Actions Overlay */}
              <div className="flex items-center justify-end gap-2 pt-6 border-t border-border-light/50">
                {onEdit && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(category)}
                    className="h-12 w-12 rounded-xl transition-all group/edit shadow-sm"
                    title="Edit category"
                  >
                    <Pencil size={22} className="transition-transform group-hover/edit:scale-110" strokeWidth={2.5} />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(category)}
                    className="h-12 w-12 rounded-xl transition-all group/delete shadow-sm"
                    title="Delete category"
                  >
                    <Trash2 size={22} className="transition-transform group-hover/delete:scale-110" strokeWidth={2.5} />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
