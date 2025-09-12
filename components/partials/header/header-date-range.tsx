"use client";

import React from 'react';
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";

export function HeaderDateRange() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);

  // Load saved dates from localStorage on component mount
  React.useEffect(() => {
    const startDate = localStorage.getItem('startDate');
    const endDate = localStorage.getItem('endDate');
    
    if (startDate && endDate && !dateRange) {
      setDateRange({
        from: new Date(startDate),
        to: new Date(endDate)
      });
    }
    
  }, [dateRange]);

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
      localStorage.setItem('startDate', formatDate(range.from));
      localStorage.setItem('endDate', formatDate(range.to));

      console.log('Selected date range:', {
        from: formatDate(range.from),
        to: formatDate(range.to),
        duration: `${duration} days`
      });
    }
  };

  const handleReset = () => {
    localStorage.removeItem('startDate');
    localStorage.removeItem('endDate');
    setDateRange(undefined);
    window.location.reload(); 
  };

  return (
    <div className="flex items-center gap-2">
      <DateRangePicker 
        className="w-auto"
        onDateRangeChange={handleDateRangeChange}
        value={dateRange}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleReset}
        className="whitespace-nowrap"
      >
        Reset Date
      </Button>
    </div>
  );
}
