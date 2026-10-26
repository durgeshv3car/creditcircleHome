"use client";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ActiveToggleCell from "./ActiveToggleCell";
import {
  ColumnDef,
  Row,
  Table,
} from '@tanstack/react-table';


import { SquarePen, Trash2, CalendarClock, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { deleteSliderImage, scheduleExpireSliderImage } from "@/app/(protected)/services/sliders/api";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface SliderData {
  id: string;
  title: string;
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
  setOfferId: React.Dispatch<React.SetStateAction<string>>;
  offerId: string;
}

export const columnsSlider = ({
  fetchData,
  router,
  setSelectedDate,
  selectedDate,
  open,
  setOpen,
  setOfferId,
  offerId,
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
    accessorKey: "title",
    header: "TITLE",
    cell: ({ row }) => (
      <span className="text-xs font-normal text-slate-800 whitespace-nowrap">
        {row.original.title || "Untitled"}
      </span>
    ),
  },
  {
    accessorKey: "thumbnail.web",
    header: "WEB",
    cell: ({ row }) => {
      const thumbnailData = row.original.thumbnail;
      let imageUrls: any = thumbnailData;
      if (thumbnailData && typeof thumbnailData === "string") {
        try {
          imageUrls = JSON.parse(thumbnailData);
        } catch {
          imageUrls = { web: thumbnailData };
        }
      }

      return (
        <div className="flex items-center">
          {imageUrls?.web ? (
            <a
              href={imageUrls.web}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-2xs hover:shadow-xs transition-all"
              title="Click to view full web creative"
            >
              <img
                src={imageUrls.web}
                alt="Web banner"
                className="w-14 h-8 object-cover group-hover:scale-105 transition-transform duration-200"
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
    accessorKey: "thumbnail.mobile",
    header: "MOBILE",
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
            <a
              href={imageUrls.mobile}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-2xs hover:shadow-xs transition-all"
              title="Click to view full mobile creative"
            >
              <img
                src={imageUrls.mobile}
                alt="Mobile banner"
                className="w-14 h-8 object-cover group-hover:scale-105 transition-transform duration-200"
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
    cell: ({ row }) => {
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
    cell: ({ row }) => <ActiveToggleCell row={row} refreshData={fetchData} />,
  },
  {
    id: "actions",
    header: "ACTION",
    enableHiding: false,
    cell: ({ row }) => {
      const handleDelete = async (id: string) => {
        const result = await deleteSliderImage(id);
        if (result.success) {
          fetchData();
          toast.success("Slider data deleted");
        } else {
          toast.error("Slider data not deleted");
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
                      `/Advertisement/home-section/slider?id=${row.original.id}`
                    )
                  }
                >
                  <SquarePen className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Edit Slider</p>
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
                <p>Delete Slider</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    id: "schedulExpire",
    header: "SCHEDULE EXPIRE",
    enableHiding: false,
    cell: ({ row }) => {
      const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
      };

      const handleScheduleDelete = async () => {
        if (!selectedDate) {
          toast.error("No date selected");
          return;
        }

        const result = await scheduleExpireSliderImage(offerId, selectedDate);
        if (result.success) {
          toast.success("Schedule expire set");
          fetchData();
          setOpen(false);
        } else {
          toast.error("Failed to schedule expire");
        }
      };

      const isCurrentOpen = open && offerId === row.original.id;

      return (
        <div className="flex items-center gap-1">
          <Dialog
            open={isCurrentOpen}
            onOpenChange={(isOpen) => {
              if (isOpen) {
                setOfferId(row.original.id);
                setOpen(true);
              } else {
                setOpen(false);
              }
            }}
          >
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 border border-transparent hover:border-amber-100 flex items-center justify-center transition-colors cursor-pointer"
                      onClick={() => {
                        setOfferId(row.original.id);
                        setOpen(true);
                      }}
                    >
                      <CalendarClock className="w-3.5 h-3.5" />
                    </button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Auto Expire Schedule</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Calendar Dialog */}
            <DialogContent
              className="max-w-sm p-6 rounded-lg border border-slate-200 bg-white shadow-xl"
              onOpenAutoFocus={(e) => {
                e.preventDefault();
                document.getElementById("schedule-delete-btn")?.focus();
              }}
            >
              <DialogTitle className="text-base font-bold text-slate-900">
                Select Expire Date
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-1">
                Pick a date from the calendar below to automatically expire this
                slider banner.
              </DialogDescription>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="border border-slate-200 rounded-md p-2 mt-3"
              />
              <Button
                id="schedule-delete-btn"
                className="mt-4 w-full h-10 rounded-md bg-[#FF6B4A] hover:bg-[#E65A38] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                onClick={() => handleScheduleDelete()}
              >
                Schedule Expire
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
