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
import { deleteAPi } from "@/app/(protected)/services/apiManagement/api";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { CounterStatusModal } from "./CounterStatus";

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
  role: string;
  thumbnail: string;
  permissions: [];
}

interface ColumnsCategoryProps {
  fetchData: () => void;
  router: AppRouterInstance;
  startDate: string;
  endDate: string;
}

export const columnsCategory = ({
  fetchData,
  router,
  startDate,
  endDate,
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
    accessorKey: "thumbnail.mobile",
    header: "Logo",
    cell: ({ row }) => {
      const thumbnailData = row.original.thumbnail;
      let imageUrls: any = thumbnailData;
      if (thumbnailData && typeof thumbnailData === "string") {
        try {
          imageUrls = JSON.parse(thumbnailData);
        } catch {
          imageUrls = { mobile: thumbnailData };
        }
      }

      return (
        <div className="flex items-center">
          {imageUrls?.mobile ? (
            <div className="w-8 h-8 rounded-md border border-slate-200 bg-white p-1 shadow-2xs flex items-center justify-center overflow-hidden">
              <img
                src={imageUrls.mobile}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono text-slate-400 bg-slate-50 border border-slate-200/60 select-none">
              None
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "active",
    header: "isActive",
    cell: ({ row }) => <ActiveToggleCell row={row} refreshData={fetchData} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const start = startDate || new Date().toISOString().split("T")[0];
      const end = endDate || new Date().toISOString().split("T")[0];

      return (
        <CounterStatusModal
          name={row.original.name}
          startDate={start}
          endDate={end}
        />
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const handleDelete = async (id: string) => {
        try {
          const result = await deleteAPi(id);
          if (result.success) {
            toast.success("API deleted successfully");
            fetchData();
          } else {
            toast.error("Failed to delete API");
          }
        } catch (error) {
          console.error("Error deleting API:", error);
          toast.error("Failed to delete API");
        }
      };

      return (
        <div className="flex items-center gap-1">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-[#EA580C] hover:bg-[#FFF1ED] border border-transparent hover:border-orange-200 flex items-center justify-center transition-colors cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/Admin/admin-section/api-management?id=${row.original.id}`
                    )
                  }
                >
                  <SquarePen className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Edit API</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 flex items-center justify-center transition-colors cursor-pointer"
                  onClick={() => handleDelete(row.original.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-rose-600 text-white border-rose-700"
              >
                <p>Delete API</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];
