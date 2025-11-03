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

export type DataProps = {
  [key in (typeof fields)[number]]?: string | number | boolean;
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
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
    const descendingNumber = total - globalIndex + 1;
    return <span>{descendingNumber}</span>;
  },
},
  {
    id: "date",
    header: "Application Date",
    cell: ({ row }) => {
      const createdAt = String(row.original.createdAt ?? "");
      const date = createdAt.split("T")[0];
      return <span>{date}</span>;
    },
  },
  {
    id: "time",
    header: "Time",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt as string | undefined;
      if (!createdAt) return <span>-</span>;

      const date = new Date(createdAt);
      const time = date.toLocaleTimeString("en-GB", {
        hour12: false,
        timeZone: "Asia/Kolkata",
      });

      return <span>{time}</span>;
    },
  },

  ...fields.map((key) => ({
    accessorKey: key,
    header: key.replace(/([A-Z])/g, " $1").trim(),
    cell: ({ row }: { row: Row<DataProps> }) => (
      <span>{String(row.original[key] ?? "-")}</span>
    ),
  })),

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColors: Record<string, string> = {
        blue: "bg-blue-100 text-blue-700",
      };
      const status = "blue";
      const statusStyles = statusColors[status];

      const handleClick = () => {
        setSelectedRow(row.original);
        setIsModalOpen(true);
      };

      return (
        <Badge
          className={cn("rounded-full px-5 cursor-pointer", statusStyles)}
          onClick={handleClick}
        >
          status
        </Badge>
      );
    },
  },

  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-7 h-7 text-default-400"
              >
                <SquarePen className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-7 h-7 text-default-400"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-destructive text-destructive-foreground"
            >
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  },
];
