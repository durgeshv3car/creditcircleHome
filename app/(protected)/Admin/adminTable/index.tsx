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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Users, Cpu, Activity, SlidersHorizontal, Check, Search, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Categorys } from "../admin-section/user-management/components/columnsCategory";

type ModalType = "api" | "logs" | "user";

// Define the props interface for the edit modal components
interface EditModalProps<Categorys> {
  id: string;
  onClose: () => void;
  tableData: Categorys[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  token: string;
}

// Define the props interface for the create modal components
interface CreateModalProps {
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  columnsField: string[];
  type: ModalType;
  token: string;
}

// Type for modal components
type ModalComponent<Categorys> = React.ComponentType<EditModalProps<Categorys>>;
type CreateComponent = React.ComponentType<CreateModalProps>;

// Define modal map with proper typing
const TablePagination = dynamic(() => import("./table-pagination"), {
  ssr: false,
});

const modalMap: Record<
  ModalType,
  {
    create: CreateComponent;
    edit: any; // Using any temporarily for dynamic imports
  }
> = {
  api: {
    create: dynamic(
      () => import("../admin-section/api-management/components/Create")
    ) as CreateComponent,
    edit: dynamic(
      () => import("../admin-section/api-management/components/EditModal")
    ),
  },
  logs: {
    create: dynamic(
      () => import("../admin-section/user-logs/components/Create")
    ) as CreateComponent,
    edit: dynamic(
      () => import("../admin-section/user-logs/components/EditModal")
    ),
  },
  user: {
    create: dynamic(
      () => import("../admin-section/user-management/components/Create")
    ) as CreateComponent,
    edit: dynamic(
      () => import("../admin-section/user-management/components/EditModal")
    ),
  },
};

interface TableProps {
  tableColumns: ColumnDef<Categorys>[]; // Ensure this matches the type of tableColumns
  tableHeading: string;
  tableData: Categorys[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  type: ModalType;
  role: string;
  permissions: [];
  token: string;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const ExampleTwo = ({
  tableHeading,
  tableData,
  tableColumns,
  setRefresh,
  type,
  role,
  permissions,
  token,
  pageSize,
  setPageSize,
  totalPages,
  setTotalPages,
  currentPage,
  setCurrentPage,
}: TableProps) => {
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

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 1,
    pageSize,
  });

  React.useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
      pageSize: Number(pageSize),
    }));
  }, [pageSize]);

  const table = useReactTable({
    data: tableData,
    columns: tableColumns as ColumnDef<Categorys>[],
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

  // Select modals based on the type
  const CreateModalComponent = modalMap[type]?.create;
  const EditModalComponent = modalMap[type]?.edit;

  const selectedRowsCount = Object.keys(rowSelection).length;

  const searchColumn =
    table.getColumn("name") ||
    table.getColumn("title") ||
    table.getColumn("username") ||
    table.getColumn("action");
  const searchValue = (searchColumn?.getFilterValue() as string) ?? "";

  const entityName =
    type === "user" ? "User" : type === "api" ? "API" : "Log";

  const getIcon = () => {
    if (type === "user") return <Users className="w-5 h-5 text-white" />;
    if (type === "api") return <Cpu className="w-5 h-5 text-white" />;
    return <Activity className="w-5 h-5 text-white" />;
  };

  const getSubtitle = () => {
    if (type === "user")
      return "Manage admin users, roles and system access permissions";
    if (type === "api")
      return "Configure API endpoints, credentials, counters and integration status";
    return "Track user audit trails, actions, IP addresses and timestamps";
  };

  const getCountLabel = () => {
    if (type === "user") return `${tableData.length} users`;
    if (type === "api") return `${tableData.length} APIs`;
    return `${tableData.length} logs`;
  };

  return (
    <div className="w-full">
      {/* Main Table Card */}
      <div className="p-6 bg-white rounded-sm border border-slate-200/80 shadow-xs mb-8">
        {/* Row 1: Header (Title & Meta on Left, Add Button on Right) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          {/* Card Header Left */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#101E4E] text-white flex items-center justify-center shrink-0 shadow-xs">
              {getIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  {tableHeading}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF1ED] text-[#EA580C] border border-[#FFD7CC]">
                  {getCountLabel()}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                {getSubtitle()}
              </p>
            </div>
          </div>

          {/* Card Header Right: Add Button (for API Management and User Management) */}
          {type !== "logs" && (
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
          )}
        </div>

        {/* Row 2: Toolbar (Search on Left, Rows & Columns on Right) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 mb-4">
          {/* Search Filter Input */}
          <div className="relative flex items-center w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <Input
              placeholder={`Search by ${searchColumn?.id || "name"}...`}
              value={searchValue}
              onChange={(event) =>
                searchColumn?.setFilterValue(event.target.value)
              }
              className="w-full h-9 pl-9 pr-8 text-xs bg-white border border-slate-200 rounded-md text-slate-800 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#FF6B4A] shadow-2xs"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => searchColumn?.setFilterValue("")}
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
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#FFF1ED] text-[#EA580C] border border-[#FFD7CC]">
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
                      className="text-[11px] font-medium text-[#FF6B4A] hover:underline cursor-pointer px-1 py-0.5 rounded"
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
          <div className="flex items-center justify-between p-3 mb-3 bg-[#FFF1ED]/60 border border-[#FFD7CC] rounded-sm text-xs font-semibold text-[#EA580C]">
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
                    return (
                      <TableHead
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="cursor-pointer select-none py-3 px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-800 transition-colors whitespace-nowrap min-w-[120px]"
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
                    className="h-32 text-center text-xs text-slate-400 font-normal"
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Bottom Pagination */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            pageSize={pageSize}
            totalRecords={totalPages > 1 ? totalPages * pageSize : tableData.length}
          />
        </div>
      </div>

      {/* Create Modal */}
      <React.Suspense fallback={<div>Loading...</div>}>
        {isCreateOpen && CreateModalComponent && (
          <CreateModalComponent
            onClose={closeCreateModal}
            columnsField={columnsField}
            setRefresh={setRefresh}
            type={type}
            token={token}
          />
        )}
      </React.Suspense>

      {/* Edit Modal */}
      <React.Suspense fallback={<div>Loading...</div>}>
        {isModalOpen && EditModalComponent && (
          <EditModalComponent
            id={leadId}
            onClose={closeModal}
            tableData={tableData}
            setRefresh={setRefresh}
            role={role}
            permissions={permissions}
            token={token}
          />
        )}
      </React.Suspense>
    </div>
  );
};

export default ExampleTwo;
