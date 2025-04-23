// ActiveToggleCell.tsx
"use client";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { toggleServiceStatus } from "@/app/(protected)/services/ourServices/api"; 

const ActiveToggleCell = ({ row,type }: { row: any; type: string }) => {
  const activeData = row?.original?.active ;
  const id= row?.original?.id  ;
  const [isActive, setIsActive] = React.useState(activeData);

  const handleToggle = async (value: boolean) => {
    const previousState = isActive; 
    setIsActive(value); 

    try {
      const result = await toggleServiceStatus(id, type, value);
      if (result.success) {
        toast.success(`${type} ${value ? "activated" : "deactivated"} successfully`);
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
