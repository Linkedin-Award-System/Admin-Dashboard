import { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import {
  Coins, Package, Star, Zap, TrendingUp, CheckCircle2,
  AlertTriangle, RefreshCw, Sparkles, Crown, Flame,
  Plus, Pencil, Trash2,
} from 'lucide-react';
import {
  useCreditPackages,
  useCreateCreditPackage,
  useUpdateCreditPackage,
  useDeleteCreditPackage,
  useToggleCreditPackageActive,
  useToggleCreditPackagePopular,
} from '@/features/credits/hooks/use-credits';
import { CreditPackageForm } from '@/features/credits/components/CreditPackageForm';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from '@/shared/components/ui/alert-dialog';
import type { CreditPackage, CreditPackageFormData } from '@/features/credits/services/credit-service';


const formatPrice = (price: number, currency = 'ETB') => {
  try {
    return new Intl.NumberFormat('en-ET', { style: 'currency', currency, minimumFractionDigits: 2 }).format(price);
  } catch {
    return `${currency} ${price.toFixed(2)}`;
  }
};

const formatCredits = (n: number) => n.toLocaleString();
const getValueScore = (pkg: CreditPackage) => (pkg.price > 0 ? pkg.credits / pkg.price : 0);

function getTier(credits: number) {
  if (credits >= 1000) return {
    label: 'Elite', icon: Crown,
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)',
    accent: '#818cf8', badgeBg: 'rgba(129,140,248,0.15)', badgeText: '#818cf8',
    glow: '0 0 40px rgba(129,140,248,0.25)',
  };
  if (credits >= 500) return {
    label: 'Pro', icon: Flame,
    gradient: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)',
    accent: '#fb923c', badgeBg: 'rgba(251,146,60,0.15)', badgeText: '#fb923c',
    glow: '0 0 40px rgba(251,146,60,0.2)',
  };
  if (credits >= 200) return {
    label: 'Growth', icon: TrendingUp,
    gradient: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #052e16 100%)',
    accent: '#4ade80', badgeBg: 'rgba(74,222,128,0.15)', badgeText: '#4ade80',
    glow: '0 0 40px rgba(74,222,128,0.2)',
  };
  if (credits >= 100) return {
    label: 'Standard', icon: Zap,
    gradient: 'linear-gradient(135deg, #0c1445 0%, #1e3a8a 50%, #0c1445 100%)',
    accent: '#60a5fa', badgeBg: 'rgba(96,165,250,0.15)', badgeText: '#60a5fa',
    glow: '0 0 40px rgba(96,165,250,0.2)',
  };
  return {
    label: 'Starter', icon: Sparkles,
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
    accent: '#a78bfa', badgeBg: 'rgba(167,139,250,0.15)', badgeText: '#a78bfa',
    glow: '0 0 40px rgba(167,139,250,0.15)',
  };
}


function PackageSkeleton() {
  return (
    <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ height: 140, background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)' }} />
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {[60, 45, 100, 80, 65].map((w, i) => (
          <div key={i} style={{ height: i === 2 ? 36 : i === 1 ? 28 : 12, background: '#f3f4f6', borderRadius: 6, width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }: {
  icon: React.ElementType; label: string; value: string | number; color: string; bg: string;
}) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #f0f0f0', borderRadius: '1.25rem',
      padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)', flex: '1 1 0', minWidth: 0,
    }}>
      <div style={{ width: 44, height: 44, borderRadius: '0.875rem', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#111827', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      </div>
    </div>
  );
}


interface PackageCardProps {
  pkg: CreditPackage;
  rank: number;
  totalPackages: number;
  onEdit: (pkg: CreditPackage) => void;
  onDelete: (pkg: CreditPackage) => void;
  onToggleActive: (pkg: CreditPackage) => void;
  onTogglePopular: (pkg: CreditPackage) => void;
}

function PackageCard({ pkg, rank, totalPackages, onEdit, onDelete, onToggleActive, onTogglePopular }: PackageCardProps) {
  const tier = getTier(pkg.credits);
  const TierIcon = tier.icon;
  const isInactive = pkg.isActive !== true;
  const isBestValue = rank === 0 && totalPackages > 1;
  const pricePerCredit = pkg.price > 0 ? (pkg.price / pkg.credits).toFixed(3) : '—';

  return (
    <div style={{
      borderRadius: '1.5rem', overflow: 'hidden',
      boxShadow: pkg.isPopular ? `0 8px 32px rgba(245,158,11,0.2), ${tier.glow}` : !isInactive ? '0 2px 8px rgba(0,0,0,0.07)' : '0 1px 4px rgba(0,0,0,0.04)',
      border: pkg.isPopular ? '2px solid #f59e0b' : isInactive ? '1.5px dashed #d1d5db' : '1px solid #e5e7eb',
      opacity: isInactive ? 0.7 : 1,
      display: 'flex', flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      position: 'relative',
    }}
      onMouseEnter={e => {
        if (!isInactive) {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = pkg.isPopular
            ? `0 16px 48px rgba(245,158,11,0.25), ${tier.glow}` : '0 8px 24px rgba(0,0,0,0.12)';
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = pkg.isPopular
          ? `0 8px 32px rgba(245,158,11,0.2), ${tier.glow}` : !isInactive ? '0 2px 8px rgba(0,0,0,0.07)' : '0 1px 4px rgba(0,0,0,0.04)';
      }}
    >
      {/* Dark gradient header */}
      <div style={{
        background: tier.gradient, padding: '1.5rem', position: 'relative',
        overflow: 'hidden', minHeight: 140, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: tier.accent, opacity: 0.08, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: tier.accent, opacity: 0.06, pointerEvents: 'none' }} />

        {/* Top row: tier badge + status badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: tier.badgeBg, border: `1px solid ${tier.accent}30`, borderRadius: 20, padding: '4px 10px' }}>
            <TierIcon size={12} style={{ color: tier.accent }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: tier.accent, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{tier.label}</span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {/* Active / Inactive status badge — always visible */}
            {!isInactive ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 20, padding: '4px 10px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Active</span>
              </div>
            ) : (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(156,163,175,0.2)', border: '1px solid rgba(156,163,175,0.3)', borderRadius: 20, padding: '4px 10px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ca3af', display: 'inline-block' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Inactive</span>
              </div>
            )}
            {/* Popular badge */}
            {pkg.isPopular && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 20, padding: '4px 10px' }}>
                <Star size={9} fill="#f59e0b" style={{ color: '#f59e0b' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Popular</span>
              </div>
            )}
            {isBestValue && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 20, padding: '4px 10px' }}>
                <TrendingUp size={10} style={{ color: '#10b981' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Best Value</span>
              </div>
            )}
          </div>
        </div>

        {/* Name + credits */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.2 }}>{pkg.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
            <Coins size={14} style={{ color: tier.accent }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: tier.accent }}>{formatCredits(pkg.credits)} credits</span>
          </div>
        </div>
      </div>

      {/* White body */}
      <div style={{ background: '#fff', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
        {/* Price */}
        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Price</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', lineHeight: 1, letterSpacing: '-0.02em' }}>{formatPrice(pkg.price, pkg.currency)}</div>
        </div>

        {/* Value bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Credits / Price</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151' }}>{pricePerCredit} / credit</span>
          </div>
          <div style={{ height: 6, background: '#f3f4f6', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(100, (getValueScore(pkg) / 2) * 100)}%`, background: `linear-gradient(90deg, #085299, ${tier.accent})`, borderRadius: 99, transition: 'width 0.6s ease' }} />
          </div>
        </div>

        {pkg.description && (
          <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{pkg.description}</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[`${formatCredits(pkg.credits)} voting credits`, 'Instant activation', 'No expiry date'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={14} style={{ color: '#10b981', flexShrink: 0 }} />
              <span style={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 500 }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Admin action bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6', marginTop: 'auto',
        }}>
          {/* Active toggle button */}
          <button
            onClick={() => onToggleActive(pkg)}
            title={isInactive ? 'Click to activate this package' : 'Click to deactivate this package'}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '0.4rem 0.75rem', borderRadius: '0.5rem',
              border: `1.5px solid ${!isInactive ? '#6ee7b7' : '#d1d5db'}`,
              background: !isInactive ? '#ecfdf5' : '#f9fafb',
              color: !isInactive ? '#059669' : '#9ca3af',
              fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {/* Live dot for active state */}
            <span style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              background: !isInactive ? '#10b981' : '#d1d5db',
              boxShadow: !isInactive ? '0 0 0 2px rgba(16,185,129,0.25)' : 'none',
            }} />
            {!isInactive ? 'Active' : 'Inactive'}
          </button>

          {/* Featured toggle button */}
          <button
            onClick={() => onTogglePopular(pkg)}
            title={pkg.isPopular ? 'Click to unfeature this package' : 'Click to feature this package'}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '0.4rem 0.75rem', borderRadius: '0.5rem',
              border: `1.5px solid ${pkg.isPopular ? '#fcd34d' : '#d1d5db'}`,
              background: pkg.isPopular ? '#fffbeb' : '#f9fafb',
              color: pkg.isPopular ? '#d97706' : '#9ca3af',
              fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <Star size={12} fill={pkg.isPopular ? '#f59e0b' : 'none'} style={{ color: pkg.isPopular ? '#f59e0b' : '#d1d5db' }} />
            {pkg.isPopular ? 'Featured' : 'Feature'}
          </button>

          <div style={{ flex: 1 }} />

          {/* Edit */}
          <button
            onClick={() => onEdit(pkg)}
            title="Edit"
            style={{
              width: 32, height: 32, borderRadius: '0.5rem',
              border: '1px solid #e5e7eb', background: '#f9fafb',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#374151', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#eff6ff'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#bfdbfe'; (e.currentTarget as HTMLButtonElement).style.color = '#085299'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f9fafb'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLButtonElement).style.color = '#374151'; }}
          >
            <Pencil size={13} />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(pkg)}
            title="Delete"
            style={{
              width: 32, height: 32, borderRadius: '0.5rem',
              border: '1px solid #e5e7eb', background: '#f9fafb',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#374151', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fef2f2'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#fecaca'; (e.currentTarget as HTMLButtonElement).style.color = '#dc2626'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f9fafb'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLButtonElement).style.color = '#374151'; }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}


export const CreditsPage = () => {
  const { data: packages, isLoading, error, refetch } = useCreditPackages();
  const createMutation = useCreateCreditPackage();
  const updateMutation = useUpdateCreditPackage();
  const deleteMutation = useDeleteCreditPackage();
  const toggleActiveMutation = useToggleCreditPackageActive();
  const togglePopularMutation = useToggleCreditPackagePopular();

  const [formOpen, setFormOpen] = useState(false);
  const [editPackage, setEditPackage] = useState<CreditPackage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CreditPackage | null>(null);

  const sortedPackages = packages
    ? [...packages].sort((a, b) => getValueScore(b) - getValueScore(a))
    : [];

  const activeCount = packages?.filter(p => p.isActive === true).length ?? 0;
  const featuredCount = packages?.filter(p => p.isPopular).length ?? 0;
  const totalCredits = packages?.reduce((s, p) => s + p.credits, 0) ?? 0;

  const handleOpenCreate = () => { setEditPackage(null); setFormOpen(true); };
  const handleOpenEdit = (pkg: CreditPackage) => { setEditPackage(pkg); setFormOpen(true); };
  const handleCloseForm = () => { setFormOpen(false); setEditPackage(null); };

  const handleFormSubmit = async (data: CreditPackageFormData) => {
    try {
      if (editPackage) {
        await updateMutation.mutateAsync({ id: editPackage.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      handleCloseForm();
    } catch {
      // Error is already shown via onError toast — keep the form open so user can fix it
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const isFormSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Layout>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Page Header */}
        <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #085299, #0a66c2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Coins size={18} color="#fff" />
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111827', margin: 0, letterSpacing: '-0.01em' }}>Credit Packages</h1>
            </div>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: 0, paddingLeft: 46 }}>Manage voting credit packages available to users</p>
          </div>

          <button
            onClick={handleOpenCreate}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '0.625rem 1.25rem', borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #085299, #0a66c2)',
              color: '#fff', border: 'none',
              fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(8,82,153,0.3)',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <Plus size={16} />
            Add Package
          </button>
        </div>

        {/* Stats Row */}
        {!isLoading && packages && packages.length > 0 && (
          <div style={{ display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
            <StatCard icon={Package} label="Total Packages" value={packages.length} color="#085299" bg="rgba(8,82,153,0.08)" />
            <StatCard icon={CheckCircle2} label="Active" value={activeCount} color="#10b981" bg="rgba(16,185,129,0.08)" />
            <StatCard icon={Star} label="Featured" value={featuredCount} color="#f59e0b" bg="rgba(245,158,11,0.08)" />
            <StatCard icon={Coins} label="Total Credits" value={totalCredits.toLocaleString()} color="#7c3aed" bg="rgba(124,58,237,0.08)" />
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {Array.from({ length: 5 }).map((_, i) => <PackageSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', background: '#fff', borderRadius: '1.5rem', border: '1px solid #fee2e2', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'inline-flex', padding: '1rem', background: '#fef2f2', borderRadius: '1rem', marginBottom: 16 }}>
              <AlertTriangle size={36} style={{ color: '#ef4444' }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#991b1b', margin: '0 0 8px' }}>Failed to load packages</h3>
            <p style={{ fontSize: 13, color: '#b91c1c', margin: '0 0 20px' }}>
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => refetch()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.625rem 1.25rem', borderRadius: '0.75rem', background: '#085299', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        ) : packages?.length === 0 ? (
          <div style={{ padding: '5rem 2rem', textAlign: 'center', background: '#fff', borderRadius: '1.5rem', border: '2px dashed #e5e7eb' }}>
            <div style={{ display: 'inline-flex', padding: '1.25rem', background: '#f9fafb', borderRadius: '1.25rem', marginBottom: 16 }}>
              <Coins size={40} style={{ color: '#d1d5db' }} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>No credit packages yet</h3>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>Create your first credit package to get started.</p>
            <button
              onClick={handleOpenCreate}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.625rem 1.25rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #085299, #0a66c2)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              <Plus size={14} /> Add First Package
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {sortedPackages.map((pkg, idx) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                rank={idx}
                totalPackages={sortedPackages.length}
                onEdit={handleOpenEdit}
                onDelete={setDeleteTarget}
                onToggleActive={p => toggleActiveMutation.mutate({ id: p.id, isActive: !(p.isActive === true) })}
                onTogglePopular={p => togglePopularMutation.mutate({ id: p.id, isPopular: !p.isPopular })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Form Modal */}
      <CreditPackageForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        isSubmitting={isFormSubmitting}
        editPackage={editPackage}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Package</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>"{deleteTarget?.name}"</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteMutation.error && (
            <div style={{ padding: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#dc2626', margin: 0 }}>
                {deleteMutation.error instanceof Error ? deleteMutation.error.message : 'Failed to delete package.'}
              </p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              loading={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default CreditsPage;
