"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  PaginationState,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Images,
  SlidersHorizontal,
  Check,
  Search,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import TablePagination from "./table-pagination";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

type ModalType = "slider" | "logo" | "offer" | "category";

interface EditModalProps<T> {
  id: string;
  onClose: () => void;
  tableData: T[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CreateModalProps {
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  columnsField: string[];
  type: ModalType;
}

type ModalComponent<T> = React.ComponentType<EditModalProps<T>>;
type CreateComponent = React.ComponentType<CreateModalProps>;

const modalMap: Record<
  ModalType,
  {
    create: CreateComponent;
    edit: any;
  }
> = {
  slider: {
    create: dynamic(
      () => import("../home-section/slider/components/Create")
    ) as CreateComponent,
    edit: dynamic(() => import("../home-section/slider/components/EditModal")),
  },
  logo: {
    create: dynamic(
      () => import("../home-section/logo/components/Create")
    ) as CreateComponent,
    edit: dynamic(() => import("../home-section/logo/components/EditModal")),
  },
  offer: {
    create: dynamic(
      () => import("../home-section/offer/components/Create")
    ) as CreateComponent,
    edit: dynamic(() => import("../home-section/offer/components/EditModal")),
  },
  category: {
    create: dynamic(
      () => import("../home-section/category/components/Create")
    ) as CreateComponent,
    edit: dynamic(
      () => import("../home-section/category/components/EditModal")
    ),
  },
};

interface TableProps<T> {
  tableColumns: ColumnDef<T>[];
  tableHeading: string;
  tableData: T[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  type: ModalType;
}

const ExampleTwo = <T,>({
  tableHeading,
  tableData,
  tableColumns,
  setRefresh,
  type,
}: TableProps<T>) => {
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const leadId = searchParams?.get("id") || "";

  React.useEffect(() => {
    setIsModalOpen(!!leadId);
  }, [leadId]);

  const closeModal = () => setIsModalOpen(false);
  const createPage = () => setIsCreateOpen(true);
  const closeCreateModal = () => setIsCreateOpen(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnsField, setColumnsField] = React.useState<string[]>([]);
  const [pageSize, setPageSize] = React.useState(20);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
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
    if (!table) return;

    const headers = table
      .getHeaderGroups()
      .flatMap((headerGroup) =>
        headerGroup.headers.map((header) =>
          String(header.column.columnDef.header)
        )
      );

    setColumnsField(headers);
  }, [table]);

  React.useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
      pageSize: Number(pageSize),
    }));
  }, [pageSize]);

  const CreateModalComponent = modalMap[type]?.create;
  const EditModalComponent = modalMap[type]?.edit;

  const titleFilterValue =
    (table.getColumn("title")?.getFilterValue() as string) ?? "";

  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;
  const totalFilteredCount = table.getFilteredRowModel().rows.length;
  const startRow = totalFilteredCount > 0 ? pagination.pageIndex * pageSize + 1 : 0;
  const endRow = Math.min((pagination.pageIndex + 1) * pageSize, totalFilteredCount);

  const entityName =
    tableHeading.replace(/\s*List$/i, "").trim() || tableHeading;

  return (
    <div className="w-full">
      {/* Main Table Card */}
      <div className="p-6 bg-white rounded-sm border border-slate-200/80 shadow-xs mb-8">
        {/* Row 1: Header (Title & Meta on Left, Add Button on Right) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          {/* Card Header Left */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#101E4E] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Images className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  {tableHeading}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#101E4E]/10 text-[#101E4E] border border-[#101E4E]/20">
                  {tableData.length} {type === "slider" ? "banners" : "items"}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Manage and review {tableHeading.toLowerCase()} creatives, destinations and status
              </p>
            </div>
          </div>

          {/* Card Header Right: Add Button */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <Button
              type="button"
              onClick={createPage}
              className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 bg-[#FF6B4A] hover:bg-[#E65A38] text-white text-xs font-semibold rounded-sm shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer active:scale-[0.98] shrink-0 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              <span>Add {entityName}</span>
            </Button>
          </div>
        </div>

        {/* Row 2: Toolbar (Search on Left, Rows & Columns on Right) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 mb-4">
          {/* Title Filter Search */}
          <div className="relative flex items-center w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <Input
              placeholder="Search by title..."
              value={titleFilterValue}
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="w-full h-9 pl-9 pr-8 text-xs bg-white border border-slate-200 rounded-md text-slate-800 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#FF6B4A] shadow-2xs"
            />
            {titleFilterValue && (
              <button
                type="button"
                onClick={() => table.getColumn("title")?.setFilterValue("")}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Toolbar: Rows & Columns */}
          <div className="flex items-center gap-2">
            {/* Rows Per Page Select */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Select
                onValueChange={(value) => setPageSize(Number(value))}
                value={String(pageSize)}
              >
                <SelectTrigger className="h-9 px-3 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-none hover:bg-slate-50 cursor-pointer w-auto min-w-[85px] gap-1.5">
                  <span className="text-slate-400 font-normal">Rows:</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg border border-slate-200 bg-white shadow-lg p-1">
                  {[20, 50, 100, 200].map((value) => (
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
                  className="h-9 px-3.5 text-xs font-medium rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-2xs cursor-pointer transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                  <span>Columns</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-mono font-medium">
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
                    }
                  </span>
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
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            )}
                          </div>
                          <span className="truncate flex-1 capitalize">
                            {column.id}
                          </span>
                        </DropdownMenuItem>
                      );
                    })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Selected Rows Banner if any */}
        {selectedRowsCount > 0 && (
          <div className="flex items-center justify-between p-3 mb-3 bg-[#FFF1ED]/60 border border-[#FFD7CC] rounded-lg text-xs font-semibold text-[#EA580C]">
            <span>
              {selectedRowsCount} item
              {selectedRowsCount > 1 ? "s" : ""} selected
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
        <div className="overflow-x-auto rounded-sm border border-slate-200/80">
          <Table className="w-full text-left border-collapse">
            <TableHeader className="bg-slate-50/70 border-b border-slate-200/80">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent border-none"
                >
                  {headerGroup.headers.map((header) => {
                    const id = header.column.id;
                    const widthClass =
                      id === "select"
                        ? "w-10 px-3"
                        : id === "serialNumber"
                        ? "w-16"
                        : id === "title"
                        ? "min-w-[180px]"
                        : id === "thumbnail.web"
                        ? "min-w-[90px]"
                        : id === "thumbnail.mobile"
                        ? "min-w-[90px]"
                        : id === "companyUrl"
                        ? "min-w-[240px]"
                        : id === "active"
                        ? "min-w-[120px]"
                        : id === "actions"
                        ? "min-w-[90px]"
                        : id === "schedulExpire"
                        ? "min-w-[140px]"
                        : "min-w-[120px]";

                    return (
                      <TableHead
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={cn(
                          "cursor-pointer select-none py-3 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-800 transition-colors whitespace-nowrap",
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
              {table.getRowModel()?.rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="group border-b border-slate-100 hover:bg-slate-50/50 transition-colors data-[state=selected]:bg-[#FFF1ED]/40 cursor-default"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-3.5 px-4 text-xs font-normal"
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
                    colSpan={tableColumns.length}
                    className="h-36 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-1.5 text-slate-400">
                      <Images className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                      <p className="text-xs font-semibold text-slate-600">
                        No {tableHeading.toLowerCase()} records found
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Try adjusting your search query or add a new entry
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Bottom Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-3 border-t border-slate-100">
          <div className="text-xs text-slate-500 font-normal">
            Showing <span className="font-medium text-slate-700">{startRow}</span> to{" "}
            <span className="font-medium text-slate-700">{endRow}</span> of{" "}
            <span className="font-medium text-slate-700">{totalFilteredCount}</span>{" "}
            {type === "slider" ? "banners" : "items"}
          </div>

          <div className="flex items-center gap-3">
            <TablePagination table={table} />
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateOpen && CreateModalComponent && (
        <CreateModalComponent
          onClose={closeCreateModal}
          setRefresh={setRefresh}
          columnsField={columnsField}
          type={type}
        />
      )}

      {/* Edit Modal */}
      {isModalOpen && EditModalComponent && (
        <EditModalComponent
          id={leadId}
          onClose={closeModal}
          tableData={tableData}
          setRefresh={setRefresh}
        />
      )}
    </div>
  );
};

export default ExampleTwo;