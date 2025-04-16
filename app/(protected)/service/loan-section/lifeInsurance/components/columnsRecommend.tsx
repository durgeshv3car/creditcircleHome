"use client";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { SquarePen, Trash2, CalendarClock, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import ActiveToggleCell from "./ActiveToggleCell";
import HomeToggleCell from "./HomeToggleCell";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { deleteService } from "@/app/(protected)/services/ourServices/api";

interface RowData {
  id: string;
  category: string;
  title: string;
  description?: string;
  thumbnail?: string | { web?: string; mobile?: string };
  companyUrl: string;
  annualFee: string;
  buttonType: string;
  active: boolean;
}

export const columnsRecommend = (
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>,
  type,
  router
) => [
  {
    id: "select",
    header: ({ table }: { table: any }) => (
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
    cell: ({ row }: { row: any }) => (
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
    cell: ({ row }: { row: any }) => <span>{row.index + 1}</span>,
    enableSorting: false,
  },

  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }: { row: { original: RowData } }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.title}</span>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }: { row: { original: RowData } }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original?.description}</span>
      </div>
    ),
  },
  {
    accessorKey: "thumbnail.web",
    header: "Web",
    cell: ({ row }: { row: { original: RowData } }) => {
      const thumbnailData = row.original.thumbnail;

      const imageUrls =
        thumbnailData && typeof thumbnailData === "string"
          ? JSON.parse(thumbnailData)
          : thumbnailData;

      return (
        <div className="flex gap-3 items-center">
          <Avatar className="w-8 h-8 rounded-none bg-transparent shadow-none border-none">
            {imageUrls?.web ? (
              <AvatarImage src={imageUrls.web} className="rounded-none" />
            ) : (
              <AvatarFallback className="rounded-none">NA</AvatarFallback>
            )}
          </Avatar>
        </div>
      );
    },
  },

  {
    accessorKey: "thumbnail.mobile",
    header: "Mobile",
    cell: ({ row }: { row: { original: RowData } }) => {
      const thumbnailData = row.original.thumbnail;

      const imageUrls =
        thumbnailData && typeof thumbnailData === "string"
          ? JSON.parse(thumbnailData)
          : thumbnailData;

      return (
        <div className="flex gap-3 items-center">
          <Avatar className="w-8 h-8 rounded-none bg-transparent shadow-none border-none">
            {imageUrls?.brandMobile ? (
              <AvatarImage src={imageUrls.mobile} className="rounded-none" />
            ) : (
              <AvatarFallback className="rounded-none">NA</AvatarFallback>
            )}
          </Avatar>
        </div>
      );
    },
  },

  {
    accessorKey: "button name",
    header: "Button Name",
    cell: ({ row }: { row: { original: RowData } }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.buttonType}</span>
      </div>
    ),
  },
  {
    accessorKey: "companyUrl",
    header: "Company URL",
    cell: ({ row }: { row: { original: RowData } }) => (
      <div className="flex gap-3 items-center">
        <a
          href={row.original.companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:underline cursor-pointer"
        >
          {row.original.companyUrl}
        </a>
      </div>
    ),
  },
  {
    accessorKey: "annual fee",
    header: "Annual Fee",
    cell: ({ row }: { row: { original: RowData } }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.annualFee}</span>
      </div>
    ),
  },

  {
    accessorKey: "active",
    header: "isActive",
    cell: ({ row }) => <ActiveToggleCell row={row} type={type} />,
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }: { row: { original: RowData } }) => {
      
      const handleDelete = async (id: string) => {
        try {
          const result = await deleteService(id);
          if (result.success) {
            toast.success("Offer data deleted");
            setRefresh((prev) => !prev); // Trigger refresh
          } else {
            toast.error("Offer data not deleted");
          }
        } catch (error) {
          console.error("Error deleting category:", error);
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
                    router.push(
                      `/service/loan-section/lifeInsurance?id=${row.original.id}`
                    )
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
