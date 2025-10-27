"use client";
import React,{useState} from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { deleteAPi } from "@/app/(protected)/services/apiManagement/api";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { deleteUser } from "@/app/(protected)/services/adminUsers/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


export interface Categorys {
  id: string;
  title: string; 
  active: boolean; 
  name:string;
  ipAddress:string;
  action:string;
  createdAt:Date;
  username: string; 
  email: string;
  thumbnail:string;
  role: string;
  permissions:[]
  token?:string;
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
        />
      </div>
    ),
    cell: ({ row }) => (
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
    cell: ({ row }) => <span>{row.index + 1}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "name", // Ensure this matches the key in your data
    header: "Name",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "email", // Ensure this matches the key in your data
    header: "Email",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "role", // Ensure this matches the key in your data
    header: "Role",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center">
        <span className="text-sm">{row.original.role}</span>
      </div>
    ),
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
        <div className="flex gap-3 items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-7 h-7 ring-offset-transparent border-default-200 dark:border-default-300 text-default-400"
                  onClick={handleOpenModal}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>View</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Modal */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>User Permissions</DialogTitle>
              </DialogHeader>
              <ul className="list-disc pl-5 space-y-1 max-h-60 overflow-y-auto">
                {permissionList.length > 0 ? (
                  permissionList.map((perm, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {perm}
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No permissions assigned.</p>
                )}
              </ul>
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
          const result = await deleteUser(id, adminId,token);
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

      return (
        <>
          {row.original.role != "Super Admin" ? (
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
                          `/Admin/admin-section/user-management?id=${row.original.id}`
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
                      onClick={() => handleDelete(row.original.id, adminId)}
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
          ) : (
            <></>
          )}
        </>
      );
    },
  },
];
