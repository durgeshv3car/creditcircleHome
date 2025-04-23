"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columns } from "./columns";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useRouter } from "next/navigation";
import { filters } from "../../leads/components/Filter";

const ExampleTwo = ({ selectedValues, setSelectedValues,tableData,tableColumns }) => {
  const router = useRouter();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [selectedColumn, setSelectedColumn] = React.useState<
    string | undefined
  >();
  const [rowSelection, setRowSelection] = React.useState({});
  const [pageSize, setPageSize] = React.useState(20); // Default to 20 rows per page

  const [selectedRowsData, setSelectedRowsData] = React.useState([]);

  const table = useReactTable({
    data:tableData,
    columns:tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: { pageIndex: 0, pageSize }, // Page size included
    },
  });
  React.useEffect(() => {
    const selectedData = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    setSelectedRowsData(selectedData);
  }, [rowSelection]);

  const handleRemoveFilter = (key) => {
    setSelectedValues((prev) => ({ ...prev, [key]: "" }));
  };
  const filters = [
    { label: "Category", key: "category", value: selectedValues.category },
    { label: "Status", key: "status", value: selectedValues.status },
    { label: "Title", key: "title", value: selectedValues.title },
    { label: "Phone", key: "phone", value: selectedValues.phone },
    { label: "User", key: "user", value: selectedValues.user },
  ].filter((filter) => filter.value && filter.value.trim() !== "");
  

  return (
    <div className="w-full">
      {/* Header & Filter Section */}
     

      {/* Display Selected Values */}
      <div className="mt-5  flex items-center justify-between">
      <Filter
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        data={tableData}
      />
       
      </div>

      <div className="flex items-center justify-between py-4 px-5">
        <div className="text-xl font-medium text-default-900">
          OfferLeads Data
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Component */}
      <TablePagination table={table} />
    </div>
  );
};

export default ExampleTwo;
