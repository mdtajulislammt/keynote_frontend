import React from 'react';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '@/types/api.types';

export interface PaginationControlProps {
  meta: PaginationMeta | null;
  onPageChange: (newPage: number) => void;
  onLimitChange?: (newLimit: number) => void;
  isLoading?: boolean;
}

export const PaginationControl: React.FC<PaginationControlProps> = ({
  meta,
  onPageChange,
  onLimitChange,
  isLoading = false,
}) => {
  if (!meta || meta.total === 0) return null;

  const { page, totalPages, total, limit, hasPrevPage, hasNextPage } = meta;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 text-sm text-muted-foreground border-t border-border/80">
      <div className="flex items-center gap-2">
        <span>
          Showing <span className="font-bold text-foreground">{startItem}</span> to{' '}
          <span className="font-bold text-foreground">{endItem}</span> of{' '}
          <span className="font-bold text-foreground">{total}</span> entries
        </span>
        {onLimitChange && (
          <div className="flex items-center gap-2 ml-4 border-l border-border pl-4">
            <span className="text-xs font-semibold">Per page:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              disabled={isLoading}
              className="h-8 rounded-md border border-border bg-background px-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage || isLoading}
          className="h-9 px-3 gap-1 font-semibold"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        <span className="px-3 py-1 text-sm font-bold text-foreground">
          Page {page} of {totalPages || 1}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage || isLoading}
          className="h-9 px-3 gap-1 font-semibold"
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
