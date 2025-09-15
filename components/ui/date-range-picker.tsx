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

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size="sm"
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex space-x-4 p-3 bg-white dark:bg-gray-800">
            <div className="flex flex-col space-y-1 border-r pr-4 dark:border-gray-700">
              <h3 className="text-sm font-medium mb-2">Custom</h3>
              <button
                className="text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => {
                  const today = new Date();
                  handleSelect({ from: today, to: today });
                }}
              >
                Today
              </button>
              <button
                className="text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => {
                  const today = new Date();
                  const yesterday = new Date(today);
                  yesterday.setDate(yesterday.getDate() - 1);
                  handleSelect({ from: yesterday, to: yesterday });
                }}
              >
                Yesterday
              </button>
              <button
                className="text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => {
                  const today = new Date();
                  const startOfWeek = new Date(today);
                  startOfWeek.setDate(today.getDate() - today.getDay());
                  handleSelect({ from: startOfWeek, to: today });
                }}
              >
                This Week
              </button>
              <button
                className="text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => {
                  const today = new Date();
                  const lastWeekEnd = new Date(today);
                  lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
                  const lastWeekStart = new Date(lastWeekEnd);
                  lastWeekStart.setDate(lastWeekEnd.getDate() - 6);
                  handleSelect({ from: lastWeekStart, to: lastWeekEnd });
                }}
              >
                Last Week
              </button>
              <button
                className="text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => {
                  const today = new Date();
                  const last7Days = new Date(today);
                  last7Days.setDate(today.getDate() - 7);
                  handleSelect({ from: last7Days, to: today });
                }}
              >
                Last 7 Days
              </button>
              <button
                className="text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => {
                  const today = new Date();
                  const last14Days = new Date(today);
                  last14Days.setDate(today.getDate() - 14);
                  handleSelect({ from: last14Days, to: today });
                }}
              >
                Last 14 Days
              </button>
              <button
                className="text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => {
                  const today = new Date();
                  const startOfMonth = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1
                  );
                  handleSelect({ from: startOfMonth, to: today });
                }}
              >
                This Month
              </button>
              <button
                className="text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => {
                  const today = new Date();
                  const last30Days = new Date(today);
                  last30Days.setDate(today.getDate() - 30);
                  handleSelect({ from: last30Days, to: today });
                }}
              >
                Last 30 Days
              </button>
              <button
                className="text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => {
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
                }}
              >
                Last Month
              </button>
              <button
                className="text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => {
                  const today = new Date();
                  const startOfTime = new Date(2020, 0, 1); // Adjust this date as needed
                  handleSelect({ from: startOfTime, to: today });
                }}
              >
                All Time
              </button>
            </div>
            <div className="flex flex-col  w-full">
              {/* Date Inputs at Top */}
              <div className="flex space-x-4">
                <div className="flex flex-col">
                  <label className="text-xs">Start Date</label>
                  <input
                    type="date"
                    className="border rounded px-2 py-1 text-sm"
                    value={
                      tempDate?.from ? format(tempDate.from, "yyyy-MM-dd") : ""
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
                        // ensure from <= to
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

                <div className="flex flex-col">
                  <label className="text-xs">End Date</label>
                  <input
                    type="date"
                    className="border rounded px-2 py-1 text-sm"
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
                        // ensure from <= to
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

              {/* Calendar under inputs */}
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={tempDate?.from}
                selected={tempDate}
                onSelect={handleSelect}
                numberOfMonths={2}
                className="flex space-x-4"
              />
            </div>

            {tempDate && (
              <div className="flex flex-col space-y-2 border-l pl-4 dark:border-gray-700">
                <h3 className="text-sm font-medium">Selected Range</h3>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p>Start: {tempDate.from?.toLocaleDateString()}</p>
                  <p>End: {tempDate.to?.toLocaleDateString()}</p>
                  <p>
                    Duration:{" "}
                    {tempDate.to && tempDate.from
                      ? `${Math.ceil(
                          (tempDate.to.getTime() - tempDate.from.getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} days`
                      : "N/A"}
                  </p>
                </div>
              </div>
            )}
            {tempDate && (
              <div className="flex flex-col space-y-2">
                <Button size="sm" onClick={handleApply}>
                  Apply
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
