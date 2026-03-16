import { useState, useMemo } from 'react';
import { useNominees } from '../hooks/use-nominees';
import { useCategories } from '@/features/categories/hooks/use-categories';
import { Button, Card, PageHeader } from '@/shared/design-system';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { Pencil, Trash2, Plus, Users, Filter, Linkedin } from 'lucide-react';
import { NomineeListSkeleton } from './NomineeListSkeleton';
import type { Nominee } from '../types';
import { formatNumber } from '@/features/dashboard/utils/format-utils';

interface NomineeListProps {
  onEdit?: (nominee: Nominee) => void;
  onDelete?: (nominee: Nominee) => void;
  onCreate?: () => void;
}

export const NomineeList = ({ onEdit, onDelete, onCreate }: NomineeListProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const { data: nominees, isLoading, error } = useNominees(selectedCategoryId || undefined);
  const { data: categories } = useCategories();

  const groupedNominees = useMemo(() => {
    if (!nominees || !categories) return new Map();

    const grouped = new Map<string, { categoryName: string; nominees: Nominee[] }>();

    nominees.forEach((nominee) => {
      if (!nominee.categories || nominee.categories.length === 0) {
        // Nominees with no categories go into a single "Uncategorized" group
        const key = '__uncategorized__';
        if (!grouped.has(key)) {
          grouped.set(key, { categoryName: 'Uncategorized', nominees: [] });
        }
        grouped.get(key)!.nominees.push(nominee);
      } else {
        nominee.categories.forEach((category) => {
          // Group nominees with missing category names together under one "Unknown Category" bucket
          const hasValidName = category.name && category.name.trim().length > 0;
          const key = hasValidName ? (category.id ?? '__unknown__') : '__unknown__';
          const displayName = hasValidName ? category.name : 'Unknown Category';
          if (!grouped.has(key)) {
            grouped.set(key, { categoryName: displayName, nominees: [] });
          }
          grouped.get(key)!.nominees.push(nominee);
        });
      }
    });

    return new Map([...grouped.entries()].sort((a, b) => (a[1].categoryName ?? '').localeCompare(b[1].categoryName ?? '')));
  }, [nominees, categories]);

  if (isLoading) {
    return <NomineeListSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-border-light shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">Nominees</h2>
        </div>
        <div className="p-8 rounded-3xl border border-red-100 bg-red-50/50 backdrop-blur-sm text-center">
          <h3 className="text-xl font-semibold text-red-800">Error Loading Nominees</h3>
          <p className="text-red-600 mt-2 max-w-md mx-auto">
            {error instanceof Error ? error.message : 'An error occurred while loading nominees'}
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
        title="Nominees"
        subtitle="Manage all participants and their voting statuses"
        actions={
          onCreate && (
            <Button onClick={onCreate} variant="primary" style={{ backgroundColor: '#085299', color: '#ffffff' }} className="rounded-2xl shadow-lg shadow-primary-500/20 px-6 h-12 font-medium transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Plus className="mr-2 h-5 w-5 stroke-[3px]" />
              Add Nominee
            </Button>
          )
        }
      />

      {/* Modern Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-bg-tertiary/30 p-4 rounded-[1.5rem] border border-border-light ring-1 ring-black/5">
        <div className="flex items-center gap-3 pl-2 flex-1 w-full sm:w-auto">
          <Filter className="text-text-tertiary" size={20} />
          <Label htmlFor="category-filter" className="text-sm font-medium text-gray-600 whitespace-nowrap">Group by Category:</Label>
          <select
            id="category-filter"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="flex h-11 w-full sm:w-64 rounded-xl border border-border-light bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
          >
            <option value="">All Categories</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {groupedNominees.size === 0 ? (
        <div className="py-20 text-center bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-border-light border-dashed">
          <div className="w-20 h-20 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-text-tertiary" size={40} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No Nominees Found</h3>
          <p className="text-text-tertiary mt-2">
            {selectedCategoryId
              ? 'No nominees found for the selected category.'
              : 'Create your first nominee to populate the dashboard.'}
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {Array.from(groupedNominees.entries()).map(([categoryId, { categoryName, nominees }], catIdx) => (
            <section key={categoryId} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${catIdx * 100}ms` }}>
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border-light to-transparent" />
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider bg-bg-primary px-6">
                  {categoryName}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border-light to-transparent" />
              </div>

              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {nominees.map((nominee: Nominee) => (
                  <Card
                    key={nominee.id}
                    hoverable
                    padding="none"
                    className="group relative overflow-hidden"
                  >
                    {/* Header: Photo & Name Area */}
                    <div className="relative">
                      {nominee.profileImageUrl ? (
                        <div className="h-56 w-full overflow-hidden">
                          <img
                            src={nominee.profileImageUrl}
                            alt={nominee.fullName}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                      ) : (
                        <div className="h-56 w-full bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center">
                          <span className="text-6xl font-semibold text-primary-200">{nominee.fullName.charAt(0)}</span>
                        </div>
                      )}
                      
                      {/* Vote Count Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-white/50 shadow-lg flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Votes</span>
                            <span className="text-xl font-semibold text-primary-600">{formatNumber(nominee.voteCount)}</span>
                          </div>
                          <Badge className="bg-primary-600 text-white rounded-xl py-1.5 px-3 font-medium text-xs">
                            Active
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-7 pt-5">
                      {/* Identity */}
                      <div className="mb-4">
                        <h4 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                          {nominee.fullName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-lg">{nominee.organization}</span>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-text-tertiary text-sm leading-relaxed font-medium line-clamp-2 mb-6 h-10">
                        {nominee.shortBiography}
                      </p>

                      {/* Footer Actions */}
                      <div className="flex items-center gap-3 pt-6 border-t border-border-light/50">
                        <a
                          href={nominee.linkedInProfileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl bg-[#0a66c2]/5 text-[#0a66c2] hover:bg-[#0a66c2] hover:text-white font-medium text-xs transition-all duration-300"
                        >
                          <Linkedin size={14} />
                          LinkedIn
                        </a>
                        
                        <div className="flex items-center gap-2">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(nominee)}
                              title="Edit nominee"
                              className="h-10 w-10 rounded-xl flex items-center justify-center bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-gray-600 border border-gray-200 hover:border-blue-300 transition-all shadow-sm"
                            >
                              <Pencil size={18} strokeWidth={2.5} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(nominee)}
                              title="Delete nominee"
                              className="h-10 w-10 rounded-xl flex items-center justify-center bg-red-500 hover:bg-red-600 text-white border border-red-500 hover:border-red-600 transition-all shadow-sm"
                            >
                              <Trash2 size={18} strokeWidth={2.5} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
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
