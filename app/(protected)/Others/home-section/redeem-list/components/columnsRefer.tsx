"use client";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ActiveToggleCell from "./ActiveToggleCell";

import { SquarePen, Trash2, CalendarClock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import {
  scheduleDeleteReferImage,
  deleteReferImage,
} from "@/app/(protected)/services/refer-earns/api";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { deleteRedeemItem } from "@/app/(protected)/services/redeemList/api";
export interface SliderData {
  id: string;
  title: string;
  points:string;
  thumbnail: string | { web?: string; mobile?: string };
  companyUrl: string;
  active: boolean;
}

interface ColumnsSliderProps {
  fetchData: () => void;
  router: AppRouterInstance;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  selectedDate?: Date;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const columnsRefer = ({
  fetchData,
  router,
  setSelectedDate,
  selectedDate,
  open,
  setOpen,
}: ColumnsSliderProps): ColumnDef<SliderData>[] => [
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
    accessorKey: "thumbnail.web",
    header: "Web",
    cell: ({ row }) => {
      const thumbnailData = row.original.thumbnail;

      // Ensure thumbnailData is an object
      const imageUrls =
        thumbnailData && typeof thumbnailData === "string"
          ? JSON.parse(thumbnailData)
          : thumbnailData;

      return (
        <div className="flex gap-3 items-center">
          <Avatar className="w-8 h-8 rounded-none bg-transparent shadow-none border-none">
            {imageUrls?.web ? ( // ✅ FIXED: Changed from webUrl to web
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
    cell: ({ row }) => {
      const thumbnailData = row.original.thumbnail;

      // Ensure thumbnailData is an object
      const imageUrls =
        thumbnailData && typeof thumbnailData === "string"
          ? JSON.parse(thumbnailData)
          : thumbnailData;

      return (
        <div className="flex gap-3 items-center">
          <Avatar className="w-8 h-8 rounded-none bg-transparent shadow-none border-none">
            {imageUrls?.mobile ? (
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
    accessorKey: "points",
    header: "Points",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.points}</span>
      </div>
    ),
  },


  {
    accessorKey: "active",
    header: "isActive",
    cell: ({ row }) => <ActiveToggleCell row={row} refreshData={fetchData} />,
  },

 

  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const handleDelete = async (id: string) => {
        const result = await deleteRedeemItem(id);

        if (result.success) {
          fetchData();
          toast.success("Slider data deleted");
        } else {
          toast.error("Slider data not deleted");
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
                      `/Others/home-section/redeem-list?id=${row.original.id}`
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
  //  {
  //         id: "schedulExpire",
  //         header: "schedulExpire",
  //         enableHiding: false,
  //         cell: ({ row }) => {

  //           const type = "refer";

  //           const handleDateSelect = (date) => {
  //             setSelectedDate(date);
  //             console.log("Selected Deletion Date:", date);
  //           };

  //           const handleScheduleDelete = async () => {
  //             if (!selectedDate) {
  //               console.log("❌ No date selected");
  //               return;
  //             }

  //             const result = await scheduleDeleteReferImage(row.original.id, type, selectedDate);

  //             if (result.success) {
  //               setOpen(false);
  //             }
  //           };

  //           return (
  //             <div className="flex items-center gap-2">
  //               <Dialog open={open} onOpenChange={setOpen}>
  //                 <TooltipProvider>
  //                   <Tooltip>
  //                     <TooltipTrigger asChild>
  //                       <DialogTrigger asChild>
  //                         <Button
  //                           variant="outline"
  //                           size="icon"
  //                           className="w-7 h-7 border-default-200 dark:border-default-300 text-default-400"
  //                           onClick={() => setOpen(true)}
  //                         >
  //                           <CalendarClock className="w-3 h-3" />
  //                         </Button>
  //                       </DialogTrigger>
  //                     </TooltipTrigger>
  //                     <TooltipContent side="top">
  //                       <p>Auto Delete Calendar</p>
  //                     </TooltipContent>
  //                   </Tooltip>
  //                 </TooltipProvider>

  //                 {/* Calendar Dialog */}
  //                 <DialogContent className="p-4">
  //                   <h2 className="text-lg font-semibold">Select Deletion Date</h2>
  //                   <Calendar
  //                     mode="single"
  //                     selected={selectedDate}
  //                     onSelect={handleDateSelect} // Updates state and logs the value
  //                     className="border rounded-md p-2"
  //                   />
  //                   <Button className="mt-4 w-full" onClick={handleScheduleDelete}>
  //                     Schedule Delete
  //                   </Button>
  //                 </DialogContent>
  //               </Dialog>
  //             </div>
  //           );
  //         },
  //       }
];
