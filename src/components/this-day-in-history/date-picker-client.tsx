"use client";

import { ChevronLeft, ChevronRight, RotateCcw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, usePathname } from "next/navigation";

interface DatePickerClientProps {
  selectedMonth: number;
  selectedDay: number;
  formattedDate: string;
  monthNames: string[];
  today: Date;
}

// ✅ Always use 29 days for February
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const getDaysInMonth = (month: number) => DAYS_IN_MONTH[month - 1];

// Calculate previous/next date without involving year
const getDateOffset = (month: number, day: number, offset: number) => {
  let newDay = day + offset;
  let newMonth = month;
  const maxDays = getDaysInMonth(month);

  if (newDay < 1) {
    newMonth = month === 1 ? 12 : month - 1;
    newDay = getDaysInMonth(newMonth);
  } else if (newDay > maxDays) {
    newMonth = month === 12 ? 1 : month + 1;
    newDay = 1;
  }

  return { month: newMonth, day: newDay };
};

export function DatePickerClient({
  selectedMonth,
  selectedDay,
  formattedDate,
  monthNames,
  today
}: DatePickerClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const prevDay = getDateOffset(selectedMonth, selectedDay, -1);
  const nextDay = getDateOffset(selectedMonth, selectedDay, 1);

  const navigateToDate = (month: number, day: number) => {
    const params = new URLSearchParams();
    params.set("month", month.toString());
    params.set("day", day.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleMonthChange = (month: string) => {
    const newMonth = parseInt(month, 10);
    const maxDay = getDaysInMonth(newMonth);
    navigateToDate(newMonth, Math.min(selectedDay, maxDay));
  };

  const handleDayChange = (day: string) => {
    navigateToDate(selectedMonth, parseInt(day, 10));
  };

  const handlePrevDay = () => navigateToDate(prevDay.month, prevDay.day);
  const handleNextDay = () => navigateToDate(nextDay.month, nextDay.day);
  const handleToday = () => router.push(pathname);

  const stepButton =
    "flex h-11 w-11 cursor-pointer items-center justify-center border-2 border-foreground bg-background transition-colors hover:bg-foreground hover:text-background";

  return (
    <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-2 sm:justify-start">
        <button type="button" onClick={handlePrevDay} aria-label="Previous day" className={stepButton}>
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 border-2 border-foreground bg-card px-3.5 py-2.5">
          <Calendar className="h-4 w-4" aria-hidden />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.14em]">{formattedDate}</span>
        </div>

        <button type="button" onClick={handleNextDay} aria-label="Next day" className={stepButton}>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Month & Day Selectors */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
        <Select value={selectedMonth.toString()} onValueChange={handleMonthChange}>
          <SelectTrigger className="h-11 w-24 border-2 border-foreground font-mono text-xs font-bold uppercase tracking-[0.1em]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {monthNames.map((name, index) => (
              <SelectItem key={name} value={(index + 1).toString()} className="font-mono text-xs uppercase">
                {name.slice(0, 3)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDay.toString()} onValueChange={handleDayChange}>
          <SelectTrigger className="h-11 w-20 border-2 border-foreground font-mono text-xs font-bold">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {Array.from({ length: getDaysInMonth(selectedMonth) }, (_, i) => i + 1).map((day) => (
              <SelectItem key={day} value={day.toString()} className="font-mono text-xs">
                Day {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={selectedMonth === today.getMonth() + 1 && selectedDay === today.getDate() ? "default" : "outline"}
          size="sm"
          onClick={handleToday}
          className="h-11 cursor-pointer border-2 border-foreground px-3 font-mono text-xs font-bold uppercase tracking-[0.14em]"
        >
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Today</span>
            <span className="sm:hidden">Now</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
