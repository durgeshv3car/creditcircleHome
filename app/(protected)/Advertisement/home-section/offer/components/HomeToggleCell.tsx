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
  const [isHome, setIsHome] = React.useState(row.original.isHome);
  
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
    const logoData = row.original.brandLogo;
      const logoimageUrls =
      logoData && typeof logoData=== "string"
          ? JSON.parse(logoData)
          : logoData;

   const BannerData = row.original.offerBanner;
      const bannerimageUrls =
      BannerData && typeof BannerData === "string"
          ? JSON.parse(BannerData)
          : BannerData;

  const offerData = row.original.offerImage;
      const offerimageUrls =
       offerData && typeof  offerData === "string"
          ? JSON.parse( offerData)
          :  offerData;

  const handleToggle = async (value: boolean) => {
    try {
      const result = await updateOffer(
        row.original.id,
        row.original.type,
        dimensions,
        { isHome: value },
        null,
        null,
        null,
        null,
        offerimageUrls.mobile || "",
        offerimageUrls.web || "",
        bannerimageUrls.banner || "",
        logoimageUrls.logo || ""
      );
      if (result.success) {
        toast.success(
          `Offer home ${value ? "activated" : "deactivated"} successfully`
        );
        setIsHome(value);
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
      <Switch checked={isHome} onCheckedChange={handleToggle} />
    </div>
  );
};

export default HomeToggleCell;
