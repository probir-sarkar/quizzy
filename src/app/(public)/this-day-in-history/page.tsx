import { getPastEventsByMonthDay } from "@/queries/past-events";
import { DatePickerClient } from "@/components/this-day-in-history/date-picker-client";
import {
  Calendar,
  Sparkles,
  ExternalLink,
  Globe,
  Clock,
  Hash,
  History,
  Star,
  ChevronRight,
  CalendarDays,
  BookOpen
} from "lucide-react";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const getCategoryData = (category: string) => {
  const categoryData = {
    war: {
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/20",
      icon: "⚔️",
      label: "War & Conflict"
    },
    discovery: {
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      icon: "🔍",
      label: "Discovery"
    },
    politics: {
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      icon: "🏛️",
      label: "Politics"
    },
    science: {
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      icon: "🔬",
      label: "Science"
    },
    art: {
      color: "text-pink-600 dark:text-pink-400",
      bg: "bg-pink-50 dark:bg-pink-900/20",
      icon: "🎨",
      label: "Art & Culture"
    },
    sports: {
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-900/20",
      icon: "⚽",
      label: "Sports"
    },
    technology: {
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
      icon: "💻",
      label: "Technology"
    },
    medicine: {
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
      icon: "🏥",
      label: "Medicine"
    },
    exploration: {
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      icon: "🗺️",
      label: "Exploration"
    },
    literature: {
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      icon: "📚",
      label: "Literature"
    },
    music: {
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-900/20",
      icon: "🎵",
      label: "Music"
    },
    economy: {
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      icon: "💰",
      label: "Economy"
    },
    religion: {
      color: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-50 dark:bg-slate-900/20",
      icon: "⛪",
      label: "Religion"
    },
    disaster: {
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-900/20",
      icon: "🌪️",
      label: "Disaster"
    },
    revolution: {
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-900/20",
      icon: "✊",
      label: "Revolution"
    },
    invention: {
      color: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-50 dark:bg-teal-900/20",
      icon: "💡",
      label: "Invention"
    }
  };
  return (
    categoryData[category as keyof typeof categoryData] || {
      color: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-50 dark:bg-slate-900/20",
      icon: "📌",
      label: category
    }
  );
};

export default async function ThisDayInHistoryPage({ searchParams }: Props) {
  const { month, day } = await searchParams;

  // Parse the month and day from query params or use today's date
  const today = new Date();
  let selectedMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
  let selectedDay = today.getDate();

  if (month && day) {
    const parsedMonth = parseInt(month, 10);
    const parsedDay = parseInt(day, 10);
    if (parsedMonth >= 1 && parsedMonth <= 12 && parsedDay >= 1 && parsedDay <= 31) {
      selectedMonth = parsedMonth;
      selectedDay = parsedDay;
    }
  }

  // Get events for the selected date
  const events = await getPastEventsByMonthDay(selectedMonth, selectedDay);
  const formattedDate = `${monthNames[selectedMonth - 1]} ${selectedDay}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pt-32 pb-8 sm:pb-12">
        {/* Enhanced Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 shadow-lg">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Historical Time Machine</span>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
            This Day in History
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Journey through time and explore remarkable historical events that shaped our world on {formattedDate}
          </p>
        </div>

        {/* Compact Stats Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
            <CalendarDays className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-slate-900 dark:text-white">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
            <History className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-slate-900 dark:text-white">{events.length} events</span>
          </div>
          {events.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {new Set(events.map((e) => e.category)).size} categories
              </span>
            </div>
          )}
        </div>

        {/* Enhanced Date Picker */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="text-center lg:text-left">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1">📅 {formattedDate}</h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Navigate through historical events
              </p>
            </div>
            <div className="w-full lg:w-auto">
              <DatePickerClient
                selectedMonth={selectedMonth}
                selectedDay={selectedDay}
                formattedDate={formattedDate}
                monthNames={monthNames}
                today={today}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Events List */}
        {events.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="relative inline-block mb-6">
              <div className="text-6xl sm:text-7xl opacity-20">📚</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <CalendarDays className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">No Events Found</h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              No historical events are recorded for {formattedDate}. Try exploring a different date to discover
              fascinating moments from history!
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid gap-4 sm:gap-6">
              {events.map((event) => {
                const categoryData = getCategoryData(event.category);
                return (
                  <div
                    key={event.id}
                    className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden hover:shadow-xl transition-shadow duration-200"
                  >
                    {/* Accent Border */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${categoryData.bg}`} />

                    {/* Event Content */}
                    <div className="p-4 sm:p-6 lg:p-7">
                      <div className="flex flex-col gap-4">
                        {/* Header Row */}
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {event.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className="font-medium">
                                    {event.year < 0 ? `${Math.abs(event.year)} BCE` : `${event.year} CE`}
                                  </span>
                                </div>
                                {event.sourceUrls && event.sourceUrls.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>
                                      {event.sourceUrls.length} source{event.sourceUrls.length === 1 ? "" : "s"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full ${categoryData.bg} ${categoryData.color} text-xs font-semibold whitespace-nowrap shadow-md border border-white/30 dark:border-slate-600/50 backdrop-blur-sm self-start shrink-0`}
                            >
                              <span className="text-sm sm:text-base leading-none">{categoryData.icon}</span>
                              <span className="max-w-[80px] sm:max-w-[120px] truncate">{categoryData.label}</span>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                          {event.description}
                        </p>

                        {/* Tags */}
                        {event.tags && event.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {event.tags.slice(0, 6).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600"
                              >
                                <Hash className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                                <span className="truncate max-w-[100px] sm:max-w-[120px]">{tag}</span>
                              </span>
                            ))}
                            {event.tags.length > 6 && (
                              <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs rounded-full border border-slate-200 dark:border-slate-600">
                                <Hash className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />+{event.tags.length - 6}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Action Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1">
                              {[...Array(3)].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 border border-white dark:border-slate-800"
                                />
                              ))}
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                              Historical significance
                            </span>
                          </div>

                          {event.sourceUrls && event.sourceUrls.length > 0 && (
                            <a
                              href={event.sourceUrls[0]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
                            >
                              <span>Explore Source</span>
                              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer CTA */}
        {events.length > 0 && (
          <div className="mt-8 sm:mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/50 dark:border-slate-700/50">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Discover more historical moments by exploring different dates</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
