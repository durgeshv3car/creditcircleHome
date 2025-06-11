

"use client";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateLogoImage } from "@/app/(protected)/services/logos/api";



const ActiveToggleCell = ({ row,refreshData }: { row: any,refreshData:()=>void }) => {
  const [isActive, setIsActive] = React.useState(row.original.active);
  const [isUpdating, setIsUpdating] = React.useState(false);
  
   const Logo_DIMENSIONS = { width: 150, height: 150 };
  const WEB_DIMENSIONS = { width: 1920, height: 970 };
  const MOBILE_DIMENSIONS = { width: 150, height: 150 };
  const dimensions ={
    web: WEB_DIMENSIONS,
    mobile: MOBILE_DIMENSIONS,
  }


  const handleToggle = async (value: boolean) => {
    if (isUpdating) return; // Prevent multiple simultaneous requests
    
    setIsUpdating(true);
    try {
      const result = await updateLogoImage(
        row.original.id,
        row.original.type,
        dimensions,
        { active: value },
        null, // file
        null, // mobileFile
        row.original.mobileUrl || "",
        row.original.webUrl || ""
      );

      if (result?.success) {
        toast.success(
          `Logo ${value ? "activated" : "deactivated"} successfully`
        );
        setIsActive(value);
        refreshData()
      } else {
        toast.error("Failed to update status");
        // Revert the switch state if update failed
        setIsActive(!value);
      }
    } catch (error) {
      console.error("Error updating isActive:", error);
      toast.error("Failed to update status");
      // Revert the switch state if update failed
      setIsActive(!value);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Switch
      checked={isActive}
      onCheckedChange={handleToggle}
      disabled={isUpdating}
      aria-label={`Toggle Logo ${isActive ? 'off' : 'on'}`}
    />
  );
};

export default ActiveToggleCell;
