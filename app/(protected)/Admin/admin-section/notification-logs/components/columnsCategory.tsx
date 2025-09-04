"use client";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";


export interface Categorys {
  id: string; // Ensure this matches the key in your data
  title: string; // Ensure this matches the key in your data
  active: boolean; // Add this field if it exists in your data
  name:string;
  ipAddress:string;
  action:string;
  createdAt:Date;
  username: string; // Ensure this matches the key in your data
  email: string;
  role: string;
  permissions:[]
}
interface ColumnsCategoryProps {
  fetchData: () => void;
  router: AppRouterInstance;
}

export const columnsCategory = ({
  fetchData,
  router,
}: ColumnsCategoryProps): ColumnDef<Categorys>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() ? "indeterminate" : false)
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2 xl:w-16">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "serialNumber",
    header: "ID",
    cell: ({ row }) => <span>{row.index + 1}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "name", // Ensure this matches the key in your data
    header: "Name",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "ip", // Ensure this matches the key in your data
    header: "Ip",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.ipAddress}</span>
      </div>
    ),
  },
  {
    accessorKey: "action", // Ensure this matches the key in your data
    header: "Action",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.action}</span>
      </div>
    ),
  },
{
  accessorKey: "time",
  header: "Time",
  cell: ({ row }) => {
    const utcDate = new Date(row.original.createdAt);
    const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000); // Convert to IST

    const day = String(istDate.getDate()).padStart(2, "0");
    const month = String(istDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = istDate.getFullYear();

    const hours = String(istDate.getHours()).padStart(2, "0");
    const minutes = String(istDate.getMinutes()).padStart(2, "0");
    const seconds = String(istDate.getSeconds()).padStart(2, "0");

    const formatted = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

    return (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{formatted}</span>
      </div>
    );
  },
}

  



];