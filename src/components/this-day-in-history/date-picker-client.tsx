"use client"

import { Calendar, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, usePathname } from "next/navigation"

interface DatePickerClientProps {
  selectedMonth: number
  selectedDay: number
  formattedDate: string
  monthNames: string[]
  today: Date
}

const getDaysInMonth = (month: number) => {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysInMonth[month - 1];
}

// Helper functions to calculate previous and next days
const getPreviousDay = (month: number, day: number) => {
  if (day > 1) {
    return { month, day: day - 1 };
  } else {
    // Previous day is last day of previous month
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevDay = getDaysInMonth(prevMonth);
    return { month: prevMonth, day: prevDay };
  }
};

const getNextDay = (month: number, day: number) => {
  const maxDay = getDaysInMonth(month);
  if (day < maxDay) {
    return { month, day: day + 1 };
  } else {
    // Next day is first day of next month
    const nextMonth = month === 12 ? 1 : month + 1;
    return { month: nextMonth, day: 1 };
  }
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

  const prevDayData = getPreviousDay(selectedMonth, selectedDay);
  const nextDayData = getNextDay(selectedMonth, selectedDay);

  const navigateToDate = (month: number, day: number) => {
    const params = new URLSearchParams();
    params.set('month', month.toString());
    params.set('day', day.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleMonthChange = (month: string) => {
    const newMonth = parseInt(month, 10);
    const maxDay = getDaysInMonth(newMonth);
    const newDay = Math.min(selectedDay, maxDay);
    navigateToDate(newMonth, newDay);
  };

  const handleDayChange = (day: string) => {
    navigateToDate(selectedMonth, parseInt(day, 10));
  };

  const handlePrevDay = () => {
    navigateToDate(prevDayData.month, prevDayData.day);
  };

  const handleNextDay = () => {
    navigateToDate(nextDayData.month, nextDayData.day);
  };

  const handleToday = () => {
    router.push(pathname);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
      {/* Navigation Controls */}
      <div className="flex items-center gap-2 justify-center sm:justify-start">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevDay}
          className="p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 h-10 w-10 rounded-lg transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700/30 min-w-0 flex-1 sm:flex-initial">
          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <span className="font-medium text-slate-900 dark:text-white text-sm truncate">
            {formattedDate}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextDay}
          className="p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 h-10 w-10 rounded-lg transition-all duration-200"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Date Selection Controls */}
      <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
        <Select value={selectedMonth.toString()} onValueChange={handleMonthChange}>
          <SelectTrigger className="h-10 w-[110px] sm:w-[120px] text-xs sm:text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {monthNames.map((name, index) => (
              <SelectItem key={name} value={(index + 1).toString()} className="text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-base">{index + 1}</span>
                  <span>{name.slice(0, 3)}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDay.toString()} onValueChange={handleDayChange}>
          <SelectTrigger className="h-10 w-16 sm:w-20 text-xs sm:text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {Array.from({ length: getDaysInMonth(selectedMonth) }, (_, i) => i + 1).map(day => (
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
          className="h-10 px-3 text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Today</span>
            <span className="sm:hidden">Now</span>
          </div>
        </Button>
      </div>
    </div>
  )
}