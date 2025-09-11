"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addApi } from "@/app/(protected)/services/apiManagement/api";
import ImageUpload from "../../../../Advertisement/components/ImageUpload";
import type { FileWithPreview } from "../../../../Advertisement/components/ImageUpload";

interface CreateModalProps {
  onClose: () => void;
  columnsField: string[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
}

const CreateModal: React.FC<CreateModalProps> = ({
  onClose,
  columnsField,
  setRefresh,
  type,
}) => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<FileWithPreview | null>(null);

  const Logo_DIMENSIONS = { width: 150 * 2, height: 150 * 2 };
  const WEB_DIMENSIONS = { width: 1920, height: 970 };
  const MOBILE_DIMENSIONS = { width: 150 * 2, height: 150 * 2 };
  const dimensions = {
    web: WEB_DIMENSIONS,
    mobile: MOBILE_DIMENSIONS,
  };
  const handleClose = () => {
    onClose();
  };

  const refreshData = () => setRefresh((prev) => !prev);

  const handleSubmit = async () => {
    try {
      const result = await addApi(
        name,
        dimensions,
        imageFile?.file || null,
        
      );

      if (result.success) {
        toast.success("API added successfully");
        setName("");
        setImageFile(null);
        refreshData();
        handleClose();
      } else {
        toast.error("Failed to add API");
      }
    } catch (error) {
      console.error("Error adding API:", error);
      toast.error("An error occurred while adding the API");
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />
      <div className="fixed right-0 top-0 h-full w-1/3 bg-white shadow-lg transform transition-transform duration-300 translate-x-0 z-50 p-6 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Create New Entry</h2>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-black"
          >
            ✖
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <Input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
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
              label="Image"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </div>
    </>
  );
};

export default CreateModal;
