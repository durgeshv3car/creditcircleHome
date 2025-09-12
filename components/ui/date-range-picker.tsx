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
  const reloadTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const handleSelect = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (onDateRangeChange) {
      onDateRangeChange(newDate);
    }
      if (newDate?.from && newDate?.to) {
    if (reloadTimeout.current) {
      clearTimeout(reloadTimeout.current);
    }
    reloadTimeout.current = setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
  };

  React.useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(date)) {
      setDate(value);
    }
  }, [value, date]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
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
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={2}
              className="flex space-x-4"
            />
            {date && (
              <div className="flex flex-col space-y-2 border-l pl-4 dark:border-gray-700">
                <h3 className="text-sm font-medium">Selected Range</h3>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p>Start: {date.from?.toLocaleDateString()}</p>
                  <p>End: {date.to?.toLocaleDateString()}</p>
                  <p>
                    Duration:{" "}
                    {date.to && date.from
                      ? `${Math.ceil(
                          (date.to.getTime() - date.from.getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} days`
                      : "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
