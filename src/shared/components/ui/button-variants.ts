import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500 shadow-md shadow-primary-500/10 hover:shadow-lg hover:shadow-primary-500/20',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-md shadow-red-500/10 hover:shadow-lg hover:shadow-red-500/20',
        outline: 'border-2 border-border-light bg-white text-text-primary hover:bg-bg-tertiary hover:border-border-focus focus-visible:ring-primary-500',
        ghost: 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary focus-visible:ring-primary-500',
        link: 'text-primary-600 underline-offset-4 hover:underline focus-visible:ring-primary-500',
      },
      size: {
        default: 'h-12 px-6 py-2',
        sm: 'h-9 px-4',
        lg: 'h-14 px-10 text-base',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
