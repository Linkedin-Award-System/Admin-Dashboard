import { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import { NomineeList } from '@/features/nominees';
import { NomineeForm } from '@/features/nominees/components/NomineeForm';
import { DeleteNomineeDialog } from '@/features/nominees/components/DeleteNomineeDialog';
import type { Nominee } from '@/features/nominees/types';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/shared/design-system';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCategories } from '@/features/categories/hooks/use-categories';

export const NomineesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingNominee, setEditingNominee] = useState<Nominee | undefined>(undefined);
  const [deletingNominee, setDeletingNominee] = useState<Nominee | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId') ?? undefined;
  const { data: categories } = useCategories();
  const filteredCategory = categoryId ? categories?.find((c) => c.id === categoryId) : undefined;

  const handleCreate = () => {
    setEditingNominee(undefined);
    setShowForm(true);
  };

  const handleEdit = (nominee: Nominee) => {
    setEditingNominee(nominee);
    setShowForm(true);
  };

  const handleDelete = (nominee: Nominee) => {
    setDeletingNominee(nominee);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingNominee(undefined);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingNominee(undefined);
  };

  const handleDeleteSuccess = () => {
    setDeletingNominee(null);
  };

  const handleSelect = (nominee: Nominee) => {
    navigate(`/nominees/${nominee.id}`);
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
                  {editingNominee ? 'Edit Nominee' : 'Add New Nominee'}
                </h1>
                <p className="text-text-tertiary font-medium mt-1">
                  Fill in the details below to {editingNominee ? 'update' : 'add'} a nominee
                </p>
              </div>
            </div>

            <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-border-light shadow-premium">
              <NomineeForm
                nominee={editingNominee}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        ) : (
          <>
            {filteredCategory && (
              <div className="flex items-center gap-3 mb-2">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => navigate(-1)}
                  style={{ backgroundColor: '#ffffff', color: '#085299', border: '2px solid #085299', borderRadius: '1rem' }}
                >
                  <ChevronLeft size={20} />
                </Button>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Filtered by category</p>
                  <h2 className="text-xl font-bold text-gray-900">{filteredCategory.name}</h2>
                </div>
              </div>
            )}
            <NomineeList
              onCreate={handleCreate}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelect={handleSelect}
            />
          </>
        )}

        <DeleteNomineeDialog
          nominee={deletingNominee}
          open={!!deletingNominee}
          onOpenChange={(open) => !open && setDeletingNominee(null)}
          onSuccess={handleDeleteSuccess}
        />
      </div>
    </Layout>
  );
};

export default NomineesPage;
