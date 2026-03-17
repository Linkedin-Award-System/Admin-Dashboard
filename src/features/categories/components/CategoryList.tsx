import { useState, useMemo } from 'react';
import { useCategories } from '../hooks/use-categories';
import { useNominees } from '@/features/nominees/hooks/use-nominees';
import { Input } from '@/shared/components/ui/input';
import { Button, PageHeader } from '@/shared/design-system';
import { Pencil, Trash2, Plus, FolderOpen, Search, Users, Tag, TrendingUp } from 'lucide-react';
import { ExportButton } from '@/features/exports/components/ExportButton';
import { exportService } from '@/features/exports/services/export-service';
import { CategoryListSkeleton } from './CategoryListSkeleton';
import type { Category } from '../types';

interface CategoryListProps {
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onCreate?: () => void;
  onSelect?: (category: Category) => void;
}

export const CategoryList = ({ onEdit, onDelete, onCreate, onSelect }: CategoryListProps) => {
  const { data: categories, isLoading, error } = useCategories();
  const { data: nominees } = useNominees();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 18;

  // Derive nominee counts per category from the nominees list (more accurate than API nomineeCount)
  const nomineeCounts = useMemo(() => {
    const map = new Map<string, number>();
    nominees?.forEach(n => {
      n.categories?.forEach(cat => {
        if (cat.id) map.set(cat.id, (map.get(cat.id) ?? 0) + 1);
      });
    });
    return map;
  }, [nominees]);

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    let filtered = categories;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      );
    }
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, searchTerm]);

  const totalNominees = useMemo(
    () => nominees?.length ?? (categories ?? []).reduce((sum, c) => sum + (c.nomineeCount ?? 0), 0),
    [nominees, categories]
  );

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / ITEMS_PER_PAGE));
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (isLoading) return <CategoryListSkeleton />;

  if (error) {
    return (
      <div className="space-y-6">
        <div style={{ padding: '2rem', borderRadius: '1.5rem', background: '#fef2f2', border: '1px solid #fecaca', textAlign: 'center' }}>
          <h3 style={{ color: '#991b1b', fontWeight: 700, fontSize: '1.125rem' }}>Error Loading Categories</h3>
          <p style={{ color: '#dc2626', marginTop: '0.5rem' }}>
            {error instanceof Error ? error.message : 'An error occurred while loading categories'}
          </p>
          <Button variant="secondary" onClick={() => window.location.reload()} style={{ marginTop: '1rem' }}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <PageHeader
        title="Categories"
        subtitle="Manage and organize your award categories"
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ExportButton
              onExport={(format) => exportService.exportCategories(format, categories ?? [])}
              filename="categories"
              label="Export"
              className="rounded-2xl border-border-light hover:bg-bg-tertiary font-semibold"
            />
            {onCreate && (
              <Button
                onClick={onCreate}
                variant="primary"
                style={{ backgroundColor: '#085299', color: '#ffffff', borderRadius: '0.75rem', padding: '0 1.25rem', height: '2.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Plus size={18} strokeWidth={2.5} />
                New Category
              </Button>
            )}
          </div>
        }
      />

      {/* Stats Strip */}
      {categories && categories.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { icon: Tag, label: 'Total Categories', value: categories.length, color: '#085299', bg: '#eff6ff' },
            { icon: Users, label: 'Total Nominees', value: totalNominees, color: '#7c3aed', bg: '#f5f3ff' },
            { icon: TrendingUp, label: 'Avg per Category', value: categories.length ? Math.round(totalNominees / categories.length) : 0, color: '#059669', bg: '#ecfdf5' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', fontWeight: 500 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search Bar */}
      <div style={{ position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
        <Input
          type="search"
          placeholder="Search categories by name or description..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          style={{ paddingLeft: '2.75rem', height: '3rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '0.875rem', width: '100%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
        />
      </div>

      {/* Grid or Empty State */}
      {filteredCategories.length === 0 ? (
        <div style={{ padding: '5rem 2rem', textAlign: 'center', background: '#fff', borderRadius: '1.5rem', border: '2px dashed #e5e7eb' }}>
          <div style={{ width: '5rem', height: '5rem', background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <FolderOpen size={36} style={{ color: '#9ca3af' }} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>No Categories Found</h3>
          <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '0.875rem' }}>
            {searchTerm ? `No categories match "${searchTerm}"` : 'Add your first category to get started.'}
          </p>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={{ marginTop: '0.75rem', color: '#085299', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {paginatedCategories.map((category) => {
            return (
              <CategoryCard
                key={category.id}
                category={category}
                nomineeCount={nomineeCounts.get(category.id) ?? category.nomineeCount ?? 0}
                onEdit={onEdit}
                onDelete={onDelete}
                onSelect={onSelect}
              />
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>
            Page {currentPage} of {totalPages} &middot; {filteredCategories.length} categories
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="secondary" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ borderRadius: '0.5rem' }}>
              Previous
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ borderRadius: '0.5rem' }}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Category Card ────────────────────────────────────────────────────────────

interface CardProps {
  category: Category;
  nomineeCount: number;
  onEdit?: (c: Category) => void;
  onDelete?: (c: Category) => void;
  onSelect?: (c: Category) => void;
}

const CategoryCard = ({ category, nomineeCount, onEdit, onDelete, onSelect }: CardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect?.(category)}
      style={{
        background: '#fff',
        border: `1px solid ${hovered ? '#085299' : '#e5e7eb'}`,
        borderRadius: '1.25rem',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: hovered ? '0 8px 24px rgba(8,82,153,0.12)' : '0 1px 3px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease',
        cursor: onSelect ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top row: nominee badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
        <div
          style={{
            background: '#eff6ff',
            color: '#085299',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.3rem 0.75rem',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            border: '1px solid #bfdbfe',
          }}
        >
          <Users size={12} />
          {nomineeCount} nominees
        </div>
      </div>

      {/* Name & description */}
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '0.375rem', lineHeight: 1.3 }}>
          {category.name}
        </h3>
        <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {category.description || 'No description provided.'}
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
        {onEdit && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(category); }}
            title="Edit category"
            style={{
              flex: 1,
              height: '2.25rem',
              borderRadius: '0.625rem',
              border: '1px solid #e5e7eb',
              background: hovered ? '#f0f7ff' : '#f9fafb',
              color: '#085299',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
              transition: 'all 0.15s ease',
            }}
          >
            <Pencil size={14} strokeWidth={2.5} />
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(category); }}
            title="Delete category"
            style={{
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: '0.625rem',
              border: '1px solid #fee2e2',
              background: '#fff5f5',
              color: '#dc2626',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
          >
            <Trash2 size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
};
