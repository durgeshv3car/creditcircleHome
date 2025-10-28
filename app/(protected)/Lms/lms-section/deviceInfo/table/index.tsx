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
import { columns } from "./columns";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
import Filter from "../components/Filter";
import OfferSelectionModal from "../components/OfferSelectionModal";
import { useSearchParams } from "next/navigation";
import { SelectedValues } from "../components/DeviceInfo";

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
}) => {
  const searchParams = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [selectedColumn, setSelectedColumn] = React.useState<
    string | undefined
  >();
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
      console.log("creatingNotification detected");
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
      <div className="py-4 px-5 mb-6 bg-white rounded-md">
        <Filter
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
          data={tableData}
          allFilterOptions={allFilterOptions}
        />
      </div>

      {/* Display Selected Values */}

      <div className="py-4 px-5 bg-whit rounded-md">
        <div className="flex items-center justify-between">
          <div className="text-xl font-medium text-default-900">
            LoanApplications Data
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
                {[20, 50, 100].map((value) => (
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
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
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
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Input for Filtering */}
            {/* <Input
            placeholder="Filter Status..."
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("status")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          /> */}
            {isCreatingNotification && (
              <button
                className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={Object.keys(rowSelection).length === 0}
                onClick={() => setIsModalOpen(true)}
              >
                Send {type}
              </button>
            )}
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Component */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
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
