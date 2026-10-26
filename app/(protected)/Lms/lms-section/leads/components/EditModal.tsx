"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateUser } from "@/app/(protected)/services/users/api";
import { DataProps } from "../table/columns";
import {
  X,
  UserCog,
  Save,
  Loader2,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Home,
  Car,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface EditModalProps {
  id: string;
  onClose: () => void;
  tableData: DataProps[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const FIELD_GROUPS = {
  personal: {
    label: "Personal",
    icon: User,
    fields: ["firstName", "lastName", "gender", "dob", "maritalStatus", "education"],
  },
  contact: {
    label: "Contact & Address",
    icon: MapPin,
    fields: [
      "phoneNumber",
      "email",
      "houseNo",
      "streetAddress",
      "landmark",
      "city",
      "state",
      "pinCode",
    ],
  },
  financial: {
    label: "Financial",
    icon: CreditCard,
    fields: ["pan", "score", "netMonthlyIncome", "loanType", "profession"],
  },
  lifestyle: {
    label: "Demographics",
    icon: Car,
    fields: [
      "liveWith",
      "ownsFourWheeler",
      "ownsTwoWheeler",
      "earningMembers",
      "shoppingFrequency",
      "insurancePlans",
      "investmentOptions",
      "rewardInterests",
      "exploreIndiaFrequency",
      "travelAbroadFrequency",
    ],
  },
};

const getFieldIcon = (key: string) => {
  switch (key) {
    case "firstName":
    case "lastName":
    case "gender":
    case "maritalStatus":
      return User;
    case "phoneNumber":
      return Phone;
    case "email":
      return Mail;
    case "pan":
    case "score":
      return ShieldCheck;
    case "houseNo":
    case "streetAddress":
    case "landmark":
      return Home;
    case "city":
    case "state":
    case "pinCode":
      return MapPin;
    case "netMonthlyIncome":
    case "loanType":
      return CreditCard;
    case "profession":
    case "education":
      return Briefcase;
    case "ownsFourWheeler":
    case "ownsTwoWheeler":
      return Car;
    default:
      return Sparkles;
  }
};

const formatFieldLabel = (key: string) => {
  switch (key) {
    case "firstName":
      return "First Name";
    case "lastName":
      return "Last Name";
    case "phoneNumber":
      return "Phone Number";
    case "dob":
      return "Date of Birth";
    case "pan":
      return "PAN Card Number";
    case "score":
      return "Credit Score";
    case "pinCode":
      return "PIN Code";
    case "houseNo":
      return "House / Flat No.";
    case "streetAddress":
      return "Street Address";
    case "netMonthlyIncome":
      return "Net Monthly Income";
    case "loanType":
      return "Loan Type";
    case "maritalStatus":
      return "Marital Status";
    case "liveWith":
      return "Living Status";
    case "ownsFourWheeler":
      return "Owns 4-Wheeler";
    case "ownsTwoWheeler":
      return "Owns 2-Wheeler";
    case "earningMembers":
      return "Earning Members";
    case "shoppingFrequency":
      return "Shopping Frequency";
    case "rewardInterests":
      return "Reward Interests";
    case "insurancePlans":
      return "Insurance Plans";
    case "investmentOptions":
      return "Investment Options";
    case "exploreIndiaFrequency":
      return "Domestic Travel";
    case "travelAbroadFrequency":
      return "Abroad Travel";
    default:
      return key.replace(/([A-Z])/g, " $1").trim();
  }
};

const EditModal: React.FC<EditModalProps> = ({
  id,
  onClose,
  tableData,
  setRefresh,
}: EditModalProps) => {
  const router = useRouter();
  const [editedData, setEditedData] = useState<Record<string, any>>({});
  const [selectedRow, setSelectedRow] = useState<DataProps | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    if (!id) return;

    const foundRow = tableData?.find((row) => row.id === id) || null;
    setSelectedRow(foundRow);
    setEditedData(foundRow ? { ...foundRow } : {});
  }, [id, tableData]);

  const handleClose = () => {
    onClose();
    router.push("/Lms/lms-section/leads", { scroll: false });
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

    try {
      setIsSaving(true);
      const result = await updateUser(id, editedData);
      if (result.success) {
        toast.success("Lead profile updated successfully.");
        refreshData();
        handleClose();
      } else {
        toast.error("Failed to update lead data.");
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Something went wrong while updating.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!selectedRow) return null;

  const excludedKeys = new Set([
    "id",
    "action",
    "createdAt",
    "updatedAt",
    "type",
    "otp",
    "otpExpiry",
    "fcm_token",
    "jwt_token",
    "whatsApp",
    "movieGenres",
    "isCompleted",
    "LoanApplication",
    "pauseSms",
    "pauseEmail",
    "pauseWhatsapp",
  ]);

  const allEditableKeys = Object.keys(selectedRow).filter(
    (key) => !excludedKeys.has(key)
  );

  const groupedKeys = new Set(
    Object.values(FIELD_GROUPS).flatMap((g) => g.fields)
  );
  const otherKeys = allEditableKeys.filter((k) => !groupedKeys.has(k));

  const initials = `${String(editedData.firstName || "").charAt(0)}${String(
    editedData.lastName || ""
  ).charAt(0)}`.toUpperCase() || "U";

  const renderField = (key: string) => {
    const label = formatFieldLabel(key);
    const IconComponent = getFieldIcon(key);
    return (
      <div key={key} className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-slate-600 capitalize tracking-tight flex items-center gap-1.5">
          <IconComponent className="w-3.5 h-3.5 text-slate-400" />
          <span>{label}</span>
        </label>
        <div className="relative">
          <Input
            name={key}
            value={editedData[key] ?? ""}
            onChange={onInputChange}
            placeholder={`Enter ${label.toLowerCase()}...`}
            className="h-10 text-xs bg-slate-50/60 hover:bg-white focus:bg-white border-slate-200/90 focus:border-[#FF6B4A] rounded-md focus:ring-2 focus:ring-orange-500/20 shadow-2xs transition-all font-medium text-slate-800"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity animate-in fade-in-0 duration-200"
        onClick={handleClose}
      />

      {/* Slide-over Executive Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200/80 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-none bg-gradient-to-r from-slate-50/80 via-white to-orange-50/30">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-md bg-[#101E4E] text-white font-bold text-sm flex items-center justify-center shadow-md shadow-slate-900/20 shrink-0 ring-2 ring-white">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  {editedData.firstName || editedData.lastName
                    ? `${editedData.firstName || ""} ${editedData.lastName || ""}`.trim()
                    : "Edit Lead"}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF1ED] text-[#EA580C] border border-[#FFD7CC]">
                  Lead Profile
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {editedData.phoneNumber ? `+91 ${editedData.phoneNumber}` : `ID: #${id.slice(-6).toUpperCase()}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-md border border-slate-200/80 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-100 bg-slate-50/50 flex-none">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-md w-full">
              {Object.entries(FIELD_GROUPS).map(([tabKey, group]) => {
                const IconComponent = group.icon;
                return (
                  <TabsTrigger
                    key={tabKey}
                    value={tabKey}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-md text-slate-600 transition-all data-[state=active]:bg-white data-[state=active]:text-[#EA580C] data-[state=active]:shadow-xs cursor-pointer"
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{group.label}</span>
                  </TabsTrigger>
                );
              })}
              {otherKeys.length > 0 && (
                <TabsTrigger
                  value="other"
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-md text-slate-600 transition-all data-[state=active]:bg-white data-[state=active]:text-[#EA580C] data-[state=active]:shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Other</span>
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>
        </div>

        {/* Drawer Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === "personal" && (
            <div className="space-y-4 animate-in fade-in-0 duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-bold text-slate-700">
                <User className="w-4 h-4 text-[#FF6B4A]" />
                <span>Personal Identity & Demographics</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FIELD_GROUPS.personal.fields
                  .filter((key) => allEditableKeys.includes(key))
                  .map(renderField)}
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-4 animate-in fade-in-0 duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-bold text-slate-700">
                <MapPin className="w-4 h-4 text-[#FF6B4A]" />
                <span>Contact Information & Residential Address</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FIELD_GROUPS.contact.fields
                  .filter((key) => allEditableKeys.includes(key))
                  .map(renderField)}
              </div>
            </div>
          )}

          {activeTab === "financial" && (
            <div className="space-y-4 animate-in fade-in-0 duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-bold text-slate-700">
                <CreditCard className="w-4 h-4 text-[#FF6B4A]" />
                <span>Credit Score & Financial Capacity</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FIELD_GROUPS.financial.fields
                  .filter((key) => allEditableKeys.includes(key))
                  .map(renderField)}
              </div>
            </div>
          )}

          {activeTab === "lifestyle" && (
            <div className="space-y-4 animate-in fade-in-0 duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-bold text-slate-700">
                <Car className="w-4 h-4 text-[#FF6B4A]" />
                <span>Assets, Dependents & Lifestyle Habits</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FIELD_GROUPS.lifestyle.fields
                  .filter((key) => allEditableKeys.includes(key))
                  .map(renderField)}
              </div>
            </div>
          )}

          {activeTab === "other" && otherKeys.length > 0 && (
            <div className="space-y-4 animate-in fade-in-0 duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-bold text-slate-700">
                <Sparkles className="w-4 h-4 text-[#FF6B4A]" />
                <span>Additional Borrower Attributes</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherKeys.map(renderField)}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between flex-none">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Ready to save changes</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSaving}
              className="h-10 px-4 rounded-md border-slate-200/90 text-xs font-semibold text-slate-700 hover:bg-white active:scale-95 transition-all cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isSaving}
              className="h-10 px-5 rounded-md bg-gradient-to-r from-[#FF6B4A] to-[#F48220] hover:from-[#E65A38] hover:to-[#D9532F] text-white text-xs font-semibold shadow-xs hover:shadow-md hover:shadow-orange-500/25 active:scale-95 flex items-center gap-2 transition-all cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditModal;
