"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../../../components/ImageUpload";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { updateReferImage } from "@/app/(protected)/services/refer-earns/api";
import type { FileWithPreview } from "../../../components/ImageUpload";
import { X, Gift, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const Web_DIMENSIONS = { width: 1920, height: 970 };
  const Mobile_DIMENSIONS = { width: 356 * 2, height: 180 * 2 };
  const dimensions = {
    web: Web_DIMENSIONS,
    mobile: Mobile_DIMENSIONS,
  };

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
    router.push("/Others/home-section/refer-earn", { scroll: false });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const refreshData = () => setRefresh((prev) => !prev);
  const type = "refer";

  const handleUpdate = async () => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      const result = await updateReferImage(
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
        toast.success("Refer & Earn entry updated");
      } else {
        toast.error("Failed to update entry");
      }
    } catch (error) {
      console.error("Error updating:", error);
      toast.error("An error occurred while updating");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedRow) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={handleClose}
      />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[500px] md:w-[540px] bg-white shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FFF1ED] text-[#EA580C] flex items-center justify-center shadow-2xs">
                <Gift className="w-4 h-4 text-[#EA580C]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Edit Refer & Earn Entry</h2>
                <p className="text-xs text-slate-400">Update promotional banners and details</p>
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
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 capitalize">
                      {key === "mobileUrl"
                        ? "Mobile Banner"
                        : key === "webUrl"
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
                    <div className="flex items-center gap-2.5 pt-1">
                      <Switch
                        checked={Boolean(editedData[key])}
                        onCheckedChange={(value) =>
                          setEditedData((prev) => ({ ...prev, [key]: value }))
                        }
                        className="data-[state=checked]:bg-[#101E4E] data-[state=unchecked]:bg-slate-200 focus-visible:ring-[#101E4E] cursor-pointer"
                      />
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide transition-all select-none border",
                          editedData[key]
                            ? "bg-[#101E4E]/10 text-[#101E4E] border-[#101E4E]/25 shadow-2xs"
                            : "bg-slate-50 text-slate-500 border-slate-200/80"
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            editedData[key] ? "bg-[#101E4E]" : "bg-slate-400"
                          )}
                        />
                        {editedData[key] ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ) : (
                    <Input
                      name={key}
                      value={editedData[key] || ""}
                      onChange={onInputChange}
                      className="w-full text-xs h-10 border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#FF6B4A]"
                    />
                  )}
                </div>
              ) : null
            )}
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
            onClick={handleUpdate}
            disabled={isSubmitting}
            className="h-9 px-4 text-xs font-semibold rounded-lg bg-[#FF6B4A] hover:bg-[#E65A38] text-white shadow-sm cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditModal;
