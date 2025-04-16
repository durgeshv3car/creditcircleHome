"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, SquarePen, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
  "loanCompletion"
];


export type DataProps = {
  [key in (typeof fields)[number]]?: string | number | boolean;
};

// Define columns dynamically
export const columns: ColumnDef<DataProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  ...fields.map((key) => ({
    accessorKey: key,
    header: key.replace(/([A-Z])/g, " $1").trim(),
    cell: ({ row }) => <span>{String(row.original[key] ?? "-")}</span>,
  })),
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
       
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="w-7 h-7 text-default-400">
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
              <Button variant="outline" size="icon" className="w-7 h-7 text-default-400">
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-destructive text-destructive-foreground">
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  },
];
