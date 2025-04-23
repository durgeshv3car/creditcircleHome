"use client";
import React from "react";
import {
  ColumnDef,
  Row,
  Table,
} from '@tanstack/react-table';
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
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { scheduleDeleteLogoImage, deleteLogoImage } from "@/app/(protected)/services/logos/api";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface LogoData {
  id: string;
  title: string;
  thumbnail: string | { web?: string; mobile?: string };
  companyUrl: string;
  active: boolean;
}

interface ColumnsLogoProps {
  fetchData: () => void;
  router: AppRouterInstance;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  selectedDate?: Date;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const columnsLogo = ({
  fetchData,
  router,
  setSelectedDate,
  selectedDate,
  open,
  setOpen,
}: ColumnsLogoProps): ColumnDef<LogoData>[] => [
  {
    id: "select",
    header: ({ table }: { table: Table<LogoData> }) => (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() ? "indeterminate" : false)
          }
          onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }: { row: Row<LogoData> }) => (
      <div className="flex items-center gap-2 xl:w-16">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
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
    cell: ({ row }: { row: Row<LogoData> }) => <span>{row.index + 1}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }: { row: Row<LogoData> }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.title}</span>
      </div>
    ),
  },
  {
    accessorKey: "thumbnail.web",
    header: "Web",
    cell: ({ row }: { row: Row<LogoData> }) => {
      const thumbnailData = row.original.thumbnail;
      const imageUrls = typeof thumbnailData === 'string' ? JSON.parse(thumbnailData) : thumbnailData;
      
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
    cell: ({ row }: { row: Row<LogoData> }) => {
      const thumbnailData = row.original.thumbnail;
      const imageUrls = typeof thumbnailData === 'string' ? JSON.parse(thumbnailData) : thumbnailData;
      
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
    cell: ({ row }: { row: Row<LogoData> }) => (
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
    cell: ({ row }: { row: Row<LogoData> }) => <ActiveToggleCell row={row} />,
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }: { row: Row<LogoData> }) => {
      const handleDelete = async (id: string) => {
        const result = await deleteLogoImage(id);
        if (result.success) {
          fetchData();
          toast.success("Logo data deleted");
        } else {
          toast.error("Logo data not deleted");
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
                    router.push(`/Advertisement/home-section/logo?id=${row.original.id}`)
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
              <TooltipContent side="top" className="bg-destructive text-destructive-foreground">
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
    header: "Schedule Expire",
    enableHiding: false,
    cell: ({ row }: { row: Row<LogoData> }) => {
      const handleDateSelect = (date: Date | undefined) => {
        if (date) {
          setSelectedDate(date);
        }
      };

      const handleScheduleDelete = async () => {
        if (!selectedDate) {
          toast.error("Please select a date first");
          return;
        }

        const result = await scheduleDeleteLogoImage(row.original.id, "logo", selectedDate);
        if (result.success) {
          setOpen(false);
          toast.success("Deletion scheduled successfully");
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

            <DialogContent className="p-4">
              <h2 className="text-lg font-semibold">Select Deletion Date</h2>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
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