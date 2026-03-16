# Skeleton Component Implementation

## Overview

The Skeleton component is a loading state placeholder that displays an animated shimmer effect while content is being fetched. It supports multiple variants (text, circular, rectangular) and animation types (pulse, wave).

## Implementation Details

### Component Structure

```
Skeleton/
├── Skeleton.tsx              # Main component
├── Skeleton.variants.ts      # CVA variant definitions
├── Skeleton.test.tsx         # Unit tests
├── Skeleton.examples.tsx     # Usage examples
├── index.ts                  # Exports
├── README.md                 # Documentation
└── IMPLEMENTATION.md         # This file
```

### Technology Stack

- **React**: Component framework
- **TypeScript**: Type safety
- **class-variance-authority (CVA)**: Variant management
- **Tailwind CSS**: Styling
- **tailwind-merge**: Class merging utility

### Design Tokens Used

- **Colors**: `colors.gray[100]` (#f3f4f6)
- **Border Radius**: 
  - Text: `borderRadius.sm` (4px)
  - Circular: `borderRadius.full` (9999px)
  - Rectangular: `borderRadius.md` (8px)
- **Animation**: Custom shimmer animation (1.5s duration)

### Variant System

The component uses CVA to manage three main variants:

1. **Text**: For text content
   - Border radius: 4px
   - Default height: 16px
   - Use case: Labels, headings, paragraphs

2. **Circular**: For circular elements
   - Border radius: 50%
   - Aspect ratio: 1:1 (square)
   - Use case: Avatars, profile pictures

3. **Rectangular**: For rectangular content (default)
   - Border radius: 8px
   - Use case: Cards, images, general blocks

### Animation System

Two animation types are supported:

1. **Wave (Default)**: Shimmer effect
   - Duration: 1.5s
   - Implementation: CSS gradient with `translateX` animation
   - Creates a moving shimmer effect from left to right

2. **Pulse**: Opacity fade
   - Duration: 2s (Tailwind default)
   - Implementation: Tailwind's `animate-pulse` utility
   - Simple fade in/out effect

### Shimmer Animation Implementation

The shimmer animation is implemented using:

1. **Tailwind Config** (`tailwind.config.js`):
```javascript
keyframes: {
  shimmer: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
},
animation: {
  shimmer: 'shimmer 1.5s infinite',
},
```

2. **CSS Classes** (in `Skeleton.variants.ts`):
```typescript
wave: [
  'before:absolute',
  'before:inset-0',
  'before:-translate-x-full',
  'before:animate-shimmer',
  'before:bg-gradient-to-r',
  'before:from-transparent',
  'before:via-white/60',
  'before:to-transparent',
]
```

### Dimension Handling

The component accepts width and height props that can be:
- **String**: e.g., "100%", "200px", "50vw"
- **Number**: Converted to pixels, e.g., 300 → "300px"

Implementation:
```typescript
const dimensionStyle: React.CSSProperties = {
  ...(width !== undefined && {
    width: typeof width === 'number' ? `${width}px` : width,
  }),
  ...(height !== undefined && {
    height: typeof height === 'number' ? `${height}px` : height,
  }),
  ...style,
};
```

### Accessibility Features

- **aria-busy="true"**: Indicates loading state
- **aria-live="polite"**: Announces changes to screen readers
- **Respects prefers-reduced-motion**: Animations disabled when user prefers reduced motion

### Props Interface

```typescript
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave';
  width?: string | number;
  height?: string | number;
  className?: string;
}
```

## Usage Patterns

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

### Loading Table

```tsx
<tbody>
  {[1, 2, 3].map((i) => (
    <tr key={i}>
      <td><Skeleton variant="text" width="150px" /></td>
      <td><Skeleton variant="text" width="100px" /></td>
      <td><Skeleton variant="rectangular" width="80px" height="24px" /></td>
    </tr>
  ))}
</tbody>
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

## Testing Strategy

### Unit Tests

The component includes comprehensive unit tests covering:

1. **Rendering**: Basic rendering and DOM presence
2. **Variants**: All three variants render correctly
3. **Animation**: Both animation types work
4. **Dimensions**: String and numeric dimensions
5. **Custom Styling**: className and style props
6. **Base Styles**: Background, positioning, overflow
7. **Accessibility**: ARIA attributes
8. **Edge Cases**: Zero dimensions, undefined values

### Test Coverage

- Target: 100% code coverage
- All props and variants tested
- Edge cases covered
- Accessibility verified

## Integration with Existing Components

The Skeleton component can replace existing skeleton implementations:

### Before (MetricCardSkeleton.tsx)

```tsx
<div className="premium-card relative overflow-hidden p-8 space-y-8 animate-shimmer">
  <div className="h-14 w-14 rounded-2xl bg-bg-tertiary shadow-inner" />
  <div className="h-12 w-3/4 rounded-xl bg-bg-tertiary" />
</div>
```

### After (Using Skeleton Component)

```tsx
<div className="premium-card p-8 space-y-8">
  <Skeleton variant="circular" width="56px" height="56px" />
  <Skeleton variant="rectangular" width="75%" height="48px" />
</div>
```

## Performance Considerations

1. **CSS Animations**: Uses GPU-accelerated transforms for smooth performance
2. **No JavaScript**: Animation runs entirely in CSS
3. **Lightweight**: Minimal bundle size impact
4. **Reusable**: Single component replaces multiple skeleton implementations

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **CSS Grid/Flexbox**: Required for layout
- **CSS Animations**: Required for shimmer effect
- **Fallback**: Pulse animation for browsers with reduced motion

## Future Enhancements

Potential improvements for future iterations:

1. **Custom Colors**: Support for different background colors
2. **Gradient Customization**: Allow custom shimmer gradient colors
3. **Speed Control**: Adjustable animation duration
4. **Direction Control**: Shimmer direction (left-to-right, right-to-left)
5. **Preset Layouts**: Pre-built skeleton layouts for common patterns

## Requirements Validation

This implementation validates the following requirements:

- **9.1**: Skeleton screens with animated shimmer effects ✓
- **9.2**: Match dimensions of content being loaded ✓
- **9.3**: Shimmer animation with 1.5 second duration ✓
- **9.4**: Light gray background (#f3f4f6) ✓
- **9.6**: 8px border radius matching actual content ✓
- **9.7**: Fade out with 300ms transition when content loads ✓

## Maintenance Notes

- Keep animation duration consistent across the application
- Ensure skeleton dimensions match actual content for smooth transitions
- Test with prefers-reduced-motion enabled
- Update examples when adding new use cases
- Maintain test coverage above 90%

## Related Components

- **MetricCardSkeleton**: Can be replaced with Skeleton component
- **ChartSkeleton**: Can be replaced with Skeleton component
- **CategoryListSkeleton**: Can be replaced with Skeleton component
- **NomineeListSkeleton**: Can be replaced with Skeleton component
- **VotingDashboardSkeleton**: Can be replaced with Skeleton component

## Migration Guide

To migrate from existing skeleton components:

1. Import the Skeleton component:
   ```tsx
   import { Skeleton } from '@/shared/design-system/components';
   ```

2. Replace custom skeleton divs with Skeleton component:
   ```tsx
   // Before
   <div className="h-12 w-3/4 rounded-xl bg-bg-tertiary" />
   
   // After
   <Skeleton variant="rectangular" width="75%" height="48px" />
   ```

3. Update circular elements:
   ```tsx
   // Before
   <div className="h-14 w-14 rounded-full bg-bg-tertiary" />
   
   // After
   <Skeleton variant="circular" width="56px" height="56px" />
   ```

4. Update text elements:
   ```tsx
   // Before
   <div className="h-5 w-1/2 rounded-lg bg-bg-tertiary" />
   
   // After
   <Skeleton variant="text" width="50%" />
   ```

## Conclusion

The Skeleton component provides a consistent, accessible, and performant loading state solution for the LinkedIn Creative Awards Admin Dashboard. It follows the design system patterns, uses design tokens, and integrates seamlessly with existing components.
