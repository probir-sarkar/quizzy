"use client";

import { Calendar, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
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

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
      {/* Navigation Controls */}
      <div className="flex items-center gap-2 justify-center sm:justify-start">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevDay}
          className="p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 h-10 w-10 rounded-lg transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700/30">
          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="font-medium text-slate-900 dark:text-white text-sm">{formattedDate}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextDay}
          className="p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 h-10 w-10 rounded-lg transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Month & Day Selectors */}
      <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
        <Select value={selectedMonth.toString()} onValueChange={handleMonthChange}>
          <SelectTrigger className="h-10 w-20 sm:w-24 text-xs sm:text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {monthNames.map((name, index) => (
              <SelectItem key={name} value={(index + 1).toString()} className="text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span>{name.slice(0, 3)}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDay.toString()} onValueChange={handleDayChange}>
          <SelectTrigger className="h-10 w-20 sm:w-24 text-xs sm:text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {Array.from({ length: getDaysInMonth(selectedMonth) }, (_, i) => i + 1).map((day) => (
              <SelectItem key={day} value={day.toString()} className="text-xs sm:text-sm">
                Day {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={selectedMonth === today.getMonth() + 1 && selectedDay === today.getDate() ? "default" : "outline"}
          size="sm"
          onClick={handleToday}
          className="h-9 px-3 text-xs sm:text-sm font-medium transition-all shadow-sm"
        >
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Today</span>
            <span className="sm:hidden">Now</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
