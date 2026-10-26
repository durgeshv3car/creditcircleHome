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
import {
  Eye,
  SquarePen,
  Trash2,
} from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { cn } from "@/lib/utils";
import PauseSms from "../components/PauseSms";
import PauseEmail from "../components/PauseEmail";
import PauseWhatsapp from "../components/PauseWhatsapp";

// Additional toggleable fields
const additionalFields = [
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
  [key: string]: any;
} & {
  LoanApplication?: {
    profession?: string;
    loanType?: string;
  } & {
    createdAt?: string;
  };
};

const formatDisplayDate = (dateStr?: string | null) => {
  if (!dateStr || dateStr === "0000-00-00" || String(dateStr).startsWith("0000")) {
    return "—";
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(dateStr);
  }
};

// Define columns dynamically matching the reference design exactly
export const columns = ({
  isModalOpen,
  setIsModalOpen,
  fetchData,
  router,
  selectedUser,
  setSelectedUser,
  pageSize,
  totalPages,
  currentPage,
  recordsCount,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  fetchData: () => void;
  router: AppRouterInstance;
  selectedUser: any;
  setSelectedUser: (val: { id: string; phoneNumber: number }) => void;
  pageSize: number;
  totalPages: number;
  currentPage: number;
  recordsCount: number;
}): ColumnDef<DataProps>[] => [
  // 1. Select Checkbox
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
        className="rounded border-slate-300 data-[state=checked]:bg-[#FF6B4A] data-[state=checked]:border-[#FF6B4A] transition-colors"
      />
    ),
    cell: ({ row }: { row: Row<DataProps> }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="rounded border-slate-300 data-[state=checked]:bg-[#FF6B4A] data-[state=checked]:border-[#FF6B4A] transition-colors"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // 2. LEAD (Avatar + Name + #ID)
  {
    id: "lead",
    accessorFn: (row) =>
      `${String(row.firstName || "")} ${String(row.lastName || "")}`.trim(),
    header: "LEAD",
    cell: ({ row }) => {
      const total = recordsCount;
      const currentIndex = row.index + 1;
      const globalIndex = (currentPage - 1) * pageSize + currentIndex;
      const descendingNumber = total ? total - globalIndex + 1 : currentIndex;

      const firstName = String(row.original.firstName || "").trim();
      const lastName = String(row.original.lastName || "").trim();
      const fullName = `${firstName} ${lastName}`.trim();
      const hasName = Boolean(fullName);

      // Extract initials
      let initials = "?";
      if (hasName) {
        const firstLetter = firstName ? firstName.charAt(0) : "";
        const secondLetter = lastName
          ? lastName.charAt(0)
          : firstName.length > 1
          ? firstName.charAt(1)
          : "";
        initials = `${firstLetter}${secondLetter}`.toUpperCase();
      }

      return (
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-9 h-9 rounded-lg font-semibold text-xs flex items-center justify-center shrink-0 tracking-tight shadow-xs",
              hasName
                ? "bg-[#101E4E] text-white"
                : "bg-slate-100 text-slate-400"
            )}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <div
              className={cn(
                "text-xs truncate max-w-[210px]",
                hasName
                  ? "font-normal text-slate-800"
                  : "font-normal text-slate-400"
              )}
              title={hasName ? fullName : "Name not provided"}
            >
              {hasName ? fullName : "Name not provided"}
            </div>
            <div className="text-[11px] text-slate-400 font-normal">
              #{descendingNumber}
            </div>
          </div>
        </div>
      );
    },
  },

  // 3. CONTACT (Phone on top + Email below)
  {
    id: "contact",
    accessorFn: (row) => `${row.phoneNumber || ""} ${row.email || ""}`,
    header: "CONTACT",
    cell: ({ row }) => {
      const phone = row.original.phoneNumber
        ? String(row.original.phoneNumber)
        : null;
      const email = row.original.email
        ? String(row.original.email).trim()
        : null;

      return (
        <div className="min-w-0">
          <div className="font-normal text-slate-700 text-xs font-mono">
            {phone || "—"}
          </div>
          <div
            className="text-xs text-slate-400 font-normal truncate max-w-[210px]"
            title={email || "No email"}
          >
            {email || "No email"}
          </div>
        </div>
      );
    },
  },

  // 4. REGISTERED (Date)
  {
    id: "date",
    accessorKey: "createdAt",
    header: "REGISTERED",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt as string | undefined;
      const formatted = formatDisplayDate(createdAt);
      return (
        <span className="text-xs text-slate-700 font-normal whitespace-nowrap">
          {formatted}
        </span>
      );
    },
  },

  // 5. DOB
  {
    accessorKey: "dob",
    header: "DOB",
    cell: ({ row }) => {
      const formatted = formatDisplayDate(row.original.dob as string);
      return (
        <span className="text-xs text-slate-400 font-normal whitespace-nowrap">
          {formatted}
        </span>
      );
    },
  },

  // 6. PAN
  {
    accessorKey: "pan",
    header: "PAN",
    cell: ({ row }) => {
      const val = row.original.pan;
      if (!val || val === "-" || String(val).trim() === "") {
        return <span className="text-slate-400 text-xs">—</span>;
      }
      return (
        <span className="text-xs text-slate-700 font-mono font-normal tracking-wide whitespace-nowrap">
          {String(val).toUpperCase()}
        </span>
      );
    },
  },

  // 7. SCORE
  {
    accessorKey: "score",
    header: "SCORE",
    cell: ({ row }) => {
      const num = Number(row.original.score);
      if (!isNaN(num) && num > 0) {
        return (
          <span className="text-xs font-normal text-slate-700 font-mono whitespace-nowrap">
            {num}
          </span>
        );
      }
      return <span className="text-slate-400 text-xs font-normal">—</span>;
    },
  },

  // 8. PIN CODE
  {
    accessorKey: "pinCode",
    header: "PIN CODE",
    cell: ({ row }) => {
      const val = row.original.pinCode;
      if (!val || val === "-" || String(val).trim() === "") {
        return <span className="text-slate-400 text-xs">—</span>;
      }
      return (
        <span className="text-xs text-slate-700 font-mono font-normal whitespace-nowrap">
          {String(val)}
        </span>
      );
    },
  },

  // Additional columns (can be shown/hidden via Columns dropdown)
  ...additionalFields.map((key) => ({
    accessorKey: key,
    header: key.replace(/([A-Z])/g, " $1").toUpperCase(),
    cell: ({ row }: { row: Row<DataProps> }) => {
      const val = row.original[key];
      if (val === null || val === undefined || val === "") {
        return <span className="text-slate-400 text-xs">—</span>;
      }
      return (
        <span className="text-xs text-slate-700 whitespace-nowrap">
          {String(val)}
        </span>
      );
    },
  })),

  // Notification toggles (hidden by default, can be toggled)
  {
    accessorKey: "pauseSms",
    header: "SMS",
    cell: ({ row }) => <PauseSms row={row} refreshData={fetchData} />,
  },
  {
    accessorKey: "pauseEmail",
    header: "EMAIL",
    cell: ({ row }) => <PauseEmail row={row} refreshData={fetchData} />,
  },
  {
    accessorKey: "pauseWhatsapp",
    header: "WHATSAPP",
    cell: ({ row }) => <PauseWhatsapp row={row} refreshData={fetchData} />,
  },

  // 9. ACTIONS
  {
    id: "actions",
    header: "ACTIONS",
    enableHiding: false,
    cell: ({ row }) => {
      const handleViewStatus = () => {
        const id = String(row.original.id ?? "");
        const phoneNumber = Number(row.original.phoneNumber) || 0;
        setSelectedUser({ id, phoneNumber });
        setIsModalOpen(true);
      };

      const handleEdit = () => {
        router.push(`/Lms/lms-section/leads/?id=${row.original.id}`);
      };

      const handleDelete = async () => {
        if (!row.original.id) {
          toast.error("Invalid user ID");
          return;
        }
        try {
          const result = await deleteUser(String(row.original.id));
          if (result.success) {
            toast.success("User data deleted");
            fetchData();
          } else {
            toast.error("User data not deleted");
          }
        } catch (error) {
          console.error("Error deleting lead:", error);
        }
      };

      return (
        <div className="flex items-center gap-1">
          {/* Eye Icon for Partner Status */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleViewStatus}
                  className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>View Partner Status</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Quick Edit */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleEdit}
                  className="w-8 h-8 rounded-md text-slate-400 hover:text-[#EA580C] hover:bg-[#FFF1ED] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <SquarePen className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Edit Lead</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Quick Delete */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-8 h-8 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-rose-600 text-white border-rose-700">
                <p>Delete Lead</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];
