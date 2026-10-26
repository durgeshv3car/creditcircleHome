"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../../../components/ImageUpload";
import { toast } from "sonner";
import TextEditor from "./SunEditor";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { addMoney } from "@/app/(protected)/services/moneySmart/api";
import { FileWithPreview } from "../../../components/ImageUpload";
import { X, Banknote, Loader2 } from "lucide-react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const Web_DIMENSIONS = { width: 1920, height: 970 };
  const Mobile_DIMENSIONS = { width: 356 * 2, height: 180 * 2 };
  const dimensions = {
    web: Web_DIMENSIONS,
    mobile: Mobile_DIMENSIONS,
  };

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

  const handleClose = () => {
    onClose();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const refreshData = () => setRefresh((prev) => !prev);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await addMoney(
        type,
        dimensions,
        { ...formData, fieldDescription },
        mobileFile?.file,
        webFile?.file
      );

      if (result.success) {
        toast.success("MoneySmart entry added successfully");
        setMobileFile(null);
        setWebFile(null);
        refreshData();
        handleClose();
      } else {
        toast.error("Failed to add MoneySmart entry");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("An error occurred while uploading");
    } finally {
      setIsSubmitting(false);
    }
  };

  const excludedFields = ["schedulexpire", "isactive"];

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={handleClose}
      />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[540px] md:w-[600px] bg-white shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FFF1ED] text-[#EA580C] flex items-center justify-center shadow-2xs">
                <Banknote className="w-4 h-4 text-[#EA580C]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Add MoneySmarts Entry</h2>
                <p className="text-xs text-slate-400">Configure financial insight banners and rich content</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <div className="mt-6 space-y-4">
            {Object.keys(formData).map((key) =>
              !excludedFields.includes(key.toLowerCase()) ? (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 capitalize">
                      {key === "mobile"
                        ? "Mobile Banner"
                        : key === "web"
                        ? "Web Banner"
                        : key}
                    </label>
                    {key.toLowerCase() === "mobile" && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        {Mobile_DIMENSIONS.width} × {Mobile_DIMENSIONS.height} px
                      </span>
                    )}
                    {key.toLowerCase() === "web" && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        {Web_DIMENSIONS.width} × {Web_DIMENSIONS.height} px
                      </span>
                    )}
                  </div>

                  {key.toLowerCase() === "category name" ? (
                    <Select
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, [key]: value }))
                      }
                    >
                      <SelectTrigger className="w-full text-xs h-10 border-slate-200 rounded-lg">
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
                  ) : key.toLowerCase() === "web" ? (
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
                      placeholder={`Enter ${key}...`}
                      className="w-full text-xs h-10 border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#FF6B4A]"
                    />
                  )}
                </div>
              ) : null
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Detail Description
              </label>
              <TextEditor
                value={fieldDescription}
                onChange={setFieldDescription}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="h-9 px-4 text-xs font-medium rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-9 px-4 text-xs font-semibold rounded-lg bg-[#FF6B4A] hover:bg-[#E65A38] text-white shadow-sm cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Entry</span>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreateModal;
