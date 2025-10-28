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
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
const EditModal = dynamic(() => import("../components/EditModal"), {
  ssr: false,
  loading: () => <p>Loading modal...</p>,
});

const ImportExportButtons = dynamic(() => import("../components/Download"), {
  ssr: false,
  loading: () => <p>Loading modal...</p>,
});

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

import dynamic from "next/dynamic";

const OfferSelectionModal = dynamic(
  () => import("../components/OfferSelectionModal"),
  {
    ssr: false,
    loading: () => <p>Loading modal...</p>,
  }
);
const Filter = dynamic(() => import("../components/Filter"), {
  ssr: false,
});
const TablePagination = dynamic(() => import("./table-pagination"), {
  ssr: false,
});

import { useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";

// import { SelectedValues } from "../page";
import { DataProps } from "./columns";
import { SelectedValues } from "../components/Leads";
import { toast } from "sonner";

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
    });
  const [selectedColumn, setSelectedColumn] = React.useState<
    string | undefined
  >();

  const [isModalOpenOffer, setIsModalOpenOffer] = React.useState(false);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [selectedRowsData, setSelectedRowsData] = React.useState<DataProps[]>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [showInput, setShowInput] = React.useState(false);

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

  // Persist column visibility settings
  React.useEffect(() => {
    const defaultHiddenColumns = {
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
    };
    setColumnVisibility((prev) => ({
      ...defaultHiddenColumns,
      ...prev,
    }));
  }, []);

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
      console.log("creatingNotification detected");
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

  // const handleSearch = () => {
  //   const start = localStorage.getItem("startDateLead");
  //   const end = localStorage.getItem("endDateLead");
  //   if (start && end) {
  //     toast.error("Please Reset Date For Search");
  //     return;
  //   }

  //   if (selected === "status" && selectedStatusPartner) {
  //     const filteredUsers = tableData.filter((user) => {
  //       if (!Array.isArray(user?.LoanApplications)) return false;

  //       return user.LoanApplications.some((loan) => {
  //         const statusValue = loan?.loanDataStatus?.[selectedStatusPartner];

  //         // ✅ Case 1: Object → Rejected
  //         if (typeof statusValue === "object" && statusValue !== null) {
  //           return (
  //             statusValue.status?.toLowerCase() === selectedStatus.toLowerCase()
  //           );
  //         }

  //         // ✅ Case 2: String with URL → Approved
  //         if (typeof statusValue === "string" && statusValue.includes("http")) {
  //           return selectedStatus.toLowerCase() === "approved";
  //         }

  //         // ✅ Case 3: String without URL → Exist / Pending / Other
  //         if (typeof statusValue === "string") {
  //           return statusValue
  //             .toLowerCase()
  //             .includes(selectedStatus.toLowerCase());
  //         }

  //         return false;
  //       });
  //     });

  //     setVisibleData(filteredUsers);
  //     return;
  //   }

  //   if (selected === "all") {
  //     setSelected("all")
  //   } else {
  //     setSelectedColumn(selected);
  //     setQuery(query);
  //   }
  // };



  return (
    <div className="w-full">
      {/* Header & Filter Section */}
      <div className="py-4 px-5 mb-6 bg-card text-card-foreground rounded-md">
        <React.Suspense fallback={<div>Loading...</div>}>
          <Filter
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
            data={tableData}
            allFilterOptions={allFilterOptions}
          />
        </React.Suspense>
      </div>

      {/* Display Selected Values */}

      <div className="py-4 px-5 bg-whit rounded-md">
        <div className="flex items-center justify-between">
          <div className="text-xl font-medium text-default-900">Users Data</div>
          <div className="flex items-center ">
            {/* Left: Select (fixed width) */}

            <div className="flex-none w-30">
              <Select value={selected} onValueChange={handleSelectChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Right: Search bar (fills remaining space) */}
            {selected !== "status" ? (
              <>
                <div className="flex-1 flex items-center">
                  <div className="relative w-full">
                    <Input
                      id="search-input"
                      placeholder={
                        selected === "all"
                          ? "Search"
                          : `Search ${
                              selected.charAt(0).toUpperCase() +
                              selected.slice(1)
                            }`
                      }
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pr-12"
                    />

                    {/* Lens icon button on the right */}
                
                  </div>
                </div>
              </>
            ) : (
              <>
                <Select
                  value={selectedStatusPartner}
                  onValueChange={handleSelectChangeStatusPartner}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cashe">Cashe</SelectItem>
                    <SelectItem value="Mpocket">Mpocket</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedStatus}
                  onValueChange={handleSelectChangeStatus}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="Exist">Exist</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={()=>console.log("Search Clicked")}
                  aria-label="Search"
                  className="w-10 h-10"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Select for Rows per Page */}
            <React.Suspense fallback={<div>Loading...</div>}>
              <ImportExportButtons
                setRefresh={setRefresh}
                filteredData={tableData}
                columns={tableColumns}
              />
            </React.Suspense>
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

            <React.Suspense fallback={<div>Loading...</div>}>
              {isCreatingNotification && (
                <button
                  className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={Object.keys(rowSelection).length === 0}
                  onClick={() => setIsModalOpenOffer(true)}
                >
                  Send {type}
                </button>
              )}
            </React.Suspense>
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
                  colSpan={tableColumns.length}
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
      <React.Suspense fallback={<div>Loading...</div>}>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </React.Suspense>
      <React.Suspense fallback={<div>Loading...</div>}>
        {isModalOpenOffer && (
          <OfferSelectionModal
            selectedRowsData={selectedRowsData}
            isOpen={isModalOpenOffer}
            onClose={() => setIsModalOpenOffer(false)}
            onSelectOffer={(offer) => setSelectedOffer(offer)}
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
