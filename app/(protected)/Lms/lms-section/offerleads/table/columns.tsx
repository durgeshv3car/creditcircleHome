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

export type DataProps = {
  id: string | number;
  title: string;
  description: string;
  redirectUrl: string;
  image?: string;
  mobile: string;
  firstName: string;
};

export const columns: ColumnDef<DataProps>[] = [
  {
    id: "serialNumber",
    header: "ID",
    cell: ({ row }) => <span>{row.index + 1}</span>,
    enableSorting: false,
  },

  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span>{row.original.user.firstName}</span>,
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
    cell: ({ row }) => <span>{row.original.user.phoneNumber}</span>,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <span>{row.original.offer.title}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="line-clamp-2">{row.original.offer.description}</span>
    ),
  },
  {
    accessorKey: "from",
    header: "From",
    cell: ({ row }) => (
      <span className="line-clamp-2">{row.original.type}</span>
    ),
  },

  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl =
        row.original.offer.offerImage.web || row.original.offer.offerImage.web;
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
    accessorKey: "clickedAt",
    header: "Clicked At",
    cell: ({ row }) => {
      const dateObj = new Date(row.original.clickedAt);
      const date = dateObj.toISOString().split("T")[0];
      const time = dateObj.toISOString().split("T")[1].split(".")[0];
      return <span className="line-clamp-2">{date+" "+time}</span>;
    },
  },
];
