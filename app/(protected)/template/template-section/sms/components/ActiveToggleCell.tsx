// ActiveToggleCell.tsx
"use client";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateSms } from "@/app/(protected)/services/smsTemplate/api";

const ActiveToggleCell = ({ row,refreshData }: { row: any,refreshData:()=>void }) => {
  const [isActive, setIsActive] = React.useState(row.original.isActive);

  const handleToggle = async (value: boolean) => {
    try {
      const result = await updateSms(row.original.id,row.original.name, value);
      if (result.success) {
        toast.success(`Api-Management ${value ? "activated" : "deactivated"} successfully`);
        setIsActive(value);
        refreshData()
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
