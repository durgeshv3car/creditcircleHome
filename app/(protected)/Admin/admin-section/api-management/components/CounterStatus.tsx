"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { fetchApiFilter } from "@/app/(protected)/services/apiManagement/api";

function CounterStatus({
  name,
  startDate,
  endDate,
}: {
  name: string;
  startDate: string;
  endDate: string;
}) {
  type FilterResponse = {
    duplicateFiltered?: { count: number; createdAt: string }[];
    approvedFiltered?: { count: number; createdAt: string }[];
    rejectedFiltered?: { count: number; createdAt: string }[];
  };

  const [counts, setCounts] = useState({
    duplicate: 0,
    approved: 0,
    rejected: 0,
  });

  async function fetchFilteredCounts() {
    try {
      const response = (await fetchApiFilter(
        name,
        startDate,
        endDate
      )) as FilterResponse;

      setCounts({
        duplicate: response.duplicateFiltered?.length ?? 0,
        approved: response.approvedFiltered?.length ?? 0,
        rejected: response.rejectedFiltered?.length ?? 0,
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  }

  useEffect(() => {
    fetchFilteredCounts();
  }, []);

  const total = counts.duplicate + counts.approved + counts.rejected;

  const statusItems = [
    {
      label: "Duplicate",
      count: counts.duplicate,
      icon: Clock,
      bgColor: "bg-gradient-to-br from-amber-50 to-yellow-50",
      iconColor: "text-amber-600",
      textColor: "text-amber-700",
      borderColor: "border-amber-200",
      percentage:
        counts.duplicate == 0
          ? 0
          : Math.round((counts.duplicate / total) * 100),
    },
    {
      label: "Approved",
      count: counts.approved,
      icon: CheckCircle2,
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
      iconColor: "text-emerald-600",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-200",
      percentage:
        counts.approved == 0 ? 0 : Math.round((counts.approved / total) * 100),
    },
    {
      label: "Rejected",
      count: counts.rejected,
      icon: XCircle,
      bgColor: "bg-gradient-to-br from-rose-50 to-red-50",
      iconColor: "text-rose-600",
      textColor: "text-rose-700",
      borderColor: "border-rose-200",
      percentage:
        counts.rejected == 0 ? 0 : Math.round((counts.rejected / total) * 100),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Overview
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{total}</div>
            <div className="text-sm text-gray-500">Total Items</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
          <div className="h-full flex rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${(counts.approved / total) * 100}%` }}
            />
            <div
              className="bg-amber-500 transition-all duration-500 ease-out"
              style={{ width: `${(counts.duplicate / total) * 100}%` }}
            />
            <div
              className="bg-rose-500 transition-all duration-500 ease-out"
              style={{ width: `${(counts.rejected / total) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-600">
          <span>{statusItems[1].percentage}% Approved</span>
          <span>{statusItems[0].percentage}% Duplicate</span>
          <span>{statusItems[2].percentage}% Rejected</span>
        </div>
      </div>

      {/* Status Cards */}
      <div className="space-y-3">
        {statusItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`${item.bgColor} ${item.borderColor} border rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group cursor-pointer`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "fadeInUp 0.5s ease-out forwards",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg bg-white/70 group-hover:bg-white transition-colors duration-200`}
                  >
                    <Icon className={`h-5 w-5 ${item.iconColor}`} />
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium text-base">
                      {item.label}
                    </span>
                    <div className="text-xs text-gray-600">
                      {item.percentage}% of total
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`${item.textColor} text-2xl font-bold group-hover:scale-110 transition-transform duration-200 inline-block`}
                  >
                    {item.count}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CounterStatusModal({
  name,
  startDate,
  endDate,
}: {
  name: string;
  startDate: string;
  endDate: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium flex items-center gap-2 group">
          <Calendar className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
          View Status
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg rounded-3xl border-0 shadow-2xl bg-white">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            Status Report
          </DialogTitle>
          <p className="text-base text-gray-600 font-medium flex items-center gap-2 mt-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            {`${startDate} - ${endDate}`}
          </p>
        </DialogHeader>
        <div className="pt-2">
          <CounterStatus name={name} startDate={startDate} endDate={endDate} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
