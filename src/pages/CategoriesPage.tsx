import { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import { CategoryList } from '@/features/categories/components/CategoryList';
import { CategoryForm } from '@/features/categories/components/CategoryForm';
import { DeleteCategoryDialog } from '@/features/categories/components/DeleteCategoryDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { Category } from '@/features/categories/types';

export const CategoriesPage = () => {
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

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {showForm ? (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryForm
                category={editingCategory}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </CardContent>
          </Card>
        ) : (
          <CategoryList
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
