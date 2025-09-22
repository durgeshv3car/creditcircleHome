import { Button } from '@/components/ui/button';
import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface DataTablePaginationProps {
  table: Table<any>;
}

const TablePagination = ({ table }: DataTablePaginationProps) => {
  const currentPage = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();

  // helper to generate a smart page window
  const getPageNumbers = () => {
    const pages: (number | 'dots')[] = [];
    const delta = 2; // how many pages to show around current

    // always show first
    pages.push(0);

    // add window around current
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages - 2, currentPage + delta); i++) {
      if (i > 0 && i < totalPages - 1) {
        pages.push(i);
      }
    }

    // always show last if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages - 1);
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
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      <div className="flex items-center gap-2 flex-none">
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
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
              onClick={() => table.setPageIndex(page)}
              size="icon"
              className="w-8 h-8"
              variant={currentPage === page ? 'default' : 'outline'}
            >
              {page + 1}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="w-8 h-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
