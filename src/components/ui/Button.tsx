import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg select-none active:scale-[0.98] cursor-pointer';

    const variants = {
      primary:
        'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm shadow-emerald-700/20 border border-emerald-500/30',
      secondary:
        'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 border border-border',
      outline:
        'border border-border bg-background hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-500 text-foreground',
      destructive:
        'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm shadow-red-700/20',
      ghost:
        'hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-foreground hover:text-emerald-700 dark:hover:text-emerald-400',
      link: 'text-emerald-600 dark:text-emerald-400 underline-offset-4 hover:underline p-0 h-auto',
    };

    const sizes = {
      sm: 'h-9 px-3.5 text-xs font-semibold gap-1.5',
      md: 'h-10 px-4 text-sm font-semibold gap-2',
      lg: 'h-12 px-6 text-base font-semibold gap-2.5',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
