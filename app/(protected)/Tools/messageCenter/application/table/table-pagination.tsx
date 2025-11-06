import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;                  
  totalPages: number;                   
  onPageChange: (page: number) => void; 
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  const getPageNumbers = () => {
    const pages: (number | 'dots')[] = [];
    const delta = 2;

    // always show first page
    pages.push(1);

    // dynamic window around current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }

    // always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    // insert dots where needed
    return pages.reduce<(number | 'dots')[]>((acc, page, idx, arr) => {
      if (idx > 0) {
        const prev = arr[idx - 1] as number;
        if (typeof page === 'number' && typeof prev === 'number' && page - prev > 1) {
          acc.push('dots');
        }
      }
      acc.push(page);
      return acc;
    }, []);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-end py-4 px-10">
      <div className="flex items-center gap-2 flex-none">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {pageNumbers.map((page, idx) =>
          page === 'dots' ? (
            <span key={idx} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={`page-${page}`}
              onClick={() => onPageChange(page)}
              size="icon"
              className="w-8 h-8"
              variant={currentPage === page ? 'default' : 'outline'}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
