# PageHeader Component

A pattern component that provides consistent page header styling across all pages in the LinkedIn Creative Awards Admin Dashboard.

## Features

- **Title**: Main page heading with 24px semibold font
- **Subtitle**: Optional secondary description text with 14px regular font
- **Actions**: Optional action buttons aligned to the right on desktop
- **Breadcrumbs**: Optional navigation breadcrumbs
- **Responsive**: Actions stack below title on mobile viewports (< 640px)
- **Consistent Spacing**: 32px bottom margin, 8px title-to-subtitle spacing

## Usage

### Basic Example

```tsx
import { PageHeader } from '@/shared/design-system/patterns';

function MyPage() {
  return (
    <div>
      <PageHeader title="Dashboard" />
      {/* Page content */}
    </div>
  );
}
```

### With Subtitle

```tsx
<PageHeader 
  title="Dashboard" 
  subtitle="View key metrics and analytics"
/>
```

### With Actions

```tsx
import { Button } from '@/shared/design-system/components';

<PageHeader 
  title="Categories" 
  actions={<Button>Create Category</Button>}
/>
```

### With Multiple Actions

```tsx
<PageHeader 
  title="Nominees"
  actions={
    <div className="flex gap-2">
      <Button variant="secondary">Export</Button>
      <Button>Add Nominee</Button>
    </div>
  }
/>
```

### With Breadcrumbs

```tsx
<PageHeader 
  title="Edit Category"
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/categories' },
    { label: 'Edit' }
  ]}
/>
```

### Complete Example

```tsx
<PageHeader 
  title="Nominees"
  subtitle="Manage award nominees"
  actions={
    <div className="flex gap-2">
      <Button variant="secondary">Export</Button>
      <Button>Add Nominee</Button>
    </div>
  }
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Nominees' }
  ]}
/>
```

## Props

### PageHeaderProps

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | Yes | - | Page title (24px semibold, #111827) |
| `subtitle` | `string` | No | - | Optional subtitle (14px regular, #6b7280) |
| `actions` | `React.ReactNode` | No | - | Optional action buttons (aligned right on desktop) |
| `breadcrumbs` | `Breadcrumb[]` | No | - | Optional breadcrumbs navigation |
| `className` | `string` | No | - | Additional CSS classes |

### Breadcrumb

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | Yes | Breadcrumb label text |
| `href` | `string` | No | Optional link href (renders as link if provided, plain text otherwise) |

## Styling Details

### Title
- Font size: 24px (1.5rem)
- Font weight: 600 (semibold)
- Color: #111827 (gray-900)
- Line height: 1.2 (tight)

### Subtitle
- Font size: 14px (0.875rem)
- Font weight: 400 (regular)
- Color: #6b7280 (gray-500)
- Top margin: 8px (mt-2)

### Actions
- Desktop: Aligned to right, same row as title
- Mobile (< 640px): Stacked below title with 16px gap

### Container
- Bottom margin: 32px (mb-8)

### Breadcrumbs
- Font size: 14px (text-sm)
- Color: #6b7280 (gray-500)
- Active item: #111827 (gray-900) with medium weight
- Separator: "/" with #9ca3af (gray-400)
- Bottom margin: 16px (mb-4)

## Responsive Behavior

### Desktop (≥ 640px)
- Title and actions in same row
- Actions aligned to right
- Horizontal layout with space-between

### Mobile (< 640px)
- Title and actions stack vertically
- 16px gap between elements
- Full width layout

## Accessibility

- Uses semantic HTML (`<h1>` for title, `<nav>` for breadcrumbs)
- Breadcrumbs wrapped in `<nav>` with `aria-label="Breadcrumb"`
- Proper heading hierarchy (h1 for page title)
- Links have hover states for keyboard navigation

## Requirements Validation

This component validates the following requirements from the comprehensive UI polish spec:

- **Requirement 5.1**: Title styled with 24px semibold font (#111827)
- **Requirement 5.2**: Subtitle styled with 14px regular font (#6b7280)
- **Requirement 5.3**: Actions aligned to right on desktop
- **Requirement 5.4**: 32px bottom margin applied
- **Requirement 5.5**: 8px vertical spacing between title and subtitle
- **Requirement 5.6**: Responsive layout collapsing to vertical stack on mobile
- **Requirement 5.7**: Consistent styling across all pages

## Examples in Application

### Dashboard Page
```tsx
<PageHeader 
  title="Dashboard" 
  subtitle="Welcome back! Here's an overview of your awards program."
/>
```

### Categories Page
```tsx
<PageHeader 
  title="Categories" 
  subtitle="Manage award categories"
  actions={<Button>Create Category</Button>}
/>
```

### Nominees Page
```tsx
<PageHeader 
  title="Nominees" 
  subtitle="Manage award nominees"
  actions={
    <div className="flex gap-2">
      <Button variant="secondary">Export</Button>
      <Button>Add Nominee</Button>
    </div>
  }
/>
```

### Voting Page
```tsx
<PageHeader 
  title="Voting Analytics" 
  subtitle="Track voting activity and trends"
  actions={<Button variant="secondary">Export Report</Button>}
/>
```

### Payments Page
```tsx
<PageHeader 
  title="Payments" 
  subtitle="View payment transactions and revenue"
  actions={<Button variant="secondary">Export Transactions</Button>}
/>
```

### Content Page
```tsx
<PageHeader 
  title="Content Management" 
  subtitle="Edit website content and images"
  actions={<Button>Save Changes</Button>}
/>
```

## Testing

The component includes comprehensive unit tests covering:

- Basic rendering (title, subtitle, actions, breadcrumbs)
- Styling validation (font sizes, colors, spacing)
- Responsive layout classes
- Conditional rendering (optional props)
- Custom props and className forwarding
- Accessibility attributes

Run tests:
```bash
npm test PageHeader.test.tsx
```

## Related Components

- [Button](../../components/Button/README.md) - Used for actions
- [Card](../../components/Card/README.md) - Often used below PageHeader
- [Badge](../../components/Badge/README.md) - Can be used in actions or title

## Design Tokens Used

- **Typography**: `typography.pageTitle`, `typography.body`
- **Colors**: `text.primary`, `text.secondary`
- **Spacing**: `spacing.xs`, `spacing.lg`
