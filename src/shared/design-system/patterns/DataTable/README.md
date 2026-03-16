# DataTable Component

Professional table component with columns, data, loading states, and interactive features.

## Features

- ✅ Column configuration (label, accessor, align, render)
- ✅ Data array of objects
- ✅ Loading state with Skeleton components
- ✅ Empty state with custom message
- ✅ Row click handler for interactive tables
- ✅ Zebra striping for better readability
- ✅ Hover effects for interactive feedback
- ✅ Responsive behavior with horizontal scrolling
- ✅ Professional styling with design system tokens

## Usage

### Basic Table

```tsx
import { DataTable } from '@/shared/design-system/patterns/DataTable';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' }
];

const data = [
  { name: 'John Doe', email: 'john@example.com', status: 'active' },
  { name: 'Jane Smith', email: 'jane@example.com', status: 'pending' }
];

<DataTable columns={columns} data={data} />
```

### With Custom Alignment

```tsx
const columns = [
  { key: 'name', label: 'Name', align: 'left' },
  { key: 'amount', label: 'Amount', align: 'right' },
  { key: 'status', label: 'Status', align: 'center' }
];

<DataTable columns={columns} data={data} />
```

### With Custom Rendering

```tsx
import { StatusBadge } from '@/shared/design-system/patterns/StatusBadge';

const columns = [
  { 
    key: 'amount', 
    label: 'Amount', 
    align: 'right',
    render: (value) => `$${value.toFixed(2)}`
  },
  { 
    key: 'status', 
    label: 'Status',
    render: (value) => <StatusBadge status={value} />
  }
];

<DataTable columns={columns} data={data} />
```

### With Loading State

```tsx
<DataTable 
  columns={columns} 
  data={[]} 
  loading={true}
/>
```

### With Empty State

```tsx
<DataTable 
  columns={columns} 
  data={[]} 
  emptyMessage="No records found"
/>
```

### With Row Click Handler

```tsx
const handleRowClick = (row) => {
  console.log('Clicked row:', row);
};

<DataTable 
  columns={columns} 
  data={data}
  onRowClick={handleRowClick}
/>
```

## Props

### DataTableProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `DataTableColumn[]` | Required | Column definitions |
| `data` | `T[]` | Required | Data array of objects |
| `loading` | `boolean` | `false` | Loading state - displays skeleton rows |
| `emptyMessage` | `string` | `"No data available"` | Message to display when data is empty |
| `onRowClick` | `(row: T) => void` | `undefined` | Row click handler for interactive tables |
| `className` | `string` | `undefined` | Additional CSS classes |

### DataTableColumn

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `key` | `string` | Required | Unique key for the column (matches data object key) |
| `label` | `string` | Required | Column header label |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Text alignment for the column |
| `render` | `(value: any, row: T) => React.ReactNode` | `undefined` | Custom render function for cell content |

## Styling Details

### Headers
- Font size: 12px (0.75rem)
- Font weight: 500 (medium)
- Text transform: uppercase
- Letter spacing: wider (0.05em)
- Color: #6b7280 (gray-500)

### Cells
- Padding: 12px (px-3 py-3)
- Font size: 14px (0.875rem)
- Color: #111827 (gray-900)

### Borders
- Border width: 1px
- Border color: #e5e7eb (gray-200)
- Border style: solid

### Row Hover
- Background color: #f9fafb (gray-50)
- Transition: colors (200ms)

### Zebra Striping
- Odd rows: white background
- Even rows: #f9fafb (gray-50) background

### Alignment
- Text columns: left-aligned
- Numeric columns: right-aligned
- Status columns: center-aligned (recommended)

## Requirements Validated

- ✅ **Requirement 7.1**: Headers styled with 12px uppercase medium weight text (#6b7280)
- ✅ **Requirement 7.2**: Row hover with background color change (#f9fafb)
- ✅ **Requirement 7.3**: Status badges with appropriate colors
- ✅ **Requirement 7.4**: 12px cell padding
- ✅ **Requirement 7.5**: 1px solid borders (#e5e7eb)
- ✅ **Requirement 7.6**: Zebra striping with alternate row backgrounds
- ✅ **Requirement 7.7**: Numeric columns right-aligned, text columns left-aligned
- ✅ **Requirement 7.8**: Consistent styling across all pages with tables

## Accessibility

- Semantic HTML table structure (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`)
- Proper heading hierarchy with `<th>` elements
- `aria-busy="true"` on skeleton loading elements
- Keyboard navigation support for clickable rows
- Screen reader friendly empty state messages

## Responsive Behavior

- Horizontal scrolling on small screens (`overflow-x-auto`)
- Full width table layout (`w-full`)
- Touch-friendly row click targets
- Maintains readability at all viewport sizes

## Best Practices

1. **Column Alignment**: Use `align: 'right'` for numeric columns, `align: 'left'` for text columns
2. **Custom Rendering**: Use the `render` prop for formatting values (currency, dates, badges)
3. **Loading States**: Always show loading state while fetching data
4. **Empty States**: Provide helpful empty messages to guide users
5. **Row Click**: Only use `onRowClick` when rows are truly interactive (e.g., navigating to detail page)
6. **Status Badges**: Use `StatusBadge` component in render functions for status columns

## Examples

See `DataTable.examples.tsx` for comprehensive usage examples including:
- Basic table
- Custom alignment
- Custom rendering
- Loading state
- Empty state
- Interactive table with row click
- Responsive table with many columns

## Testing

The component includes comprehensive tests covering:
- Basic rendering
- Loading states
- Column alignment
- Custom rendering
- Row click handlers
- Styling requirements
- Accessibility
- Responsive behavior
- Edge cases

Run tests with:
```bash
npm test DataTable.test.tsx
```
