import { BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export function ChartEmpty({
  message = 'No data available',
  icon: Icon = BarChart3,
}: {
  message?: string;
  icon?: LucideIcon;
}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100%', minHeight: 160,
      textAlign: 'center', gap: 10,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: '#f9fafb', border: '1px solid #e5e7eb',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} style={{ color: '#d1d5db' }} />
      </div>
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', margin: 0 }}>{message}</p>
        <p style={{ fontSize: 11, color: '#9ca3af', margin: '3px 0 0' }}>Data will appear here once available</p>
      </div>
    </div>
  );
}
