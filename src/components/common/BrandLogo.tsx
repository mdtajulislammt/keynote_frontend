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
  showText = true,
  showTagline = false,
  className = '',
  asLink = true,
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };

  const logoMark = (
    <div
      className={`relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 text-white shadow-md shadow-emerald-700/25 border border-emerald-400/30 ${iconDimensions[size]}`}
    >
      {/* Custom Project SVG Mark: Note Document + Shield & Keyhole */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-3/5 h-3/5"
      >
        {/* Note document body */}
        <path
          d="M7 6C7 4.89543 7.89543 4 9 4H19.5L25 9.5V26C25 27.1046 24.1046 28 23 28H9C7.89543 28 7 27.1046 7 26V6Z"
          fill="currentColor"
          fillOpacity="0.25"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Folded corner */}
        <path
          d="M19 4V10H25"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Post lines / note content lines */}
        <path
          d="M11 14H18M11 18H15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Shield lock badge on bottom right corner */}
        <circle cx="21" cy="21" r="5.5" fill="#047857" stroke="white" strokeWidth="1.5" />
        <path
          d="M21 19V20.5M21 21.5V22.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Subtle live indicator dot */}
      <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
      </span>
    </div>
  );

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {logoMark}

      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight text-emerald-600 dark:text-emerald-400 ${titleSizes[size]}`}>
              Keynote
            </span>
          </div>
          {showTagline ? (
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Encrypted Notes & Social Feed
            </span>
          ) : (
            <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Keynote Vault & Feed
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" className="inline-flex items-center group cursor-pointer">
        {content}
      </Link>
    );
  }

  return content;
};
