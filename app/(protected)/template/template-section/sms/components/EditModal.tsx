"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateSms } from "@/app/(protected)/services/smsTemplate/api";
import { X, Smartphone, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const foundRow = tableData?.find((row) => (row as any).id === id) || null;
    setSelectedRow(foundRow);
    if (foundRow) {
      setName((foundRow as any).name || "");
      setIsActive(Boolean((foundRow as any).active ?? (foundRow as any).isActive ?? true));
    }
  }, [id, tableData]);

  const handleClose = () => {
    onClose();
    router.push("/template/template-section/sms", { scroll: false });
  };

  const refreshData = () => setRefresh((prev) => !prev);

  const handleUpdate = async () => {
    if (!id) return;
    if (!name.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateSms(id, name, isActive);
      if (result.success) {
        toast.success("SMS template updated successfully.");
        refreshData();
        handleClose();
      } else {
        toast.error("Failed to update template.");
      }
    } catch (error) {
      console.error("Error updating sms template:", error);
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
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Edit SMS Template</h2>
                <p className="text-xs text-slate-400">Update SMS template name and status</p>
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
                Template Name <span className="text-rose-500">*</span>
              </label>
              <Input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Template name"
                className="w-full text-xs h-10 border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#FF6B4A]"
              />
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-2.5">
                <Switch
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(checked)}
                  className="data-[state=checked]:bg-[#101E4E] data-[state=unchecked]:bg-slate-200 focus-visible:ring-[#101E4E] cursor-pointer"
                />
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide transition-all select-none border",
                    isActive
                      ? "bg-[#101E4E]/10 text-[#101E4E] border-[#101E4E]/25 shadow-2xs"
                      : "bg-slate-50 text-slate-500 border-slate-200/80"
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      isActive ? "bg-[#101E4E]" : "bg-slate-400"
                    )}
                  />
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
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
              <span>Update Template</span>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditModal;