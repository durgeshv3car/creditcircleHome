"use client";

import React from "react";
import { ExternalLink, Image as ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export interface DataProps {
  id: string;
  title: string;
  status?: string;
  offer?: {
    category?: string;
    [key: string]: any;
  };
  user?: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    [key: string]: any;
  };
  [key: string]: any;
  pageSize: number;
  totalPages: number;
  currentPage: number;
  recordsCount: number;
}

export const columns = ({
  pageSize,
  totalPages,
  currentPage,
  recordsCount,
}: {
  pageSize: number;
  totalPages: number;
  currentPage: number;
  recordsCount: number;
}): ColumnDef<DataProps>[] => [
  {
    id: "index",
    header: "ID",
    cell: ({ row }) => {
      const total = recordsCount;
      const currentIndex = row.index + 1;
      const globalIndex = (currentPage - 1) * pageSize + currentIndex;
      const descendingNumber = total ? total - globalIndex + 1 : currentIndex;
      return (
        <span className="font-mono text-xs text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/70">
          #{descendingNumber}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => {
      const phone = row.original?.user?.phoneNumber;
      return phone ? (
        <span className="font-medium text-slate-800 text-xs">{phone}</span>
      ) : (
        <span className="text-slate-400 text-xs">—</span>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="font-semibold text-slate-900 text-xs line-clamp-1">
        {row.original.title}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600 line-clamp-2 max-w-[280px]">
        {row.original.body || "No description"}
      </span>
    ),
  },
  {
    accessorKey: "redirectUrl",
    header: "Redirect URL",
    cell: ({ row }) => {
      const url = row.original.url;
      return url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline font-medium text-xs max-w-[180px] truncate"
        >
          <span className="truncate">{url}</span>
          <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
        </a>
      ) : (
        <span className="text-slate-400 text-xs">No URL</span>
      );
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original.offer?.offerBanner?.banner;
      return imageUrl ? (
        <Avatar className="w-9 h-9 rounded-lg border border-slate-200 shadow-2xs">
          <AvatarImage src={imageUrl} alt="Notification Banner" className="object-cover" />
          <AvatarFallback className="bg-slate-100 rounded-lg">
            <ImageIcon className="w-4 h-4 text-slate-400" />
          </AvatarFallback>
        </Avatar>
      ) : (
        <span className="text-slate-400 text-xs">No Image</span>
      );
    },
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      if (!row.original.createdAt) {
        return <span className="text-slate-400 text-xs">—</span>;
      }
      try {
        const dateObj = new Date(row.original.createdAt);
        const time = dateObj.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const date = dateObj.toLocaleDateString([], {
          month: "short",
          day: "numeric",
        });
        return (
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-700">{date}</span>
            <span className="text-[11px] text-slate-400 font-mono">{time}</span>
          </div>
        );
      } catch {
        return <span className="text-slate-400 text-xs">—</span>;
      }
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.getValue<string>("status") || "").toLowerCase();
      if (status === "sent") {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Sent
          </span>
        );
      }
      if (status === "failed") {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Failed
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          {status || "Unknown"}
        </span>
      );
    },
  },
];
