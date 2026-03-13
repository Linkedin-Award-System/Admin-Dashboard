# Input Component

Enhanced input component with label, error, helper text, and icon support. Implements focus states, error states, and smooth transitions following the LinkedIn Creative Awards design system.

## Features

- **Label Support**: Optional label with 14px medium weight (500) and 8px bottom margin
- **Error Handling**: Error state with 2px red border and error message display
- **Helper Text**: Optional helper text displayed below the input
- **Icon Support**: Left and right icon slots for enhanced UX
- **Focus States**: 2px LinkedIn Blue border on focus with 200ms transition
- **Accessibility**: Proper label association and ARIA attributes
- **Responsive**: Full width by default, works on all screen sizes

## Styling Details

- **Padding**: 12px (all sides)
- **Border Radius**: 8px
- **Font Size**: 14px
- **Border**: 1px solid gray (default), 2px solid LinkedIn Blue (focus), 2px solid red (error)
- **Transitions**: 200ms for all state changes
- **Label**: 14px medium weight (500), 8px bottom margin
- **Placeholder**: Light gray (#9ca3af)

## Usage

### Basic Input

```tsx
import { Input } from '@/shared/design-system/components/Input';

<Input 
  label="Email" 
  type="email" 
  placeholder="Enter your email" 
/>
```

### Input with Error

```tsx
<Input 
  label="Password" 
  type="password" 
  error="Password is required" 
/>
```

### Input with Helper Text

```tsx
<Input 
  label="Username" 
  placeholder="Choose a username"
  helperText="Must be 3-20 characters long" 
/>
```

### Input with Left Icon

```tsx
import { Search } from 'lucide-react';

<Input 
  label="Search" 
  leftIcon={<Search className="h-4 w-4" />}
  placeholder="Search..." 
/>
```

### Input with Right Icon

```tsx
import { Eye } from 'lucide-react';

<Input 
  label="Password" 
  type="password"
  rightIcon={<Eye className="h-4 w-4" />}
/>
```

### Disabled Input

```tsx
<Input 
  label="Email" 
  value="user@example.com"
  disabled 
/>
```

### Custom Styling

```tsx
<Input 
  label="Custom Input"
  className="border-purple-500"
  containerClassName="max-w-md"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label text displayed above the input |
| `error` | `string` | - | Error message displayed below the input |
| `helperText` | `string` | - | Helper text displayed below the input (when no error) |
| `leftIcon` | `React.ReactNode` | - | Icon displayed on the left side of the input |
| `rightIcon` | `React.ReactNode` | - | Icon displayed on the right side of the input |
| `className` | `string` | - | Additional CSS classes for the input element |
| `containerClassName` | `string` | - | Additional CSS classes for the container |
| `disabled` | `boolean` | `false` | Disable the input |
| ...rest | `InputHTMLAttributes` | - | All standard HTML input attributes |

## States

### Default State
- 1px solid gray border (#e5e7eb)
- White background
- Gray placeholder text

### Focus State
- 2px solid LinkedIn Blue border (#0a66c2)
- Smooth 200ms transition
- No outline ring

### Error State
- 2px solid red border (#ef4444)
- Red error message below input
- Error message in 12px font

### Disabled State
- Gray background (#f3f4f6)
- Gray text (#9ca3af)
- 50% opacity
- Not clickable

## Accessibility

- Proper `label` and `input` association using `htmlFor` and `id`
- Error messages are associated with the input
- Disabled state prevents interaction
- Focus states are clearly visible
- Keyboard navigation supported

## Design Tokens Used

- **Colors**: `colors.primary[600]`, `colors.error[500]`, `colors.gray[*]`
- **Typography**: `typography.input`, `typography.label`
- **Borders**: `borderRadius.md`, `componentBorderWidth.inputFocus`
- **Spacing**: 12px padding, 8px label margin

## Requirements Validated

This component validates the following requirements from the comprehensive UI polish spec:

- **10.1**: 12px padding with 8px border radius
- **10.2**: Labels in 14px medium weight (500) font above inputs
- **10.3**: LinkedIn Blue border with 2px width on focus
- **10.4**: Red border and error message on error state
- **10.5**: 14px font size for input text
- **10.6**: 16px vertical spacing between form fields (via container)
- **10.7**: Placeholder text in light gray (#9ca3af)
- **10.8**: 200ms transition effects for focus and error states

## Examples in Forms

### Login Form

```tsx
<form className="space-y-4">
  <Input 
    label="Email" 
    type="email" 
    placeholder="Enter your email"
    required
  />
  <Input 
    label="Password" 
    type="password" 
    placeholder="Enter your password"
    required
  />
  <Button type="submit" fullWidth>
    Sign In
  </Button>
</form>
```

### Category Form

```tsx
<form className="space-y-4">
  <Input 
    label="Category Name" 
    placeholder="e.g., Best Video Campaign"
    helperText="Choose a descriptive name"
  />
  <Input 
    label="Description" 
    placeholder="Brief description"
  />
  <div className="flex gap-2">
    <Button type="submit">Save</Button>
    <Button variant="secondary" type="button">Cancel</Button>
  </div>
</form>
```

## Migration from Old Input

If you're migrating from the old `@/shared/components/ui/input` component:

### Before
```tsx
import { Input } from '@/shared/components/ui/input';

<Input type="email" placeholder="Email" />
```

### After
```tsx
import { Input } from '@/shared/design-system/components/Input';

<Input 
  label="Email"
  type="email" 
  placeholder="Enter your email" 
/>
```

## Notes

- The component uses `React.useId()` to generate unique IDs if not provided
- Icons should be sized appropriately (typically 16px / h-4 w-4)
- The component is fully controlled or uncontrolled based on usage
- Error takes precedence over helperText when both are provided
- The component maintains backward compatibility with standard HTML input attributes
