import React from "react";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps {
  table: Table<any>;
}

const TablePagination: React.FC<DataTablePaginationProps> = ({ table }) => {
  const currentPage = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  const getPageNumbers = () => {
    const pages: (number | "dots")[] = [];
    const delta = 2;

    pages.push(0);

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(pageCount - 2, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }

    if (pageCount > 1) {
      pages.push(pageCount - 1);
    }

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
    <div className="flex items-center justify-end py-1">
      <div className="flex items-center gap-1.5 flex-none">
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="w-8 h-8 rounded-sm border border-slate-200/90 bg-white hover:bg-[#FFF1ED] hover:border-orange-300 text-slate-600 hover:text-[#EA580C] disabled:opacity-30 disabled:pointer-events-none shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {pageNumbers.map((page, idx) =>
          page === "dots" ? (
            <span key={idx} className="px-1.5 text-slate-400 text-xs font-mono">
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => table.setPageIndex(page)}
              className={cn(
                "w-8 h-8 rounded-sm font-normal text-xs flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer",
                currentPage === page
                  ? "bg-gradient-to-r from-[#FF6B4A] to-[#F48220] text-white shadow-sm shadow-orange-500/25"
                  : "bg-white text-slate-700 hover:text-[#EA580C] border border-slate-200/90 hover:border-orange-300 hover:bg-[#FFF1ED] shadow-2xs"
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
          className="w-8 h-8 rounded-sm border border-slate-200/90 bg-white hover:bg-[#FFF1ED] hover:border-orange-300 text-slate-600 hover:text-[#EA580C] disabled:opacity-30 disabled:pointer-events-none shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;