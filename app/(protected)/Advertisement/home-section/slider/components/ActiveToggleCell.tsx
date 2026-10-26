"use client";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateSliderImage } from "@/app/(protected)/services/sliders/api";
import { cn } from "@/lib/utils";

const ActiveToggleCell = ({ row, refreshData }: { row: any; refreshData: () => void }) => {
  const [isActive, setIsActive] = React.useState(row.original.active);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const Web_DIMENSIONS = { width: 1920, height: 970 };
  const Mobile_DIMENSIONS = { width: 365, height: 140 };
  const dimensions = {
    web: Web_DIMENSIONS,
    mobile: Mobile_DIMENSIONS,
  };

  const handleToggle = async (value: boolean) => {
    if (isUpdating) return; // Prevent multiple simultaneous requests

    setIsUpdating(true);
    try {
      const result = await updateSliderImage(
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
          `Slider ${value ? "activated" : "deactivated"} successfully`
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
    <div className="flex items-center gap-2">
      <Switch
        checked={isActive}
        onCheckedChange={handleToggle}
        disabled={isUpdating}
        aria-label={`Toggle slider ${isActive ? "off" : "on"}`}
        className="data-[state=checked]:bg-[#101E4E] data-[state=unchecked]:bg-slate-200 focus-visible:ring-[#101E4E] cursor-pointer"
      />
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide transition-all select-none border",
          isActive
            ? "bg-[#101E4E]/10 text-[#101E4E] border-[#101E4E]/25 shadow-2xs"
            : "bg-slate-50 text-slate-500 border-slate-200/80"
        )}
      >
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            isActive ? "bg-[#101E4E]" : "bg-slate-400"
          )}
        />
        {isActive ? "Active" : "Inactive"}
      </span>
    </div>
  );
};

export default ActiveToggleCell;