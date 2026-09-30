import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface LoaderProps {
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  fullScreen = false,
  text = 'Loading...',
  className,
}) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xs">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
        <p className="text-sm font-medium text-muted-foreground">{text}</p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
      {text && <p className="text-xs text-muted-foreground">{text}</p>}
    </div>
  );
};
