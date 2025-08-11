
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
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedRange, setSelectedRange] = React.useState<DateRange | undefined>(date);

  React.useEffect(() => {
    setSelectedRange(date);
  }, [date]);

  const getDisplayString = () => {
    if (!date?.from) {
      return <span>Pick a date range</span>
    }

    // All time
    if (minDate && maxDate && date.to && isSameDay(date.from, minDate) && isSameDay(date.to, maxDate)) {
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
  
  const handleDone = () => {
    setDate(selectedRange);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setSelectedRange(date); // Revert to the original date
    setIsOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
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
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selectedRange?.from}
            selected={selectedRange}
            onSelect={setSelectedRange}
            numberOfMonths={1}
            fromDate={minDate}
            toDate={maxDate}
          />
           <div className="p-2 border-t flex justify-end gap-2">
            <Button
              onClick={handleCancel}
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
             <Button
              onClick={handleDone}
              size="sm"
            >
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
