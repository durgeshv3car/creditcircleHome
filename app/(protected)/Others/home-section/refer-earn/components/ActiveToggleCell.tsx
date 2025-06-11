"use client";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateReferImage } from "@/app/(protected)/services/refer-earns/api";

const ActiveToggleCell = ({
  row,
  refreshData,
}: {
  row: any;
  refreshData: () => void;
}) => {
  const [isActive, setIsActive] = React.useState(row.original.active);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const Web_DIMENSIONS = { width: 1920, height: 970 };
  const Mobile_DIMENSIONS = { width: 356, height: 180 };
  const dimensions = {
    web: Web_DIMENSIONS,
    mobile: Mobile_DIMENSIONS,
  };

  const handleToggle = async (value: boolean) => {
    if (isUpdating) return; // Prevent multiple simultaneous requests

    setIsUpdating(true);
    try {
      const result = await updateReferImage(
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
          `Refer&Earn ${value ? "activated" : "deactivated"} successfully`
        );
        setIsActive(value);
        refreshData();
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
      aria-label={`Toggle Refer&Earn ${isActive ? "off" : "on"}`}
    />
  );
};

export default ActiveToggleCell;
