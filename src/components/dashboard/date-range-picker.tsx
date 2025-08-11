
"use client";

import * as React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isSameMonth,
  isSameYear,
  startOfDay,
  endOfDay,
} from "date-fns";
import { Calendar as CalendarIcon, RotateCcw } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
}

export function DateRangePicker({
  className,
  date,
  setDate,
  minDate,
  maxDate,
}: DateRangePickerProps) {

  const getDisplayString = () => {
    if (!date?.from) {
      return <span>Pick a date range</span>;
    }

    if (
      minDate &&
      maxDate &&
      date.to &&
      isSameDay(date.from, minDate) &&
      isSameDay(date.to, maxDate)
    ) {
      return "All time";
    }

    if (date.to && isSameMonth(date.from, date.to) && isSameYear(date.from, date.to)) {
      const firstDay = startOfMonth(date.from);
      const lastDay = endOfMonth(date.to);
      if (isSameDay(date.from, firstDay) && isSameDay(date.to, lastDay)) {
        return format(date.from, "MMMM yyyy");
      }
    }

    if (date.to) {
      return (
        <>
          {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
        </>
      );
    }

    return format(date.from, "LLL dd, y");
  };

  const handleReset = () => {
    setDate({ from: minDate, to: maxDate });
  };
  
  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    if (!selectedDate?.from) {
      setDate(undefined);
      return;
    }
    const from = startOfDay(selectedDate.from);
    const to = selectedDate.to ? endOfDay(selectedDate.to) : endOfDay(selectedDate.from);
    setDate({ from, to });
  };


  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size="sm"
            className={cn(
              "w-auto justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="truncate">{getDisplayString()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex items-center justify-end p-2 border-b">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    onClick={handleReset}
                  >
                    <RotateCcw className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset to All Time</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={1}
              fromDate={minDate}
              toDate={maxDate}
            />
        </PopoverContent>
      </Popover>
    </div>
  );
}
