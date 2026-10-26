"use client";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, SquarePen, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { deleteUser } from "@/app/(protected)/services/adminUsers/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface Categorys {
  id: string;
  title: string; 
  active: boolean; 
  name: string;
  ipAddress: string;
  action: string;
  createdAt: Date;
  username: string; 
  email: string;
  thumbnail: string;
  role: string;
  permissions: [];
  token?: string;
}

interface ColumnsCategoryProps {
  fetchData: () => void;
  router: AppRouterInstance;
  adminId: string;
  open: boolean;
  setOpen: (val: boolean) => void;
  permissionList: string[];
  setPermissionList: (val: string[]) => void;
  token: string;
}

export const columnsCategory = ({
  fetchData,
  router,
  adminId,
  open,
  setOpen,
  permissionList,
  setPermissionList,
  token
}: ColumnsCategoryProps): ColumnDef<Categorys>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() ? "indeterminate" : false)
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="rounded border-slate-300 data-[state=checked]:bg-[#FF6B4A] data-[state=checked]:border-[#FF6B4A] transition-colors"
        />
      </div>
    ),
    cell: ({ row }) => (
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
    cell: ({ row }) => (
      <span className="font-normal text-slate-500 font-mono text-xs whitespace-nowrap">
        #{row.index + 1}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="text-xs font-normal text-slate-800 whitespace-nowrap">
        {row.original.name || "—"}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-xs font-normal text-slate-600 font-mono whitespace-nowrap">
        {row.original.email || "—"}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role || "User";
      const roleColor =
        role === "Super Admin"
          ? "bg-purple-50 text-purple-700 border-purple-200/70"
          : role === "Editor"
          ? "bg-[#FFF1ED] text-[#EA580C] border-[#FFD7CC]"
          : "bg-slate-100 text-slate-700 border-slate-200/70";

      return (
        <span
          className={cn(
            "text-[11px] font-medium px-2 py-0.5 rounded-md border whitespace-nowrap inline-block",
            roleColor
          )}
        >
          {role}
        </span>
      );
    },
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      const permissions = row.original.permissions || [];

      const handleOpenModal = () => {
        setPermissionList(permissions);
        setOpen(true);
      };

      return (
        <div className="flex items-center">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-[#EA580C] hover:bg-[#FFF1ED] border border-transparent hover:border-orange-200 flex items-center justify-center transition-colors cursor-pointer"
                  onClick={handleOpenModal}
                  title="View permissions"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>View Permissions ({permissions.length})</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Modal */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md p-5 rounded-lg">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-base font-semibold text-slate-900">
                    User Permissions
                  </DialogTitle>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#FFF1ED] text-[#EA580C] border border-[#FFD7CC]">
                    {permissionList.length} assigned
                  </span>
                </div>
              </DialogHeader>
              <div className="mt-3 max-h-72 overflow-y-auto space-y-1.5 pr-1">
                {permissionList.length > 0 ? (
                  permissionList.map((perm, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-100 text-xs text-slate-700 font-mono"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{perm}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-3 text-center">
                    No permissions assigned.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const handleDelete = async (id: string, adminId: string) => {
        try {
          const result = await deleteUser(id, adminId, token);
          if (result.success) {
            toast.success("User data deleted");
            fetchData();
          } else {
            toast.error("User data not deleted");
          }
        } catch (error) {
          console.error("Error deleting category:", error);
          toast.error("Failed to delete category");
        }
      };

      if (row.original.role === "Super Admin") {
        return <span className="text-xs text-slate-400 font-mono">—</span>;
      }

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
                      `/Admin/admin-section/user-management?id=${row.original.id}`
                    )
                  }
                >
                  <SquarePen className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Edit User</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 flex items-center justify-center transition-colors cursor-pointer"
                  onClick={() => handleDelete(row.original.id, adminId)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-rose-600 text-white border-rose-700"
              >
                <p>Delete User</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];
