import { AlertCircle, RefreshCw } from 'lucide-react';

export function ChartError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, border: '1px solid #fecaca',
      padding: '20px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', minHeight: 200,
      textAlign: 'center', gap: 10,
    }}>
      <AlertCircle size={28} style={{ color: '#ef4444' }} />
      <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: 0 }}>Failed to load chart data</p>
      <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{error.message}</p>
      <button
        onClick={onRetry}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 8,
          border: '1px solid #e5e7eb', background: '#fff',
          fontSize: 12, fontWeight: 600, color: '#374151',
          cursor: 'pointer',
        }}
      >
        <RefreshCw size={13} /> Retry
      </button>
    </div>
  );
}
