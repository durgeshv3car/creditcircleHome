"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DateRangePickerProps {
  className?: string;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  value?: DateRange | undefined;
}

export function DateRangePicker({
  className,
  onDateRangeChange,
  value,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(value);

  const handleSelect = (newDate: DateRange | undefined) => {
    setTempDate(newDate);
  };
  console.log("Temp Date:", tempDate);

  const handleApply = () => {
    setDate(tempDate);
    onDateRangeChange?.(tempDate);
    setIsOpen(false);
    if (tempDate?.from && tempDate?.to) {
      window.location.reload();
    }
  };

  const handleCancel = () => {
    setTempDate(date);
  };

  React.useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(date)) {
      setDate(value);
      setTempDate(value);
    }
  }, [value]);

  const presetOptions = [
    {
      label: "Today",
      action: () => {
        const today = new Date();
        handleSelect({ from: today, to: today });
      },
    },
    {
      label: "Yesterday",
      action: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        handleSelect({ from: yesterday, to: yesterday });
      },
    },
    {
      label: "This Week",
      action: () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        handleSelect({ from: startOfWeek, to: today });
      },
    },
    {
      label: "Last Week",
      action: () => {
        const today = new Date();
        const lastWeekEnd = new Date(today);
        lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
        const lastWeekStart = new Date(lastWeekEnd);
        lastWeekStart.setDate(lastWeekEnd.getDate() - 6);
        handleSelect({ from: lastWeekStart, to: lastWeekEnd });
      },
    },
    {
      label: "Last 7 Days",
      action: () => {
        const today = new Date();
        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 7);
        handleSelect({ from: last7Days, to: today });
      },
    },
    {
      label: "Last 14 Days",
      action: () => {
        const today = new Date();
        const last14Days = new Date(today);
        last14Days.setDate(today.getDate() - 14);
        handleSelect({ from: last14Days, to: today });
      },
    },
    {
      label: "This Month",
      action: () => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        handleSelect({ from: startOfMonth, to: today });
      },
    },
    {
      label: "Last 30 Days",
      action: () => {
        const today = new Date();
        const last30Days = new Date(today);
        last30Days.setDate(today.getDate() - 30);
        handleSelect({ from: last30Days, to: today });
      },
    },
    {
      label: "Last Month",
      action: () => {
        const today = new Date();
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        const startOfLastMonth = new Date(
          lastMonth.getFullYear(),
          lastMonth.getMonth(),
          1
        );
        const endOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0
        );
        handleSelect({ from: startOfLastMonth, to: endOfLastMonth });
      },
    },
    {
      label: "All Time",
      action: () => {
        const today = new Date();
        const startOfTime = new Date(2020, 0, 1);
        handleSelect({ from: startOfTime, to: today });
      },
    },
  ];

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            size="sm"
            variant="outline"
            className={cn(
              "h-9 w-auto min-w-[200px] justify-start text-left font-medium text-xs rounded-sm bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-orange-400 text-slate-700 shadow-sm hover:shadow-md hover:shadow-orange-500/10 transition-all duration-200 px-3 group",
              !date && "text-slate-400"
            )}
          >
            <div className="p-1 rounded-xs bg-[#FFF1ED] text-[#EA580C] mr-2 group-hover:bg-[#FF6B4A] group-hover:text-white transition-colors duration-200 flex-shrink-0">
              <CalendarIcon className="h-3.5 w-3.5" />
            </div>
            {date?.from ? (
              date.to ? (
                <span className="font-semibold text-slate-800">
                  {format(date.from, "MMM dd")} - {format(date.to, "MMM dd, y")}
                </span>
              ) : (
                <span className="font-semibold text-slate-800">{format(date.from, "MMM dd, y")}</span>
              )
            ) : (
              <span className="text-slate-500 font-medium">Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 shadow-2xl shadow-slate-900/10 border border-slate-200/90 rounded-sm overflow-hidden bg-white/95 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-200" align="end" sideOffset={8}>
          <div className="flex bg-white rounded-sm overflow-hidden">
            {/* Left Sidebar - Presets */}
            <div className="w-36 bg-slate-50/90 border-r border-slate-100 p-2.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                Quick Select
              </div>
              <div className="space-y-0.5">
                {presetOptions.map((preset) => (
                  <button
                    key={preset.label}
                    className="w-full text-left text-xs px-2.5 py-1.5 hover:bg-white hover:text-[#2563EB] hover:shadow-sm rounded-sm transition-all text-slate-700 font-medium cursor-pointer"
                    onClick={preset.action}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="p-3">
              {/* Compact Date Inputs */}
              <div className="bg-gray-50 border border-gray-200 rounded-sm p-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-600 block mb-1.5">
                      Start Date*
                    </label>
                    <input
                      type="date"
                      className="w-full text-sm border border-gray-300 rounded-sm px-3 py-2 bg-white 
                   focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] focus:outline-none
                   transition-all duration-200 hover:border-gray-400"
                      value={
                        tempDate?.from
                          ? format(tempDate.from, "yyyy-MM-dd")
                          : ""
                      }
                      onChange={(e) => {
                        const newDate = e.target.value
                          ? new Date(e.target.value)
                          : undefined;
                        setTempDate((prev) => {
                          let updated = {
                            from: newDate,
                            to: prev?.to ?? undefined,
                          };
                          if (
                            updated.to &&
                            updated.from &&
                            updated.from > updated.to
                          ) {
                            updated.to = updated.from;
                          }
                          return updated;
                        });
                      }}
                    />
                  </div>

                  <div className="pt-6 text-gray-400">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12H19M19 12L12 5M19 12L12 19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-600 block mb-1.5">
                      End Date*
                    </label>
                    <input
                      type="date"
                      className="w-full text-sm border border-gray-300 rounded-sm px-3 py-2 bg-white
                   focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] focus:outline-none
                   transition-all duration-200 hover:border-gray-400"
                      value={
                        tempDate?.to ? format(tempDate.to, "yyyy-MM-dd") : ""
                      }
                      onChange={(e) => {
                        const newDate = e.target.value
                          ? new Date(e.target.value)
                          : undefined;
                        setTempDate((prev) => {
                          let updated = {
                            from: prev?.from ?? undefined,
                            to: newDate,
                          };
                          if (
                            updated.from &&
                            updated.to &&
                            updated.to < updated.from
                          ) {
                            updated.from = updated.to;
                          }
                          return updated;
                        });
                      }}
                    />
                  </div>
                </div>

                {/* Duration Display */}
                {tempDate?.from && tempDate?.to && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500 flex items-center justify-between">
                      <span>
                        Duration:{" "}
                        {Math.ceil(
                          (tempDate.to.getTime() - tempDate.from.getTime()) /
                            (1000 * 60 * 60 * 24)
                        ) + 1}{" "}
                        days
                      </span>
                      <span className="text-green-600 font-medium">
                        ✓ Valid range
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Calendar */}
              <div className="calendar-container bg-gray-100 rounded-sm border border-gray-100 p-2">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={tempDate?.from}
                  selected={tempDate}
                  onSelect={handleSelect}
                  numberOfMonths={2}
                  className="rounded-sm"
                  classNames={{
                    months: "flex space-x-4",
                    month: "space-y-3",
                    caption:
                      "flex justify-center pt-2 pb-3 relative items-center",
                    caption_label: "text-sm font-semibold text-gray-800",
                    nav: "space-x-1 flex items-center",
                    nav_button:
                      "h-7 w-7 bg-white border border-gray-200 p-0 hover:bg-gray-50 rounded-sm shadow-sm transition-colors",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex mb-2",
                    head_cell:
                      "text-gray-500 rounded-sm w-8 font-medium text-xs text-center py-1",
                    row: "flex w-full mt-1",
                    cell: "text-center text-sm relative p-0 focus-within:relative focus-within:z-20",
                    day: "h-8 w-8 p-0 font-normal hover:bg-blue-50 hover:text-blue-600 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2",
                    day_selected:
                      "bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:text-white focus:bg-[#1D4ED8] focus:text-white shadow-sm",
                    day_today:
                      "bg-blue-50 text-blue-700 font-semibold border border-blue-200",
                    day_outside: "text-gray-300",
                    day_disabled:
                      "text-gray-300 cursor-not-allowed hover:bg-transparent",
                    day_range_middle:
                      "aria-selected:bg-[#DBEAFE] aria-selected:text-[#2563EB] hover:bg-[#BFDBFE] hover:text-[#1D4ED8]",
                    day_range_start: "rounded-l-md rounded-r-none",
                    day_range_end: "rounded-r-md rounded-l-none",
                    day_hidden: "invisible",
                  }}
                />
              </div>

              {/* Action Buttons */}
              {tempDate && (
                <div className="flex justify-end gap-2 mt-3 pt-2.5 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    className="h-8 px-3.5 text-xs rounded-sm font-medium border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleApply}
                    className="h-8 px-4 text-xs rounded-sm font-semibold bg-gradient-to-r from-[#FF6B4A] to-[#F48220] text-white shadow-md shadow-orange-500/25 hover:from-[#E65A38] hover:to-[#D9532F] transition-all"
                  >
                    Apply Range
                  </Button>
                </div>
              )}

            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
