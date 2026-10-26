"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { NextRouter } from "next/router";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

interface Category {
  offerId: string;
  offerTitle: string;
  total: number;
  sent: number;
  failed: number;
}

interface ColumnsCategoryProps {
  fetchData: () => void;
  router: NextRouter;
}

export const columnsCategory = (
  fetchData: ColumnsCategoryProps["fetchData"],
  router: ColumnsCategoryProps["router"]
): ColumnDef<Category>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() ? "indeterminate" : false)
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="rounded-[3px] border-slate-300 data-[state=checked]:bg-[#FF6B4A] data-[state=checked]:border-[#FF6B4A]"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="rounded-[3px] border-slate-300 data-[state=checked]:bg-[#FF6B4A] data-[state=checked]:border-[#FF6B4A]"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "serialNumber",
    header: "Offer ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/70">
        #{row.original.offerId ? row.original.offerId.slice(0, 10) : row.index + 1}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: "Campaign / Offer Title",
    cell: ({ row }) => (
      <span className="font-semibold text-slate-900 text-xs line-clamp-1">
        {row.original.offerTitle || "Untitled Offer"}
      </span>
    ),
  },
  {
    accessorKey: "total",
    header: "Total Dispatched",
    cell: ({ row }) => (
      <span className="font-bold text-slate-800 text-xs">
        {row.original.total.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "sent",
    header: "Successfully Sent",
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        {row.original.sent.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "failed",
    header: "Delivery Failed",
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        {row.original.failed.toLocaleString()}
      </span>
    ),
  },
];
