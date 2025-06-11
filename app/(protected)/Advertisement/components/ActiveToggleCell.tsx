// ActiveToggleCell.tsx
"use client";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateService } from "@/app/(protected)/services/ourServices/api"; 

const ActiveToggleCell = ({ row,type,setRefresh }: { row: any; type: string , setRefresh: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const activeData = row?.original?.active ;
  const id= row?.original?.id  ;
  const [isActive, setIsActive] = React.useState(activeData);
  
  const Web_DIMENSIONS = { width: 1920, height: 970 };
  const Mobile_DIMENSIONS = { width: 356, height: 180 };
  const Logo_DIMENSIONS = { width: 150, height: 150 };
   const dimensions={
    web: Web_DIMENSIONS,
    mobile: Mobile_DIMENSIONS,
  }


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
        row.original.webUrl || "");
      if (result.success) {
        toast.success(`${type} ${value ? "activated" : "deactivated"} successfully`);
        setIsActive(value)
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
    <div className="flex gap-3 items-center">
      <Switch checked={isActive} onCheckedChange={handleToggle} />
    </div>
  );
};

export default ActiveToggleCell;
