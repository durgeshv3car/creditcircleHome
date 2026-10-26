"use client";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface Categorys {
  id: string;
  title: string;
  active: boolean;
  name: string;
  ipAddress: string;
  action: string;
  createdAt: Date;
  username: string;
  email: string;
  thumbnail: string;
  role: string;
  permissions: [];
}

interface ColumnsCategoryProps {
  fetchData: () => void;
  router: AppRouterInstance;
  token: string;
}

export const columnsCategory = ({
  fetchData,
  router,
  token,
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
          className="rounded border-slate-300 data-[state=checked]:bg-[#FF6B4A] data-[state=checked]:border-[#FF6B4A] transition-colors"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="rounded border-slate-300 data-[state=checked]:bg-[#FF6B4A] data-[state=checked]:border-[#FF6B4A] transition-colors"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "serialNumber",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-normal text-slate-500 font-mono text-xs whitespace-nowrap">
        #{row.index + 1}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="text-xs font-normal text-slate-800 whitespace-nowrap">
        {row.original.name || "—"}
      </span>
    ),
  },
  {
    accessorKey: "ip",
    header: "IP Address",
    cell: ({ row }) => (
      <span className="text-xs font-normal text-slate-600 font-mono whitespace-nowrap px-2 py-0.5 rounded bg-slate-50 border border-slate-200/60 inline-block">
        {row.original.ipAddress || "—"}
      </span>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <span className="text-xs font-normal text-slate-700 whitespace-nowrap">
        {row.original.action || "—"}
      </span>
    ),
  },
  {
    accessorKey: "time",
    header: "Timestamp",
    cell: ({ row }) => {
      if (!row.original.createdAt) {
        return <span className="text-xs text-slate-400 font-mono">—</span>;
      }
      const utcDate = new Date(row.original.createdAt);
      const day = String(utcDate.getDate()).padStart(2, "0");
      const month = String(utcDate.getMonth() + 1).padStart(2, "0");
      const year = utcDate.getFullYear();

      const hours = String(utcDate.getHours()).padStart(2, "0");
      const minutes = String(utcDate.getMinutes()).padStart(2, "0");
      const seconds = String(utcDate.getSeconds()).padStart(2, "0");

      const formatted = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

      return (
        <span className="text-xs font-normal text-slate-500 font-mono whitespace-nowrap">
          {formatted}
        </span>
      );
    },
  },
];