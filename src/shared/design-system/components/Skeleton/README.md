# Skeleton Component

Loading state placeholder with shimmer animation for displaying content while data is being fetched.

## Features

- **Multiple Variants**: text, circular, rectangular
- **Two Animation Types**: pulse, wave (shimmer)
- **Custom Dimensions**: Width and height props
- **Light Gray Background**: #f3f4f6
- **Smooth Animation**: 1.5s shimmer duration

## Usage

### Basic Usage

```tsx
import { Skeleton } from '@/shared/design-system/components';

// Text skeleton
<Skeleton variant="text" width="200px" />

// Circular skeleton (avatar)
<Skeleton variant="circular" width="48px" height="48px" />

// Rectangular skeleton (card)
<Skeleton variant="rectangular" width="100%" height="200px" />
```

### Animation Types

```tsx
// Wave animation (default) - shimmer effect
<Skeleton animation="wave" width="100%" height="100px" />

// Pulse animation - simple opacity pulse
<Skeleton animation="pulse" width="100%" height="100px" />
```

### Custom Dimensions

```tsx
// Using string values
<Skeleton width="300px" height="150px" />

// Using numeric values (pixels)
<Skeleton width={300} height={150} />

// Using percentage
<Skeleton width="100%" height="200px" />
```

### Custom Styling

```tsx
// Add custom classes
<Skeleton className="mb-4" width="100%" height="100px" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'text' \| 'circular' \| 'rectangular'` | `'rectangular'` | Skeleton shape variant |
| `animation` | `'pulse' \| 'wave'` | `'wave'` | Animation type |
| `width` | `string \| number` | - | Width (string or number in pixels) |
| `height` | `string \| number` | - | Height (string or number in pixels) |
| `className` | `string` | - | Additional CSS classes |

## Variants

### Text
- **Border Radius**: 4px
- **Default Height**: 16px (h-4)
- **Use Case**: Text content, labels, headings

### Circular
- **Border Radius**: 50% (fully rounded)
- **Aspect Ratio**: Square (1:1)
- **Use Case**: Avatars, profile pictures, circular icons

### Rectangular
- **Border Radius**: 8px
- **Use Case**: Cards, images, general content blocks (default)

## Animation Types

### Wave (Default)
- **Duration**: 1.5s
- **Effect**: Shimmer gradient moving left to right
- **Implementation**: CSS gradient animation with `translateX`
- **Use Case**: Premium loading experience, recommended for most cases

### Pulse
- **Duration**: 2s (Tailwind default)
- **Effect**: Opacity fade in/out
- **Implementation**: Tailwind's `animate-pulse` utility
- **Use Case**: Simple loading states, reduced motion preference

## Styling Details

- **Background**: #f3f4f6 (gray-100)
- **Border Radius**: 
  - Text: 4px
  - Circular: 50%
  - Rectangular: 8px
- **Animation Duration**: 1.5s (wave), 2s (pulse)
- **Gradient**: White with 60% opacity overlay

## Examples

### Loading Metric Card

```tsx
<div className="p-8 space-y-4">
  <div className="flex items-start justify-between">
    <Skeleton variant="circular" width="56px" height="56px" />
    <Skeleton variant="rectangular" width="80px" height="28px" />
  </div>
  <div className="space-y-2">
    <Skeleton variant="rectangular" width="75%" height="48px" />
    <Skeleton variant="text" width="50%" />
  </div>
</div>
```

### Loading Table Row

```tsx
<tr>
  <td><Skeleton variant="text" width="150px" /></td>
  <td><Skeleton variant="text" width="100px" /></td>
  <td><Skeleton variant="rectangular" width="80px" height="24px" /></td>
  <td><Skeleton variant="text" width="120px" /></td>
</tr>
```

### Loading Card List

```tsx
<div className="space-y-4">
  {[1, 2, 3].map((i) => (
    <div key={i} className="p-6 border rounded-lg space-y-3">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width="40px" height="40px" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="rectangular" width="100%" height="100px" />
    </div>
  ))}
</div>
```

### Loading Avatar with Text

```tsx
<div className="flex items-center gap-3">
  <Skeleton variant="circular" width="48px" height="48px" />
  <div className="space-y-2">
    <Skeleton variant="text" width="120px" />
    <Skeleton variant="text" width="80px" />
  </div>
</div>
```

### Loading Chart

```tsx
<div className="p-6 border rounded-lg">
  <Skeleton variant="text" width="150px" className="mb-4" />
  <Skeleton variant="rectangular" width="100%" height="300px" />
</div>
```

## Accessibility

- Uses `aria-busy="true"` to indicate loading state
- Uses `aria-live="polite"` for screen reader announcements
- Respects `prefers-reduced-motion` media query (animations disabled)
- Semantic HTML structure

## Design Tokens

The Skeleton component uses the following design tokens:

- **Background**: `colors.gray[100]` (#f3f4f6)
- **Border Radius**: 
  - Text: `borderRadius.sm` (4px)
  - Circular: `borderRadius.full` (9999px)
  - Rectangular: `borderRadius.md` (8px)
- **Animation Duration**: 1.5s (shimmer)

## Best Practices

1. **Match Content Dimensions**: Skeleton should match the size of the content it's replacing
2. **Use Appropriate Variants**: Choose the variant that best matches the content type
3. **Consistent Animation**: Use the same animation type throughout your application
4. **Fade Out Transition**: When content loads, fade out the skeleton with a 300ms transition
5. **Avoid Over-Skeletonizing**: Don't show skeletons for very fast loading times (< 200ms)

## Requirements

Validates requirements:
- 9.1: Skeleton screens with animated shimmer effects
- 9.2: Match dimensions of content being loaded
- 9.3: Shimmer animation with 1.5 second duration
- 9.4: Light gray background (#f3f4f6)
- 9.6: 8px border radius matching actual content
- 9.7: Fade out with 300ms transition when content loads
