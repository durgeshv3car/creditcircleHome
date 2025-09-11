import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrendingUp } from "lucide-react";

type LoanStatus =
  | string
  | {
      amount: number | null;
      status: string;
    };

function PartnerStatus({isOpen, close, loanDataStatus }: { 
  close: () => void;
  loanDataStatus: any;
  isOpen: boolean;
}) {
  // ✅ Render logic for different cases
  console.log("Rendering PartnerStatus with loanDataStatus:", loanDataStatus)
  const renderCashe = () => {
    if (typeof loanDataStatus.Cashe === "string") {
      if (loanDataStatus.Cashe.startsWith("http")) {
        return (
          <span className="text-green-600 font-semibold">
            Approved 
          </span>
        );
      }
      return <span>{loanDataStatus.Cashe}</span>;
    }

    if (typeof loanDataStatus.Cashe === "object") {
      return (
        <span className="text-red-600 font-semibold">
          Status: {loanDataStatus.Cashe.status} | Amount:{" "}
          {loanDataStatus.Cashe.amount ?? "N/A"}
        </span>
      );
    }

    return <span>Unknown</span>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-lg rounded-xl border-0 shadow-lg">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            Loan Data Status
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
            <p className="flex items-center gap-2">
              <strong className="text-gray-700">Status:</strong> 
              {renderCashe()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PartnerStatus;
