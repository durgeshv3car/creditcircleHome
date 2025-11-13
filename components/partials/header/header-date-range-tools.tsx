"use client";

import React from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TimerReset } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeaderDateRangeTools() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined
  );

  // Load saved dates from localStorage on component mount
  React.useEffect(() => {
    const startDate = localStorage.getItem("startDateTools");
    const endDate = localStorage.getItem("endDateTools");

    if (startDate && endDate && !dateRange) {
      setDateRange({
        from: new Date(startDate),
        to: new Date(endDate),
      });
    }
  }, [dateRange]);

  // Calculate the duration of current range in days
  const getRangeDuration = () => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    const diffTime = Math.abs(
      dateRange.to.getTime() - dateRange.from.getTime()
    );
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      const duration = Math.ceil(
        (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Format dates as YYYY-MM-DD
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      // Store in localStorage
      localStorage.setItem("startDateTools", formatDate(range.from));
      localStorage.setItem("endDateTools", formatDate(range.to));

      console.log("Selected date range:", {
        from: formatDate(range.from),
        to: formatDate(range.to),
        duration: `${duration} days`,
      });
    }
  };

  // Shift date range backward (decrement)
  const decrementRange = () => {
    if (!dateRange?.from || !dateRange?.to) return;

    const duration = getRangeDuration();
    const newFrom = new Date(dateRange.from);
    const newTo = new Date(dateRange.to);

    // Move both dates backward by the duration + 1 day
    newFrom.setDate(newFrom.getDate() - duration - 1);
    newTo.setDate(newTo.getDate() - duration - 1);

    const newRange = { from: newFrom, to: newTo };
    handleDateRangeChange(newRange);
    window.location.reload();
  };

  // Shift date range forward (increment)
  const incrementRange = () => {
    if (!dateRange?.from || !dateRange?.to) return;

    const duration = getRangeDuration();
    const newFrom = new Date(dateRange.from);
    const newTo = new Date(dateRange.to);

    // Move both dates forward by the duration + 1 day
    newFrom.setDate(newFrom.getDate() + duration + 1);
    newTo.setDate(newTo.getDate() + duration + 1);

    const newRange = { from: newFrom, to: newTo };
    handleDateRangeChange(newRange);
    window.location.reload();
  };

  const handleReset = () => {
    localStorage.removeItem("startDateTools");
    localStorage.removeItem("endDateTools");
    setDateRange(undefined);
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2">
      {/* Date Range Picker */}
      <DateRangePicker
        className="w-auto"
        onDateRangeChange={handleDateRangeChange}
        value={dateRange}
      />

      <ChevronLeft
        onClick={decrementRange}
        className={cn(
          "h-6 w-6 rounded-full border border-gray-300 p-1 cursor-pointer text-primary hover:bg-gray-100",
          {
            "opacity-50 cursor-not-allowed": !dateRange?.from || !dateRange?.to,
          }
        )}
      />

      {/* Increment Button */}
      <ChevronRight
        onClick={incrementRange}
        className={cn(
          "h-6 w-6 rounded-full border border-gray-300 p-1 cursor-pointer text-primary hover:bg-gray-100",
          {
            "opacity-50 cursor-not-allowed": !dateRange?.from || !dateRange?.to,
          }
        )}
      />

      <TimerReset
        onClick={handleReset}
        className={cn(
          "h-6 w-6 rounded-full border border-gray-300 p-1 cursor-pointer text-red-600 hover:bg-gray-100",
          {
            "opacity-50 cursor-not-allowed": !dateRange?.from || !dateRange?.to,
          }
        )}
      />
    </div>
  );
}
