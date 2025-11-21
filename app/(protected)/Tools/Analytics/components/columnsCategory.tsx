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
import { deleteCategory } from "@/app/(protected)/services/categorys/api";
import { NextRouter } from "next/router";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
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
    cell: ({ row }) => <span>{row.original.offerId.slice(0, 10)}</span>,
    enableSorting: false,
  },

  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.offerTitle}</span>
      </div>
    ),
  },
  {
    accessorKey: "total",
    header: "Total Notifications",
    cell: ({ row }) => <span className="text-sm">{row.original.total}</span>,
  },

  {
    accessorKey: "sent",
    header: "Sent",
    cell: ({ row }) => {
      const statusColors: Record<string, string> = {
        sent: "bg-success/20 text-success",
      };

      const statusStyles = statusColors["sent"] || "default";
      return (
        <Badge className={cn("rounded-full px-5", statusStyles)}>
          {row.original.sent}
        </Badge>
      );
    },
  },
  {
    accessorKey: "failed",
    header: "Failed",
    cell: ({ row }) => {
      const statusColors: Record<string, string> = {
        failed: "bg-destructive/20 text-destructive",
      };
      const statusStyles = statusColors["failed"] || "default";
      return (
        <Badge className={cn("rounded-full px-5", statusStyles)}>
          {row.original.failed}
        </Badge>
      );
    },
  },

];
