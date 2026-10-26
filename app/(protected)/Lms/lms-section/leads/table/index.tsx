"use client";

import * as React from "react";
import {
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
  Search,
  Users,
  SlidersHorizontal,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import dynamic from "next/dynamic";

const EditModal = dynamic(() => import("../components/EditModal"), {
  ssr: false,
  loading: () => <p className="text-xs text-slate-400">Loading...</p>,
});

const ImportExportButtons = dynamic(() => import("../components/Download"), {
  ssr: false,
  loading: () => <p className="text-xs text-slate-400">Loading...</p>,
});

const OfferSelectionModal = dynamic(
  () => import("../components/OfferSelectionModal"),
  {
    ssr: false,
    loading: () => <p className="text-xs text-slate-400">Loading...</p>,
  }
);

const Filter = dynamic(() => import("../components/Filter"), {
  ssr: false,
});

import TablePagination from "./table-pagination";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const COLUMN_DISPLAY_NAMES: Record<string, string> = {
  lead: "Lead",
  contact: "Contact",
  date: "Date",
  dob: "Date of Birth",
  pan: "PAN",
  score: "Score",
  pinCode: "PIN Code",
  city: "City",
  state: "State",
  houseNo: "House No",
  streetAddress: "Street Address",
  landmark: "Landmark",
  gender: "Gender",
  education: "Education",
  maritalStatus: "Marital Status",
  liveWith: "Living Situation",
  ownsFourWheeler: "Owns 4-Wheeler",
  ownsTwoWheeler: "Owns 2-Wheeler",
  insurancePlans: "Insurance Plans",
  investmentOptions: "Investments",
  earningMembers: "Earning Members",
  shoppingFrequency: "Shopping Frequency",
  rewardInterests: "Reward Interests",
  exploreIndiaFrequency: "Travel (India)",
  travelAbroadFrequency: "Travel (Abroad)",
  pauseSms: "SMS Alerts",
  pauseEmail: "Email Alerts",
  pauseWhatsapp: "WhatsApp Alerts",
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
import { ColumnDef } from "@tanstack/react-table";

import { DataProps } from "./columns";
import { SelectedValues } from "../components/Leads";
import { cn } from "@/lib/utils";

interface ExampleTwoProps {
  selectedValues: SelectedValues;
  setSelectedValues: React.Dispatch<React.SetStateAction<SelectedValues>>;
  tableData: DataProps[];
  tableColumns: ColumnDef<DataProps, any>[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  allFilterOptions: Record<string, any>;
  token: string;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  options: { value: string; label: string }[];
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  isLoading?: boolean;
  recordsCount?: number;
}

const ExampleTwo = <TData extends Record<string, any>>({
  selectedValues,
  setSelectedValues,
  tableData,
  tableColumns,
  setRefresh,
  allFilterOptions,
  token,
  pageSize,
  setPageSize,
  totalPages,
  setTotalPages,
  currentPage,
  setCurrentPage,
  options,
  query,
  setQuery,
  selected,
  setSelected,
  searchTerm,
  setSearchTerm,
  isLoading = false,
  recordsCount = 0,
}: ExampleTwoProps) => {
  const searchParams = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      time: false,
      liveWith: false,
      ownsFourWheeler: false,
      ownsTwoWheeler: false,
      insurancePlans: false,
      investmentOptions: false,
      earningMembers: false,
      shoppingFrequency: false,
      rewardInterests: false,
      exploreIndiaFrequency: false,
      travelAbroadFrequency: false,
      pauseSms: true,
      pauseEmail: true,
      pauseWhatsapp: true,
      city: true,
      state: true,
      houseNo: true,
      streetAddress: true,
      landmark: true,
      gender: true,
      education: false,
      maritalStatus: false,
    });

  const [isModalOpenOffer, setIsModalOpenOffer] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [selectedRowsData, setSelectedRowsData] = React.useState<DataProps[]>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [type, setType] = React.useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = React.useState<any>(null);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const leadId = searchParams?.get("id") || "";

  const [isCreatingNotification, setIsCreatingNotification] =
    React.useState(false);

  React.useEffect(() => {
    setIsModalOpen(!!leadId);
  }, [leadId]);

  const closeModal = () => setIsModalOpen(false);

  React.useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
      pageSize: Number(pageSize),
    }));
  }, [pageSize]);

  const [visibleData, setVisibleData] = React.useState<DataProps[]>(tableData);
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
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      globalFilter,
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
    setType(searchParams?.get("type") as string);

    if (creatingNotification === "true") {
      setIsCreatingNotification(true);
    }
  }, [searchParams]);

  const [selectedStatus, setSelectedStatus] =
    React.useState<string>("approved");
  const [selectedStatusPartner, setSelectedStatusPartner] =
    React.useState<string>("Cashe");

  const handleSelectChange = (val: string) => {
    setSelected(val);
  };
  const handleSelectChangeStatusPartner = (val: string) => {
    setSelectedStatusPartner(val);
  };
  const handleSelectChangeStatus = (val: string) => {
    setSelectedStatus(val);
  };

  // Filter leads when status is selected
  React.useEffect(() => {
    if (selected === "status" && selectedStatusPartner && selectedStatus) {
      const filteredUsers = tableData.filter((user) => {
        const loanApps = Array.isArray(user?.LoanApplications)
          ? user.LoanApplications
          : Array.isArray((user as any)?.loanApplications)
          ? (user as any).loanApplications
          : [];

        if (loanApps.length === 0) return false;

        return loanApps.some((loan: any) => {
          const statusValue = loan?.loanDataStatus?.[selectedStatusPartner];

          if (typeof statusValue === "object" && statusValue !== null) {
            return (
              statusValue.status?.toLowerCase() === selectedStatus.toLowerCase()
            );
          }

          if (typeof statusValue === "string" && statusValue.includes("http")) {
            return selectedStatus.toLowerCase() === "approved";
          }

          if (typeof statusValue === "string") {
            return statusValue
              .toLowerCase()
              .includes(selectedStatus.toLowerCase());
          }

          return false;
        });
      });

      setVisibleData(filteredUsers);
    } else {
      setVisibleData(tableData);
    }
  }, [tableData, selected, selectedStatusPartner, selectedStatus]);

  return (
    <div className="w-full">
      {/* Filter Section Card */}
      <div className="p-5 md:p-6 mb-6 bg-white rounded-sm border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all duration-300">
        <React.Suspense fallback={<div className="h-20 flex items-center justify-center text-slate-400 text-xs">Loading filters...</div>}>
          <Filter
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
            data={tableData}
            allFilterOptions={allFilterOptions}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </React.Suspense>
      </div>

      {/* Main Table Card Matching Reference Design */}
      <div className="p-6 bg-white rounded-sm border border-slate-200/80 shadow-xs mb-8">
        {/* Top Header & Toolbar Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-2">
          {/* Card Header Left */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#101E4E] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Users Data
                </h2>
                <span className="px-2 py-0.5 rounded-sm text-xs font-semibold bg-[#FFF1ED] text-[#EA580C]">
                  {recordsCount ? `${recordsCount.toLocaleString()} leads` : "Directory"}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Manage, filter and export registered borrower leads
              </p>
            </div>
          </div>

          {/* Right Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Column Selector & Search Input matching user's image */}
            <div className="flex items-center gap-1.5">
              <Select value={selected} onValueChange={handleSelectChange}>
                <SelectTrigger className="h-9 px-3 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-none hover:bg-slate-50 cursor-pointer w-auto min-w-[85px] gap-1.5 focus:ring-1 focus:ring-[#FF6B4A]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border border-slate-200 bg-white shadow-lg p-1 min-w-[140px]">
                  {options.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="rounded-md text-xs cursor-pointer py-1.5 px-2.5 text-slate-700 hover:text-slate-900 focus:bg-slate-100"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selected !== "status" ? (
                <div className="relative flex items-center">
                  <Input
                    id="search-input"
                    placeholder={
                      selected === "all"
                        ? "Search..."
                        : `Search by ${
                            options.find((o) => o.value === selected)?.label ||
                            selected
                          }...`
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-9 pr-7 text-xs bg-white border border-slate-200 rounded-md text-slate-800 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#FF6B4A] focus-visible:border-[#FF6B4A] w-44 sm:w-56 shadow-2xs"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Select
                    value={selectedStatusPartner}
                    onValueChange={handleSelectChangeStatusPartner}
                  >
                    <SelectTrigger className="h-9 px-3 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-none hover:bg-slate-50 cursor-pointer w-auto min-w-[95px]">
                      <SelectValue placeholder="Partner" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border border-slate-200 bg-white shadow-lg p-1">
                      <SelectItem value="Cashe" className="rounded-md text-xs cursor-pointer">
                        Cashe
                      </SelectItem>
                      <SelectItem value="Mpocket" className="rounded-md text-xs cursor-pointer">
                        Mpocket
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedStatus}
                    onValueChange={handleSelectChangeStatus}
                  >
                    <SelectTrigger className="h-9 px-3 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-none hover:bg-slate-50 cursor-pointer w-auto min-w-[100px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border border-slate-200 bg-white shadow-lg p-1">
                      <SelectItem value="approved" className="rounded-md text-xs cursor-pointer">
                        Approved
                      </SelectItem>
                      <SelectItem value="rejected" className="rounded-md text-xs cursor-pointer">
                        Rejected
                      </SelectItem>
                      <SelectItem value="Exist" className="rounded-md text-xs cursor-pointer">
                        Exist
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
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

            {/* Export & Add Lead Buttons */}
            <React.Suspense fallback={<div className="text-xs text-slate-400">Loading actions...</div>}>
              <ImportExportButtons
                setRefresh={setRefresh}
                filteredData={tableData}
                columns={tableColumns}
                selectedRowsData={selectedRowsData}
                selected={selected}
                selectedValues={selectedValues}
              />
            </React.Suspense>

            {isCreatingNotification && (
              <button
                className="bg-[#FF6B4A] hover:bg-[#E65A38] text-white px-3.5 h-9 rounded-md text-xs font-semibold shadow-sm shadow-orange-500/20 transition-colors cursor-pointer"
                onClick={() => setIsModalOpenOffer(true)}
              >
                Send {type}
              </button>
            )}
          </div>
        </div>

        {/* Selected Rows Banner if any */}
        {selectedRowsData.length > 0 && (
          <div className="flex items-center justify-between p-3 mb-3 bg-[#FFF1ED]/60 border border-[#FFD7CC] rounded-sm text-xs font-semibold text-[#EA580C]">
            <span>{selectedRowsData.length} lead{selectedRowsData.length > 1 ? "s" : ""} selected</span>
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
                        : id === "lead"
                        ? "min-w-[200px]"
                        : id === "contact"
                        ? "min-w-[180px]"
                        : id === "date"
                        ? "min-w-[110px]"
                        : id === "dob"
                        ? "min-w-[80px]"
                        : id === "pan"
                        ? "min-w-[105px]"
                        : id === "score"
                        ? "min-w-[110px]"
                        : id === "pinCode"
                        ? "min-w-[85px]"
                        : id === "city"
                        ? "min-w-[100px]"
                        : id === "state"
                        ? "min-w-[100px]"
                        : id === "houseNo"
                        ? "min-w-[95px]"
                        : id === "streetAddress"
                        ? "min-w-[140px]"
                        : id === "landmark"
                        ? "min-w-[110px]"
                        : id === "gender"
                        ? "min-w-[80px]"
                        : id === "pauseSms"
                        ? "min-w-[65px] text-center"
                        : id === "pauseEmail"
                        ? "min-w-[65px] text-center"
                        : id === "pauseWhatsapp"
                        ? "min-w-[75px] text-center"
                        : id === "actions"
                        ? "min-w-[90px]"
                        : "min-w-[100px]";

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
                              <div className="w-4 h-4 rounded bg-slate-100 animate-pulse" />
                            )}
                            {id === "lead" && (
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-slate-100 animate-pulse shrink-0" />
                                <div className="space-y-1.5 min-w-0">
                                  <div className="h-3.5 w-28 bg-slate-100 rounded animate-pulse" />
                                  <div className="h-2.5 w-14 bg-slate-100 rounded animate-pulse" />
                                </div>
                              </div>
                            )}
                            {id === "contact" && (
                              <div className="space-y-1.5">
                                <div className="h-3.5 w-24 bg-slate-100 rounded animate-pulse" />
                                <div className="h-2.5 w-32 bg-slate-100 rounded animate-pulse" />
                              </div>
                            )}
                            {id === "date" && (
                              <div className="h-3.5 w-20 bg-slate-100 rounded animate-pulse" />
                            )}
                            {id === "dob" && (
                              <div className="h-3.5 w-8 bg-slate-100 rounded animate-pulse" />
                            )}
                            {id === "pan" && (
                              <div className="h-3.5 w-24 bg-slate-100 rounded animate-pulse" />
                            )}
                            {id === "score" && (
                              <div className="h-4 w-12 rounded bg-slate-100 animate-pulse" />
                            )}
                            {id === "pinCode" && (
                              <div className="h-3.5 w-16 bg-slate-100 rounded animate-pulse" />
                            )}
                            {["pauseSms", "pauseEmail", "pauseWhatsapp"].includes(id) && (
                              <div className="w-8 h-4 rounded-full bg-slate-100 animate-pulse mx-auto" />
                            )}
                            {["city", "state", "houseNo", "landmark", "gender"].includes(id) && (
                              <div className="h-3.5 w-16 bg-slate-100 rounded animate-pulse" />
                            )}
                            {id === "streetAddress" && (
                              <div className="h-3.5 w-28 bg-slate-100 rounded animate-pulse" />
                            )}
                            {id === "actions" && (
                              <div className="w-8 h-8 rounded-md bg-slate-100 animate-pulse" />
                            )}
                            {![
                              "select",
                              "lead",
                              "contact",
                              "date",
                              "dob",
                              "pan",
                              "score",
                              "pinCode",
                              "city",
                              "state",
                              "houseNo",
                              "streetAddress",
                              "landmark",
                              "gender",
                              "pauseSms",
                              "pauseEmail",
                              "pauseWhatsapp",
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
                      <TableCell
                        key={cell.id}
                        className="py-3.5 px-4 text-xs"
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
                    colSpan={table.getVisibleLeafColumns().length || 9}
                    className="h-40 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400 py-6">
                      <Users className="w-8 h-8 text-slate-300" />
                      <p className="text-sm font-semibold text-slate-700">No leads found</p>
                      <p className="text-xs text-slate-400">
                        Try adjusting your filters or search keywords.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Bottom Pagination Bar Matching Reference */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 mt-2 border-t border-slate-100">
          <div className="text-xs text-slate-500 font-normal">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {recordsCount || tableData.length ? (currentPage - 1) * pageSize + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-800">
              {Math.min(
                currentPage * pageSize,
                recordsCount || totalPages * pageSize || tableData.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {(
                recordsCount ||
                totalPages * pageSize ||
                tableData.length
              ).toLocaleString()}
            </span>{" "}
            leads
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-normal">
              <span>Rows per page</span>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => setPageSize(Number(value))}
              >
                <SelectTrigger className="h-8 px-2.5 rounded-sm border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-none hover:bg-slate-50 cursor-pointer w-auto min-w-[60px] gap-1">
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

      <React.Suspense fallback={<div>Loading...</div>}>
        {isModalOpenOffer && (
          <OfferSelectionModal
            selectedRowsData={selectedRowsData}
            isOpen={isModalOpenOffer}
            onClose={() => setIsModalOpenOffer(false)}
            onSelectOffer={(offer) => setSelectedOffer(offer)}
            selected={selected}
            selectedValues={selectedValues}
          />
        )}
      </React.Suspense>
      <React.Suspense fallback={<div>Loading...</div>}>
        {isModalOpen && (
          <EditModal
            id={leadId}
            onClose={closeModal}
            tableData={tableData}
            setRefresh={setRefresh}
          />
        )}
      </React.Suspense>
    </div>
  );
};

export default ExampleTwo;
