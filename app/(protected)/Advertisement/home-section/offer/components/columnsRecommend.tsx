"use client";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { SquarePen, Trash2, CalendarClock, Timer, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import ActiveToggleCell from "./ActiveToggleCell";
import HomeToggleCell from "./HomeToggleCell";
import { Calendar } from "@/components/ui/calendar";

import {
  deleteOffer,
  scheduleExpireOffer,
} from "@/app/(protected)/services/offers/api";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface RowData {
  id: string;
  category: string;
  title: string;
  description?: string;
  thumbnail?: string | { web?: string; mobile?: string };
  brandthumbnail?: string | { web?: string; mobile?: string };
  offerBanner?: string | { banner?: string };
  brandLogo?: string | { logo?: string };
  buttonType: string;
  redirectUrl: string;
  active: boolean;
  brandName: string;
}
export const columnsRecommend = (
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>,
  router: AppRouterInstance,
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>,
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  selectedDate: Date | undefined,
  setOfferId: React.Dispatch<React.SetStateAction<string>>,
  offerId: string
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
          className="rounded border-slate-300 data-[state=checked]:bg-[#FF6B4A] data-[state=checked]:border-[#FF6B4A] transition-colors"
        />
      </div>
    ),
    cell: ({ row }: { row: any }) => (
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
    cell: ({ row }: { row: any }) => (
      <span className="font-normal text-slate-500 font-mono text-xs whitespace-nowrap">
        #{row.index + 1}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "category name",
    header: "Category Name",
    cell: ({ row }: { row: { original: RowData } }) => (
      <span className="text-xs font-normal text-slate-800 whitespace-nowrap">
        {row.original.category}
      </span>
    ),
  },
  {
    accessorKey: "brand name",
    header: "Brand Name",
    cell: ({ row }: { row: { original: RowData } }) => (
      <span className="text-xs font-normal text-slate-800 whitespace-nowrap">
        {row.original.brandName}
      </span>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }: { row: { original: RowData } }) => (
      <span className="text-xs font-normal text-slate-800 whitespace-nowrap">
        {row.original.title}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }: { row: { original: RowData } }) => (
      <span
        className="text-xs font-normal text-slate-500 max-w-[200px] truncate block"
        title={row.original?.description}
      >
        {row.original?.description || "—"}
      </span>
    ),
  },
  {
    accessorKey: "banner",
    header: "Banner",
    cell: ({ row }: { row: { original: RowData } }) => {
      const BannerData = row.original.offerBanner;
      let imageUrls: any = BannerData;
      if (BannerData && typeof BannerData === "string") {
        try {
          imageUrls = JSON.parse(BannerData);
        } catch {
          imageUrls = { banner: BannerData };
        }
      }

      return (
        <div className="flex items-center">
          {imageUrls?.banner ? (
            <a
              href={imageUrls.banner}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-2xs hover:shadow-xs transition-all"
              title="Click to view full banner"
            >
              <img
                src={imageUrls.banner}
                alt="Banner"
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
    accessorKey: "thumbnail.web",
    header: "Web",
    cell: ({ row }: { row: { original: RowData } }) => {
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
              title="Click to view web creative"
            >
              <img
                src={imageUrls.web}
                alt="Web creative"
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
    header: "Mobile",
    cell: ({ row }: { row: { original: RowData } }) => {
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
              title="Click to view mobile creative"
            >
              <img
                src={imageUrls.mobile}
                alt="Mobile creative"
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
    accessorKey: "brandthumbnail.logo",
    header: "Brand Logo",
    cell: ({ row }: { row: { original: RowData } }) => {
      const brandThumbnailData = row.original.brandLogo;
      let imageUrls: any = brandThumbnailData;
      if (brandThumbnailData && typeof brandThumbnailData === "string") {
        try {
          imageUrls = JSON.parse(brandThumbnailData);
        } catch {
          imageUrls = { logo: brandThumbnailData };
        }
      }

      return (
        <div className="flex items-center">
          {imageUrls?.logo ? (
            <a
              href={imageUrls.logo}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xs hover:shadow-xs p-1"
              title="Click to view brand logo"
            >
              <img
                src={imageUrls.logo}
                alt="Brand logo"
                className="w-8 h-8 object-contain"
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
    accessorKey: "button name",
    header: "Button Name",
    cell: ({ row }: { row: { original: RowData } }) => (
      <span className="text-xs font-normal text-slate-700 px-2 py-0.5 rounded bg-slate-100 border border-slate-200/60 whitespace-nowrap">
        {row.original.buttonType}
      </span>
    ),
  },
  {
    accessorKey: "companyUrl",
    header: "Company URL",
    cell: ({ row }: { row: { original: RowData } }) => {
      const url = row.original.redirectUrl;
      return (
        <div className="flex items-center">
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-mono font-normal hover:underline max-w-[220px] truncate group"
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
    header: "isActive",
    cell: ({ row }: { row: { original: RowData } }) => (
      <ActiveToggleCell row={row} setRefresh={setRefresh} />
    ),
  },
  {
    accessorKey: "home",
    header: "isHome",
    cell: ({ row }: { row: { original: RowData } }) => (
      <HomeToggleCell row={row} setRefresh={setRefresh} />
    ),
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }: { row: { original: RowData } }) => {
      const handleDelete = async (id: string) => {
        try {
          const result = await deleteOffer(id);
          if (result.success) {
            toast.success("Offer data deleted");
            setRefresh((prev) => !prev);
          } else {
            toast.error("Offer data not deleted");
          }
        } catch (error) {
          console.error("Error deleting category:", error);
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
                      `/Advertisement/home-section/offer?id=${row.original.id}`
                    )
                  }
                >
                  <SquarePen className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Edit Offer</p>
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
                <p>Delete Offer</p>
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
    cell: ({ row }: { row: { original: RowData } }) => {
      const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
      };

      const handleScheduleDelete = async () => {
        if (!selectedDate) return;

        const result = await scheduleExpireOffer(offerId, selectedDate);
        if (result.success) {
          setRefresh((prev) => !prev);
          setOpen(false);
        }
      };

      const handleChange = (id: string) => {
        setOpen(true);
        setOfferId(id);
      };

      return (
        <div className="flex items-center gap-1">
          <Dialog
            open={open}
            onOpenChange={() => handleChange(row.original.id)}
          >
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 border border-transparent hover:border-amber-100 flex items-center justify-center transition-colors cursor-pointer"
                      onClick={() => setOpen(true)}
                    >
                      <CalendarClock className="w-3.5 h-3.5" />
                    </button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Schedule Expiry</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DialogContent
              className="p-4"
              onOpenAutoFocus={(e) => {
                e.preventDefault();
                document.getElementById("schedule-delete-btn")?.focus();
              }}
            >
              <DialogTitle className="text-base font-semibold text-slate-900">
                Select Expiration Date
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Pick a date from the calendar below to automatically expire this offer.
              </DialogDescription>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="border border-slate-200 rounded-lg p-2"
              />
              <Button
                id="schedule-delete-btn"
                className="mt-4 w-full bg-[#FF6B4A] hover:bg-[#E65A38] text-white text-xs font-medium h-9 rounded-lg"
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
