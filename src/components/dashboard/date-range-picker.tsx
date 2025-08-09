
"use client"

import * as React from "react"
import { format, startOfMonth, endOfMonth, isSameDay, isSameMonth, isSameYear } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
  maxDate
}: DateRangePickerProps) {

  const getDisplayString = () => {
    if (!date?.from) {
      return <span>Pick a date range</span>
    }

    // All time
    if (minDate && maxDate && isSameDay(date.from, minDate) && date.to && isSameDay(date.to, maxDate)) {
        return "All time";
    }

    // Full month
    if (date.to && isSameMonth(date.from, date.to) && isSameYear(date.from, date.to)) {
        const firstDay = startOfMonth(date.from);
        const lastDay = endOfMonth(date.to);
        if (isSameDay(date.from, firstDay) && isSameDay(date.to, lastDay)) {
            return format(date.from, "MMMM yyyy");
        }
    }

    // Standard range
    if (date.to) {
      return (
        <>
          {format(date.from, "LLL dd, y")} -{" "}
          {format(date.to, "LLL dd, y")}
        </>
      )
    }

    return format(date.from, "LLL dd, y");
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
              "w-full sm:w-[180px] justify-start text-left font-normal h-9",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getDisplayString()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            fromDate={minDate}
            toDate={maxDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
