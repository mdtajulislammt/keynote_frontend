import React, { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'admin' | 'success';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variants = {
    default:
      'bg-emerald-600 text-white border-transparent shadow-xs',
    secondary:
      'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-800/80 font-medium',
    outline:
      'border border-border text-foreground bg-background hover:bg-neutral-50 dark:hover:bg-neutral-800',
    destructive:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900',
    admin:
      'bg-emerald-700 text-white border-emerald-600 dark:bg-emerald-500 dark:text-neutral-950 font-bold tracking-wider uppercase text-[11px] shadow-xs',
    success:
      'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold border transition-all duration-200 select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
