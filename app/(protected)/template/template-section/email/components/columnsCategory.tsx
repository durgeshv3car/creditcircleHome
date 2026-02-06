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
import ActiveToggleCell from "./ActiveToggleCell";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { deleteEmail } from "@/app/(protected)/services/emailTemplate/api";


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
    accessorKey: "active", // Ensure this matches the key in your data
    header: "isActive",
    cell: ({ row }) => <ActiveToggleCell row={row} refreshData={fetchData} />,
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const handleDelete = async (id: string) => {
        try {
          const result = await deleteEmail(id);
          if (result.success) {
            toast.success("Category data deleted");
            fetchData();
          } else {
            toast.error("Category data not deleted");
          }
        } catch (error) {
          console.error("Error deleting category:", error);
          toast.error("Failed to delete category");
        }
      };

      return (
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-7 h-7 border-default-200 dark:border-default-300 text-default-400"
                  onClick={() =>
                    router.push(`/template/template-section/email?id=${row.original.id}`)
                  }
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
                  className="w-7 h-7 border-default-200 dark:border-default-300 text-default-400"
                  onClick={() => handleDelete(row.original.id)}
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
      );
    },
  },
];