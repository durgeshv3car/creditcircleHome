"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateWallet } from "@/app/(protected)/services/walletPoints/api";
import { X, Coins, Loader2 } from "lucide-react";

interface TableRow {
  id: string;
  title?: string;
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
  const [title, setTitle] = useState("");
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const foundRow = tableData?.find((row) => row.id === id) || null;
    setSelectedRow(foundRow);
    if (foundRow) {
      setTitle(foundRow.title || "");
    }
  }, [id, tableData]);

  const handleClose = () => {
    onClose();
    router.push("/Others/page-section/wallet-points", { scroll: false });
  };

  const refreshData = () => setRefresh((prev) => !prev);

  const handleUpdate = async () => {
    if (!id) return;
    if (!title.trim()) {
      toast.error("Please enter a title / point tier");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateWallet(id, title);
      if (result.success) {
        toast.success("Wallet points updated successfully.");
        refreshData();
        handleClose();
      } else {
        toast.error("Failed to update wallet points.");
      }
    } catch (error) {
      console.error("Error updating wallet points:", error);
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
      <div className="fixed right-0 top-0 h-full w-full sm:w-[460px] bg-white shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0B1740] text-white flex items-center justify-center shadow-2xs">
                <Coins className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Edit Wallet Points Entry</h2>
                <p className="text-xs text-slate-400">Update point allocation tier</p>
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
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Points Title / Tier <span className="text-rose-500">*</span>
              </label>
              <Input
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 100 Reward Points on Signup"
                className="w-full text-xs h-10 border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#FF6B4A]"
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
              <span>Update Entry</span>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditModal;
