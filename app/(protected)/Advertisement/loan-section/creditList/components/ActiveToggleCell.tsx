// ActiveToggleCell.tsx
"use client";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { toggleServiceStatus } from "@/app/(protected)/services/ourServices/api"; 

const ActiveToggleCell = ({ row,type }: { row: any; type: string }) => {
  const [isActive, setIsActive] = React.useState(row.original.isActive);
  console.log(type, "type");

  const handleToggle = async (value: boolean) => {
    try {
      const result = await toggleServiceStatus(row.original.id,type, value);
      if (result.success) {
        toast.success(`credit ${value ? "activated" : "deactivated"} successfully`);
        setIsActive(value);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating isActive:", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex gap-3 items-center">
      <Switch checked={isActive} onCheckedChange={handleToggle} />
    </div>
  );
};

export default ActiveToggleCell;
