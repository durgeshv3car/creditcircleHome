"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../../../components/ImageUpload";
import { toast } from "sonner";
import { uploadSliderImage } from "@/app/(protected)/services/sliders/api";
import { X, PlusCircle } from "lucide-react";

import type { FileWithPreview } from "../../../components/ImageUpload";
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
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [mobileFile, setMobileFile] = useState<FileWithPreview | null>(null);
  const [webFile, setWebFile] = useState<FileWithPreview | null>(null);

  const Web_DIMENSIONS = { width: 1920, height: 970 };
  const Mobile_DIMENSIONS = { width: 365 * 2, height: 140 * 2 };
  const dimensions = {
    web: Web_DIMENSIONS,
    mobile: Mobile_DIMENSIONS,
  };

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

  const handleClose = () => {
    onClose();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const refreshData = () => setRefresh((prev) => !prev);

  const handleSubmit = async () => {
    try {
      const result = await uploadSliderImage({
        type,
        dimensions,
        title: formData.Title,
        mobileFile: mobileFile?.file || null,
        webFile: webFile?.file || null,
        companyUrl: formData["Company URL"],
      });

      if (result.success) {
        toast.success("Slider image added successfully");
        setMobileFile(null);
        setWebFile(null);
        refreshData();
        handleClose();
      } else {
        toast.error("Slider image could not be added");
      }
    } catch (error) {
      console.error("Error submitting:", error);
    }
  };
  const excludedFields = ["schedulexpire", "isactive"];

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 transition-opacity"
        onClick={handleClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-6 overflow-y-auto max-h-screen flex flex-col justify-between animate-in slide-in-from-right duration-200">
        <div>
          <div className="flex justify-between items-center pb-4 mb-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF1ED] text-[#EA580C] flex items-center justify-center">
                <PlusCircle className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Add Slider Banner</h2>
                <p className="text-[11px] text-slate-400">Upload web & mobile banner assets</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {Object.keys(formData).map((key) =>
              !excludedFields.includes(key.toLowerCase()) ? (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-700">
                      {key === "mobile" ? "Mobile Banner" : key === "web" ? "Web Banner" : key}
                    </label>
                    {key.toLowerCase() === "web" && (
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                        {Web_DIMENSIONS.width} × {Web_DIMENSIONS.height}
                      </span>
                    )}
                    {key.toLowerCase() === "mobile" && (
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                        {Mobile_DIMENSIONS.width} × {Mobile_DIMENSIONS.height}
                      </span>
                    )}
                  </div>
                  {key.toLowerCase() === "web" ? (
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
                      placeholder={`Enter ${key.toLowerCase()}`}
                      className="w-full h-9 text-xs rounded-md border-slate-200 focus-visible:ring-1 focus-visible:ring-[#FF6B4A]"
                    />
                  )}
                </div>
              ) : null
            )}
          </div>
        </div>

        <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="rounded-md h-9 px-4 text-xs font-normal border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="rounded-md h-9 px-4 text-xs font-medium bg-[#FF6B4A] hover:bg-[#E65A38] text-white shadow-xs cursor-pointer"
          >
            Save Banner
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreateModal;
