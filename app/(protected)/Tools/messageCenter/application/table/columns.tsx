"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Eye, SquarePen, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
}
export const columns: ColumnDef<DataProps>[] = [
  {
    id: "serialNumber",
    header: "ID",
    cell: ({ row }) => <span>{row.index + 1}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <span>{row.original.title}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="line-clamp-2">
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
          className="text-blue-500 underline"
        >
          {url}
        </a>
      ) : (
        <span className="text-gray-500">No URL</span>
      );
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original.offer?.offerBanner?.banner;
      return imageUrl ? (
        <Avatar className="w-10 h-10">
          <AvatarImage src={imageUrl} alt="Image" />
        </Avatar>
      ) : (
        <span className="text-gray-500">No Image</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColors: Record<string, string> = {
        sent: "bg-success/20 text-success",
        failed: "bg-destructive/20 text-destructive",
      };
      const status = row.getValue<string>("status");
      const statusStyles = statusColors[status] || "default";
      return (
        <Badge className={cn("rounded-full px-5", statusStyles)}>
          {status}{" "}
        </Badge>
      );
    },
  },
];
