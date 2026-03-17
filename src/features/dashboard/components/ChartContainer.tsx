import type { LucideIcon } from 'lucide-react';
import { type ReactNode, isValidElement } from 'react';

export function ChartContainer({
  title,
  icon: Icon,
  children,
  chartHeight = '260px',
}: {
  title: string;
  icon: LucideIcon | ReactNode;
  children?: ReactNode;
  className?: string;
  isLoading?: boolean;
  chartHeight?: string;
  description?: string;
}) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      border: '1px solid #f0f0f0',
      padding: '16px 18px 14px',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, flexShrink: 0 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7,
          background: '#f0f7ff',
          border: '1px solid #dbeafe',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {isValidElement(Icon) ? Icon : typeof Icon === 'function'
            ? <Icon size={14} style={{ color: '#0a66c2' }} />
            : null}
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', letterSpacing: '0.01em' }}>{title}</span>
      </div>

      {/* Chart area — explicit height so Recharts ResponsiveContainer always has a pixel size */}
      <div style={{ height: chartHeight, minHeight: chartHeight, flexShrink: 0 }}>
        {children}
      </div>
    </div>
  );
}
