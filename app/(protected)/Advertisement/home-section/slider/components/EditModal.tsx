"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../../../components/ImageUpload";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { updateSliderImage } from "@/app/(protected)/services/sliders/api";
import { X, Edit3 } from "lucide-react";
import type { FileWithPreview } from "../../../components/ImageUpload";

interface TableRow {
  id: string;
  title?: string;
  imageUrl?: string;
  [key: string]: any;
}

interface EditModalProps {
  id: string | null;
  onClose: () => void;
  tableData: TableRow[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditModal: React.FC<EditModalProps> = ({
  id,
  onClose,
  tableData,
  setRefresh,
}) => {
  const router = useRouter();
  const [editedData, setEditedData] = useState<Partial<TableRow>>({});
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null);
  const [mobileFile, setMobileFile] = useState<FileWithPreview | null>(null);
  const [webFile, setWebFile] = useState<FileWithPreview | null>(null);

  const Web_DIMENSIONS = { width: 1920, height: 970 };
  const Mobile_DIMENSIONS = { width: 365 * 2, height: 140 * 2 };
  const dimensions = {
    web: Web_DIMENSIONS,
    mobile: Mobile_DIMENSIONS,
  };

  // Find the row data based on the id
  useEffect(() => {
    if (id && tableData) {
      const foundRow = tableData.find((row) => row.id === id) || null;
      setSelectedRow(foundRow);
      setEditedData(foundRow || {});

      if (foundRow?.mobileUrl) {
        setMobileFile({ preview: foundRow.mobileUrl } as FileWithPreview);
      }
      if (foundRow?.webUrl) {
        setWebFile({ preview: foundRow.webUrl } as FileWithPreview);
      }
    }
  }, [id, tableData]);

  const handleClose = () => {
    onClose();
    router.push("/Advertisement/home-section/slider", { scroll: false });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const refreshData = () => setRefresh((prev) => !prev);
  const type = "slider";

  const handleUpdate = async () => {
    if (!id) return;

    const result = await updateSliderImage(
      id,
      type,
      dimensions,
      editedData,
      mobileFile?.file,
      webFile?.file,
      mobileFile?.preview,
      webFile?.preview
    );

    if (result.success) {
      refreshData();
      handleClose();
      toast.success("Slider data updated successfully");
    } else {
      toast.error("Slider data could not be updated");
    }
  };

  if (!selectedRow) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Right-Side Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-6 overflow-y-auto max-h-screen flex flex-col justify-between animate-in slide-in-from-right duration-200">
        <div>
          <div className="flex justify-between items-center pb-4 mb-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF1ED] text-[#EA580C] flex items-center justify-center">
                <Edit3 className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Edit Slider Banner</h2>
                <p className="text-[11px] text-slate-400">Modify banner creatives & link</p>
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
            {Object.keys(selectedRow).map((key) =>
              ![
                "id",
                "action",
                "createdAt",
                "updatedAt",
                "type",
                "thumbnail",
                "deletionDate",
              ].includes(key) ? (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-700">
                      {key === "mobileUrl"
                        ? "Mobile Banner"
                        : key === "webUrl"
                        ? "Web Banner"
                        : key === "active"
                        ? "Active Status"
                        : key}
                    </label>
                    {key.toLowerCase() === "mobileurl" && (
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                        {Mobile_DIMENSIONS.width} × {Mobile_DIMENSIONS.height}
                      </span>
                    )}
                    {key.toLowerCase() === "weburl" && (
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                        {Web_DIMENSIONS.width} × {Web_DIMENSIONS.height}
                      </span>
                    )}
                  </div>
                  {key.toLowerCase() === "mobileurl" ? (
                    <ImageUpload
                      files={mobileFile ? [mobileFile] : []}
                      setFiles={(files: FileWithPreview[]) =>
                        setMobileFile(files[0] || null)
                      }
                      label="Mobile"
                    />
                  ) : key.toLowerCase() === "weburl" ? (
                    <ImageUpload
                      files={webFile ? [webFile] : []}
                      setFiles={(files: FileWithPreview[]) =>
                        setWebFile(files[0] || null)
                      }
                      label="Web"
                    />
                  ) : key.toLowerCase() === "active" ? (
                    <div className="pt-1">
                      <Switch
                        checked={Boolean(editedData[key])}
                        onCheckedChange={(value) =>
                          setEditedData((prev) => ({ ...prev, [key]: value }))
                        }
                      />
                    </div>
                  ) : (
                    <Input
                      name={key}
                      value={editedData[key] || ""}
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
            onClick={handleUpdate}
            className="rounded-md h-9 px-4 text-xs font-medium bg-[#FF6B4A] hover:bg-[#E65A38] text-white shadow-xs cursor-pointer"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditModal;
