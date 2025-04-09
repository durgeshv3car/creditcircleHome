"use client";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


import { SquarePen, Trash2, CalendarClock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { scheduleDeleteReferImage,toggleReferImageStatus,deleteReferImage } from "@/app/(protected)/services/refer-earns/api";

export const columnsRefer = (refreshData,router,setSelectedDate,selectedDate,open,setOpen) => [
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.name}</span>
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
    accessorKey: "companyUrl",
    header: "Company URL",
    cell: ({ row }) => (
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
    accessorKey: "active",
    header: "isActive",
    cell: ({ row }) => {
      const isActive = row.getValue("active"); // Get the active value (true/false)

     const handleToggle = async (value: boolean) => {
            try {
              const result = await toggleReferImageStatus(row.original.id, value);
          
              if (result.success) {
                toast.success(`Slider ${value ? "activated" : "deactivated"} successfully`);
                row.original.active = value; // Update UI immediately
              } else {
                toast.error("Failed to update status");
              }
            } catch (error) {
              console.error("Error updating isActive:", error);
              toast.error("Failed to update status");
            }
          };
      return (
        <div className="flex gap-3 items-center">
          <Switch onCheckedChange={handleToggle} />
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
   
        const handleDelete = async (id: string) => {
                   const result = await deleteReferImage(id);
                 
                   if (result.success) {
                     refreshData();
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
                      `/layout/home-section/refer-earn?id=${row.original.id}`
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
 {
        id: "schedulExpire",
        header: "schedulExpire",
        enableHiding: false,
        cell: ({ row }) => {
         
          const type = "refer";
      
          const handleDateSelect = (date) => {
            setSelectedDate(date);
            console.log("Selected Deletion Date:", date);
          };
      
          const handleScheduleDelete = async () => {
            if (!selectedDate) {
              console.log("❌ No date selected");
              return;
            }
          
            const result = await scheduleDeleteReferImage(row.original.id, type, selectedDate);
          
            if (result.success) {
              setOpen(false);
            }
          };
      
          return (
            <div className="flex items-center gap-2">
              <Dialog open={open} onOpenChange={setOpen}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-7 h-7 border-default-200 dark:border-default-300 text-default-400"
                          onClick={() => setOpen(true)}
                        >
                          <CalendarClock className="w-3 h-3" />
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Auto Delete Calendar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
      
                {/* Calendar Dialog */}
                <DialogContent className="p-4">
                  <h2 className="text-lg font-semibold">Select Deletion Date</h2>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect} // Updates state and logs the value
                    className="border rounded-md p-2"
                  />
                  <Button className="mt-4 w-full" onClick={handleScheduleDelete}>
                    Schedule Delete
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          );
        },
      }
];
