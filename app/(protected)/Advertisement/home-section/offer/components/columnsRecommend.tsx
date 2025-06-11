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
import  HomeToggleCell  from "./HomeToggleCell";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  deleteOffer,
} from "@/app/(protected)/services/offers/api";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface RowData {
  id: string;
  category: string;
  title: string;
  description?: string;
  thumbnail?: string | { web?: string; mobile?: string };
  brandthumbnail?: string | { web?: string; mobile?: string };
  offerBanner?: string | { banner?: string;  };
  brandLogo?: string | { logo?: string;  };
  buttonType: string;
  redirectUrl: string;
  active: boolean;
  brandName: string;
}

export const columnsRecommend = (
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>,
  router:AppRouterInstance
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
    accessorKey: "category name",
    header: "Category Name",
    cell: ({ row }: { row: { original: RowData } }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.category}</span>
      </div>
    ),
  },
  {
    accessorKey: "brand name",
    header: "Brand Name",
    cell: ({ row }: { row: { original: RowData } }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.brandName}</span>
      </div>
    ),
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
    accessorKey: "banner",
    header: "Banner",
    cell: ({ row }: { row: { original: RowData } }) => {
      const BannerData = row.original.offerBanner;

      const imageUrls =
      BannerData && typeof BannerData === "string"
          ? JSON.parse(BannerData)
          : BannerData;

      return (
        <div className="flex gap-3 items-center">
          <Avatar className="w-8 h-8 rounded-none bg-transparent shadow-none border-none">
            {imageUrls?.banner ? (
              <AvatarImage src={imageUrls.banner} className="rounded-none" />
            ) : (
              <AvatarFallback className="rounded-none">NA</AvatarFallback>
            )}
          </Avatar>
        </div>
      );
    },
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
    accessorKey: "brandthumbnail.logo",
    header: "Brand Logo",
    cell: ({ row }: { row: { original: RowData } }) => {
      const brandThumbnailData = row.original.brandLogo;

      const imageUrls =
        brandThumbnailData && typeof brandThumbnailData === "string"
          ? JSON.parse(brandThumbnailData)
          : brandThumbnailData;

      return (
        <div className="flex gap-3 items-center">
          <Avatar className="w-8 h-8 rounded-none bg-transparent shadow-none border-none">
            {imageUrls?.logo ? (
              <AvatarImage src={imageUrls.logo} className="rounded-none" />
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
          href={row.original.redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:underline cursor-pointer"
        >
          {row.original.redirectUrl}
        </a>
      </div>
    ),
  },
  {
    accessorKey: "active",
    header: "isActive",
    cell: ({ row }: { row: { original: RowData } }) => <ActiveToggleCell row={row} setRefresh={setRefresh} />,
  },
  {
    accessorKey: "home",
    header: "isHome",
    cell: ({ row }: { row: { original: RowData } }) => <HomeToggleCell row={row} setRefresh={setRefresh} />,
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
                      `/Advertisement/home-section/offer?id=${row.original.id}`
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
