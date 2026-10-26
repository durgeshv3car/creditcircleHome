import { singleLoans } from "@/app/(protected)/services/loans/api";
import React, { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TrendingUp,
  FileText,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  ExternalLink,
  ShieldCheck,
  Percent,
  Calendar,
  IndianRupee,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LoanDataStatus {
  status?: string;
  amount?: number;
  tenure?: number;
  interestRate?: number;
  emi?: number;
  url?: string;
  [key: string]: any;
}

interface LoanData {
  id: string;
  loanDataStatus: {
    [key: string]: string | LoanDataStatus;
  };
}

interface Partner {
  id: string;
  name: string;
  status: string;
  details: LoanDataStatus | null;
}

interface PartnerStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id?: string;
  phoneNumber?: string;
}

// Memoized loan card component
const LoanCard = React.memo(function LoanCard({ loan }: { loan: Partner }) {
  const isApproved =
    loan.status?.toLowerCase().includes("approved") ||
    loan.status?.toLowerCase().includes("exist");
  const isRejected = loan.status?.toLowerCase().includes("rejected");
  const isPending = !isApproved && !isRejected;

  const hasMetrics =
    loan.details &&
    (loan.details.amount ||
      loan.details.tenure ||
      loan.details.interestRate ||
      loan.details.emi);

  const redirectUrl =
    loan.details?.url ||
    (typeof loan.details?.status === "string" &&
    loan.details.status.includes("http")
      ? loan.details.status
      : null);

  return (
    <div className="bg-white hover:bg-slate-50/60 border border-slate-200/90 hover:border-orange-300 rounded-lg shadow-2xs hover:shadow-xs p-5 transition-all duration-200 group">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-md bg-[#0B1740] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-slate-900 text-sm tracking-tight capitalize truncate">
                {loan.name}
              </h4>
              <span className="px-2 py-0.2 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200/70">
                Partner
              </span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">
              Ref: #{loan.id.slice(-8).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs transition-all whitespace-nowrap",
              isApproved &&
                "bg-emerald-50 text-emerald-700 border-emerald-200/90",
              isRejected &&
                "bg-rose-50 text-rose-700 border-rose-200/90",
              isPending &&
                "bg-amber-50 text-amber-700 border-amber-200/90"
            )}
          >
            {isApproved && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            )}
            {isRejected && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
            {isPending && <Clock className="w-3.5 h-3.5 text-amber-600" />}
            <span className="capitalize">{loan.status}</span>
          </span>
        </div>
      </div>

      {/* Financial Details Grid if available */}
      {hasMetrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 mt-2">
          {loan.details?.amount != null && (
            <div className="bg-slate-50/90 rounded-md p-2.5 border border-slate-100/90">
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                <IndianRupee className="w-2.5 h-2.5" />
                <span>Amount</span>
              </div>
              <span className="font-extrabold text-slate-800 text-xs">
                ₹{Number(loan.details.amount).toLocaleString("en-IN")}
              </span>
            </div>
          )}
          {loan.details?.tenure != null && (
            <div className="bg-slate-50/90 rounded-md p-2.5 border border-slate-100/90">
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                <Calendar className="w-2.5 h-2.5" />
                <span>Tenure</span>
              </div>
              <span className="font-extrabold text-slate-800 text-xs">
                {loan.details.tenure} Months
              </span>
            </div>
          )}
          {loan.details?.interestRate != null && (
            <div className="bg-slate-50/90 rounded-md p-2.5 border border-slate-100/90">
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                <Percent className="w-2.5 h-2.5" />
                <span>Interest</span>
              </div>
              <span className="font-extrabold text-slate-800 text-xs">
                {loan.details.interestRate}% p.a.
              </span>
            </div>
          )}
          {loan.details?.emi != null && (
            <div className="bg-slate-50/90 rounded-md p-2.5 border border-slate-100/90">
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                <IndianRupee className="w-2.5 h-2.5" />
                <span>Monthly EMI</span>
              </div>
              <span className="font-extrabold text-slate-800 text-xs">
                ₹{Number(loan.details.emi).toLocaleString("en-IN")}/mo
              </span>
            </div>
          )}
        </div>
      )}

      {/* Partner Link if available */}
      {redirectUrl && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-end">
          <a
            href={redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>View Partner Application</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
});

function PartnerStatusModal({
  open,
  onOpenChange,
  phoneNumber,
}: PartnerStatusModalProps) {
  const [selected, setSelected] = useState<string>("all");
  const [loans, setLoans] = useState<LoanData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!phoneNumber || !open) return;

    let isMounted = true;
    setLoading(true);
    setLoans([]);

    const fetchData = async () => {
      try {
        const res = await singleLoans(String(phoneNumber));
        if (isMounted) {
          if (Array.isArray(res?.data)) {
            setLoans(res.data);
          } else if (res?.data) {
            setLoans([res.data]);
          } else {
            setLoans([]);
          }
        }
      } catch (error) {
        console.error("Error fetching loans:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [phoneNumber, open]);

  // Memoized loan grouping
  const { groupedLoans, loanTypes } = useMemo(() => {
    const grouped = loans.reduce((acc, data) => {
      if (!data.loanDataStatus) {
        return acc;
      }

      Object.entries(data.loanDataStatus).forEach(([key, value]) => {
        const type = key.toLowerCase();
        if (!acc[type]) {
          acc[type] = [];
        }
        if (!acc["all"]) {
          acc["all"] = [];
        }

        let status = "Pending";
        let loanDetails: LoanDataStatus | null = null;

        if (typeof value === "object" && value !== null) {
          loanDetails = value as LoanDataStatus;
          if ("status" in value && typeof value.status === "string") {
            status = value.status;
          }
        } else if (typeof value === "string") {
          if (value.includes("User")) {
            status = value;
          } else if (value.includes("http")) {
            status = "Approved";
            loanDetails = { url: value };
          } else {
            status = value;
          }
        }

        const loanItem: Partner = {
          id: data.id,
          name: key,
          status,
          details: loanDetails,
        };

        acc[type].push(loanItem);
        acc["all"].push(loanItem);
      });
      return acc;
    }, {} as Record<string, Partner[]>);

    return {
      groupedLoans: grouped,
      loanTypes: ["all", ...Object.keys(grouped).filter((k) => k !== "all")],
    };
  }, [loans]);

  const selectedLoans = useMemo(() => {
    const key = (selected || "all").toLowerCase();
    return groupedLoans[key] || [];
  }, [selected, groupedLoans]);

  const approvedCount = useMemo(() => {
    const all = groupedLoans["all"] || [];
    return all.filter(
      (l) =>
        l.status.toLowerCase().includes("approved") ||
        l.status.toLowerCase().includes("exist")
    ).length;
  }, [groupedLoans]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] rounded-lg border border-slate-200/90 shadow-2xl bg-white flex flex-col p-6 overflow-hidden">
        <DialogHeader className="pb-4 border-b border-slate-100 flex-none">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-[#101E4E] text-white flex items-center justify-center shadow-xs shrink-0">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Partner Loan Applications
                </DialogTitle>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span className="font-mono font-bold text-slate-800">
                      +91 {phoneNumber}
                    </span>
                  </span>
                  {groupedLoans["all"]?.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                      {approvedCount} Approved
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-9 h-9 rounded-full border-3 border-[#FF6B4A] border-t-transparent animate-spin" />
            <p className="text-xs font-bold text-slate-600">
              Querying partner application records...
            </p>
            <p className="text-[11px] text-slate-400">
              Checking status across integrated lender APIs
            </p>
          </div>
        ) : (
          <div className="pt-3 flex flex-col min-h-0 flex-grow">
            {/* Interactive Partner Filter Tabs */}
            {loanTypes.length > 1 && (
              <div className="flex flex-wrap items-center gap-2 mb-4 pb-1 overflow-x-auto flex-none">
                {loanTypes.map((type) => {
                  const count = groupedLoans[type]?.length || 0;
                  const isActive =
                    (selected || "all").toLowerCase() === type.toLowerCase();
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelected(type)}
                      className={cn(
                        "h-8 px-3 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs",
                        isActive
                          ? "bg-gradient-to-r from-[#FF6B4A] to-[#F48220] text-white shadow-xs"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80"
                      )}
                    >
                      <span className="capitalize">{type}</span>
                      <span
                        className={cn(
                          "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-200/70 text-slate-600"
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Cards List Section */}
            {selectedLoans && selectedLoans.length > 0 ? (
              <div className="flex-grow overflow-y-auto pr-1 space-y-3 min-h-0 max-h-[52vh]">
                {selectedLoans.map((loan, index) => (
                  <LoanCard
                    key={`${loan.id}-${loan.name}-${index}`}
                    loan={loan}
                  />
                ))}
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center py-12">
                <div className="text-center text-slate-400">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-md bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    No partner records found
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    No loan applications currently on record for {selected}.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PartnerStatusModal;