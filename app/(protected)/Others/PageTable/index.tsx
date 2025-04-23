"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
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

// Dynamically import different modals based on type
const modalMap = {
  
  faq: {
    create: dynamic(
      () => import("../page-section/faq/components/Create"),
      { ssr: false }
    ),
    edit: dynamic(() => import("../page-section/faq/components/EditModal"), {
      ssr: false,
    }),
  },
  policy: {
    create: dynamic(
      () => import("../page-section/policy/components/Create"),
      { ssr: false }
    ),
    edit: dynamic(() => import("../page-section/policy/components/EditModal"), {
      ssr: false,
    }),
  },
};

const ExampleTwo = ({
  tableHeading,
  tableData,
  tableColumns,
  setRefresh,
  type,
}) => {
  console.log(tableData, `${type} Data`);

  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const leadId = searchParams.get("id");

  React.useEffect(() => {
    setIsModalOpen(!!leadId);
  }, [leadId]);

  const closeModal = () => setIsModalOpen(false);
  const createPage = () => setIsCreateOpen(true);
  const closeCreateModal = () => setIsCreateOpen(false);

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnsField, setColumnsField] = React.useState([]);
  const [pageSize, setPageSize] = React.useState(20);

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
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: { pageIndex: 0, pageSize },
    },
  });

  React.useEffect(() => {
    if (!table) return;

    const headers = table
      .getHeaderGroups()
      .flatMap((headerGroup) =>
        headerGroup.headers.map((header) => header.column.columnDef.header)
      );

    setColumnsField(headers);
  }, [table]);

  // Select modals based on the `type`
  const CreateModalComponent = modalMap[type]?.create;
  const EditModalComponent = modalMap[type]?.edit;
  console.log(isCreateOpen, "isCreateOpen")
  console.log(isModalOpen, "isModalOpen")
  console.log(CreateModalComponent, "CreateModalComponent")

  return (
    <div className="w-full">
      {/* Header & Filter Section */}
      <div className="flex items-center justify-between py-4 px-5">
        <div className="flex items-center gap-16">
          <div className="text-xl font-medium text-gray-600">
            {tableHeading}
          </div>
          <Button
            onClick={createPage}
            className="bg-gray-600 hover:bg-gray-700 text-white w-24 h-8 text-xs rounded-md shadow-sm transition-all"
          >
            Add {tableHeading}
          </Button>
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
          <DropdownMenu  onOpenChange={(open) => console.log("Dropdown state:", open)}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto" onClick={() => console.log("Dropdown clicked")}>
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
            value={table.getColumn("name")?.getFilterValue() ?? ""}
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
