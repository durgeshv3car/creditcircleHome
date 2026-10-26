"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Eye, SquarePen, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import PartnerStatus from "../components/PartnerStatus";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Define all fields explicitly
const fields = [
  "phoneNumber",
  "desiredLoanAmount",
  "loanTenure",
  "loanType",
  "employmentStatus",
  "netMonthlyIncome",
  "salaryMode",
  "hasCreditCard",
  "salaryBank",
  "companyName",
  "employmentLevel",
  "officeLocation",
  "officeStreet",
  "officePinCode",
  "officeCity",
  "officeState",
  "loanPurpose",
  "hasGST",
  "gstNumber",
  "businessPAN",
  "businessName",
  "tradeName",
  "PrincipalPlaceofBusiness",
  "businessType",
  "natureOfBusiness",
  "yearsInBusiness",
  "businessTurnover",
  "GSTStatus",
  "businessIncome",
  "businessBank",
  "profession",
  "registrationNumber",
  "yearRegistration",
  "studentIncome",
  "studentIncomeMode",
  "fatherName",
  "motherName",
  "livesWithParents",
  "loanCompletion",
];

const formatDisplayDate = (dateStr?: string | null) => {
  if (
    !dateStr ||
    dateStr === "0000-00-00" ||
    String(dateStr).startsWith("0000") ||
    dateStr === "-"
  ) {
    return "—";
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(dateStr);
  }
};

export type DataProps = {
  [key in (typeof fields)[number]]?: string | number | boolean;
} & {
  createdAt?: string;
  id?: string;
  loanDataStatus?: any;
};

// Define columns dynamically
export const columns = ({
  isModalOpen,
  setIsModalOpen,
  setSelectedRow,
  pageSize,
  totalPages,
  currentPage,
  recordsCount,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  setSelectedRow: (row: DataProps | null) => void;
  pageSize: number;
  totalPages: number;
  currentPage: number;
  recordsCount: number;
}): ColumnDef<DataProps>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="rounded border-slate-300 data-[state=checked]:bg-[#FF6B4A] data-[state=checked]:border-[#FF6B4A] transition-colors"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="rounded border-slate-300 data-[state=checked]:bg-[#FF6B4A] data-[state=checked]:border-[#FF6B4A] transition-colors"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    id: "index",
    header: "ID",
    cell: ({ row }) => {
      const total = recordsCount;
      const currentIndex = row.index + 1;
      const globalIndex = (currentPage - 1) * pageSize + currentIndex;
      const descendingNumber = total ? total - globalIndex + 1 : currentIndex;
      return (
        <span className="font-normal text-slate-600 font-mono text-xs whitespace-nowrap">
          #{descendingNumber}
        </span>
      );
    },
  },

  {
    id: "date",
    header: "APPLICATION DATE",
    cell: ({ row }) => {
      const createdAt = String(row.original.createdAt ?? "");
      const formatted = formatDisplayDate(createdAt);
      return (
        <span className="text-xs text-slate-700 font-normal whitespace-nowrap">
          {formatted}
        </span>
      );
    },
  },

  {
    id: "time",
    header: "TIME",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt as string | undefined;
      if (!createdAt) return <span className="text-slate-400 text-xs">—</span>;

      try {
        const date = new Date(createdAt);
        const time = date.toLocaleTimeString("en-GB", {
          hour12: false,
          timeZone: "Asia/Kolkata",
        });
        return (
          <span className="text-xs text-slate-500 font-mono whitespace-nowrap">
            {time}
          </span>
        );
      } catch {
        return <span className="text-slate-400 text-xs">—</span>;
      }
    },
  },

  ...fields.map((key) => {
    const headerTitle = key
      .replace(/([A-Z])/g, " $1")
      .trim()
      .toUpperCase();

    return {
      accessorKey: key,
      header: headerTitle,
      cell: ({ row }: { row: Row<DataProps> }) => {
        const val = row.original[key];
        if (val === null || val === undefined || val === "" || val === "-") {
          return <span className="text-slate-400 text-xs font-normal">—</span>;
        }

        // Phone number
        if (key === "phoneNumber") {
          return (
            <span className="font-normal text-slate-700 text-xs font-mono whitespace-nowrap">
              {String(val)}
            </span>
          );
        }

        // Currency / Income fields
        if (
          [
            "desiredLoanAmount",
            "netMonthlyIncome",
            "businessTurnover",
            "businessIncome",
            "studentIncome",
          ].includes(key)
        ) {
          const num = Number(val);
          const formatted =
            !isNaN(num) && num > 0
              ? `₹${num.toLocaleString("en-IN")}`
              : String(val);
          return (
            <span className="text-xs font-normal text-slate-700 font-mono whitespace-nowrap">
              {formatted}
            </span>
          );
        }

        // Boolean fields
        if (
          key === "hasCreditCard" ||
          key === "hasGST" ||
          typeof val === "boolean"
        ) {
          const isTrue = val === true || String(val).toLowerCase() === "true";
          return (
            <span
              className={cn(
                "px-2 py-0.5 rounded-md text-[11px] font-normal whitespace-nowrap inline-flex items-center",
                isTrue
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                  : "bg-slate-50 text-slate-600 border border-slate-200/60"
              )}
            >
              {isTrue ? "Yes" : "No"}
            </span>
          );
        }

        return (
          <span className="text-xs text-slate-700 font-normal whitespace-nowrap">
            {String(val)}
          </span>
        );
      },
    };
  }),

  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const handleClick = () => {
        setSelectedRow(row.original);
        setIsModalOpen(true);
      };

      return (
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-normal bg-[#FFF1ED] text-[#EA580C] hover:bg-[#FFD7CC] border border-orange-200/60 shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Status</span>
        </button>
      );
    },
  },

  {
    id: "actions",
    header: "ACTIONS",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="w-8 h-8 rounded-md text-slate-400 hover:text-[#EA580C] hover:bg-[#FFF1ED] flex items-center justify-center transition-colors cursor-pointer"
              >
                <SquarePen className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Edit Application</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="w-8 h-8 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-rose-600 text-white border-rose-700"
            >
              <p>Delete Application</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  },
];
