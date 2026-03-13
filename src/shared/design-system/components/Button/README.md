# Button Component

Enhanced button component with LinkedIn Blue styling, multiple variants, sizes, and interactive states.

## Features

- ✅ Multiple variants (primary, secondary, danger, ghost, icon)
- ✅ Three sizes (sm, md, lg)
- ✅ Loading state with spinner
- ✅ Icon support
- ✅ Full width option
- ✅ Hover effects (shadow increase, scale 1.02)
- ✅ Active effects (scale 0.98)
- ✅ 200-300ms smooth transitions
- ✅ 8px border radius
- ✅ 12px vertical and 24px horizontal padding (md size)
- ✅ Fully accessible with keyboard navigation
- ✅ TypeScript support with full type safety

## Usage

### Basic Usage

```tsx
import { Button } from '@/shared/design-system';

function MyComponent() {
  return <Button>Click me</Button>;
}
```

### Variants

```tsx
// Primary (default) - LinkedIn Blue background
<Button variant="primary">Primary Button</Button>

// Secondary - White background with LinkedIn Blue border
<Button variant="secondary">Secondary Button</Button>

// Danger - Red background for destructive actions
<Button variant="danger">Delete</Button>

// Ghost - Transparent background, minimal styling
<Button variant="ghost">Cancel</Button>

// Icon - Square button for icon-only actions
<Button variant="icon"><Settings /></Button>
```

### Sizes

```tsx
// Small
<Button size="sm">Small Button</Button>

// Medium (default)
<Button size="md">Medium Button</Button>

// Large
<Button size="lg">Large Button</Button>
```

### Loading State

```tsx
<Button loading>Saving...</Button>
```

### With Icon

```tsx
import { Plus } from 'lucide-react';

<Button icon={<Plus />}>Add Item</Button>
```

### Full Width

```tsx
<Button fullWidth>Submit Form</Button>
```

### Disabled

```tsx
<Button disabled>Disabled Button</Button>
```

### Custom Styling

```tsx
<Button className="mt-4">Custom Margin</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'ghost' \| 'icon'` | `'primary'` | Button visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `loading` | `boolean` | `false` | Show loading spinner and disable button |
| `icon` | `React.ReactNode` | `undefined` | Icon to display before button text |
| `fullWidth` | `boolean` | `false` | Make button full width |
| `disabled` | `boolean` | `false` | Disable button |
| `className` | `string` | `undefined` | Additional CSS classes |
| `children` | `React.ReactNode` | `undefined` | Button content |
| `onClick` | `(event: React.MouseEvent) => void` | `undefined` | Click handler |

All standard HTML button attributes are also supported.

## Styling Details

### Primary Variant
- Background: LinkedIn Blue (#0a66c2)
- Text: White
- Shadow: LinkedIn Blue tinted shadow
- Hover: Darker blue, increased shadow, scale 1.02
- Active: Scale 0.98

### Secondary Variant
- Background: White
- Border: 2px LinkedIn Blue
- Text: LinkedIn Blue
- Hover: Light blue background, increased shadow, scale 1.02
- Active: Scale 0.98

### Danger Variant
- Background: Red (#ef4444)
- Text: White
- Shadow: Red tinted shadow
- Hover: Darker red, increased shadow, scale 1.02
- Active: Scale 0.98

### Ghost Variant
- Background: Transparent
- Text: Gray
- Hover: Light gray background, scale 1.02
- Active: Scale 0.98

### Icon Variant
- Background: Transparent
- Text: Gray
- Square shape (equal width and height)
- Hover: Light gray background, scale 1.02
- Active: Scale 0.98

## Accessibility

- Fully keyboard accessible
- Focus visible ring for keyboard navigation
- Disabled state prevents interaction
- Loading state disables button and shows visual feedback
- Semantic HTML button element
- ARIA attributes supported

## Examples

### Form Submit Button

```tsx
<form onSubmit={handleSubmit}>
  <Button type="submit" loading={isSubmitting} fullWidth>
    {isSubmitting ? 'Saving...' : 'Save Changes'}
  </Button>
</form>
```

### Action Buttons

```tsx
<div className="flex gap-4">
  <Button variant="primary" onClick={handleSave}>
    Save
  </Button>
  <Button variant="secondary" onClick={handleCancel}>
    Cancel
  </Button>
  <Button variant="danger" onClick={handleDelete}>
    Delete
  </Button>
</div>
```

### Icon Buttons

```tsx
import { Settings, Edit, Trash } from 'lucide-react';

<div className="flex gap-2">
  <Button variant="icon" size="sm">
    <Settings className="h-4 w-4" />
  </Button>
  <Button variant="icon" size="md">
    <Edit className="h-5 w-5" />
  </Button>
  <Button variant="icon" size="lg">
    <Trash className="h-6 w-6" />
  </Button>
</div>
```

### With Loading State

```tsx
function SaveButton() {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button loading={loading} onClick={handleSave}>
      Save
    </Button>
  );
}
```

## Design Tokens Used

- Colors: `primary[600]`, `primary[700]`, `red[600]`, `red[700]`, `gray[100]`, `gray[700]`
- Spacing: 12px vertical, 24px horizontal (md size)
- Border Radius: 8px
- Shadows: Small and medium shadows with color tints
- Transitions: 200-300ms duration

## Testing

The Button component has comprehensive test coverage including:
- Basic rendering
- All variants
- All sizes
- Loading state
- Icon support
- Full width
- Disabled state
- User interactions
- Styling classes

Run tests:
```bash
npm test -- Button.test.tsx
```
