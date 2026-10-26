"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
// Make sure this import path is correct and that the function is properly exported
import { deleteDevice } from "@/app/(protected)/services/deviceInfo/api";

const fields = ["phoneNumber", "deviceId", "model", "brand", "idfa"] as const;

export type DataProps = {
  id?: string;
} & {
  [key in (typeof fields)[number]]?: string | number | boolean;
};

export const columns = ({
  fetchData,
  pageSize,
  totalPages,
  currentPage,
  recordsCount,
}: {
  fetchData: () => Promise<void>;
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
        className="rounded border-slate-300 data-[state=checked]:bg-[#FF6B4A] data-[state=checked]:border-[#FF6B4A] transition-colors"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="rounded border-slate-300 data-[state=checked]:bg-[#FF6B4A] data-[state=checked]:border-[#FF6B4A] transition-colors"
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
      const descendingNumber = total ? total - globalIndex + 1 : currentIndex;
      return (
        <span className="font-normal text-slate-600 font-mono text-xs whitespace-nowrap">
          #{descendingNumber}
        </span>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "PHONE NUMBER",
    cell: ({ row }) => {
      const val = row.original.phoneNumber;
      return (
        <span className="font-normal text-slate-700 text-xs font-mono whitespace-nowrap">
          {val ? String(val) : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "deviceId",
    header: "DEVICE ID",
    cell: ({ row }) => {
      const val = row.original.deviceId;
      return (
        <span
          className="font-normal text-slate-700 text-xs font-mono whitespace-nowrap truncate max-w-[150px] inline-block"
          title={val ? String(val) : ""}
        >
          {val ? String(val) : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "model",
    header: "MODEL",
    cell: ({ row }) => {
      const val = row.original.model;
      return (
        <span
          className="font-normal text-slate-700 text-xs whitespace-nowrap truncate max-w-[180px] inline-block"
          title={val ? String(val) : ""}
        >
          {val ? String(val) : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "brand",
    header: "BRAND",
    cell: ({ row }) => {
      const val = row.original.brand;
      return (
        <span className="font-normal text-slate-700 text-xs whitespace-nowrap uppercase">
          {val ? String(val) : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "idfa",
    header: "IDFA",
    cell: ({ row }) => {
      const val = row.original.idfa;
      return (
        <span
          className="font-normal text-slate-500 text-xs font-mono whitespace-nowrap truncate max-w-[220px] inline-block"
          title={val ? String(val) : ""}
        >
          {val ? String(val) : "—"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "ACTION",
    enableHiding: false,
    cell: ({ row }) => {
      const handleDelete = async (id: string | undefined) => {
        if (!id) {
          toast.error("Invalid device ID");
          return;
        }

        try {
          const result = await deleteDevice(id);
          if (result && result.success) {
            toast.success("Device deleted successfully");
            fetchData();
          } else {
            toast.error("Failed to delete device");
          }
        } catch (error) {
          console.error("Error deleting device:", error);
          toast.error("Error occurred while deleting device");
        }
      };

      return (
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() =>
                    handleDelete(row.original.id as string | undefined)
                  }
                  className="w-8 h-8 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-rose-600 text-white border-rose-700"
              >
                <p>Delete Device</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];
