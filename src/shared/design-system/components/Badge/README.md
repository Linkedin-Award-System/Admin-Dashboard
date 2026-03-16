# Badge Component

Status indicator badge with color-coded variants for displaying states and labels.

## Features

- **Multiple Variants**: success, warning, error, info, neutral
- **Two Sizes**: sm (small), md (medium)
- **Full Border Radius**: Pill-shaped design (9999px)
- **Uppercase Text**: Automatic text transformation
- **Semantic Colors**: Color-coded for different states

## Usage

### Basic Usage

```tsx
import { Badge } from '@/shared/design-system/components';

// Success badge
<Badge variant="success">Active</Badge>

// Warning badge
<Badge variant="warning">Pending</Badge>

// Error badge
<Badge variant="error">Failed</Badge>

// Info badge
<Badge variant="info">New</Badge>

// Neutral badge (default)
<Badge variant="neutral">Inactive</Badge>
```

### Sizes

```tsx
// Small badge
<Badge variant="success" size="sm">Active</Badge>

// Medium badge (default)
<Badge variant="success" size="md">Active</Badge>
```

### Custom Styling

```tsx
// Add custom classes
<Badge variant="success" className="ml-2">
  Active
</Badge>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'success' \| 'warning' \| 'error' \| 'info' \| 'neutral'` | `'neutral'` | Badge color variant |
| `size` | `'sm' \| 'md'` | `'md'` | Badge size |
| `children` | `React.ReactNode` | - | Badge content (required) |
| `className` | `string` | - | Additional CSS classes |

## Variants

### Success
- **Color**: Green (#10b981)
- **Use Case**: Active states, completed actions, success messages

### Warning
- **Color**: Yellow (#f59e0b)
- **Use Case**: Pending states, warnings, attention needed

### Error
- **Color**: Red (#ef4444)
- **Use Case**: Failed states, errors, critical issues

### Info
- **Color**: LinkedIn Blue (#0a66c2)
- **Use Case**: Informational states, new items, highlights

### Neutral
- **Color**: Gray (#6b7280)
- **Use Case**: Inactive states, default labels, neutral information

## Styling Details

### Small (sm)
- **Padding**: 4px vertical, 12px horizontal
- **Font Size**: 12px
- **Font Weight**: 600 (semibold)
- **Text Transform**: Uppercase
- **Letter Spacing**: 0.05em

### Medium (md)
- **Padding**: 6px vertical, 16px horizontal
- **Font Size**: 14px
- **Font Weight**: 600 (semibold)
- **Text Transform**: Uppercase
- **Letter Spacing**: 0.05em

## Examples

### Status Indicators

```tsx
// Payment status
<Badge variant="success">Paid</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>

// User status
<Badge variant="success">Active</Badge>
<Badge variant="neutral">Inactive</Badge>

// Vote status
<Badge variant="info">Voted</Badge>
<Badge variant="neutral">Not Voted</Badge>
```

### In Tables

```tsx
<table>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>
        <Badge variant="success" size="sm">Active</Badge>
      </td>
    </tr>
    <tr>
      <td>Jane Smith</td>
      <td>
        <Badge variant="warning" size="sm">Pending</Badge>
      </td>
    </tr>
  </tbody>
</table>
```

### With Icons

```tsx
import { Check, AlertCircle, X } from 'lucide-react';

<Badge variant="success">
  <Check className="w-3 h-3 mr-1" />
  Completed
</Badge>

<Badge variant="warning">
  <AlertCircle className="w-3 h-3 mr-1" />
  Pending
</Badge>

<Badge variant="error">
  <X className="w-3 h-3 mr-1" />
  Failed
</Badge>
```

## Accessibility

- Uses semantic HTML (`<div>` with appropriate ARIA attributes if needed)
- High contrast colors for readability
- Uppercase text with increased letter spacing for clarity
- Can be used with screen reader text for additional context

## Design Tokens

The Badge component uses the following design tokens:

- **Colors**: `colors.success[500]`, `colors.warning[500]`, `colors.error[500]`, `colors.primary[600]`, `colors.gray[500]`
- **Border Radius**: Full (9999px)
- **Font Weight**: 600 (semibold)
- **Letter Spacing**: 0.05em

## Requirements

Validates requirements:
- 7.3: Status badge elements with appropriate colors
- 7.7: Badge styling in tables
- 16.4: Status badge styling in voting page
- 17.4: Status badge styling in payments page
