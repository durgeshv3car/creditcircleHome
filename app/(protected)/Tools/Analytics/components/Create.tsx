"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addCategory } from "@/app/(protected)/services/categorys/api";
import { X, Sparkles } from "lucide-react";

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
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    onClose();
  };

  const refreshData = () => setRefresh((prev) => !prev);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await addCategory(title);
      if (result.success) {
        toast.success("Entry added successfully");
        setTitle("");
        refreshData();
        handleClose();
      } else {
        toast.error("Failed to add entry");
      }
    } catch (error) {
      console.error("Error adding title:", error);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={handleClose}
      />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0B1740] text-white flex items-center justify-center shadow-2xs">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Create New Entry</h2>
                <p className="text-xs text-slate-400">Add a new category or campaign record</p>
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
                Campaign Title
              </label>
              <Input
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Festive Personal Loan Broadcast"
                className="w-full text-xs h-10 border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#FF6B4A]"
              />
            </div>
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
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-9 px-4 text-xs font-semibold rounded-lg bg-[#FF6B4A] hover:bg-[#E65A38] text-white shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Entry"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreateModal;
