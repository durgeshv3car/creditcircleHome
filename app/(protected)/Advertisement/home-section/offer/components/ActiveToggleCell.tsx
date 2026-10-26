import React from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateOffer } from "@/app/(protected)/services/offers/api";
import { cn } from "@/lib/utils";

const ActiveToggleCell = ({
  row,
  setRefresh,
}: {
  row: any;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isActive, setIsActive] = React.useState(row.original.isActive);
  
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
    const previousState = isActive;
    setIsActive(value);
    try {
      const result = await updateOffer(
        row.original.id,
        row.original.type,
        dimensions,
        { isActive: value },
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
          `Offer ${value ? "activated" : "deactivated"} successfully`
        );
        setIsActive(value);
        setRefresh((prev) => !prev);
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
    <div className="flex items-center gap-2">
      <Switch
        checked={isActive}
        onCheckedChange={handleToggle}
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
