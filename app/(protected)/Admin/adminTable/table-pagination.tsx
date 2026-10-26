import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;                  
  totalPages: number;                   
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalRecords?: number;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalRecords,
}) => {
  const getPageNumbers = () => {
    const pages: (number | 'dots')[] = [];
    const delta = 2;

    pages.push(1);

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

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

  const startRecord =
    pageSize && totalRecords
      ? Math.min((currentPage - 1) * pageSize + 1, totalRecords)
      : null;
  const endRecord =
    pageSize && totalRecords
      ? Math.min(currentPage * pageSize, totalRecords)
      : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-1">
      {/* Left: Range or Page Info */}
      <div className="text-xs text-slate-500 font-normal">
        {totalRecords !== undefined && startRecord !== null && endRecord !== null ? (
          <>
            Showing{" "}
            <span className="font-semibold text-slate-700 font-mono">
              {startRecord}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-700 font-mono">
              {endRecord}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700 font-mono">
              {totalRecords}
            </span>{" "}
            items
          </>
        ) : (
          <>
            Page{" "}
            <span className="font-semibold text-slate-700 font-mono">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700 font-mono">
              {Math.max(1, totalPages)}
            </span>
          </>
        )}
      </div>

      {/* Right: Page Numbers */}
      <div className="flex items-center gap-1.5 flex-none">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="w-8 h-8 rounded-sm border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 cursor-pointer shadow-2xs"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {pageNumbers.map((page, idx) =>
          page === 'dots' ? (
            <span key={idx} className="px-1.5 text-slate-400 text-xs select-none">
              ...
            </span>
          ) : (
            <Button
              key={`page-${page}`}
              onClick={() => onPageChange(page)}
              size="icon"
              className={
                currentPage === page
                  ? "w-8 h-8 rounded-sm bg-gradient-to-r from-[#FF6B4A] to-[#F48220] hover:opacity-95 text-white font-medium shadow-sm shadow-orange-500/25 text-xs cursor-pointer"
                  : "w-8 h-8 rounded-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-normal text-xs cursor-pointer transition-colors shadow-2xs"
              }
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="w-8 h-8 rounded-sm border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 cursor-pointer shadow-2xs"
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
