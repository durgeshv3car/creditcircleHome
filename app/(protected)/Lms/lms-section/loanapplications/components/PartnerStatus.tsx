import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TrendingUp,
  Building2,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

function PartnerStatus({
  isOpen,
  close,
  loanDataStatus,
}: {
  close: () => void;
  loanDataStatus: any;
  isOpen: boolean;
}) {
  const renderPartner = (partnerKey: string) => {
    const partner = loanDataStatus?.[partnerKey];

    if (!partner) {
      return (
        <span className="text-slate-400 text-xs font-medium">No data</span>
      );
    }

    const { status, payload } = partner;
    const isApproved = String(status).toLowerCase().includes("approved");
    const isRejected = String(status).toLowerCase().includes("rejected");

    // Approved with URL
    if (isApproved && typeof payload === "string") {
      return (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approved
          </span>
          <a
            href={payload}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            <span>View</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      );
    }

    // Rejected / Pending with payload object
    if (typeof payload === "object" && payload !== null) {
      return (
        <div className="flex flex-col gap-0.5 items-end">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold",
              isRejected
                ? "bg-rose-50 text-rose-700 border border-rose-200/80"
                : "bg-slate-100 text-slate-700 border border-slate-200/80"
            )}
          >
            {isRejected && <XCircle className="w-3 h-3 text-rose-600" />}
            {String(status).toUpperCase()}
          </span>
          {payload.amount && (
            <span className="text-[11px] text-slate-500 font-mono">
              ₹{Number(payload.amount).toLocaleString("en-IN")}
            </span>
          )}
        </div>
      );
    }

    // fallback
    return (
      <span
        className={cn(
          "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold",
          isApproved && "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
          isRejected && "bg-rose-50 text-rose-700 border border-rose-200/80",
          !isApproved && !isRejected && "bg-slate-100 text-slate-700 border border-slate-200/80"
        )}
      >
        {String(status || "N/A")}
      </span>
    );
  };

  const partners = Object.keys(loanDataStatus || {});

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md rounded-lg border border-slate-200 bg-white shadow-2xl p-6">
        <DialogHeader className="pb-3 border-b border-slate-100">
          <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#101E4E] text-white flex items-center justify-center shrink-0 shadow-xs">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span>Loan Application Partner Status</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2.5 pt-3">
          {partners.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              No partner status records available.
            </div>
          ) : (
            partners.map((partner) => (
              <div
                key={partner}
                className="p-3 border border-slate-200/80 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <strong className="text-xs font-semibold text-slate-800 capitalize truncate">
                    {partner}
                  </strong>
                </div>
                <div className="shrink-0">{renderPartner(partner)}</div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PartnerStatus;
