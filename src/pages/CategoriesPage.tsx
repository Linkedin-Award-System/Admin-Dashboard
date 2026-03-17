import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/shared/components/layout';
import { CategoryList } from '@/features/categories/components/CategoryList';
import { CategoryForm } from '@/features/categories/components/CategoryForm';
import { DeleteCategoryDialog } from '@/features/categories/components/DeleteCategoryDialog';
import type { Category } from '@/features/categories/types';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/shared/design-system';

export const CategoriesPage = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const handleCreate = () => {
    setEditingCategory(undefined);
    setShowForm(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCategory(undefined);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCategory(undefined);
  };

  const handleDeleteSuccess = () => {
    setDeletingCategory(null);
  };

  const handleSelect = (category: Category) => {
    navigate(`/categories/${category.id}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 max-w-7xl">
        {showForm ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-4">
              <Button 
                variant="secondary" 
                size="md" 
                onClick={handleFormCancel}
                style={{ backgroundColor: '#ffffff', color: '#085299', border: '2px solid #085299' }}
                className="rounded-2xl shadow-sm hover:bg-primary-50 transition-all duration-200"
              >
                <ChevronLeft size={24} />
              </Button>
              <div>
                <h1 className="text-3xl font-black text-text-primary tracking-tight">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h1>
                <p className="text-text-tertiary font-medium mt-1">
                  Fill in the details below to {editingCategory ? 'update' : 'add'} an award category
                </p>
              </div>
            </div>

            <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-border-light shadow-premium">
              <CategoryForm
                category={editingCategory}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        ) : (
          <CategoryList
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={handleSelect}
          />
        )}

        <DeleteCategoryDialog
          category={deletingCategory}
          open={!!deletingCategory}
          onOpenChange={(open) => !open && setDeletingCategory(null)}
          onSuccess={handleDeleteSuccess}
        />
      </div>
    </Layout>
  );
};

export default CategoriesPage;
