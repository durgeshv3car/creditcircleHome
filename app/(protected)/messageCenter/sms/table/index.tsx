"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
import FilterSection from "../components/FilterSection";

const ExampleTwo = ({
  selectedValues,
  setSelectedValues,
  tableData,
  tableColumns,
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

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility, // ✅ Ensure visibility updates
    onRowSelectionChange: setRowSelection, // ✅ Ensure row selection updates
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: { pageIndex: 0, pageSize },
    },
  });

  return (
    <div className="w-full">
      {/* Filter Section */}
      <div className="mt-5 flex items-center justify-between">
        {/* <Filter selectedValues={selectedValues} setSelectedValues={setSelectedValues} data={tableData} /> */}

        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center  text-sm text-neutral-900 font-medium border border-neutral-700 rounded-[8px] px-4 py-2">
            <Icon icon="heroicons-outline:funnel" className="w-5 h-5" />
            <span>Filters </span>
          </span>
         
          <Input
            placeholder="Filter title..."
            value={table.getColumn("title")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() =>
              router.push("/dashboard/leads?createnotification=true&&type=Sms")
            }
            className="flex items-center space-x-1 border border-neutral-700 rounded-md"
          >
            <Icon icon="heroicons:bell-solid" className="w-5 h-5 " />
            <span>Create Notification</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {" "}
                <Icon
                  icon="heroicons-outline:circle-stack"
                  className="w-5 h-5 "
                />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex items-center justify-between py-4 px-5">
        <div className="flex items-center gap-4">
          {/* Rows per Page */}

          {/* Column Visibility Toggle */}
        </div>
      </div>

      {/* Table Component */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
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
        {/* Controls bar (Rows per page) */}
        <div className="flex items-center justify-between py-4 px-5">
          <div className="flex items-center space-x-2">
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
          </div>
        </div>

        {/* Table body - separate block below controls */}
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
              <TableCell
                colSpan={tableColumns.length}
                className="text-center py-8 text-gray-500"
              >
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
