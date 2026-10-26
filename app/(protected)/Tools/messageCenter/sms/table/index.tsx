"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  PaginationState,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Smartphone,
  SmartphoneNfc,
  SlidersHorizontal,
  Check,
  Search,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "./table-pagination";
import Filter from "../components/Filter";
import { useRouter } from "next/navigation";
import { DataProps } from "./columns";
import { SelectedValues } from "../page";
import { cn } from "@/lib/utils";

interface ExampleTwoProps {
  selectedValues: SelectedValues;
  setSelectedValues: React.Dispatch<React.SetStateAction<SelectedValues>>;
  tableData: DataProps[];
  tableColumns: any;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
}

const ExampleTwo: React.FC<ExampleTwoProps> = ({
  selectedValues,
  setSelectedValues,
  tableData,
  tableColumns,
  setRefresh,
  isLoading = false,
}) => {
  const router = useRouter();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pageSize, setPageSize] = React.useState(20);
  const [searchQuery, setSearchQuery] = React.useState("");

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  React.useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
      pageSize: Number(pageSize),
    }));
  }, [pageSize]);

  React.useEffect(() => {
    if (table.getColumn("title")) {
      table.getColumn("title")?.setFilterValue(searchQuery || undefined);
    }
  }, [searchQuery, table]);

  const currentPage = table.getState().pagination.pageIndex;

  return (
    <div className="w-full">
      {/* Filter Section Card */}
      <div className="p-5 md:p-6 mb-6 bg-white rounded-lg border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all duration-300">
        <Filter
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
          data={tableData}
        />
      </div>

      {/* Main Table Card */}
      <div className="p-6 bg-white rounded-lg border border-slate-200/80 shadow-xs mb-8">
        {/* Top Header & Toolbar Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-2">
          {/* Header Left */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#101E4E] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  SMS Notifications
                </h2>
                <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-[#FFF1ED] text-[#EA580C] border border-[#FFD7CC]">
                  {tableData.length.toLocaleString()} messages
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Monitor and dispatch direct SMS campaigns and subscriber alerts
              </p>
            </div>
          </div>

          {/* Right Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Search */}
            <div className="relative flex items-center">
              <Input
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pr-7 text-xs bg-white border border-slate-200 rounded-md text-slate-800 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#FF6B4A] focus-visible:border-[#FF6B4A] w-44 sm:w-56 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Columns Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 px-3 text-xs font-medium rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                  <span>Columns</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 p-0 rounded-lg bg-white border border-slate-200 shadow-xl overflow-hidden z-50"
              >
                <div className="px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">
                    Visible Columns
                  </span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        table
                          .getAllColumns()
                          .filter((c) => c.getCanHide())
                          .forEach((c) => c.toggleVisibility(true));
                      }}
                      className="font-medium text-slate-500 hover:text-[#EA580C] px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      All
                    </button>
                    <span className="text-slate-300">·</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        table
                          .getAllColumns()
                          .filter((c) => c.getCanHide())
                          .forEach((c) => c.toggleVisibility(false));
                      }}
                      className="font-medium text-slate-500 hover:text-rose-600 px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 clean-scrollbar">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      const isVisible = column.getIsVisible();
                      return (
                        <DropdownMenuItem
                          key={column.id}
                          onSelect={(e) => {
                            e.preventDefault();
                            column.toggleVisibility(!isVisible);
                          }}
                          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer focus:bg-slate-50 focus:text-slate-900 outline-none transition-colors"
                        >
                          <div
                            className={cn(
                              "w-4 h-4 rounded-[3px] border flex items-center justify-center transition-all duration-150 shrink-0",
                              isVisible
                                ? "bg-[#FF6B4A] border-[#FF6B4A] text-white shadow-2xs"
                                : "border-slate-300 bg-white hover:border-slate-400"
                            )}
                          >
                            {isVisible && (
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            )}
                          </div>
                          <span className="truncate flex-1 capitalize">
                            {column.id.replace(/([A-Z])/g, " $1")}
                          </span>
                        </DropdownMenuItem>
                      );
                    })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Create Notification Button */}
            <button
              onClick={() =>
                router.push(
                  "/Lms/lms-section/leads?createnotification=true&&type=Sms"
                )
              }
              className="bg-[#FF6B4A] hover:bg-[#E65A38] text-white px-3.5 h-9 rounded-md text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Notification</span>
            </button>
          </div>
        </div>

        {/* Table Component */}
        <div className="overflow-x-auto rounded-lg border border-slate-200/80">
          <Table className="w-full text-left border-collapse">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent bg-slate-50/60 border-b border-slate-100"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer select-none py-3 px-4 text-[11px] font-medium text-slate-400 uppercase tracking-wider hover:text-slate-700 transition-colors whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, rIdx) => (
                  <TableRow
                    key={`skeleton-${rIdx}`}
                    className="border-b border-slate-100"
                  >
                    {table.getVisibleLeafColumns().map((col) => (
                      <TableCell
                        key={`skeleton-cell-${col.id}-${rIdx}`}
                        className="py-3.5 px-4"
                      >
                        <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="group border-b border-slate-100 hover:bg-slate-50/50 transition-colors data-[state=selected]:bg-[#dbeafe]/20 cursor-default"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-3.5 px-4 text-xs"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getVisibleLeafColumns().length || 7}
                    className="h-44 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400 py-8">
                      <SmartphoneNfc className="w-8 h-8 text-slate-300" />
                      <p className="text-sm font-semibold text-slate-700">
                        No SMS notifications found
                      </p>
                      <p className="text-xs text-slate-400">
                        Try adjusting your search keywords or filters.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Bottom Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 mt-2 border-t border-slate-100">
          <div className="text-xs text-slate-500 font-normal">
            Showing{" "}
            {table.getRowModel().rows.length
              ? currentPage * pageSize + 1
              : 0}
            –
            {Math.min(
              (currentPage + 1) * pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length.toLocaleString()} messages
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-normal">
              <span>Rows per page</span>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => setPageSize(Number(value))}
              >
                <SelectTrigger className="h-8 px-2.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-none hover:bg-slate-50 cursor-pointer w-auto min-w-[60px] gap-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg border border-slate-200 bg-white shadow-lg p-1">
                  {[20, 50, 100, 200].map((v) => (
                    <SelectItem
                      key={v}
                      value={String(v)}
                      className="rounded-md text-xs cursor-pointer"
                    >
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <TablePagination table={table} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleTwo;