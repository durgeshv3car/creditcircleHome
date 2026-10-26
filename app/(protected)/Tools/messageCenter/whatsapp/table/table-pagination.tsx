import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps {
  table: Table<any>;
}

const TablePagination = ({ table }: DataTablePaginationProps) => {
  const currentPage = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();

  const getPageNumbers = () => {
    const pages: (number | "dots")[] = [];
    const delta = 2;

    // always show first
    pages.push(0);

    // add window around current
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages - 2, currentPage + delta);
      i++
    ) {
      if (i > 0 && i < totalPages - 1) {
        pages.push(i);
      }
    }

    // always show last if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages - 1);
    }

    // insert dots where needed
    return pages.reduce<(number | "dots")[]>((acc, page, idx, arr) => {
      if (idx > 0) {
        const prev = arr[idx - 1] as number;
        if (typeof page === "number" && typeof prev === "number" && page - prev > 1) {
          acc.push("dots");
        }
      }
      acc.push(page);
      return acc;
    }, []);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center gap-1.5 flex-none">
      <Button
        variant="outline"
        size="icon"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        className="w-8 h-8 rounded-md border border-slate-200/90 bg-white hover:bg-emerald-50/60 hover:border-emerald-300 text-slate-600 hover:text-emerald-700 disabled:opacity-30 disabled:pointer-events-none shadow-2xs transition-all active:scale-95 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {pageNumbers.map((page, idx) =>
        page === "dots" ? (
          <span key={idx} className="px-1 text-slate-400 text-xs font-mono">
            ...
          </span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => table.setPageIndex(page)}
            className={cn(
              "w-8 h-8 rounded-md font-bold text-xs flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer",
              currentPage === page
                ? "bg-gradient-to-tr from-emerald-600 to-teal-700 text-white shadow-sm shadow-emerald-500/25"
                : "bg-white text-slate-700 hover:text-emerald-700 border border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50/50 shadow-2xs"
            )}
          >
            {page + 1}
          </button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        className="w-8 h-8 rounded-md border border-slate-200/90 bg-white hover:bg-emerald-50/60 hover:border-emerald-300 text-slate-600 hover:text-emerald-700 disabled:opacity-30 disabled:pointer-events-none shadow-2xs transition-all active:scale-95 cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default TablePagination;
