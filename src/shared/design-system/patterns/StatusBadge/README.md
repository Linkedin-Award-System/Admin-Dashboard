# StatusBadge Pattern Component

A specialized Badge component for status indicators that automatically maps status values to appropriate badge variants.

## Overview

The StatusBadge component wraps the Badge component and provides semantic status mapping. It accepts a status prop and automatically determines the correct badge variant based on common status values.

## Features

- **Automatic Status Mapping**: Maps common status values to appropriate badge variants
- **Extensible**: Supports custom status values with default neutral styling
- **Flexible Labels**: Use status value or provide custom label
- **Variant Override**: Explicitly set variant when needed
- **Type-Safe**: Full TypeScript support with type definitions
- **Accessible**: Inherits accessibility features from Badge component

## Status Mappings

| Status | Badge Variant | Color | Use Case |
|--------|---------------|-------|----------|
| `active` | success | Green (#10b981) | Active items, enabled features |
| `pending` | warning | Yellow (#f59e0b) | Awaiting action, in review |
| `completed` | success | Green (#10b981) | Finished tasks, successful operations |
| `failed` | error | Red (#ef4444) | Failed operations, errors |
| `inactive` | neutral | Gray (#6b7280) | Disabled items, archived content |
| *custom* | neutral | Gray (#6b7280) | Any other status value |

## Usage

### Basic Usage

```tsx
import { StatusBadge } from '@/shared/design-system/patterns/StatusBadge';

// Common status values
<StatusBadge status="active" />
<StatusBadge status="pending" />
<StatusBadge status="completed" />
<StatusBadge status="failed" />
<StatusBadge status="inactive" />
```

### Size Variants

```tsx
// Small badge (12px font, 4px-12px padding)
<StatusBadge status="active" size="sm" />

// Medium badge (14px font, 6px-16px padding) - default
<StatusBadge status="active" size="md" />
```

### Custom Labels

```tsx
// Use custom label instead of status value
<StatusBadge status="active">Currently Active</StatusBadge>
<StatusBadge status="pending">Awaiting Approval</StatusBadge>
<StatusBadge status="failed">Error Occurred</StatusBadge>
```

### Custom Status Values

```tsx
// Custom status values default to neutral variant
<StatusBadge status="in-progress" />
<StatusBadge status="not_started" />
<StatusBadge status="on hold" />
```

### Explicit Variant Override

```tsx
// Override automatic mapping with explicit variant
<StatusBadge status="processing" variant="info" />
<StatusBadge status="verified" variant="success" />
<StatusBadge status="attention" variant="warning" />
```

### In Tables

```tsx
<table>
  <tbody>
    <tr>
      <td>Project Alpha</td>
      <td>
        <StatusBadge status="active" size="sm" />
      </td>
    </tr>
    <tr>
      <td>Project Beta</td>
      <td>
        <StatusBadge status="pending" size="sm" />
      </td>
    </tr>
  </tbody>
</table>
```

### In Cards

```tsx
<div className="card">
  <div className="flex items-center justify-between">
    <h3>Nominee Name</h3>
    <StatusBadge status="active" size="sm" />
  </div>
  <p>Additional details...</p>
</div>
```

## API Reference

### StatusBadge Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `StatusValue` | - | **Required.** Status value to display |
| `children` | `ReactNode` | - | Optional custom label (overrides formatted status) |
| `variant` | `BadgeVariant` | - | Optional explicit variant override |
| `size` | `'sm' \| 'md'` | `'md'` | Badge size |
| `className` | `string` | - | Additional CSS classes |

### StatusValue Type

```typescript
type StatusValue = 
  | 'active' 
  | 'pending' 
  | 'completed' 
  | 'failed' 
  | 'inactive'
  | string; // Custom status values
```

### getStatusVariant Utility

Export utility function for status-to-variant mapping:

```typescript
import { getStatusVariant } from '@/shared/design-system/patterns/StatusBadge';

const variant = getStatusVariant('active'); // Returns 'success'
const variant = getStatusVariant('pending'); // Returns 'warning'
const variant = getStatusVariant('custom'); // Returns 'neutral'
```

## Status Formatting

The component automatically formats status values for display:

- Capitalizes first letter of each word
- Handles hyphenated values: `in-progress` → `In Progress`
- Handles underscore-separated values: `not_started` → `Not Started`
- Handles space-separated values: `on hold` → `On Hold`
- Case-insensitive: `ACTIVE`, `Active`, `active` all work

## Styling

The StatusBadge inherits all styling from the Badge component:

- **Border Radius**: Full (9999px)
- **Font Weight**: Semibold (600)
- **Text Transform**: Uppercase
- **Letter Spacing**: 0.05em
- **Padding**: 4px-12px (sm), 6px-16px (md)
- **Font Size**: 12px (sm), 14px (md)

## Accessibility

- Inherits accessibility features from Badge component
- Status text is readable by screen readers
- Color is not the only indicator (text label included)
- Sufficient color contrast for all variants

## Requirements Validation

This component validates the following requirements from the comprehensive UI polish spec:

- **Requirement 7.3**: Display Status_Badge elements with appropriate colors
- **Requirement 7.7**: Apply consistent styling across all pages with tables

## Examples

See `StatusBadge.examples.tsx` for comprehensive usage examples including:
- Common status values
- Size variants
- Custom status values
- Custom labels
- Explicit variant overrides
- Table context
- Card context
- Case insensitivity

## Related Components

- **Badge**: Base component for status indicators
- **PageHeader**: Pattern component for page headers
- **DataTable**: Pattern component for tables (uses StatusBadge)
