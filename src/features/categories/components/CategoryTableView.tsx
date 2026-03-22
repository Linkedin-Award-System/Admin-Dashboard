import { useState, useMemo } from 'react';
import { Pencil, Trash2, Plus, Search, Tag, Users, TrendingUp } from 'lucide-react';
import { useCategories } from '../hooks/use-categories';
import { useNominees } from '@/features/nominees/hooks/use-nominees';
import { Input } from '@/shared/components/ui/input';
import { Button, PageHeader, DataTable } from '@/shared/design-system';
import type { DataTableColumn } from '@/shared/design-system/patterns/DataTable/DataTable';
import { ExportButton } from '@/features/exports/components/ExportButton';
import { exportService } from '@/features/exports/services/export-service';
import type { Category } from '../types';

// Feature: category-list-view
export function truncateDescription(desc: string, max = 80): string {
  if (desc.length > max) return desc.slice(0, max) + '…';
  return desc;
}

interface CategoryTableViewProps {
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onCreate?: () => void;
  onSelect?: (category: Category) => void;
}

export function CategoryTableView({ onEdit, onDelete, onCreate, onSelect }: CategoryTableViewProps) {
  const { data: categories, isLoading, error } = useCategories();
  const { data: nominees } = useNominees();
  const [searchTerm, setSearchTerm] = useState('');

  const nomineeCounts = useMemo(() => {
    const map = new Map<string, number>();
    nominees?.forEach(n => {
      n.categories?.forEach(cat => {
        if (cat.id) map.set(cat.id, (map.get(cat.id) ?? 0) + 1);
      });
    });
    return map;
  }, [nominees]);

  const totalNominees = useMemo(
    () => nominees?.length ?? (categories ?? []).reduce((sum, c) => sum + (c.nomineeCount ?? 0), 0),
    [nominees, categories]
  );

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories ?? [];
    const q = searchTerm.toLowerCase();
    return (categories ?? []).filter(
      c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  }, [categories, searchTerm]);

  const columns: DataTableColumn<Category>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (_value, row) => (
        <button
          type="button"
          onClick={() => onSelect?.(row)}
          style={{ background: 'none', border: 'none', padding: 0, cursor: onSelect ? 'pointer' : 'default', color: '#085299', fontWeight: 600, fontSize: '0.875rem', textAlign: 'left' }}
        >
          {row.name}
        </button>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => (
        <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          {truncateDescription(value ?? '')}
        </span>
      ),
    },
    {
      key: 'nomineeCount',
      label: 'Nominees',
      align: 'right',
      render: (_value, row) => nomineeCounts.get(row.id) ?? row.nomineeCount ?? 0,
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: '_actions',
      label: 'Actions',
      align: 'center',
      render: (_value, row) => (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          {onEdit && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onEdit(row); }}
              title="Edit category"
              style={{ background: '#f0f7ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem', padding: '0.375rem', cursor: 'pointer', color: '#085299', display: 'flex', alignItems: 'center' }}
            >
              <Pencil size={14} strokeWidth={2.5} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete(row); }}
              title="Delete category"
              style={{ background: '#fff5f5', border: '1px solid #fee2e2', borderRadius: '0.5rem', padding: '0.375rem', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}
            >
              <Trash2 size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div style={{ padding: '2rem', borderRadius: '1.5rem', background: '#fef2f2', border: '1px solid #fecaca', textAlign: 'center' }}>
        <h3 style={{ color: '#991b1b', fontWeight: 700, fontSize: '1.125rem' }}>Error Loading Categories</h3>
        <p style={{ color: '#dc2626', marginTop: '0.5rem' }}>
          {error instanceof Error ? error.message : 'An error occurred while loading categories'}
        </p>
        <Button variant="secondary" onClick={() => window.location.reload()} style={{ marginTop: '1rem' }}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
      {(categories ?? []).length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { icon: Tag, label: 'Total Categories', value: (categories ?? []).length, color: '#085299', bg: '#eff6ff' },
            { icon: Users, label: 'Total Nominees', value: totalNominees, color: '#7c3aed', bg: '#f5f3ff' },
            { icon: TrendingUp, label: 'Avg per Category', value: (categories ?? []).length ? Math.round(totalNominees / (categories ?? []).length) : 0, color: '#059669', bg: '#ecfdf5' },
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

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
        <Input
          type="search"
          placeholder="Search categories by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '2.75rem', height: '3rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '0.875rem', width: '100%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
        />
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <DataTable
          columns={columns}
          data={filteredCategories}
          loading={isLoading}
          emptyMessage={searchTerm && filteredCategories.length === 0 ? 'No categories match your search' : 'No categories found'}
        />
      </div>
    </div>
  );
}
