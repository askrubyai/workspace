import { useState, useEffect, useMemo } from 'react';

const API = '';

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  next: string;
  last: string;
  status: string;
}

interface Event {
  id: string;
  type: 'research' | 'social' | 'reminder' | 'event' | 'cron';
  title: string;
  date?: string;
  time?: string;
  schedule?: string;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  detail?: string;
  recurring?: boolean;
}

interface CalendarData {
  cronJobs: CronJob[];
  recurringEvents: Event[];
  threadEvents: Event[];
  upcomingEvents: Event[];
}

const COLOR_CLASSES = {
  blue: { dot: 'bg-blue-400', bg: 'bg-blue-500/15 border-blue-500/30 text-blue-300', badge: 'bg-blue-400/20 text-blue-300' },
  green: { dot: 'bg-green-400', bg: 'bg-green-500/15 border-green-500/30 text-green-300', badge: 'bg-green-400/20 text-green-300' },
  yellow: { dot: 'bg-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300', badge: 'bg-yellow-400/20 text-yellow-300' },
  red: { dot: 'bg-red-400', bg: 'bg-red-500/15 border-red-500/30 text-red-300', badge: 'bg-red-400/20 text-red-300' },
  purple: { dot: 'bg-purple-400', bg: 'bg-purple-500/15 border-purple-500/30 text-purple-300', badge: 'bg-purple-400/20 text-purple-300' },
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

function parseRelativeDate(str: string): Date | null {
  if (!str) return null;
  str = str.trim().toLowerCase();

  const now = new Date();

  if (str.startsWith('in ')) {
    const rest = str.slice(3);
    const minsMatch = rest.match(/^(\d+)\s*m/);
    const hrsMatch = rest.match(/^(\d+)\s*h/);
    const daysMatch = rest.match(/^(\d+)\s*d/);
    if (minsMatch) return new Date(now.getTime() + parseInt(minsMatch[1]) * 60000);
    if (hrsMatch) return new Date(now.getTime() + parseInt(hrsMatch[1]) * 3600000);
    if (daysMatch) return new Date(now.getTime() + parseInt(daysMatch[1]) * 86400000);
  }

  if (str.endsWith('ago')) {
    return now; // Show as today
  }

  // Try to parse as absolute date
  try {
    const d = new Date(str);
    if (!isNaN(d.getTime())) return d;
  } catch (_) {}

  return null;
}

// Get all events for a specific date
function getEventsForDate(
  dateStr: string,
  data: CalendarData,
): Event[] {
  const events: Event[] = [];

  // Thread events (fixed dates)
  for (const e of data.threadEvents) {
    if (e.date === dateStr) events.push(e);
  }

  // Upcoming events (fixed dates)
  for (const e of data.upcomingEvents) {
    if (e.date === dateStr) events.push(e);
  }

  // Recurring events — show every day
  for (const e of data.recurringEvents) {
    const ev: Event = { ...e, date: dateStr };
    events.push(ev);
  }

  // Cron jobs with next date
  for (const job of data.cronJobs) {
    if (!job.next) continue;
    const nextDate = parseRelativeDate(job.next);
    if (nextDate && formatDateKey(nextDate) === dateStr) {
      events.push({
        id: `cron-${job.id}`,
        type: 'cron',
        title: job.name,
        date: dateStr,
        time: nextDate.toTimeString().slice(0, 5),
        color: 'yellow',
        detail: job.schedule,
      });
    }
  }

  return events;
}

// ─── Day Cell ─────────────────────────────────────────────────────────────────

function DayCell({
  date,
  isCurrentMonth,
  isToday,
  events,
  onClick,
}: {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
  onClick: () => void;
}) {
  const MAX_VISIBLE = 3;
  const visible = events.slice(0, MAX_VISIBLE);
  const overflow = events.length - MAX_VISIBLE;

  return (
    <div
      onClick={onClick}
      className={`min-h-[80px] p-1.5 border-b border-r border-border cursor-pointer transition-colors hover:bg-surface-2 ${
        isToday ? 'bg-accent/10' : isCurrentMonth ? 'bg-surface-1' : 'bg-surface-1/30'
      }`}
    >
      <div className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
        isToday
          ? 'bg-accent text-white'
          : isCurrentMonth ? 'text-text-secondary' : 'text-text-muted opacity-40'
      }`}>
        {date.getDate()}
      </div>

      <div className="space-y-0.5">
        {visible.map((e, i) => {
          const colors = COLOR_CLASSES[e.color];
          return (
            <div
              key={`${e.id}-${i}`}
              className={`text-[9px] px-1 py-0.5 rounded border truncate font-medium ${colors.bg}`}
              title={e.title}
            >
              {e.time && <span className="opacity-70 mr-0.5">{e.time}</span>}
              {e.title}
            </div>
          );
        })}
        {overflow > 0 && (
          <div className="text-[9px] text-text-muted px-1">+{overflow} more</div>
        )}
      </div>
    </div>
  );
}

// ─── Week Row ─────────────────────────────────────────────────────────────────

function WeekView({
  dates,
  data,
  onDayClick,
}: {
  dates: Date[];
  data: CalendarData;
  onDayClick: (date: Date, events: Event[]) => void;
}) {
  const today = formatDateKey(new Date());

  return (
    <div className="bg-surface-1 rounded-xl border border-border overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {dates.map(date => {
          const isToday = formatDateKey(date) === today;
          return (
            <div key={date.toISOString()} className={`p-2 text-center border-r border-border last:border-r-0 ${isToday ? 'bg-accent/10' : ''}`}>
              <div className="text-xs text-text-muted">{DAY_NAMES[date.getDay()]}</div>
              <div className={`text-sm font-semibold mt-0.5 mx-auto w-7 h-7 flex items-center justify-center rounded-full ${
                isToday ? 'bg-accent text-white' : 'text-text-primary'
              }`}>{date.getDate()}</div>
            </div>
          );
        })}
      </div>

      {/* Events */}
      <div className="grid grid-cols-7 min-h-[300px]">
        {dates.map(date => {
          const dateStr = formatDateKey(date);
          const isToday = dateStr === today;
          const events = getEventsForDate(dateStr, data);
          return (
            <div
              key={date.toISOString()}
              onClick={() => onDayClick(date, events)}
              className={`p-1.5 border-r border-border-subtle last:border-r-0 cursor-pointer hover:bg-surface-2 transition-colors ${isToday ? 'bg-accent/5' : ''}`}
            >
              <div className="space-y-1">
                {events.map((e, i) => {
                  const colors = COLOR_CLASSES[e.color];
                  return (
                    <div key={`${e.id}-${i}`} className={`text-[10px] px-1.5 py-1 rounded border font-medium truncate ${colors.bg}`}>
                      {e.time && <span className="opacity-70 mr-0.5 font-mono">{e.time}</span>}
                      {e.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Day Sidebar ──────────────────────────────────────────────────────────────

function DaySidebar({
  date,
  events,
  onClose,
}: {
  date: Date;
  events: Event[];
  onClose: () => void;
}) {
  const typeLabels = {
    research: { label: 'Research', icon: '🔬' },
    social: { label: 'Social', icon: '🐦' },
    reminder: { label: 'Reminder', icon: '🔔' },
    event: { label: 'Event', icon: '📅' },
    cron: { label: 'Cron Job', icon: '⏰' },
  };

  const grouped = events.reduce((acc, e) => {
    if (!acc[e.type]) acc[e.type] = [];
    acc[e.type].push(e);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <div className="bg-surface-1 rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-semibold text-text-primary">
            {DAY_NAMES[date.getDay()]}, {MONTH_NAMES[date.getMonth()]} {date.getDate()}
          </div>
          <div className="text-xs text-text-muted">{events.length} event{events.length !== 1 ? 's' : ''}</div>
        </div>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary text-lg">✕</button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-6 text-text-muted text-sm">No events this day</div>
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped).map(([type, evts]) => {
            const { label, icon } = typeLabels[type as keyof typeof typeLabels] || { label: type, icon: '📌' };
            return (
              <div key={type}>
                <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <span>{icon}</span> {label}
                </div>
                <div className="space-y-1.5">
                  {evts.map((e, i) => {
                    const colors = COLOR_CLASSES[e.color];
                    return (
                      <div key={`${e.id}-${i}`} className={`p-2.5 rounded-lg border ${colors.bg}`}>
                        <div className="text-xs font-medium">{e.title}</div>
                        {e.time && <div className="text-[10px] opacity-70 mt-0.5 font-mono">{e.time}</div>}
                        {e.detail && <div className="text-[10px] opacity-60 mt-0.5">{e.detail}</div>}
                        {e.recurring && <div className="text-[10px] opacity-50 mt-0.5">↻ Recurring daily</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CalendarView() {
  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<{ date: Date; events: Event[] } | null>(null);

  useEffect(() => {
    fetch(`${API}/api/calendar/events`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Month grid
  const monthDates = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const dates: Date[] = [];

    // Pad with previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      dates.push(new Date(year, month, -i));
    }
    // Current month
    for (let d = 1; d <= lastDate; d++) {
      dates.push(new Date(year, month, d));
    }
    // Pad to 6 rows of 7
    while (dates.length < 42) {
      dates.push(new Date(year, month + 1, dates.length - firstDay - lastDate + 1));
    }
    return dates;
  }, [currentDate]);

  // Week dates
  const weekDates = useMemo(() => {
    const d = new Date(currentDate);
    const day = d.getDay();
    d.setDate(d.getDate() - day); // Start of week (Sunday)
    return Array.from({ length: 7 }, (_, i) => {
      const nd = new Date(d);
      nd.setDate(d.getDate() + i);
      return nd;
    });
  }, [currentDate]);

  const navigate = (dir: -1 | 1) => {
    const d = new Date(currentDate);
    if (viewMode === 'month') {
      d.setMonth(d.getMonth() + dir);
    } else {
      d.setDate(d.getDate() + dir * 7);
    }
    setCurrentDate(d);
    setSelectedDay(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(null);
  };

  const handleDayClick = (date: Date, events: Event[]) => {
    setSelectedDay({ date, events });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-text-muted gap-2">
        <span className="animate-spin text-xl">⟳</span>
        <span className="text-sm">Loading calendar…</span>
      </div>
    );
  }

  const safeData: CalendarData = data || { cronJobs: [], recurringEvents: [], threadEvents: [], upcomingEvents: [] };
  const today = formatDateKey(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-surface-1 rounded-xl border border-border p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
              <span>📅</span>
              {viewMode === 'month'
                ? `${MONTH_NAMES[currentMonth]} ${currentYear}`
                : `Week of ${MONTH_NAMES[weekDates[0].getMonth()]} ${weekDates[0].getDate()}`
              }
            </h2>

            {/* Navigation */}
            <div className="flex items-center gap-1">
              <button onClick={() => navigate(-1)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-2 text-text-muted hover:text-text-primary transition-colors text-sm">←</button>
              <button onClick={goToToday} className="px-2 py-1 text-xs bg-surface-2 hover:bg-surface-3 border border-border rounded-lg text-text-secondary transition-colors">Today</button>
              <button onClick={() => navigate(1)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-2 text-text-muted hover:text-text-primary transition-colors text-sm">→</button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Legend */}
            <div className="hidden sm:flex items-center gap-3 text-xs text-text-muted">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />Research</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />Social</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />Reminder</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Event</span>
            </div>

            {/* View toggle */}
            <div className="flex bg-surface-2 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'month' ? 'bg-accent text-white' : 'text-text-muted hover:text-text-secondary'}`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'week' ? 'bg-accent text-white' : 'text-text-muted hover:text-text-secondary'}`}
              >
                Week
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className={`grid gap-4 ${selectedDay ? 'lg:grid-cols-3' : 'grid-cols-1'}`}>
        <div className={selectedDay ? 'lg:col-span-2' : ''}>
          {viewMode === 'month' ? (
            <div className="bg-surface-1 rounded-xl border border-border overflow-hidden">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-border">
                {DAY_NAMES.map(d => (
                  <div key={d} className="p-2 text-center text-xs font-medium text-text-muted border-r border-border last:border-r-0">{d}</div>
                ))}
              </div>

              {/* Month grid */}
              <div className="grid grid-cols-7">
                {monthDates.map((date, i) => {
                  const dateStr = formatDateKey(date);
                  const isCurrentMonth = date.getMonth() === currentMonth;
                  const isToday = dateStr === today;
                  const events = getEventsForDate(dateStr, safeData);
                  return (
                    <DayCell
                      key={i}
                      date={date}
                      isCurrentMonth={isCurrentMonth}
                      isToday={isToday}
                      events={events}
                      onClick={() => handleDayClick(date, events)}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <WeekView
              dates={weekDates}
              data={safeData}
              onDayClick={handleDayClick}
            />
          )}
        </div>

        {/* Day sidebar */}
        {selectedDay && (
          <div>
            <DaySidebar
              date={selectedDay.date}
              events={selectedDay.events}
              onClose={() => setSelectedDay(null)}
            />
          </div>
        )}
      </div>

      {/* Upcoming deployments */}
      {safeData.threadEvents.length > 0 && (
        <div className="bg-surface-1 rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
            <span>🐦</span> Upcoming Thread Deployments
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {safeData.threadEvents
              .filter(e => e.date)
              .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
              .map(e => (
                <div key={e.id} className="bg-green-500/10 border border-green-500/20 rounded-lg p-2.5">
                  <div className="text-xs font-medium text-green-300 truncate">{e.title}</div>
                  <div className="text-[10px] text-green-400/70 mt-1 font-mono">{e.date}</div>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* Cron jobs list */}
      {safeData.cronJobs.length > 0 && (
        <div className="bg-surface-1 rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
            <span>⏰</span> Active Cron Jobs ({safeData.cronJobs.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {safeData.cronJobs.slice(0, 12).map(job => (
              <div key={job.id} className="flex items-center gap-2 p-2.5 bg-surface-2 border border-border rounded-lg">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  job.status === 'running' ? 'bg-green-400 animate-pulse' :
                  job.status === 'ok' ? 'bg-green-400' :
                  job.status === 'error' ? 'bg-red-400' :
                  job.status === 'idle' ? 'bg-yellow-400' :
                  'bg-text-muted'
                }`} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-text-secondary truncate">{job.name}</div>
                  <div className="text-[10px] text-text-muted truncate">{job.schedule}</div>
                  {job.next && (
                    <div className="text-[10px] text-accent/70">Next: {job.next}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
