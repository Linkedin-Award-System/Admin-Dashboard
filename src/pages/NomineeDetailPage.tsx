import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '@/shared/components/layout';
import { useNominee } from '@/features/nominees/hooks/use-nominees';
import { useVotersByNominee } from '@/features/voting/hooks/use-voting';
import {
  ArrowLeft, Users, BarChart2, Linkedin, Mail, Calendar,
  Trophy, ChevronLeft, ChevronRight, Vote,
} from 'lucide-react';
import { formatNumber, formatDateTime } from '@/features/dashboard/utils/format-utils';

const RAILWAY_BASE = 'https://linkedin-creative-awards-api-production.up.railway.app';
function resolveImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('blob:')) return url;
  // Strip absolute Railway URL → relative so it goes through the Vite proxy
  if (url.startsWith(RAILWAY_BASE)) return url.slice(RAILWAY_BASE.length);
  if (url.startsWith('/')) return url;
  return `/uploads/${url}`;
}

const VOTERS_PER_PAGE = 20;

export function NomineeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const backLabel: string = (location.state as { backLabel?: string } | null)?.backLabel ?? 'Back to Nominees';
  const [page, setPage] = useState(1);
  const [imgError, setImgError] = useState(false);

  const { data: nominee, isLoading: loadingNominee } = useNominee(id ?? '');
  const { data: votersData, isLoading: loadingVoters } = useVotersByNominee(
    id ?? '', page, VOTERS_PER_PAGE
  );

  if (loadingNominee) {
    return (
      <Layout>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ height: 200, background: '#f3f4f6', borderRadius: 16, marginBottom: 20 }} />
          <div style={{ height: 40, background: '#f3f4f6', borderRadius: 8, width: '40%', marginBottom: 12 }} />
          <div style={{ height: 20, background: '#f3f4f6', borderRadius: 8, width: '60%' }} />
        </div>
      </Layout>
    );
  }

  if (!nominee) {
    return (
      <Layout>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: 16 }}>Nominee not found.</p>
          <button onClick={() => navigate(-1)} style={{ marginTop: 16, color: '#085299', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
            ← {backLabel}
          </button>
        </div>
      </Layout>
    );
  }

  const voters = votersData?.voters ?? [];
  const totalVoters = votersData?.total ?? 0;
  const totalPages = votersData?.totalPages ?? 1;

  return (
    <Layout>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 48px' }}>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            marginBottom: 24, color: '#6b7280', fontSize: 13, fontWeight: 600,
            background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#085299')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
        >
          <ArrowLeft size={16} /> {backLabel}
        </button>

        {/* Profile card */}
        <div style={{
          background: '#fff', borderRadius: 20, border: '1px solid #f0f0f0',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: 24,
        }}>
          {/* Cover / image */}
          <div style={{ height: 200, background: 'linear-gradient(135deg, #0b1a35 0%, #0e2147 100%)', position: 'relative', overflow: 'hidden' }}>
            {nominee.profileImageUrl && !imgError ? (
              <img
                src={resolveImageUrl(nominee.profileImageUrl)}
                alt={nominee.fullName}
                onError={() => setImgError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', background: 'transparent' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 32, fontWeight: 900, color: '#fff',
                }}>
                  {nominee.fullName.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>{nominee.fullName}</h1>
                {nominee.organization && (
                  <p style={{ fontSize: 13, color: '#0a66c2', fontWeight: 600, marginTop: 4 }}>{nominee.organization}</p>
                )}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <a
                  href={nominee.linkedInProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 10,
                    background: '#0a66c2', color: '#fff',
                    fontSize: 12, fontWeight: 600, textDecoration: 'none',
                  }}
                >
                  <Linkedin size={14} /> LinkedIn
                </a>
              </div>
            </div>

            <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7, marginTop: 14 }}>
              {nominee.shortBiography}
            </p>

            {/* Categories */}
            {nominee.categories?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                {nominee.categories.map(cat => (
                  <span key={cat.id} style={{
                    padding: '4px 12px', borderRadius: 20,
                    background: '#eff6ff', color: '#1d4ed8',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                  }}>
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 20, marginTop: 20, flexWrap: 'wrap' }}>
              {[
                { icon: BarChart2, label: 'Total Votes', value: formatNumber(nominee.voteCount), color: '#0a66c2' },
                { icon: Users, label: 'Unique Voters', value: formatNumber(totalVoters), color: '#7c3aed' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 16px', borderRadius: 12,
                  background: '#f9fafb', border: '1px solid #f0f0f0',
                }}>
                  <Icon size={16} style={{ color }} />
                  <div>
                    <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1 }}>{value}</p>
                    <p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Voter list */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #f0f0f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Vote size={17} style={{ color: '#0a66c2' }} />
              </div>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Registered Voters</h2>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: 0, marginTop: 2 }}>
                  {formatNumber(totalVoters)} voter{totalVoters !== 1 ? 's' : ''} · Page {page} of {totalPages}
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          {loadingVoters ? (
            <div style={{ padding: '40px 24px' }}>
              {Array(5).fill(0).map((_, i) => (
                <div key={i} style={{ height: 52, background: '#f9fafb', borderRadius: 10, marginBottom: 8 }} />
              ))}
            </div>
          ) : voters.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <Trophy size={40} style={{ color: '#d1d5db', margin: '0 auto 12px' }} />
              <p style={{ color: '#6b7280', fontWeight: 600 }}>No votes recorded yet</p>
              <p style={{ color: '#9ca3af', fontSize: 12, marginTop: 4 }}>Voters will appear here once voting begins</p>
            </div>
          ) : (
            <>
              {/* Column headers */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr auto auto auto',
                padding: '10px 24px', background: '#f9fafb',
                borderBottom: '1px solid #f3f4f6',
                fontSize: 10, fontWeight: 700, color: '#9ca3af',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                <span>Voter</span>
                <span style={{ textAlign: 'center', minWidth: 80 }}>Votes</span>
                <span style={{ textAlign: 'center', minWidth: 80 }}>Type</span>
                <span style={{ textAlign: 'right', minWidth: 140 }}>Date</span>
              </div>

              {voters.map((voter, idx) => (
                <div
                  key={`${voter.userId}-${idx}`}
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr auto auto auto',
                    padding: '14px 24px', alignItems: 'center',
                    borderBottom: idx < voters.length - 1 ? '1px solid #f9fafb' : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Voter ID */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: 'linear-gradient(135deg, #0a66c2, #1d4ed8)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Mail size={13} style={{ color: '#fff' }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block' }}>
                        Voter
                      </span>
                      <span style={{
                        fontSize: 11, color: '#9ca3af', fontFamily: 'monospace',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        display: 'block', maxWidth: 220,
                      }}>
                        {voter.userId}
                      </span>
                    </div>
                  </div>

                  {/* Vote count */}
                  <div style={{ textAlign: 'center', minWidth: 80 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '3px 10px', borderRadius: 20,
                      background: '#eff6ff', color: '#1d4ed8',
                      fontSize: 12, fontWeight: 700,
                    }}>
                      <BarChart2 size={11} />
                      {voter.quantity}
                    </span>
                  </div>

                  {/* Type */}
                  <div style={{ textAlign: 'center', minWidth: 80 }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20,
                      background: voter.type === 'PREMIUM' ? '#fdf4ff' : '#f0fdf4',
                      color: voter.type === 'PREMIUM' ? '#7c3aed' : '#16a34a',
                      fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}>
                      {voter.type}
                    </span>
                  </div>

                  {/* Date */}
                  <div style={{ textAlign: 'right', minWidth: 140 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 5 }}>
                      <Calendar size={11} style={{ color: '#9ca3af' }} />
                      <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>
                        {formatDateTime(voter.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              padding: '16px 24px', borderTop: '1px solid #f3f4f6',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                Showing {((page - 1) * VOTERS_PER_PAGE) + 1}–{Math.min(page * VOTERS_PER_PAGE, totalVoters)} of {formatNumber(totalVoters)}
              </p>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    height: 34, width: 34, borderRadius: 8, border: '1px solid #e5e7eb',
                    background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: page === 1 ? '#d1d5db' : '#374151',
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={{
                        height: 34, width: 34, borderRadius: 8,
                        border: page === p ? 'none' : '1px solid #e5e7eb',
                        background: page === p ? '#085299' : '#fff',
                        color: page === p ? '#fff' : '#374151',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    height: 34, width: 34, borderRadius: 8, border: '1px solid #e5e7eb',
                    background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: page === totalPages ? '#d1d5db' : '#374151',
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default NomineeDetailPage;
