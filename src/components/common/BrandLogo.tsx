import React from 'react';
import { Link } from 'react-router-dom';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  asLink?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  className = '',
  asLink = true,
}) => {
  const titleSizes = {
    sm: 'text-base font-extrabold',
    md: 'text-lg sm:text-xl font-black',
    lg: 'text-2xl font-black',
    xl: 'text-3xl font-black',
  };

  const content = (
    <div className={`inline-flex items-center tracking-tight select-none ${className}`}>
      <span className={`text-foreground ${titleSizes[size]}`}>
        Key<span className="text-emerald-600 dark:text-emerald-400">note</span>
      </span>
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" className="inline-flex items-center group cursor-pointer hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};

