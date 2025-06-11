// ActiveToggleCell.tsx
"use client";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateOffer } from "@/app/(protected)/services/offers/api";

const HomeToggleCell = ({
  row,
  setRefresh,
}: {
  row: any;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isActive, setIsActive] = React.useState(row.original.isHome);
  
  const Logo_DIMENSIONS = { width: 150, height: 150 };
  const Web_DIMENSIONS = { width: 1920, height: 970 };
  const Banner_DIMENSIONS = { width: 356, height: 180 };
  const Mobile_DIMENSIONS = { width: 150, height: 280 };
  const dimensions={
    brandLogo: Logo_DIMENSIONS,
    web: Web_DIMENSIONS,
    banner: Banner_DIMENSIONS,
    mobile: Mobile_DIMENSIONS,
  }

  const handleToggle = async (value: boolean) => {
    try {
      const result = await updateOffer(
        row.original.id,
        row.original.type,
        dimensions,
        { active: value },
        null,
        null,
        null,
        null,
        row.original.mobileUrl || "",
        row.original.webUrl || "",
        row.original.bannerUrl || "",
        row.original.logoUrl || ""
      );
      if (result.success) {
        toast.success(
          `Offer home ${value ? "activated" : "deactivated"} successfully`
        );
        setIsActive(value);
        setRefresh((prev) => !prev);
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

export default HomeToggleCell;
