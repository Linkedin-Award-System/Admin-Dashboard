import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        // Use explicit hex so Tailwind purging never strips these
        default:     '[background-color:#085299] [color:#ffffff] hover:[background-color:#063d73] focus-visible:ring-blue-500 shadow-md hover:shadow-lg',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-md hover:shadow-lg',
        outline:     'border-2 border-gray-200 bg-white text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus-visible:ring-blue-500',
        ghost:       'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-blue-500',
        link:        '[color:#085299] underline-offset-4 hover:underline focus-visible:ring-blue-500',
      },
      size: {
        default: 'h-12 px-6 py-2',
        sm:      'h-9 px-4',
        lg:      'h-14 px-10 text-base',
        icon:    'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
