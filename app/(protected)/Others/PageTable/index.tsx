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
import TablePagination from "./table-pagination";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

type ModalType = "faq" | "policy" | "creditScore" | "walletPoints";

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
  faq: {
    create: dynamic(() => import("../page-section/faq/components/Create"), {
      ssr: false,
    }) as CreateComponent,
    edit: dynamic(() => import("../page-section/faq/components/EditModal"), {
      ssr: false,
    }),
  },
  policy: {
    create: dynamic(() => import("../page-section/policy/components/Create"), {
      ssr: false,
    }) as CreateComponent,
    edit: dynamic(() => import("../page-section/policy/components/EditModal"), {
      ssr: false,
    }),
  },
  creditScore: {
    create: dynamic(
      () => import("../page-section/credit-score/components/Create"),
      { ssr: false }
    ) as CreateComponent,
    edit: dynamic(
      () => import("../page-section/credit-score/components/EditModal"),
      {
        ssr: false,
      }
    ),
  },
  walletPoints: {
    create: dynamic(
      () => import("../page-section/wallet-points/components/Create"),
      { ssr: false }
    ) as CreateComponent,
    edit: dynamic(
      () => import("../page-section/wallet-points/components/EditModal"),
      {
        ssr: false,
      }
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

  const [globalFilter, setGlobalFilter] = React.useState(""); 

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      globalFilter, // ✅ ADDED
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter, // ✅ ADDED
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),

    // ✅ Custom global filter for "title" and "companyUrl"
    globalFilterFn: (row, columnId, filterValue) => {
      const title = row.getValue("title")?.toString().toLowerCase() ?? "";
      const companyUrl =
        row.getValue("companyUrl")?.toString().toLowerCase() ?? "";
      const filter = filterValue?.toLowerCase() ?? "";
      return title.includes(filter) || companyUrl.includes(filter);
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

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 px-5">
        <div className="flex items-center gap-16">
          <div className="text-xl font-medium text-gray-600">
            {tableHeading}
          </div>
          <Button
            onClick={createPage}
            className="bg-gray-600 hover:bg-gray-700 text-white h-8 text-xs rounded-md shadow-sm transition-all px-6"
          >
            Add {tableHeading}
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600">Rows per page:</label>
          <Select
            onValueChange={(value) => setPageSize(Number(value))}
            value={String(pageSize)}
          >
            <SelectTrigger className="w-20 border rounded px-2 py-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[20, 50, 100].map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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

          {/* ✅ Updated Filter Input */}
          <Input
            placeholder="Filter ..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

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
      {isCreateOpen && CreateModalComponent && (
        <CreateModalComponent
          onClose={closeCreateModal}
          setRefresh={setRefresh}
          columnsField={columnsField}
          type={type}
        />
      )}
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
