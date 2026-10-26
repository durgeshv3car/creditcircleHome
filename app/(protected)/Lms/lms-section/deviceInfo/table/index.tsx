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
import { RowSelectionState, ColumnDef } from "@tanstack/react-table";
import {
  Smartphone,
  SlidersHorizontal,
  Check,
  CheckCheck,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import TablePagination from "./table-pagination";
import Filter from "../components/Filter";
import OfferSelectionModal from "../components/OfferSelectionModal";
import { useSearchParams } from "next/navigation";
import { SelectedValues } from "../components/DeviceInfo";

const COLUMN_DISPLAY_NAMES: Record<string, string> = {
  select: "Select",
  index: "ID",
  phoneNumber: "Phone Number",
  deviceId: "Device ID",
  model: "Model",
  brand: "Brand",
  idfa: "IDFA",
  actions: "Action",
};

const formatColumnLabel = (id: string): string => {
  if (COLUMN_DISPLAY_NAMES[id]) {
    return COLUMN_DISPLAY_NAMES[id];
  }
  return id
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
};

interface ExampleTwoProps {
  selectedValues: SelectedValues;
  setSelectedValues: React.Dispatch<React.SetStateAction<SelectedValues>>;
  tableData: any[];
  tableColumns: ColumnDef<any, any>[];
  allFilterOptions: Record<string, any>;
  token: string;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  recordsCount?: number;
  isLoading?: boolean;
}

const ExampleTwo: React.FC<ExampleTwoProps> = ({
  selectedValues,
  setSelectedValues,
  tableData,
  tableColumns,
  allFilterOptions,
  token,
  pageSize,
  setPageSize,
  totalPages,
  setTotalPages,
  currentPage,
  setCurrentPage,
  recordsCount,
  isLoading,
}) => {
  const searchParams = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [selectedOffer, setSelectedOffer] = React.useState<any>(null);
  const [selectedRowsData, setSelectedRowsData] = React.useState<any[]>([]);
  const [isCreatingNotification, setIsCreatingNotification] =
    React.useState<boolean>(false);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const [type, setType] = React.useState<string | null>(null);

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  React.useEffect(() => {
    const selectedData = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    setSelectedRowsData(selectedData);
  }, [table, rowSelection]);

  React.useEffect(() => {
    const creatingNotification = searchParams?.get("createnotification");
    setType(String(searchParams?.get("type")));

    if (creatingNotification === "true") {
      setIsCreatingNotification(true);
    }
  }, [searchParams]);

  React.useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
      pageSize: Number(pageSize),
    }));
  }, [pageSize]);

  return (
    <div className="w-full">
      {/* Header & Filter Section */}
      <div className="p-5 md:p-6 mb-6 bg-white rounded-sm border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all duration-300">
        <Filter
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
          data={tableData}
          allFilterOptions={allFilterOptions}
        />
      </div>

      {/* Main Table Card */}
      <div className="p-6 bg-white rounded-sm border border-slate-200/80 shadow-xs mb-8">
        {/* Top Header & Toolbar Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-2">
          {/* Card Header Left */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#101E4E] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Device Info Data
                </h2>
                <span className="px-2 py-0.5 rounded-sm text-xs font-semibold bg-[#FFF1ED] text-[#EA580C]">
                  {recordsCount
                    ? `${recordsCount.toLocaleString()} devices`
                    : "Directory"}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Manage, filter and review borrower hardware and device identity records
              </p>
            </div>
          </div>

          {/* Right Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Select for Rows per Page */}
            <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
              <Select
                onValueChange={(value) => setPageSize(Number(value))}
                value={String(pageSize)}
              >
                <SelectTrigger className="h-9 px-2.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-none hover:bg-slate-50 cursor-pointer w-auto min-w-[80px] gap-1">
                  <span>Rows:</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg border border-slate-200 bg-white shadow-lg p-1">
                  {[20, 50, 100, 200, 500].map((value) => (
                    <SelectItem
                      key={value}
                      value={String(value)}
                      className="rounded-md text-xs cursor-pointer"
                    >
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                className="w-64 p-0 rounded-lg bg-white border border-slate-200 shadow-xl overflow-hidden z-50"
              >
                {/* Header */}
                <div className="px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-800">
                      Toggle Columns
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#FFF1ED] text-[#EA580C] border border-orange-200/70">
                      {
                        table
                          .getAllColumns()
                          .filter(
                            (c) =>
                              c.getCanHide() &&
                              c.getIsVisible() &&
                              c.id !== "select" &&
                              c.id !== "actions"
                          ).length
                      }{" "}
                      active
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => table.toggleAllColumnsVisible(true)}
                      className="text-[11px] font-medium text-[#EA580C] hover:underline cursor-pointer px-1 py-0.5 rounded"
                      title="Select all columns"
                    >
                      All
                    </button>
                    <span className="text-slate-300 text-xs">|</span>
                    <button
                      type="button"
                      onClick={() => table.toggleAllColumnsVisible(false)}
                      className="text-[11px] font-medium text-slate-500 hover:text-slate-800 hover:underline cursor-pointer px-1 py-0.5 rounded"
                      title="Hide all hideable columns"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Column Items */}
                <div className="max-h-72 overflow-y-auto p-1.5 clean-scrollbar">
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
                          className={cn(
                            "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-colors",
                            isVisible
                              ? "text-slate-800 font-medium hover:bg-slate-50"
                              : "text-slate-400 hover:bg-slate-50"
                          )}
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
                          <span className="truncate flex-1">
                            {formatColumnLabel(column.id)}
                          </span>
                        </DropdownMenuItem>
                      );
                    })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {isCreatingNotification && (
              <button
                className="bg-[#FF6B4A] hover:bg-[#E65A38] text-white px-3.5 h-9 rounded-md text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                disabled={Object.keys(rowSelection).length === 0}
                onClick={() => setIsModalOpen(true)}
              >
                Send {type}
              </button>
            )}
          </div>
        </div>

        {/* Selected Rows Banner if any */}
        {selectedRowsData.length > 0 && (
          <div className="flex items-center justify-between p-3 mb-3 bg-[#FFF1ED]/60 border border-[#FFD7CC] rounded-sm text-xs font-semibold text-[#EA580C]">
            <span>
              {selectedRowsData.length} device
              {selectedRowsData.length > 1 ? "s" : ""} selected
            </span>
            <button
              type="button"
              onClick={() => setRowSelection({})}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-2.5 py-1 rounded-sm border border-slate-200 shadow-2xs cursor-pointer"
            >
              Clear selection
            </button>
          </div>
        )}

        {/* Table Component */}
        <div className="overflow-x-auto">
          <Table className="w-full text-left border-collapse">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent border-b border-slate-100"
                >
                  {headerGroup.headers.map((header) => {
                    const id = header.column.id;
                    const widthClass =
                      id === "select"
                        ? "w-10 px-3"
                        : id === "index"
                        ? "w-16"
                        : id === "phoneNumber"
                        ? "min-w-[130px]"
                        : id === "deviceId"
                        ? "min-w-[160px]"
                        : id === "model"
                        ? "min-w-[180px]"
                        : id === "brand"
                        ? "min-w-[120px]"
                        : id === "idfa"
                        ? "min-w-[220px]"
                        : id === "actions"
                        ? "min-w-[80px]"
                        : "min-w-[120px]";

                    return (
                      <TableHead
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={cn(
                          "cursor-pointer select-none py-3 px-4 text-[11px] font-medium text-slate-400 uppercase tracking-wider hover:text-slate-700 transition-colors whitespace-nowrap",
                          widthClass
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, rIdx) => {
                  const visibleCols = table.getVisibleLeafColumns();
                  return (
                    <TableRow
                      key={`skeleton-row-${rIdx}`}
                      className="border-b border-slate-100"
                    >
                      {visibleCols.map((col) => {
                        const id = col.id;
                        return (
                          <TableCell
                            key={`skeleton-cell-${col.id}-${rIdx}`}
                            className="py-3.5 px-4"
                          >
                            {id === "select" && (
                              <div className="w-4 h-4 rounded-[3px] bg-slate-100 animate-pulse" />
                            )}
                            {id === "index" && (
                              <div className="h-3.5 w-10 bg-slate-100 rounded animate-pulse" />
                            )}
                            {id === "phoneNumber" && (
                              <div className="h-3.5 w-24 bg-slate-100 rounded animate-pulse" />
                            )}
                            {id === "deviceId" && (
                              <div className="h-3.5 w-24 bg-slate-100 rounded animate-pulse" />
                            )}
                            {id === "model" && (
                              <div className="h-3.5 w-28 bg-slate-100 rounded animate-pulse" />
                            )}
                            {id === "brand" && (
                              <div className="h-3.5 w-16 bg-slate-100 rounded animate-pulse" />
                            )}
                            {id === "idfa" && (
                              <div className="h-3.5 w-36 bg-slate-100 rounded animate-pulse" />
                            )}
                            {id === "actions" && (
                              <div className="w-8 h-8 rounded-md bg-slate-100 animate-pulse" />
                            )}
                            {![
                              "select",
                              "index",
                              "phoneNumber",
                              "deviceId",
                              "model",
                              "brand",
                              "idfa",
                              "actions",
                            ].includes(id) && (
                              <div className="h-3.5 w-20 bg-slate-100 rounded animate-pulse" />
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="group border-b border-slate-100 hover:bg-slate-50/50 transition-colors data-[state=selected]:bg-[#FFF1ED]/40 cursor-default"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3.5 px-4 text-xs">
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
                    colSpan={table.getVisibleLeafColumns().length || 1}
                    className="h-36 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-1.5 text-slate-400">
                      <Smartphone className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                      <p className="text-xs font-semibold text-slate-600">
                        No device records found
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Try adjusting your filters or search options
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
              ? (currentPage - 1) * pageSize + 1
              : 0}
            –
            {Math.min(
              currentPage * pageSize,
              recordsCount || totalPages * pageSize || tableData.length
            )}{" "}
            of{" "}
            {(
              recordsCount ||
              totalPages * pageSize ||
              tableData.length
            ).toLocaleString()}{" "}
            devices
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
                  {[10, 20, 50, 100, 200].map((v) => (
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

            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <OfferSelectionModal
          selectedRowsData={selectedRowsData}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectOffer={(offer) => setSelectedOffer(offer)}
        />
      )}
    </div>
  );
};

export default ExampleTwo;
