"use client";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { pauseServices } from "@/app/(protected)/services/users/api";

const PauseSms = ({
  row,
  refreshData,
}: {
  row: any;
  refreshData: () => void;
}) => {
  const [isActive, setIsActive] = React.useState(row.original.pauseSms);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleToggle = async (value: boolean) => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      const result = await pauseServices(row.original.id, { sms: value });

      if (result?.success) {
        toast.success(
          `Sms ${value ? "activated" : "deactivated"} successfully`
        );
        setIsActive(value);
        refreshData();
      } else {
        toast.error("Failed to update status");
        setIsActive(!value);
      }
    } catch (error) {
      console.error("Error updating isActive:", error);
      toast.error("Failed to update status");
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
      aria-label={`Toggle Logo ${isActive ? "off" : "on"}`}
    />
  );
};

export default PauseSms;
