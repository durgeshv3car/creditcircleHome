"use client";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ColumnDef,
  Row,
  Table,
} from '@tanstack/react-table';

import { SquarePen, Trash2, CalendarClock, Timer, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import ActiveToggleCell from "../../../components/ActiveToggleCell";

import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { deleteService } from "@/app/(protected)/services/ourServices/api";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface RowData {
  id: string;
  category: string;
  title: string;
  description?: string;
  thumbnail?: string | { web?: string; mobile?: string };
  companyUrl: string;
  joiningFee: string;
  annualFee: string;
  buttonType: string;
  active: boolean;
}

interface ColumnsLogoProps {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  router: AppRouterInstance;
  type: string;
}

export const columnsRecommend = ({
  setRefresh,
  type,
  router
}: ColumnsLogoProps): ColumnDef<RowData>[] => [
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
    cell: ({ row }: { row: { original: RowData } }) => {
      const rawDescription = row.original?.description || "";
      const plainText = rawDescription.replace(/<[^>]*>/g, "");
      const truncated =
        plainText.length > 30 ? plainText.slice(0, 30) + "..." : plainText;

      return (
        <span
          className="text-xs font-normal text-slate-500 max-w-[200px] truncate block"
          title={plainText}
        >
          {truncated || "—"}
        </span>
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
      const url = row.original.companyUrl;
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
    accessorKey: "joining fee",
    header: "Joining Fee",
    cell: ({ row }: { row: { original: RowData } }) => (
      <span className="text-xs font-normal text-slate-700 whitespace-nowrap">
        {row.original.joiningFee || "—"}
      </span>
    ),
  },
  {
    accessorKey: "annual fee",
    header: "Annual Fee",
    cell: ({ row }: { row: { original: RowData } }) => (
      <span className="text-xs font-normal text-slate-700 whitespace-nowrap">
        {row.original.annualFee || "—"}
      </span>
    ),
  },
  {
    accessorKey: "active",
    header: "isActive",
    cell: ({ row }) => <ActiveToggleCell row={row} type={type} setRefresh={setRefresh} />,
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
            setRefresh((prev) => !prev);
          } else {
            toast.error("Offer data not deleted");
          }
        } catch (error) {
          console.error("Error deleting item:", error);
        }
      };

      const handleEdit = () => {
        const currentPath =
          typeof window !== "undefined"
            ? window.location.pathname
            : `/Advertisement/loan-section/${type}`;
        router.push(`${currentPath}?id=${row.original.id}`);
      };

      return (
        <div className="flex items-center gap-1">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-[#EA580C] hover:bg-[#FFF1ED] border border-transparent hover:border-orange-200 flex items-center justify-center transition-colors cursor-pointer"
                  onClick={handleEdit}
                >
                  <SquarePen className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Edit</p>
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
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];
