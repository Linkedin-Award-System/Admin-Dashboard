# Card Component

Container component for grouped content with variants and padding options.

## Features

- Multiple variants (default, elevated, outlined)
- Flexible padding options (none, sm, md, lg)
- 20px default padding (md)
- 8px border radius
- 1px solid border (#e5e7eb)
- Elevated variant with shadow (0 4px 6px rgba(0,0,0,0.07))
- Hoverable prop with shadow increase and 300ms transition
- Composable sub-components (CardHeader, CardTitle, CardDescription, CardContent, CardFooter)

## Usage

### Basic Card

```tsx
import { Card } from '@/shared/design-system/components';

<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

### Elevated Card

```tsx
<Card variant="elevated">
  <h3>Elevated Card</h3>
  <p>This card has a shadow for elevation</p>
</Card>
```

### Outlined Card

```tsx
<Card variant="outlined">
  <h3>Outlined Card</h3>
  <p>This card has an emphasized border</p>
</Card>
```

### Hoverable Card

```tsx
<Card hoverable onClick={() => console.log('Card clicked')}>
  <h3>Click Me</h3>
  <p>This card has hover effects</p>
</Card>
```

### Custom Padding

```tsx
// No padding
<Card padding="none">
  <img src="image.jpg" alt="Full width image" />
</Card>

// Small padding (12px)
<Card padding="sm">
  <p>Small padding content</p>
</Card>

// Large padding (32px)
<Card padding="lg">
  <p>Large padding content</p>
</Card>
```

### Composable Structure

```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/shared/design-system/components';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description or subtitle</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

## Props

### Card

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'elevated' \| 'outlined'` | `'default'` | Visual style variant |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Internal padding size |
| `hoverable` | `boolean` | `false` | Enable hover effects (shadow increase) |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Card content |

### CardHeader, CardTitle, CardDescription, CardContent, CardFooter

All sub-components accept standard HTML div props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Component content |

## Variants

### default
Standard card with a 1px solid border (#e5e7eb).

### elevated
Card with shadow elevation (0 4px 6px rgba(0,0,0,0.07)) for visual depth.

### outlined
Card with an emphasized 2px border for stronger visual separation.

## Padding Options

- **none**: No padding (0px) - useful for full-width images or custom layouts
- **sm**: Small padding (12px)
- **md**: Medium padding (20px) - default, matches design system spec
- **lg**: Large padding (32px)

## Design Tokens

The Card component uses the following design tokens:

- **Border Radius**: 8px (`borderRadius.md`)
- **Border Color**: #e5e7eb (`border.default`)
- **Shadow**: 0 4px 6px rgba(0,0,0,0.07) (`shadows.md`)
- **Hover Shadow**: 0 10px 15px rgba(0,0,0,0.1) (`shadows.lg`)
- **Transition**: 300ms (`duration-300`)

## Accessibility

- Use semantic HTML within cards (headings, paragraphs, etc.)
- When using `hoverable`, ensure the card has appropriate keyboard navigation
- Add `role="button"` and `tabIndex={0}` for clickable cards
- Provide appropriate ARIA labels for interactive cards

## Examples

### Metric Card

```tsx
<Card variant="elevated" hoverable>
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">Total Users</p>
      <p className="text-3xl font-semibold">1,234</p>
    </div>
    <div className="p-3 bg-blue-100 rounded-full">
      <Users className="h-6 w-6 text-blue-600" />
    </div>
  </div>
</Card>
```

### Content Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Article Title</CardTitle>
    <CardDescription>Published on Jan 1, 2024</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Article content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button variant="secondary">Read More</Button>
  </CardFooter>
</Card>
```

### Image Card

```tsx
<Card padding="none" hoverable>
  <img 
    src="image.jpg" 
    alt="Card image" 
    className="w-full h-48 object-cover rounded-t-lg"
  />
  <div className="p-5">
    <h3 className="text-lg font-medium">Image Title</h3>
    <p className="text-sm text-gray-500">Image description</p>
  </div>
</Card>
```

## Requirements

Validates requirements:
- **3.2**: Card padding (20px default)
- **8.1**: Chart container with 20px padding
- **8.7**: 8px border radius for chart containers
