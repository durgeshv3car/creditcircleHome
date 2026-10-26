"use client";

import React from "react";
import { ExternalLink, Image as ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
}

export const columns: ColumnDef<DataProps>[] = [
  {
    id: "serialNumber",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/70">
        #{row.index + 1}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: "Card Title",
    cell: ({ row }) => (
      <span className="font-semibold text-slate-900 text-xs line-clamp-1">
        {row.original.title}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const cat = row.original.offer?.category;
      return cat ? (
        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200/70">
          {cat}
        </span>
      ) : (
        <span className="text-slate-400 text-xs">—</span>
      );
    },
  },
  {
    accessorKey: "recipient",
    header: "Recipient",
    cell: ({ row }) => {
      const name = [row.original.user?.firstName, row.original.user?.lastName]
        .filter(Boolean)
        .join(" ");
      const phone = row.original.user?.phoneNumber;
      return (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-800">{name || "Contact"}</span>
          {phone && <span className="text-[11px] text-slate-400 font-mono">{phone}</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Rich Content",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600 line-clamp-2 max-w-[280px]">
        {row.original.body || "No rich message content"}
      </span>
    ),
  },
  {
    accessorKey: "redirectUrl",
    header: "Action Link",
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
    header: "Card Media",
    cell: ({ row }) => {
      const imageUrl = row.original.image || row.original.offer?.offerBanner?.banner;
      return imageUrl ? (
        <Avatar className="w-9 h-9 rounded-lg border border-slate-200 shadow-2xs">
          <AvatarImage src={imageUrl} alt="RCS Media" className="object-cover" />
          <AvatarFallback className="bg-slate-100 rounded-lg">
            <ImageIcon className="w-4 h-4 text-slate-400" />
          </AvatarFallback>
        </Avatar>
      ) : (
        <span className="text-slate-400 text-xs">None</span>
      );
    },
  },
];
