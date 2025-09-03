"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { deleteUser } from "@/app/(protected)/services/users/api";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Eye, SquarePen, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import PartnerStatus from "../components/PartnerStatus";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Define all fields explicitly
const fields = [
  "phoneNumber",
  "firstName",
  "lastName",
  "email",
  "dob",
  "pan",
  "pinCode",
  "city",
  "state",
  "houseNo",
  "streetAddress",
  "landmark",
  "gender",
  "education",
  "maritalStatus",
  "liveWith",
  "ownsFourWheeler",
  "ownsTwoWheeler",
  "insurancePlans",
  "investmentOptions",
  "earningMembers",
  "shoppingFrequency",
  "rewardInterests",
  "exploreIndiaFrequency",
  "travelAbroadFrequency",
];

export type DataProps = {
  [key in (typeof fields)[number]]?: string | number | boolean;
} & {
  LoanApplication?: {
    profession?: string;
    loanType?: string;
  };
};
// Define columns dynamically
export const columns = ({
  isModalOpen,
  setIsModalOpen,
  fetchData,
  router,
  selectedUser,
  setSelectedUser, // ✅ accept here
}: {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  fetchData: () => void;
  router: AppRouterInstance;
  selectedUser:any,
  setSelectedUser: (val: { id: string; phoneNumber: number }) => void;
}): ColumnDef<DataProps>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }: { row: Row<DataProps> }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "index",
    header: "ID",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  ...fields.map((key) => ({
    accessorKey: key,
    header: key.replace(/([A-Z])/g, " $1").trim(),
    cell: ({ row }: { row: Row<DataProps> }) => (
      <span>{String(row.original[key] ?? "-")}</span>
    ),
  })),
{
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => {
    const statusColors: Record<string, string> = {
      blue: "bg-blue-100 text-blue-700",
    };

    const handleClick = () => {
      const id =
        typeof row.original.id === "string"
          ? row.original.id
          : String(row.original.id ?? "");

      const phoneNumber =
        typeof row.original.phoneNumber === "number"
          ? row.original.phoneNumber
          : Number(row.original.phoneNumber) || 0;

      setSelectedUser({ id, phoneNumber });
      setIsModalOpen(true);
    };

    const status = "blue"; // You can update this dynamically if needed
    const statusStyles = statusColors[status];

    return (
      <>
        <Badge
          className={cn("rounded-full px-5 cursor-pointer", statusStyles)}
          onClick={handleClick}
        >
          status
        </Badge>
        {isModalOpen && (
          <PartnerStatus
            close={() => setIsModalOpen(false)}
            userdata={row.original.registerStatus}
            id={selectedUser.id}
            phoneNumber={selectedUser.phoneNumber}
          />
        )}
      </>
    );
  },
},

  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const handleDelete = async (id: string | undefined) => {
        if (!id) {
          toast.error("Invalid user ID");
          return;
        }
        try {
          const result = await deleteUser(id);
          if (result.success) {
            toast.success("User data deleted");
            fetchData();
          } else {
            toast.error("User data not deleted");
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
                  className="w-7 h-7 text-default-400"
                  onClick={() =>
                    router.push(`/Lms/lms-section/leads/?id=${row.original.id}`)
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
                  className="w-7 h-7 text-default-400"
                  onClick={() =>
                    handleDelete(row.original.id as string | undefined)
                  }
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
