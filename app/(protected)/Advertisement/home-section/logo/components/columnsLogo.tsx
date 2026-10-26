"use client";
import React from "react";
import {
  ColumnDef,
  Row,
  Table,
} from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ActiveToggleCell from "./ActiveToggleCell";
import { SquarePen, Trash2, CalendarClock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { deleteLogoImage } from "@/app/(protected)/services/logos/api";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface LogoData {
  id: string;
  title: string;
  thumbnail: string | { web?: string; mobile?: string };
  companyUrl: string;
  active: boolean;
}

interface ColumnsLogoProps {
  fetchData: () => void;
  router: AppRouterInstance;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  selectedDate?: Date;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const columnsLogo = ({
  fetchData,
  router,
  setSelectedDate,
  selectedDate,
  open,
  setOpen,
}: ColumnsLogoProps): ColumnDef<LogoData>[] => [
  {
    id: "select",
    header: ({ table }: { table: Table<LogoData> }) => (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="rounded border-slate-300 data-[state=checked]:bg-[#FF6B4A] data-[state=checked]:border-[#FF6B4A] transition-colors"
        />
      </div>
    ),
    cell: ({ row }: { row: Row<LogoData> }) => (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
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
    cell: ({ row }: { row: Row<LogoData> }) => (
      <span className="font-normal text-slate-500 font-mono text-xs whitespace-nowrap">
        #{row.index + 1}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: "TITLE",
    cell: ({ row }: { row: Row<LogoData> }) => (
      <span className="text-xs font-normal text-slate-800 whitespace-nowrap">
        {row.original.title || "Untitled"}
      </span>
    ),
  },
  {
    accessorKey: "thumbnail.mobile",
    header: "LOGO",
    cell: ({ row }: { row: Row<LogoData> }) => {
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
            <a
              href={imageUrls.mobile}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-md border border-slate-200 bg-white p-1 shadow-2xs hover:shadow-xs transition-all"
              title="Click to view full logo"
            >
              <img
                src={imageUrls.mobile}
                alt="Partner Logo"
                className="w-8 h-8 object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </a>
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
    accessorKey: "companyUrl",
    header: "COMPANY URL",
    cell: ({ row }: { row: Row<LogoData> }) => {
      const url = row.original.companyUrl;
      return (
        <div className="flex items-center">
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-mono font-normal hover:underline max-w-[240px] truncate group"
              title={url}
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-600 shrink-0" />
              <span className="truncate">{url}</span>
            </a>
          ) : (
            <span className="text-xs text-slate-400 font-mono">—</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "active",
    header: "IS ACTIVE",
    cell: ({ row }: { row: Row<LogoData> }) => (
      <ActiveToggleCell row={row} refreshData={fetchData} />
    ),
  },
  {
    id: "actions",
    header: "ACTION",
    enableHiding: false,
    cell: ({ row }: { row: Row<LogoData> }) => {
      const handleDelete = async (id: string) => {
        const result = await deleteLogoImage(id);
        if (result.success) {
          fetchData();
          toast.success("Logo data deleted");
        } else {
          toast.error("Logo data not deleted");
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
                      `/Advertisement/home-section/logo?id=${row.original.id}`
                    )
                  }
                >
                  <SquarePen className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Edit Logo</p>
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
                <p>Delete Logo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  // {
  //   id: "schedulExpire",
  //   header: "Schedule Expire",
  //   enableHiding: false,
  //   cell: ({ row }: { row: Row<LogoData> }) => {
  //     const handleDateSelect = (date: Date | undefined) => {
  //       if (date) {
  //         setSelectedDate(date);
  //       }
  //     };

  //     const handleScheduleDelete = async () => {
  //       if (!selectedDate) {
  //         toast.error("Please select a date first");
  //         return;
  //       }

  //       const result = await scheduleDeleteLogoImage(row.original.id, "logo", selectedDate);
  //       if (result.success) {
  //         setOpen(false);
  //         toast.success("Deletion scheduled successfully");
  //       }
  //     };

  //     return (
  //       <div className="flex items-center gap-2">
  //         <Dialog open={open} onOpenChange={setOpen}>
  //           <TooltipProvider>
  //             <Tooltip>
  //               <TooltipTrigger asChild>
  //                 <DialogTrigger asChild>
  //                   <Button
  //                     variant="outline"
  //                     size="icon"
  //                     className="w-7 h-7 border-default-200 dark:border-default-300 text-default-400"
  //                     onClick={() => setOpen(true)}
  //                   >
  //                     <CalendarClock className="w-3 h-3" />
  //                   </Button>
  //                 </DialogTrigger>
  //               </TooltipTrigger>
  //               <TooltipContent side="top">
  //                 <p>Auto Delete Calendar</p>
  //               </TooltipContent>
  //             </Tooltip>
  //           </TooltipProvider>

  //           <DialogContent className="p-4">
  //             <h2 className="text-lg font-semibold">Select Deletion Date</h2>
  //             <Calendar
  //               mode="single"
  //               selected={selectedDate}
  //               onSelect={handleDateSelect}
  //               className="border rounded-md p-2"
  //             />
  //             <Button className="mt-4 w-full" onClick={handleScheduleDelete}>
  //               Schedule Delete
  //             </Button>
  //           </DialogContent>
  //         </Dialog>
  //       </div>
  //     );
  //   },
  // }
];