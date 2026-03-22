import { LayoutGrid, List } from 'lucide-react';

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const activeStyle: React.CSSProperties = {
  background: '#eff6ff',
  color: '#085299',
  border: '1px solid #bfdbfe',
  borderRadius: '0.5rem',
  padding: '0.375rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const ghostStyle: React.CSSProperties = {
  background: 'transparent',
  color: '#9ca3af',
  border: '1px solid transparent',
  borderRadius: '0.5rem',
  padding: '0.375rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      <button
        type="button"
        aria-label="Grid view"
        aria-pressed={value === 'grid'}
        onClick={() => onChange('grid')}
        style={value === 'grid' ? activeStyle : ghostStyle}
      >
        <LayoutGrid size={18} />
      </button>
      <button
        type="button"
        aria-label="List view"
        aria-pressed={value === 'list'}
        onClick={() => onChange('list')}
        style={value === 'list' ? activeStyle : ghostStyle}
      >
        <List size={18} />
      </button>
    </div>
  );
}
