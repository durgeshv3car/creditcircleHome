import React from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateService } from "@/app/(protected)/services/ourServices/api"; 
import { cn } from "@/lib/utils";

const ActiveToggleCell = ({ row, type, setRefresh }: { row: any; type: string; setRefresh: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const activeData = row?.original?.active;
  const id = row?.original?.id;
  const [isActive, setIsActive] = React.useState(activeData);
  
  const Web_DIMENSIONS = { width: 1920, height: 970 };
  const Mobile_DIMENSIONS = { width: 356, height: 180 };
  const Logo_DIMENSIONS = { width: 150, height: 150 };
  const dimensions = {
    web: Web_DIMENSIONS,
    mobile: Mobile_DIMENSIONS,
  };

  const handleToggle = async (value: boolean) => {
    const previousState = isActive; 
    setIsActive(value); 

    try {
      const result = await updateService( 
        row.original.id,
        row.original.type,
        dimensions,
        { active: value },
        null, // file
        null, // mobileFile
        row.original.mobileUrl || "",
        row.original.webUrl || ""
      );
      if (result.success) {
        toast.success(`${type} ${value ? "activated" : "deactivated"} successfully`);
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
