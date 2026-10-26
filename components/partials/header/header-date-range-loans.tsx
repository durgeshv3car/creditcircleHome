"use client";

import React from 'react';
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TimerReset } from 'lucide-react';
import { cn } from "@/lib/utils";

export function HeaderDateRangeLoan() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);

  // Load saved dates from localStorage on component mount
  React.useEffect(() => {
    const startDate = localStorage.getItem('startDateLoan');
    const endDate = localStorage.getItem('endDateLoan');
    
    if (startDate && endDate && !dateRange) {
      setDateRange({
        from: new Date(startDate),
        to: new Date(endDate)
      });
    }
  }, [dateRange]);

  // Calculate the duration of current range in days
  const getRangeDuration = () => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime());
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
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // Store in localStorage
      localStorage.setItem('startDateLoan', formatDate(range.from));
      localStorage.setItem('endDateLoan', formatDate(range.to));

      console.log('Selected date range:', {
        from: formatDate(range.from),
        to: formatDate(range.to),
        duration: `${duration} days`
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
    localStorage.removeItem('startDateLoan');
    localStorage.removeItem('endDateLoan');
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

      <button
        type="button"
        onClick={decrementRange}
        disabled={!dateRange?.from || !dateRange?.to}
        aria-label="Previous date range"
        className={cn(
          "h-8.5 w-8.5 rounded-sm border border-slate-200/90 bg-white hover:bg-gradient-to-tr hover:from-blue-50/80 hover:to-indigo-50/80 hover:border-blue-300 text-slate-600 hover:text-[#2563EB] cursor-pointer shadow-sm hover:shadow-md hover:shadow-blue-500/10 transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none disabled:hover:scale-100",
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Increment Button */}
      <button
        type="button"
        onClick={incrementRange}
        disabled={!dateRange?.from || !dateRange?.to}
        aria-label="Next date range"
        className={cn(
          "h-8.5 w-8.5 rounded-sm border border-slate-200/90 bg-white hover:bg-gradient-to-tr hover:from-blue-50/80 hover:to-indigo-50/80 hover:border-blue-300 text-slate-600 hover:text-[#2563EB] cursor-pointer shadow-sm hover:shadow-md hover:shadow-blue-500/10 transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none disabled:hover:scale-100",
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={handleReset}
        disabled={!dateRange?.from || !dateRange?.to}
        aria-label="Reset date range"
        className={cn(
          "h-8.5 w-8.5 rounded-sm border border-slate-200/90 bg-white hover:bg-gradient-to-tr hover:from-rose-50/80 hover:to-orange-50/80 hover:border-rose-300 text-slate-500 hover:text-rose-600 cursor-pointer shadow-sm hover:shadow-md hover:shadow-rose-500/10 transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none disabled:hover:scale-100",
        )}
      >
        <TimerReset className="h-4 w-4" />
      </button>
    </div>
  );
}