import { useState, useMemo, useEffect } from 'react';
import { useCategories } from '../hooks/use-categories';
import { useNominees } from '@/features/nominees/hooks/use-nominees';
import { Input } from '@/shared/components/ui/input';
import { Button, PageHeader } from '@/shared/design-system';
import { Pencil, Trash2, Plus, FolderOpen, Search, Users, Tag, TrendingUp, GripVertical } from 'lucide-react';
import { ExportButton } from '@/features/exports/components/ExportButton';
import { exportService } from '@/features/exports/services/export-service';
import { CategoryListSkeleton } from './CategoryListSkeleton';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCategoryOrderStore } from '../store/category-order-store';
import type { Category } from '../types';

export function mergeOrder(savedIds: string[], liveCategories: Category[]): Category[] {
  const liveMap = new Map(liveCategories.map(c => [c.id, c]));
  // Step 1: saved IDs that still exist in live data (preserves saved order, removes stale)
  const ordered: Category[] = savedIds
    .filter(id => liveMap.has(id))
    .map(id => liveMap.get(id)!);
  // Step 2: new categories not in saved order, sorted alphabetically
  const savedSet = new Set(savedIds);
  const newCategories = liveCategories
    .filter(c => !savedSet.has(c.id))
    .sort((a, b) => a.name.localeCompare(b.name));
  return [...ordered, ...newCategories];
}

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
  const [activeId, setActiveId] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 18;

  const { order, setOrder, loadFromStorage } = useCategoryOrderStore();

  // Load persisted order on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

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

  // Merge saved order with live data, then filter by search (preserving saved order)
  const orderedCategories = useMemo(() => mergeOrder(order, categories ?? []), [order, categories]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return orderedCategories;
    const q = searchTerm.toLowerCase();
    return orderedCategories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  }, [orderedCategories, searchTerm]);

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }
    const ids = orderedCategories.map(c => c.id);
    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    if (oldIndex !== -1 && newIndex !== -1) {
      setOrder(arrayMove(ids, oldIndex, newIndex));
    }
    setActiveId(null);
  };

  const activeCategory = activeId ? orderedCategories.find(c => c.id === activeId) : null;

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
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={!!searchTerm ? undefined : handleDragEnd}
        >
          <SortableContext items={orderedCategories.map(c => c.id)} strategy={rectSortingStrategy}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {paginatedCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  nomineeCount={nomineeCounts.get(category.id) ?? category.nomineeCount ?? 0}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onSelect={onSelect}
                  dragDisabled={!!searchTerm}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeCategory && (
              <CategoryCard
                category={activeCategory}
                nomineeCount={nomineeCounts.get(activeCategory.id) ?? activeCategory.nomineeCount ?? 0}
                isDragOverlay
              />
            )}
          </DragOverlay>
        </DndContext>
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
  isDragOverlay?: boolean;   // true when rendered inside DragOverlay (no useSortable)
  dragDisabled?: boolean;    // true when search is active
}

const CategoryCard = ({ category, nomineeCount, onEdit, onDelete, onSelect, isDragOverlay, dragDisabled }: CardProps) => {
  const [hovered, setHovered] = useState(false);
  const [handleHovered, setHandleHovered] = useState(false);

  // Task 4.3: Wire useSortable — always call the hook (React rules), but use 'overlay' id when isDragOverlay
  const sortable = useSortable({ id: isDragOverlay ? 'overlay' : category.id });
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = sortable;
  const isDragging = isDragOverlay ? false : isSortableDragging;

  // Task 4.4: Compute card transform/style
  const cardTransform = CSS.Transform.toString(transform);

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    border: `1px solid ${hovered && !isDragging ? '#085299' : '#e5e7eb'}`,
    borderRadius: '1.25rem',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    position: 'relative',
    overflow: 'hidden',
    // Task 4.4: dynamic visual states
    opacity: isDragging ? 0.4 : 1,
    transform: isDragOverlay
      ? 'scale(1.04)'
      : isDragging
        ? `${cardTransform ?? ''} scale(0.98)`.trim()
        : cardTransform ?? undefined,
    transition: transition ?? 'all 0.2s ease',
    boxShadow: isDragOverlay
      ? '0 20px 40px rgba(0,0,0,0.18)'
      : hovered
        ? '0 8px 24px rgba(8,82,153,0.12)'
        : '0 1px 3px rgba(0,0,0,0.06)',
    cursor: isDragOverlay ? 'grabbing' : onSelect ? 'pointer' : 'default',
  };

  return (
    <div
      ref={setNodeRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect?.(category)}
      style={cardStyle}
    >
      {/* Top row: drag handle + nominee badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {/* Task 4.2: Drag handle button */}
        <button
          {...listeners}
          {...attributes}
          title="Drag to reorder"
          aria-label="Drag to reorder"
          onMouseEnter={() => { if (!dragDisabled) setHandleHovered(true); }}
          onMouseLeave={() => setHandleHovered(false)}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.25rem',
            cursor: dragDisabled ? 'not-allowed' : 'grab',
            color: dragDisabled ? '#d1d5db' : handleHovered ? '#085299' : '#9ca3af',
            opacity: dragDisabled ? 0.4 : 1,
            display: 'flex',
            alignItems: 'center',
            borderRadius: '0.25rem',
            transition: 'color 0.15s ease',
            flexShrink: 0,
          }}
        >
          <GripVertical size={16} />
        </button>

        {/* Nominee badge */}
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
