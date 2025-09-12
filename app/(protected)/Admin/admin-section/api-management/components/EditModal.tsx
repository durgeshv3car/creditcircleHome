"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"; // Added missing import
import { toast } from "sonner";
import { updateApi } from "@/app/(protected)/services/apiManagement/api";
import ImageUpload from "../../../../Advertisement/components/ImageUpload";
import type { FileWithPreview } from "../../../../Advertisement/components/ImageUpload";

// Match the same interface structure as in the main component
interface EditModalProps<T> {
  id: string;
  onClose: () => void;
  tableData: T[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditModal = <T extends Record<string, any>>({
  id,
  onClose,
  tableData,
  setRefresh,
}: EditModalProps<T>) => {
  const router = useRouter();
  const [editedData, setEditedData] = useState<Record<string, any>>({});
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const [imageFile, setImageFile] = useState<FileWithPreview | null>(null);

  const Logo_DIMENSIONS = { width: 150*2, height: 150*2 };
  const WEB_DIMENSIONS = { width: 1920, height: 970 };
  const MOBILE_DIMENSIONS = { width: 150*2, height: 150*2 };
    const dimensions ={
    web: WEB_DIMENSIONS,
    mobile: MOBILE_DIMENSIONS,
  }


  useEffect(() => {
    if (!id) return;

    // Type assertion to handle the possibility that id might be a different type
    const foundRow = tableData?.find((row) => (row as any).id === id) || null;
    setSelectedRow(foundRow);
    setEditedData(foundRow ? { ...foundRow } : {});
    
    if (foundRow?.mobileUrl) {
      setImageFile({ preview: foundRow.mobileUrl } as FileWithPreview);
    }
  }, [id, tableData]);
 

  const handleClose = () => {
    onClose();
    router.push("/Admin/admin-section/api-management", { scroll: false });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const refreshData = () => setRefresh((prev) => !prev);

  const handleUpdate = async () => {
    if (!id) return;
    
    try {
      const result = await updateApi(
        id,
        dimensions,
        editedData.name,
        editedData.isActive,
        imageFile?.file || null,
        editedData.mobileUrl
      );

      if (result.success) {
        toast.success("API data updated successfully.");
        refreshData();
        handleClose();
      } else {
        toast.error("Failed to update API data.");
      }
    } catch (error) {
      console.error("Error updating API:", error);
      toast.error("An error occurred while updating the API.");
    }
  };
    
  if (!selectedRow) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />

      {/* Right-Side Modal */}
      <div className="fixed right-0 top-0 h-full w-1/3 bg-white shadow-lg transform transition-transform duration-300 translate-x-0 z-50 p-6 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Edit Row</h2>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-black"
          >
            ✖
          </button>
        </div>

        <div className="space-y-3">
          {Object.keys(selectedRow).map((key) => {
            // Skip these fields
            if (["id", "action", "createdAt", "updatedAt", "type", "thumbnail", "webUrl", "pendingCount", "rejectedCount", "approvedCount"].includes(key)) {
              return null;
            }

            // Render appropriate input based on field type
            if (key.toLowerCase() === "active" || typeof editedData[key] === "boolean") {
              return (
                <div key={key} className="flex flex-col space-y-1">
                  <label className="text-sm font-medium">{key}</label>
                  <Switch
                    checked={Boolean(editedData[key])}
                    onCheckedChange={(value) =>
                      setEditedData((prev) => ({ ...prev, [key]: value }))
                    }
                  />
                </div>
              );
            }
            else if (key.toLowerCase() === "mobileurl") {
              return (
                <div key={key}>
                  <div className="flex items-center">
                    <label className="block text-sm font-medium">Logo</label>
                    <span className="text-xs text-gray-500 ml-2">
                      ({Logo_DIMENSIONS.width} x {Logo_DIMENSIONS.height})
                    </span>
                  </div>
                  <ImageUpload
                    files={imageFile ? [imageFile] : []}
                    setFiles={(files: FileWithPreview[]) =>
                      setImageFile(files[0] || null)
                    }
                    label="Logo"
                  />
                </div>
              );
            }
            else {
              return (
                <div key={key} className="flex flex-col space-y-1">
                  <label className="text-sm font-medium">{key}</label>
                  <Input
                    name={key}
                    value={editedData[key] || ""}
                    onChange={onInputChange}
                  />
                </div>
              );
            }
          })}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Save Changes</Button>
        </div>
      </div>
    </>
  );
};

export default EditModal;