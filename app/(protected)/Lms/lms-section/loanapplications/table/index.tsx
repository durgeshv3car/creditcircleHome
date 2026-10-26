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
  RowSelectionState,
  ColumnDef,
} from "@tanstack/react-table";
import {
  FileSpreadsheet,
  SlidersHorizontal,
  Check,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
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
import { cn } from "@/lib/utils";

import TablePagination from "./table-pagination";
import Filter from "../components/Filter";
import OfferSelectionModal from "../components/OfferSelectionModal";
import { useSearchParams } from "next/navigation";
import { SelectedValues } from "../components/LoanApplications";

const COLUMN_DISPLAY_NAMES: Record<string, string> = {
  select: "Select",
  index: "ID",
  date: "Application Date",
  time: "Time",
  phoneNumber: "Phone Number",
  desiredLoanAmount: "Desired Loan Amount",
  loanTenure: "Loan Tenure",
  loanType: "Loan Type",
  employmentStatus: "Employment Status",
  netMonthlyIncome: "Net Monthly Income",
  salaryMode: "Salary Mode",
  hasCreditCard: "Has Credit Card",
  salaryBank: "Salary Bank",
  companyName: "Company Name",
  employmentLevel: "Employment Level",
  officeLocation: "Office Location",
  officeStreet: "Office Street",
  officePinCode: "Office PIN Code",
  officeCity: "Office City",
  officeState: "Office State",
  loanPurpose: "Loan Purpose",
  hasGST: "Has GST",
  gstNumber: "GST Number",
  businessPAN: "Business PAN",
  businessName: "Business Name",
  tradeName: "Trade Name",
  PrincipalPlaceofBusiness: "Principal Place of Business",
  businessType: "Business Type",
  natureOfBusiness: "Nature of Business",
  yearsInBusiness: "Years in Business",
  businessTurnover: "Business Turnover",
  GSTStatus: "GST Status",
  businessIncome: "Business Income",
  businessBank: "Business Bank",
  profession: "Profession",
  registrationNumber: "Registration Number",
  yearRegistration: "Year of Registration",
  studentIncome: "Student Income",
  studentIncomeMode: "Student Income Mode",
  fatherName: "Father's Name",
  motherName: "Mother's Name",
  livesWithParents: "Lives with Parents",
  loanCompletion: "Loan Completion",
  status: "Status",
  actions: "Actions",
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
  token: string;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setSelectedStatus: React.Dispatch<React.SetStateAction<string>>;
  selectedStatus: string;
  setSelectedStatusPartner: React.Dispatch<React.SetStateAction<string>>;
  selectedStatusPartner: string;
  recordsCount?: number;
  isLoading?: boolean;
}

const ExampleTwo: React.FC<ExampleTwoProps> = ({
  selectedValues,
  setSelectedValues,
  tableData,
  tableColumns,
  token,
  pageSize,
  setPageSize,
  totalPages,
  setTotalPages,
  currentPage,
  setCurrentPage,
  setSelectedStatus,
  selectedStatus,
  setSelectedStatusPartner,
  selectedStatusPartner,
  recordsCount = 0,
  isLoading = false,
}) => {
  const searchParams = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      time: false,
    });
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
  const [visibleData, setVisibleData] = React.useState(tableData);
  React.useEffect(() => {
    setVisibleData(tableData);
  }, [tableData]);

  const table = useReactTable({
    data: visibleData,
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

  const handleSelectChangeStatusPartner = (val: string) => {
    setSelectedStatusPartner(val);
    table.resetColumnFilters();
  };

  const handleSelectChangeStatus = (val: string) => {
    setSelectedStatus(val);
    table.resetColumnFilters();
  };

  return (
    <div className="w-full">
      {/* Header & Filter Section */}
      <div className="p-5 md:p-6 mb-6 bg-white rounded-sm border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all duration-300">
        <Filter
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
          data={tableData}
        />
      </div>

      {/* Main Table Card */}
      <div className="p-6 bg-white rounded-sm border border-slate-200/80 shadow-xs mb-8">
        {/* Top Header & Toolbar Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-2">
          {/* Card Header Left */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#101E4E] text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Loan Applications Data
                </h2>
                <span className="px-2 py-0.5 rounded-sm text-xs font-semibold bg-[#FFF1ED] text-[#EA580C]">
                  {recordsCount
                    ? `${recordsCount.toLocaleString()} applications`
                    : "Directory"}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Manage, filter and review loan application requests and borrower details
              </p>
            </div>
          </div>

          {/* Right Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Partner Filter */}
            <Select
              value={selectedStatusPartner}
              onValueChange={handleSelectChangeStatusPartner}
            >
              <SelectTrigger className="h-9 px-3 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-none hover:bg-slate-50 cursor-pointer w-auto min-w-[125px] gap-1.5 focus:ring-1 focus:ring-[#FF6B4A]">
                <SelectValue placeholder="All Partners" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border border-slate-200 bg-white shadow-lg p-1 min-w-[140px]">
                <SelectItem value="Partners" className="rounded-md text-xs cursor-pointer">
                  All Partners
                </SelectItem>
                <SelectItem value="Cashe" className="rounded-md text-xs cursor-pointer">
                  Cashe
                </SelectItem>
                <SelectItem
                  value="Emergancy Paisa"
                  className="rounded-md text-xs cursor-pointer"
                >
                  Emergancy Paisa
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={selectedStatus}
              onValueChange={handleSelectChangeStatus}
            >
              <SelectTrigger className="h-9 px-3 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-none hover:bg-slate-50 cursor-pointer w-auto min-w-[110px] gap-1.5 focus:ring-1 focus:ring-[#FF6B4A]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border border-slate-200 bg-white shadow-lg p-1 min-w-[125px]">
                <SelectItem value="Status" className="rounded-md text-xs cursor-pointer">
                  All Status
                </SelectItem>
                <SelectItem value="approved" className="rounded-md text-xs cursor-pointer">
                  Approved
                </SelectItem>
                <SelectItem value="rejected" className="rounded-md text-xs cursor-pointer">
                  Rejected
                </SelectItem>
                <SelectItem value="duplicate" className="rounded-md text-xs cursor-pointer">
                  Duplicate
                </SelectItem>
              </SelectContent>
            </Select>

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
                    <SelectItem key={value} value={String(value)} className="rounded-md text-xs cursor-pointer">
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
                      Visible Columns
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#FFF1ED] text-[#EA580C] border border-orange-200/70">
                      {
                        table
                          .getAllColumns()
                          .filter((c) => c.getCanHide() && c.getIsVisible())
                          .length
                      }{" "}
                      active
                    </span>
                  </div>
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

                {/* Columns List */}
                <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5 clean-scrollbar">
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
                className="bg-[#FF6B4A] hover:bg-[#E65A38] text-white px-3.5 h-9 rounded-md text-xs font-semibold shadow-sm shadow-orange-500/20 transition-colors cursor-pointer"
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
              {selectedRowsData.length} application
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
                        : id === "date"
                        ? "min-w-[130px]"
                        : id === "phoneNumber"
                        ? "min-w-[120px]"
                        : id === "desiredLoanAmount"
                        ? "min-w-[140px]"
                        : id === "status"
                        ? "min-w-[120px]"
                        : id === "actions"
                        ? "min-w-[90px]"
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
                            {id === "date" && (
                              <div className="h-3.5 w-20 bg-slate-100 rounded animate-pulse" />
                            )}
                            {id === "phoneNumber" && (
                              <div className="h-3.5 w-24 bg-slate-100 rounded animate-pulse" />
                            )}
                            {id === "status" && (
                              <div className="h-6 w-24 rounded-md bg-slate-100 animate-pulse" />
                            )}
                            {id === "actions" && (
                              <div className="w-8 h-8 rounded-md bg-slate-100 animate-pulse" />
                            )}
                            {![
                              "select",
                              "index",
                              "date",
                              "phoneNumber",
                              "status",
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
                      <FileSpreadsheet className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                      <p className="text-xs font-semibold text-slate-600">
                        No loan applications found
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Try adjusting your filters or date range
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Bottom Pagination & Records count bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-5 mt-3 border-t border-slate-100">
          <div className="text-xs text-slate-500 font-normal">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {recordsCount ? (currentPage - 1) * pageSize + 1 : 0}
            </span>
            –
            <span className="font-semibold text-slate-800">
              {Math.min(currentPage * pageSize, recordsCount)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {recordsCount.toLocaleString()}
            </span>{" "}
            applications
          </div>

          <div className="flex items-center gap-3">
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
