import { singleLoans } from "@/app/(protected)/services/loans/api";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrendingUp, FileText, ChevronDown } from "lucide-react";

interface LoanDataStatus {
  status?: string;
  amount?: number;
  tenure?: number;
  interestRate?: number;
  emi?: number;
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
  console.log("Rendering loan card:", loan);
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{loan.name}</p>
            <p className="text-sm text-gray-500">ID: {loan.id}</p>
          </div>
        </div>

        <div className="text-right">
          <p
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-200 ${
              loan.status === "Approved"
                ? "bg-emerald-100 text-emerald-800 border-emerald-200 group-hover:bg-emerald-200"
                : loan.status === "Rejected"
                ? "bg-rose-100 text-rose-800 border-rose-200 group-hover:bg-rose-200"
                : "bg-amber-100 text-amber-800 border-amber-200 group-hover:bg-amber-200"
            }`}
          >
            {loan.status}
          </p>
        </div>
      </div>

    </div>
  );
});

function PartnerStatusModal({ open, onOpenChange, phoneNumber }: PartnerStatusModalProps) {
  const [selected, setSelected] = useState<string>("");
  const [loans, setLoans] = useState<LoanData[]>([]);
  const [loading, setLoading] = useState(true);

  // Memoize handlers
  const handleSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
  }, []);

  useEffect(() => {
    if (!phoneNumber || !open) return;

    let isMounted = true;
    setLoading(true);
    setLoans([]); // Reset loans when modal opens

    const fetchData = async () => {
      try {
        console.log("Fetching data for phone:", phoneNumber);
        const res = await singleLoans(String(phoneNumber));
        console.log("API response:", res);
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
  console.log("Processing loans:", loans);
  const grouped = loans.reduce((acc, data) => {
    if (!data.loanDataStatus) {
      console.log("No loanDataStatus for:", data);
      return acc;
    }

    Object.entries(data.loanDataStatus).forEach(([key, value]) => {
      const type = key.toLowerCase();
      if (!acc[type]) {
        acc[type] = [];
      }
      if (!acc["all"]) {
        acc["all"] = []; // ensure "all" group exists
      }

      let status = "Pending";
      let loanDetails: LoanDataStatus | null = null;

      console.log(`Processing ${type} loan:`, value);

      if (typeof value === "object" && value !== null) {
        loanDetails = value as LoanDataStatus;
        if ("status" in value && typeof value.status === "string") {
          status = value.status;
        }
      } else if (typeof value === "string") {
        if (value.includes("User")) {
          status = value;
        } else {
          status = "Approved";
        }
      }

      const loanItem = {
        id: data.id,
        name: key,
        status,
        details: loanDetails,
      };

      acc[type].push(loanItem);
      acc["all"].push(loanItem); // add loan to "all" as well
    });
    return acc;
  }, {} as Record<string, Partner[]>);

  return {
    groupedLoans: grouped,
    loanTypes: ["all", ...Object.keys(grouped).filter(k => k !== "all")],
  };
}, [loans]);


  const selectedLoans = useMemo(() => 
    selected ? groupedLoans[selected.toLowerCase()] || [] : []
  , [selected, groupedLoans]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] rounded-3xl border-0 shadow-2xl bg-white flex flex-col">
        <DialogHeader className="pb-4 border-b border-gray-100 flex-none">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            Partner Status
          </DialogTitle>
          <p className="text-base text-gray-600 font-medium mt-2">
            Phone: {phoneNumber}
          </p>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-gray-600 flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full animate-bounce"></div>
              Loading content...
            </div>
          </div>
        ) : (
          <div className="pt-2 flex flex-col min-h-0 flex-grow">
            {/* Dropdown */}
            <div className="flex-none mb-6">
              <div className="relative">
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 pr-10 bg-white text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
                  value={selected}
                  onChange={handleSelectChange}
                >
                  <option value="">Select Partner Type</option>
                  {loanTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Cards - Scrollable Section */}
            {selectedLoans && selectedLoans.length > 0 && (
              <div className="flex-grow overflow-hidden flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-4 flex-none">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selected.toUpperCase()} Loans
                  </h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {selectedLoans.length} items
                  </span>
                </div>
                
                <div className="overflow-y-auto flex-grow pr-2 space-y-3">
                  {selectedLoans.map((loan, index) => (
                    <div
                      key={`${loan.id}-${index}`}
                      style={{ 
                        animationDelay: `${index * 50}ms`,
                        animation: 'fadeInUp 0.3s ease-out forwards'
                      }}
                    >
                      <LoanCard loan={loan} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selected && selectedLoans.length === 0 && (
              <div className="flex-grow flex items-center justify-center py-12">
                <div className="text-center text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No {selected} loans found</p>
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