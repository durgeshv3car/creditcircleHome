"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../../../components/ImageUpload";
import { toast } from "sonner";
import axios from "axios";
import TextEditor from "./SunEditor";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { addMoney } from "@/app/(protected)/services/moneySmart/api";

import { FileWithPreview } from "../../../components/ImageUpload";

interface CreateModalProps {
  onClose: () => void;
  columnsField: string[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
}

type Category = {
  id: string;
  title: string;
};
const CreateModal: React.FC<CreateModalProps> = ({
  onClose,
  columnsField,
  setRefresh,
  type,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [mobileFile, setMobileFile] = useState<FileWithPreview | null>(null);
  const [webFile, setWebFile] = useState<FileWithPreview | null>(null);
   const [fieldDescription, setFieldDescription] = useState<string>("");

  const Web_DIMENSIONS = { width: 1920, height: 970 };
  const Mobile_DIMENSIONS = { width: 356, height: 180 };
   const dimensions={
    web: Web_DIMENSIONS,
    mobile: Mobile_DIMENSIONS,
  }

  const router = useRouter();

  useEffect(() => {
    if (columnsField.length > 0) {
      const filteredColumns = columnsField.slice(1);
      const initialData = filteredColumns.reduce((acc, column) => {
        if (column !== "ID" && column !== "Action") {
          acc[column] = "";
        }
        return acc;
      }, {} as Record<string, string>);
      setFormData(initialData);
    }
  }, [columnsField]);
  const [categories, setCategories] = useState<Category[]>([]);
  const buttonsType = [
    { id: "apply_now", name: "Apply Now" },
    { id: "book_now", name: "Book Now" },
    { id: "download_app", name: "Download App" },
    { id: "sign_up", name: "Sign Up" },
    { id: "get_offer", name: "Get Offer" },
    { id: "get_quote", name: "Get Quote" },
    { id: "learn_more", name: "Learn More" },
    { id: "know_more", name: "Know More" },
    { id: "shop_now", name: "Shop Now" },
  ];

  // Fetch categories from API
 

  const handleClose = () => {
    onClose();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const refreshData = () => setRefresh((prev) => !prev);
  console.log(mobileFile, webFile);

  const handleSubmit = async () => {
    console.log("type", type);

    const result = await addMoney(
      type,
      dimensions,
      { ...formData, fieldDescription: fieldDescription },
      mobileFile?.file,
      webFile?.file
    );

    if (result.success) {
      toast.success("Operation successful.");
      console.log("Upload success:", result.data);
      setMobileFile(null);
      setWebFile(null);
      refreshData();
      handleClose();
    } else {
      toast.error("An error occurred.");
    }
  };
  const excludedFields = ["schedulexpire", "isactive"];
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
          {Object.keys(formData).map((key) =>
            !excludedFields.includes(key.toLowerCase()) ? (
              <div key={key}>
                   <div className="flex items-center">
                  <label className="block text-sm font-medium">
                    {key === "mobile"
                      ? "Mobile"
                      : key === "web"
                      ? "Web"
                      : key}
                  </label>
                  {key.toLowerCase() === "mobile" && (
                    <span className="text-xs text-gray-500 ml-2">
                      ( {Mobile_DIMENSIONS.width} x {Mobile_DIMENSIONS.height} )
                    </span>
                  )}
                  {key.toLowerCase() === "web" && (
                    <span className="text-xs text-gray-500 ml-2">
                      ( {Web_DIMENSIONS.width} x {Web_DIMENSIONS.height} )
                    </span>
                  )}
               
                </div>

                {/* Select Dropdown for Category Name */}
                {key.toLowerCase() === "category name" ? (
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, [key]: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.title}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : /* Image Uploads */
                key.toLowerCase() === "web" ? (
                  <ImageUpload
                    files={webFile ? [webFile] : []}
                    setFiles={(files: FileWithPreview[]) =>
                      setWebFile(files[0] || null)
                    }
                    label="Web"
                  />
                ) : key.toLowerCase() === "mobile" ? (
                  <ImageUpload
                    files={mobileFile ? [mobileFile] : []}
                    setFiles={(files: FileWithPreview[]) =>
                      setMobileFile(files[0] || null)
                    }
                    label="Mobile"
                  />
                ) : (
                  <Input
                    name={key}
                    value={formData[key]}
                    onChange={onInputChange}
                    className="w-full"
                  />
                )}
              </div>
            ) : null
          )}
           <div>
            <label className="block text-sm font-medium">
              Detail Description
            </label>
            <TextEditor
              value={fieldDescription}
              onChange={setFieldDescription}
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
