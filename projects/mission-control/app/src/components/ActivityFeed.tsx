import { useTasks } from '../hooks/useTasks';
import { useState, useRef, useEffect, useCallback } from 'react';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

const actionIcons: Record<string, string> = {
  completed: '✅',
  published: '📝',
  started: '🚀',
  heartbeat: '💓',
  commented: '💬',
  assigned: '👤',
  blocked: '🚫',
  updated: '📝',
};

const PAGE_SIZE = 30;

export function ActivityFeed() {
  const { activity, loading, error } = useTasks();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const visibleActivity = activity.slice(0, visibleCount);
  const hasMore = visibleCount < activity.length;

  const loadMore = useCallback(() => {
    if (hasMore) {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, activity.length));
    }
  }, [hasMore, activity.length]);

  // Reset visible count when activity changes significantly
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activity.length]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Activity Feed</h2>
        {activity.length > 0 && (
          <span className="text-xs text-text-muted">
            {visibleCount < activity.length 
              ? `${visibleCount} of ${activity.length}` 
              : `${activity.length} events`}
          </span>
        )}
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-text-muted">Loading activity...</p>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-danger/10 border border-danger/20 rounded-xl p-4">
          <p className="text-sm text-danger font-medium">⚠️ Error loading activity</p>
          <p className="text-xs text-text-muted mt-1">{error}</p>
        </div>
      )}
      
      {/* Activity List */}
      {!loading && !error && (
        <>
          {activity.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-text-muted">No recent activity</p>
              <p className="text-xs text-text-muted mt-1">Activity updates in real-time as agents work</p>
            </div>
          ) : (
            <div className="space-y-0">
              {visibleActivity.map((item, i) => (
                <div key={item.id} className="flex gap-3 py-3 relative">
                  {/* Timeline line */}
                  {i < visibleActivity.length - 1 && (
                    <div className="absolute left-[15px] top-10 bottom-0 w-px bg-border-subtle" />
                  )}
                  {/* Icon */}
                  <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-sm border border-border flex-shrink-0 z-10">
                    {actionIcons[item.action] || '📌'}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-semibold text-accent">{item.agent}</span>
                      <span className="text-xs text-text-muted">{item.action}</span>
                      <span className="text-[10px] text-text-muted ml-auto flex-shrink-0">{timeAgo(item.timestamp)}</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
              
              {/* Infinite scroll sentinel */}
              {hasMore && (
                <div ref={sentinelRef} className="flex items-center justify-center py-4">
                  <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin mr-2" />
                  <span className="text-xs text-text-muted">Loading more… ({activity.length - visibleCount} remaining)</span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
