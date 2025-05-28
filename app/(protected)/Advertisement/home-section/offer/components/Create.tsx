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
import { addOffer } from "@/app/(protected)/services/offers/api";
import type { FileWithPreview } from "../../../components/ImageUpload";

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
  const [fieldDescription, setFieldDescription] = useState<string>("");
  const [mobileFile, setMobileFile] = useState<FileWithPreview | null>(null);
  const [webFile, setWebFile] = useState<FileWithPreview | null>(null);
  const [bannerFile, setBannerFile] = useState<FileWithPreview | null>(null);
  const [brandLogoFile, setBrandLogoFile] = useState<FileWithPreview | null>(
    null
  );

  const Logo_DIMENSIONS = { width: 150, height: 150 };
  const Web_DIMENSIONS = { width: 1920, height: 970 };
  const Banner_DIMENSIONS = { width: 356, height: 180 };
  const Mobile_DIMENSIONS = { width: 150, height: 280 };

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
  useEffect(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    axios
      .get(`${API_BASE_URL}/category`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setCategories([]);
        } else {
          console.error("Error fetching categories:", error);
        }
      });
  }, []);

  const handleClose = () => {
    onClose();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const refreshData = () => setRefresh((prev) => !prev);

  const handleSubmit = async () => {
    const result = await addOffer(
      type,
      { ...formData, fieldDescription: fieldDescription },
      mobileFile?.file,
      webFile?.file,
      bannerFile?.file,
      brandLogoFile?.file
    );

    if (result.success) {
      toast.success(result.message);
      setMobileFile(null);
      setWebFile(null);
      setBannerFile(null);
      setBrandLogoFile(null);
      refreshData();
      handleClose();
    } else {
      toast.error(result.message);
    }
  };
  const excludedFields = ["schedulexpire", "isactive", "ishome"];
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
                <label className="block text-sm font-medium">
                  {key === "mobile"
                    ? "Mobile"
                    : key === "web"
                    ? "Web"
                    : key === "brand web"
                    ? "Brand Web"
                    : key === "brand mobile"
                    ? "Brand Mobile"
                    : key}
                </label>

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
                ) : key.toLowerCase() === "button name" ? (
                  <div className="flex gap-2 flex-wrap">
                    <Select
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, [key]: value }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Button" />
                      </SelectTrigger>
                      <SelectContent>
                        {buttonsType.map((button) => (
                          <SelectItem key={button.id} value={button.name}>
                            {button.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : key.toLowerCase() === "banner" ? (
                  <ImageUpload
                    files={bannerFile ? [bannerFile] : []}
                    setFiles={(files: FileWithPreview[]) =>
                      setBannerFile(files[0] || null)
                    }
                    expectedDimensions={Banner_DIMENSIONS}
                    label="Banner"
                  />
                ) : key.toLowerCase() === "web" ? (
                  <ImageUpload
                    files={webFile ? [webFile] : []}
                    setFiles={(files: FileWithPreview[]) =>
                      setWebFile(files[0] || null)
                    }
                    expectedDimensions={Web_DIMENSIONS}
                    label="Web"
                  />
                ) : key.toLowerCase() === "mobile" ? (
                  <ImageUpload
                    files={mobileFile ? [mobileFile] : []}
                    setFiles={(files: FileWithPreview[]) =>
                      setMobileFile(files[0] || null)
                    }
                    expectedDimensions={Mobile_DIMENSIONS}
                    label="Mobile"
                  />
                ) : key.toLowerCase() === "brand logo" ? (
                  <ImageUpload
                    files={brandLogoFile ? [brandLogoFile] : []}
                    setFiles={(files: FileWithPreview[]) =>
                      setBrandLogoFile(files[0] || null)
                    }
                    expectedDimensions={Logo_DIMENSIONS}
                    label="Logo"
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
