"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateCategory } from "@/app/(protected)/services/categorys/api";
import { X, Edit3 } from "lucide-react";

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
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;

    const foundRow =
      tableData?.find(
        (row) => (row as any).id === id || (row as any).offerId === id
      ) || null;
    setSelectedRow(foundRow);
    setEditedData(foundRow ? { ...foundRow } : {});
  }, [id, tableData]);

  const handleClose = () => {
    onClose();
    router.push("/Tools/Analytics", { scroll: false });
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

    setIsUpdating(true);
    try {
      const result = await updateCategory(id, editedData.title);
      if (result.success) {
        toast.success("Record updated successfully");
        refreshData();
        handleClose();
      } else {
        toast.error("Failed to update record");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("An error occurred while updating");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!selectedRow) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Right-Side Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0B1740] text-white flex items-center justify-center shadow-2xs">
                <Edit3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Edit Record</h2>
                <p className="text-xs text-slate-400">Modify campaign details</p>
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
              !["id", "action", "createdAt", "updatedAt", "type", "offerId"].includes(
                key
              ) ? (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <Input
                    name={key}
                    value={editedData[key] || ""}
                    onChange={onInputChange}
                    className="w-full text-xs h-10 border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#FF6B4A]"
                  />
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button
            variant="outline"
            onClick={handleClose}
            className="h-9 px-4 text-xs font-medium rounded-lg border-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="h-9 px-4 text-xs font-semibold rounded-lg bg-[#FF6B4A] hover:bg-[#E65A38] text-white shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditModal;