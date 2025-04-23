// ActiveToggleCell.tsx
"use client";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { toggleLogoImageStatus } from "@/app/(protected)/services/logos/api"; 

const ActiveToggleCell = ({ row }: { row: any }) => {
  const [isActive, setIsActive] = React.useState(row.original.active);

  const handleToggle = async (value: boolean) => {
    const previousState = isActive; 
    setIsActive(value); 
    try {
      const result = await toggleLogoImageStatus(row.original.id, value);
      if (result.success) {
        toast.success(`Logo ${value ? "activated" : "deactivated"} successfully`);
        setIsActive(value);
      } else {
        setIsActive(previousState); 
        toast.error("Failed to update status");
      }
    } catch (error) {
      setIsActive(previousState); 
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
