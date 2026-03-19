import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Coins, DollarSign, FileText, Tag, Star, ToggleLeft } from 'lucide-react';
import type { CreditPackage, CreditPackageFormData } from '../services/credit-service';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(80, 'Max 80 characters'),
  description: z.string().max(300, 'Max 300 characters').optional(),
  credits: z.number().int('Must be a whole number').min(1, 'Must be at least 1'),
  price: z.number().min(0, 'Must be 0 or more'),
  currency: z.string().min(1, 'Currency is required'),
  isActive: z.boolean(),
  isPopular: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface CreditPackageFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreditPackageFormData) => void;
  isSubmitting: boolean;
  editPackage?: CreditPackage | null;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  border: '1.5px solid #e5e7eb',
  borderRadius: '0.625rem',
  fontSize: '0.875rem',
  color: '#111827',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#374151',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const errorStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#ef4444',
  marginTop: 4,
};

export const CreditPackageForm = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  editPackage,
}: CreditPackageFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      credits: 100,
      price: 0,
      currency: 'ETB',
      isActive: true,
      isPopular: false,
    },
  });

  useEffect(() => {
    if (open) {
      if (editPackage) {
        reset({
          name: editPackage.name,
          description: editPackage.description ?? '',
          credits: editPackage.credits,
          price: editPackage.price,
          currency: editPackage.currency ?? 'ETB',
          isActive: editPackage.isActive === true,
          isPopular: editPackage.isPopular ?? false,
        });
      } else {
        reset({ name: '', description: '', credits: 100, price: 0, currency: 'ETB', isActive: true, isPopular: false });
      }
    }
  }, [open, editPackage, reset]);

  const isActive = watch('isActive');
  const isPopular = watch('isPopular');

  if (!open) return null;

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      name: values.name,
      description: values.description || undefined,
      credits: values.credits,
      price: values.price,
      currency: values.currency,
      isActive: values.isActive,
      isPopular: values.isPopular,
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div style={{
        position: 'relative', zIndex: 51,
        background: '#fff',
        borderRadius: '1.25rem',
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        width: '100%',
        maxWidth: 520,
        maxHeight: '90vh',
        overflowY: 'auto',
        margin: '0 1rem',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 1.5rem 1.25rem',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: '#fff',
          zIndex: 1,
          borderRadius: '1.25rem 1.25rem 0 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #085299, #0a66c2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Coins size={16} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                {editPackage ? 'Edit Package' : 'New Credit Package'}
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
                {editPackage ? 'Update package details' : 'Create a new credit package'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#f9fafb',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#6b7280',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Name */}
          <div>
            <label style={labelStyle}>
              <Tag size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
              Package Name
            </label>
            <input
              {...register('name')}
              placeholder="e.g. Starter Pack"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#085299')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
            />
            {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>
              <FileText size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
              Description <span style={{ color: '#9ca3af', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
            </label>
            <textarea
              {...register('description')}
              placeholder="Brief description of this package..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
              onFocus={e => (e.target.style.borderColor = '#085299')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
            />
            {errors.description && <p style={errorStyle}>{errors.description.message}</p>}
          </div>

          {/* Credits + Price row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>
                <Coins size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                Credits
              </label>
              <input
                {...register('credits', { valueAsNumber: true })}
                type="number"
                min={1}
                placeholder="100"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#085299')}
                onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
              />
              {errors.credits && <p style={errorStyle}>{errors.credits.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>
                <DollarSign size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                Price
              </label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#085299')}
                onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
              />
              {errors.price && <p style={errorStyle}>{errors.price.message}</p>}
            </div>
          </div>

          {/* Currency */}
          <div>
            <label style={labelStyle}>Currency</label>
            <select
              {...register('currency')}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={e => (e.target.style.borderColor = '#085299')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
            >
              <option value="ETB">ETB — Ethiopian Birr</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
            </select>
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Active toggle */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.875rem 1rem',
              background: '#f9fafb',
              borderRadius: '0.75rem',
              border: '1.5px solid #e5e7eb',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ToggleLeft size={18} style={{ color: isActive ? '#10b981' : '#9ca3af' }} />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Active</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Package is visible and purchasable</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setValue('isActive', !isActive, { shouldDirty: true })}
                style={{
                  width: 44, height: 24, borderRadius: 99,
                  background: isActive ? '#10b981' : '#d1d5db',
                  border: 'none', cursor: 'pointer',
                  position: 'relative', transition: 'background 0.2s',
                  flexShrink: 0,
                }}
              >
                <span style={{
                  position: 'absolute', top: 2,
                  left: isActive ? 22 : 2,
                  width: 20, height: 20,
                  borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  transition: 'left 0.2s',
                }} />
              </button>
            </div>

            {/* Popular toggle */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.875rem 1rem',
              background: '#f9fafb',
              borderRadius: '0.75rem',
              border: '1.5px solid #e5e7eb',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Star size={18} style={{ color: isPopular ? '#f59e0b' : '#9ca3af', fill: isPopular ? '#f59e0b' : 'none' }} />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Featured / Popular</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Highlight this package as popular</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setValue('isPopular', !isPopular, { shouldDirty: true })}
                style={{
                  width: 44, height: 24, borderRadius: 99,
                  background: isPopular ? '#f59e0b' : '#d1d5db',
                  border: 'none', cursor: 'pointer',
                  position: 'relative', transition: 'background 0.2s',
                  flexShrink: 0,
                }}
              >
                <span style={{
                  position: 'absolute', top: 2,
                  left: isPopular ? 22 : 2,
                  width: 20, height: 20,
                  borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  transition: 'left 0.2s',
                }} />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '0.75rem',
                border: '1.5px solid #e5e7eb',
                borderRadius: '0.75rem',
                background: '#fff',
                fontSize: '0.875rem', fontWeight: 600, color: '#374151',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: 2, padding: '0.75rem',
                border: 'none',
                borderRadius: '0.75rem',
                background: isSubmitting ? '#93c5fd' : 'linear-gradient(135deg, #085299, #0a66c2)',
                fontSize: '0.875rem', fontWeight: 600, color: '#fff',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {isSubmitting ? (
                <>
                  <span style={{
                    width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite', display: 'inline-block',
                  }} />
                  Saving...
                </>
              ) : (
                editPackage ? 'Save Changes' : 'Create Package'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
