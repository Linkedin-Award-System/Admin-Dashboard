import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/shared/components/layout';
import { Button } from '@/shared/design-system';
import { useCategories } from '@/features/categories/hooks/use-categories';
import { useNominees } from '@/features/nominees/hooks/use-nominees';
import { ChevronLeft, Users, BarChart2, Linkedin } from 'lucide-react';
import { formatNumber } from '@/features/dashboard/utils/format-utils';
import { useState } from 'react';

const RAILWAY_BASE = 'https://linkedin-creative-awards-api-production.up.railway.app';

const LINKEDIN_CDN_HOSTNAMES = ['media.licdn.com', 'media-exp1.licdn.com', 'media-exp2.licdn.com', 'static.licdn.com'];

function isLinkedInCdnUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return LINKEDIN_CDN_HOSTNAMES.some(h => parsed.hostname === h || parsed.hostname.endsWith('.' + h));
  } catch {
    return false;
  }
}

function resolveImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('blob:')) return url;
  // Railway-hosted uploads: proxy through Vercel to bypass Cross-Origin-Resource-Policy: same-origin
  if (url.startsWith(RAILWAY_BASE)) return `/api/fetch-image?url=${encodeURIComponent(url)}`;
  // Relative /uploads path: rewrite to absolute Railway URL then proxy
  if (url.startsWith('/uploads/')) return `/api/fetch-image?url=${encodeURIComponent(`${RAILWAY_BASE}${url}`)}`;
  // Route LinkedIn CDN URLs through the server-side proxy to avoid CORS issues
  if (isLinkedInCdnUrl(url)) return `/api/fetch-image?url=${encodeURIComponent(url)}`;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `/api/fetch-image?url=${encodeURIComponent(`${RAILWAY_BASE}${url}`)}`;
  return `/api/fetch-image?url=${encodeURIComponent(`${RAILWAY_BASE}/uploads/${url}`)}`;
}

const NomineeAvatar = ({ name, imageUrl }: { name: string; imageUrl?: string }) => {
  const [imgError, setImgError] = useState(false);
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const gradients = [
    'from-blue-500 to-indigo-600', 'from-violet-500 to-purple-600',
    'from-rose-500 to-pink-600', 'from-amber-500 to-orange-600',
    'from-emerald-500 to-teal-600', 'from-cyan-500 to-blue-600',
  ];
  const gradient = gradients[name.charCodeAt(0) % gradients.length];

  if (imageUrl && !imgError) {
    return (
      <div className="h-44 w-full overflow-hidden">
        <img
          src={resolveImageUrl(imageUrl)}
          alt={name}
          className="w-full h-full object-cover object-top"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`h-44 w-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
      <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
        <span className="text-xl font-bold text-white">{initials}</span>
      </div>
    </div>
  );
};

export const CategoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const { data: nominees, isLoading } = useNominees(id);

  const category = categories?.find((c) => c.id === id);

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl space-y-8">
        {/* Back + header */}
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/categories')}
            style={{ backgroundColor: '#ffffff', color: '#085299', border: '2px solid #085299', borderRadius: '1rem' }}
          >
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {category?.name ?? 'Category'}
            </h1>
            {category?.description && (
              <p className="text-gray-500 mt-1 text-sm">{category.description}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
            <Users size={16} className="text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">
              {isLoading ? '…' : nominees?.length ?? 0} nominees
            </span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
            <BarChart2 size={16} className="text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">
              {isLoading ? '…' : formatNumber(nominees?.reduce((s, n) => s + n.voteCount, 0) ?? 0)} total votes
            </span>
          </div>
        </div>

        {/* Nominees grid */}
        {isLoading ? (
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : nominees?.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <Users className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-600">No nominees in this category</h3>
            <p className="text-gray-400 text-sm mt-1">Nominees assigned to this category will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {[...(nominees ?? [])].sort((a, b) => b.voteCount - a.voteCount).map((nominee) => (
              <div
                key={nominee.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
                onClick={() => navigate(`/nominees/${nominee.id}`)}
              >
                <div className="relative overflow-hidden">
                  <NomineeAvatar name={nominee.fullName} imageUrl={nominee.profileImageUrl} />
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md border border-white/60">
                      <BarChart2 size={11} className="text-blue-600" />
                      <span className="text-xs font-bold text-gray-800">{formatNumber(nominee.voteCount)}</span>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="flex flex-col flex-1 p-4">
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                    {nominee.fullName}
                  </h4>
                  {nominee.organization && (
                    <p className="text-xs text-blue-600 font-medium mt-0.5 line-clamp-1">{nominee.organization}</p>
                  )}
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mt-2 flex-1">
                    {nominee.shortBiography}
                  </p>
                  <a
                    href={nominee.linkedInProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 flex items-center justify-center gap-1.5 h-8 rounded-lg bg-[#0a66c2]/8 text-[#0a66c2] hover:bg-[#0a66c2] hover:text-white text-xs font-semibold transition-all border border-[#0a66c2]/20 hover:border-[#0a66c2]"
                  >
                    <Linkedin size={12} />
                    LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryDetailPage;
