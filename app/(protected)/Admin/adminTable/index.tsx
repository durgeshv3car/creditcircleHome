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
import { CalendarIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
}

// Define the props interface for the create modal components
interface CreateModalProps {
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  columnsField: string[];
  type: ModalType;
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

}

const ExampleTwo = ({
  tableHeading,
  tableData,
  tableColumns,
  setRefresh,
  type,
  role,
  permissions,
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
  const [pageSize, setPageSize] = React.useState(20);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
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

  return (
    <div className="w-full">
      {/* Header & Filter Section */}
      <div className="flex items-center justify-between py-4 px-5">
        <div className="flex items-center gap-16">
          <div className="text-xl font-medium text-gray-600">
            {tableHeading}
          </div>{" "}
          {
            <>
              {type === "api" && (
                <>
                  <Button
                    onClick={createPage}
                    className="bg-gray-600 hover:bg-gray-700 text-white h-8 text-xs rounded-md shadow-sm transition-all px-6"
                  >
                    Add {tableHeading}
                  </Button>
                </>
              )}
            </>
          }
        </div>

        <div className="flex items-center gap-4">
          {/* Select for Rows per Page */}
          <label className="text-sm text-gray-600">Rows per page:</label>
          <Select
            onValueChange={(value) => setPageSize(Number(value))}
            value={String(pageSize)}
          >
            <SelectTrigger className="w-20 border rounded px-2 py-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[20, 50, 100, 200, 500].map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Select for Column Visibility */}
          <label className="text-sm text-gray-600">Hide Column:</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" forceMount>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Input for Filtering */}
          <Input
            placeholder="Filter Name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      </div>
      {/* Table Component */}
      <Table>
        <TableHeader className="bg-default-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer select-none"
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center justify-between">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() && (
                        <span className="text-sm">
                          {header.column.getIsSorted() === "asc" ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-pointer">
                                    <Icon icon="heroicons:arrow-up" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>Sort Ascending</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-pointer">
                                    <Icon icon="heroicons:arrow-down" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>Sort Descending</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel()?.rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={tableColumns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination table={table} />

      {/* Create Modal */}
      <React.Suspense fallback={<div>Loading...</div>}>
        {isCreateOpen && CreateModalComponent && (
          <CreateModalComponent
            onClose={closeCreateModal}
            columnsField={columnsField}
            setRefresh={setRefresh}
            type={type}
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
          />
        )}
      </React.Suspense>
    </div>
  );
};

export default ExampleTwo;
