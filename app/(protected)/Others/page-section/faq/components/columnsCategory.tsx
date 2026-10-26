"use client";
import React, { useEffect, useState } from "react";
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

import { deletefaq } from "@/app/(protected)/services/faqs/api";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ColumnDef } from "@tanstack/react-table";
export interface Category {
  id: string;
  title: string;
  description: string;

}

interface ColumnsCategoryProps {
  fetchData: () => void;
  router: AppRouterInstance;
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
            (table.getIsSomePageRowsSelected() && "indeterminate")
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
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.title}</span>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.description}</span>
      </div>
    ),
  },



  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {

      const handleDelete = async (id: string) => {
        try {
          const result = await deletefaq(id);
          if (result.success) {
            toast.success("Faq data deleted");
            fetchData();
          } else {
            toast.error("Faq data not deleted");
          }
        } catch (error) {
          console.error("Error deleting faq:", error);
        }
      };

      return (
        <div className="flex items-center gap-1.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-7 h-7 text-slate-500 hover:text-[#EA580C] hover:border-orange-200 hover:bg-[#FFF1ED] rounded-md transition-colors cursor-pointer"
                  onClick={() =>
                    router.push(`/Others/page-section/faq?id=${row.original.id}`)
                  }
                >
                  <SquarePen className="w-3.5 h-3.5" />
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
                  className="w-7 h-7 text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50 rounded-md transition-colors cursor-pointer"
                  onClick={() => handleDelete(row.original.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
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
