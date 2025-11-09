"use client"

import { Calendar, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

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
  const prevDayData = getPreviousDay(selectedMonth, selectedDay);
  const nextDayData = getNextDay(selectedMonth, selectedDay);

  const handleMonthChange = (month: string) => {
    const newMonth = parseInt(month)
    const maxDay = getDaysInMonth(newMonth)
    const newDay = Math.min(selectedDay, maxDay)
    window.location.href = `?month=${newMonth}&day=${newDay}`
  }

  const handleDayChange = (day: string) => {
    window.location.href = `?month=${selectedMonth}&day=${day}`
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white h-8 w-8"
        >
          <Link href={`?month=${prevDayData.month}&day=${prevDayData.day}`}>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm">
          <Calendar className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          <span className="font-medium text-slate-900 dark:text-white">
            {formattedDate}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          asChild
          className="p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white h-8 w-8"
        >
          <Link href={`?month=${nextDayData.month}&day=${nextDayData.day}`}>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Select value={selectedMonth.toString()} onValueChange={handleMonthChange}>
          <SelectTrigger className="h-8 w-[100px] text-xs">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {monthNames.map((name, index) => (
              <SelectItem key={name} value={(index + 1).toString()}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDay.toString()} onValueChange={handleDayChange}>
          <SelectTrigger className="h-8 w-14 text-xs">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: getDaysInMonth(selectedMonth) }, (_, i) => i + 1).map(day => (
              <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={selectedMonth === today.getMonth() + 1 && selectedDay === today.getDate() ? "default" : "outline"}
          size="sm"
          asChild
          className="h-8 px-2 text-xs"
        >
          <Link href="/this-day-in-history">
            <RotateCcw className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}