import { getPastEventsByMonthDay } from "@/queries/past-events";
import { DatePickerClient } from "@/components/this-day-in-history/date-picker-client";
import { Calendar, Sparkles, ExternalLink, BookOpen, Globe, Clock, Hash } from "lucide-react";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getCategoryColor = (category: string) => {
  const colors = {
    war: 'text-red-600 dark:text-red-400',
    discovery: 'text-emerald-600 dark:text-emerald-400',
    politics: 'text-blue-600 dark:text-blue-400',
    science: 'text-purple-600 dark:text-purple-400',
    art: 'text-pink-600 dark:text-pink-400',
    sports: 'text-orange-600 dark:text-orange-400',
    technology: 'text-cyan-600 dark:text-cyan-400',
    medicine: 'text-green-600 dark:text-green-400',
    exploration: 'text-indigo-600 dark:text-indigo-400',
    literature: 'text-yellow-600 dark:text-yellow-400',
    music: 'text-violet-600 dark:text-violet-400',
    economy: 'text-amber-600 dark:text-amber-400',
    religion: 'text-slate-600 dark:text-slate-400',
    disaster: 'text-rose-600 dark:text-rose-400',
    revolution: 'text-orange-600 dark:text-orange-400',
    invention: 'text-teal-600 dark:text-teal-400'
  };
  return colors[category as keyof typeof colors] || 'text-slate-600 dark:text-slate-400';
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Historical Events</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            This Day in History
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Explore significant historical events that happened on {formattedDate}
          </p>
        </div>

        {/* Stats Bar */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 sm:p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="text-center sm:text-left mb-2 sm:mb-0">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {formattedDate}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {events.length} historical {events.length === 1 ? 'event' : 'events'} found
              </p>
            </div>

            {/* Date Picker */}
            <div className="w-full sm:w-auto">
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

        {/* Events List */}
        {events.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
              No Events Found
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto text-sm">
              No historical events are recorded for {formattedDate}. Try a different date!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-5">
              {events.map((event) => (
                <div key={event.id} className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-200">
                  {/* Event Content */}
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight flex-1">
                        {event.title}
                      </h3>
                      <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-slate-100 dark:bg-slate-700 ${getCategoryColor(event.category)} whitespace-nowrap`}>
                        {event.category}
                      </span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
                      {event.description}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                      <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                          <Clock className="w-3 h-3" />
                          <span className="font-medium">
                            {event.year < 0 ? `${Math.abs(event.year)} BCE` : `${event.year} CE`}
                          </span>
                        </div>
                        {event.sourceUrls && event.sourceUrls.length > 0 && (
                          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                            <Globe className="w-3 h-3" />
                            <span>
                              {event.sourceUrls.length} source{event.sourceUrls.length === 1 ? '' : 's'}
                            </span>
                          </div>
                        )}
                      </div>

                      {event.sourceUrls && event.sourceUrls.length > 0 && (
                        <a
                          href={event.sourceUrls[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-medium transition-colors"
                        >
                          View Source
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {event.tags && event.tags.length > 0 && (
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {event.tags.slice(0, 6).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-md"
                          >
                            <Hash className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                        {event.tags.length > 6 && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs rounded-md">
                            <Hash className="w-3 h-3" />
                            +{event.tags.length - 6}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";