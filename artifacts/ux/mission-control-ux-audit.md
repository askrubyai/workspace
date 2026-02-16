# Mission Control Frontend — UX Audit
**Date:** 2026-02-14 03:32 IST  
**Reviewer:** Shuri (Product Analyst)  
**Version:** v1 (localhost:5174)  
**Context:** Overnight build, mobile-first React + Tailwind UI

---

## Executive Summary

**Overall Assessment:** 3.5/5 — Strong foundation with mobile-first design, but several critical UX gaps around data integration, loading states, and user guidance.

**Critical Issues:** 2  
**High Priority:** 4  
**Medium Priority:** 6  
**Low Priority:** 3

---

## ✅ What's Working Well

### 1. **Mobile-First Architecture**
- Bottom navigation with fixed positioning
- Horizontal scrolling for squad status and filter chips
- Touch-friendly tap targets (py-1.5, px-4)
- Responsive grid layout (grid-cols-2 on mobile)

### 2. **Visual Hierarchy**
- Clear sections (Stats → Squad → Tasks → Live Memory)
- Good use of whitespace (space-y-5, gap-3)
- Consistent color system (text-accent, bg-success, etc.)
- Status indicators with semantic colors

### 3. **Information Density**
- Stats cards provide quick overview
- Squad status shows 10 agents at a glance
- Task filtering with counts
- Live working memory preview

### 4. **Navigation UX**
- Bottom nav is familiar mobile pattern
- "View all →" links provide clear next steps
- Active state highlighting on nav items

---

## 🚨 Critical Issues

### 1. **Sample Data in Production Code**
**Location:** `Dashboard.tsx` line 25, `TaskBoard.tsx` line 17  
**Impact:** HIGH — Users see fake tasks instead of real Mission Control data

```tsx
// Dashboard.tsx
const activeAgents = agents.filter(a => a.status === 'active').length;
const inProgress = sampleTasks.filter(t => t.status === 'in_progress').length;

// TaskBoard.tsx
const [tasks] = useState(sampleTasks);
```

**Problem:**
- `sampleTasks` and `agents` are hardcoded in `data.ts`
- Real task data exists in API (`/api/status`)
- Users see disconnected sample data, not actual squad state

**Fix:**
- Replace `sampleTasks` with API-fetched data from `/api/status`
- Parse `WORKING.md` to extract actual task list
- Use real agent heartbeat data, not static status

**Severity:** CRITICAL — This defeats the entire purpose of "live" dashboard

---

### 2. **No Loading States**
**Location:** All components using `useWorkingMemory`  
**Impact:** HIGH — Users see blank/stale UI during data fetch

**Problem:**
- `useWorkingMemory` hook returns data but no loading indicator
- No skeleton screens or spinners
- On slow networks, looks broken for 1-2 seconds

**Fix:**
```tsx
const { data: workingData, loading, error } = useWorkingMemory();

if (loading) return <SkeletonDashboard />;
if (error) return <ErrorState message={error} />;
```

**Examples to implement:**
- Stats cards: Show shimmer effect while loading
- Squad status: Gray circles with pulse animation
- Task list: 3-4 skeleton task cards

**Severity:** CRITICAL — Users can't distinguish loading from broken

---

## ⚠️ High Priority Issues

### 3. **No Error Handling**
**Location:** All API-consuming components  
**Impact:** MEDIUM-HIGH — API failures show nothing useful

**Problem:**
- If backend is down, users see empty dashboard
- No retry mechanism
- No "offline mode" indicator

**Fix:**
- Add error boundary component
- Show toast notification on API failures
- Provide retry button: "Refresh data"
- Cache last successful response for offline viewing

---

### 4. **Live Memory Truncation**
**Location:** `Dashboard.tsx` line 76  
**Impact:** MEDIUM — Important information might be cut mid-sentence

```tsx
{workingData.working.slice(0, 1500)}
```

**Problem:**
- Hard 1500-char limit cuts arbitrary position
- Might slice markdown headers, lists, or code blocks
- No "read more" affordance

**Fix:**
- Truncate at nearest paragraph break (find last `\n\n`)
- Add "Read full →" link that expands or navigates
- Alternative: Show last 3 sections instead of first N chars

---

### 5. **Filter State Doesn't Persist**
**Location:** `TaskBoard.tsx` line 21  
**Impact:** MEDIUM — Users lose filter when switching tabs

**Problem:**
```tsx
const [filter, setFilter] = useState<string>('all');
```
- Filter resets on unmount (when navigating away)
- No URL params, so can't share filtered view
- Frustrating if reviewing specific status repeatedly

**Fix:**
- Use URL search params: `?status=blocked`
- Or lift filter state to App.tsx and persist
- Save to localStorage for persistence across sessions

---

### 6. **No Horizontal Scroll Indicators**
**Location:** Squad status, filter chips  
**Impact:** MEDIUM — Users might not know content is scrollable

**Problem:**
- Overflow content hidden by default
- No visual hint that scrolling is possible
- Especially bad for filter chips (might miss "Blocked")

**Fix:**
- Add fade gradient on right edge: `bg-gradient-to-r from-transparent to-surface-1`
- Or show pagination dots below scrollable area
- Or add scroll buttons (← →) for desktop

---

## 📝 Medium Priority Issues

### 7. **Empty State Lacks Guidance**
**Location:** `TaskBoard.tsx` line 46  
**Impact:** MEDIUM — Dead end for new users

```tsx
{filteredTasks.length === 0 ? (
  <div className="text-center py-12 text-text-muted">No tasks here</div>
) : (...)}
```

**Problem:**
- Message is passive ("No tasks here")
- No actionable next step
- First-time users don't know what to do

**Fix:**
- Add contextual message:
  - Inbox empty: "All caught up! 🎉"
  - Blocked empty: "No blockers right now ✨"
  - Done empty: "Complete your first task to see it here"
- Add CTA button: "Create Task" or "View All Tasks"

---

### 8. **Priority Color Legend Missing**
**Location:** `TaskBoard.tsx` (uses `priorityDot` mapping)  
**Impact:** LOW-MEDIUM — Users don't know what colors mean

**Problem:**
```tsx
const priorityDot: Record<string, string> = {
  critical: 'bg-danger',
  high: 'bg-warning',
  medium: 'bg-info',
  low: 'bg-text-muted',
};
```
- Red/yellow/blue dots shown but not explained
- New users have to guess meaning
- Not accessible (color alone isn't sufficient)

**Fix:**
- Add legend below filter chips or in header
- Use icon + color (🔴 Critical, 🟡 High, 🔵 Medium, ⚪ Low)
- Or show priority text on hover/focus

---

### 9. **Bottom Nav Spacing Mismatch**
**Location:** `App.tsx` line 36  
**Impact:** LOW — Inefficient use of space

```tsx
<main className="flex-1 overflow-y-auto pb-20">
```

**Problem:**
- Main content has 80px (pb-20) bottom padding
- Bottom nav is likely ~60px tall
- Creates 20px dead space at bottom

**Fix:**
- Measure actual nav height (inspect in browser)
- Adjust padding to match exactly (pb-16 or pb-14)
- Or use CSS variable: `padding-bottom: var(--nav-height)`

---

### 10. **Time Ago Function Lacks Precision**
**Location:** `Dashboard.tsx` line 13  
**Impact:** LOW — Users lose context on recent activity

```tsx
if (mins < 1) return 'now';
```

**Problem:**
- Everything under 60s shows as "now"
- Can't distinguish 5s ago from 55s ago
- Matters for time-sensitive tasks

**Fix:**
- Show seconds for recent items: "12s ago"
- Or use relative time with seconds: "just now", "30s ago"

---

### 11. **No Keyboard Navigation**
**Location:** All interactive elements  
**Impact:** MEDIUM — Not accessible

**Problem:**
- Bottom nav buttons work with click/tap only
- No focus styling visible
- Can't tab through task cards
- No keyboard shortcuts (j/k for navigation)

**Fix:**
- Add `:focus-visible` ring styles
- Ensure tab order is logical (top → bottom)
- Consider shortcuts: `1-4` for nav tabs, `Enter` to expand tasks

---

### 12. **No Dark Mode Toggle**
**Location:** Header  
**Impact:** LOW — Users stuck with single theme

**Problem:**
- Color system supports dark mode (`bg-surface`, `text-primary`)
- But no UI control to switch
- Hardcoded to dark theme only

**Fix:**
- Add sun/moon icon in header
- Use system preference as default
- Persist choice in localStorage

---

## 🎯 Nice-to-Have Improvements

### 13. **Agent Heartbeat Visualization**
**Idea:** Show last heartbeat time on each agent card  
**Why:** Helps debug stuck agents (e.g., "Last seen 45m ago")

### 14. **Task Search/Filter**
**Idea:** Add search bar above filter chips  
**Why:** Find specific task by title/agent quickly

### 15. **Pull-to-Refresh**
**Idea:** Mobile gesture to refresh data manually  
**Why:** Standard mobile UX pattern for live data

---

## 📊 Testing Recommendations

### Manual Testing Checklist
- [ ] Test on actual mobile device (iPhone/Android)
- [ ] Test with slow network (3G throttling)
- [ ] Test with API backend down (simulate 500 error)
- [ ] Test with empty task list (first-time user)
- [ ] Test with 50+ tasks (performance, scroll)
- [ ] Test keyboard-only navigation (no mouse)
- [ ] Test in Safari, Firefox (not just Chrome)

### Edge Cases to Test
1. **Long task titles** — Do they wrap or truncate?
2. **Many agents** — What if squad has 20 agents? Horizontal scroll breaks?
3. **Stale data** — What if WORKING.md hasn't been updated in 24h?
4. **Special characters** — Emoji in task titles, markdown in descriptions

---

## 🔧 Implementation Priority

### Phase 1: Data Integration (Critical)
1. Replace sample data with real API calls
2. Add loading states (skeletons)
3. Add error handling + retry

**Effort:** 2-3 hours  
**Impact:** Makes dashboard actually functional

### Phase 2: UX Polish (High)
1. Fix truncation in live memory preview
2. Add horizontal scroll indicators
3. Persist filter state in URL
4. Improve empty states

**Effort:** 2 hours  
**Impact:** Significantly better user experience

### Phase 3: Accessibility (Medium)
1. Add keyboard navigation
2. Add priority legend
3. Fix focus states
4. Add ARIA labels

**Effort:** 1.5 hours  
**Impact:** Makes app usable for everyone

### Phase 4: Nice-to-Haves (Low)
1. Dark mode toggle
2. Pull-to-refresh
3. Task search
4. Heartbeat visualization

**Effort:** 3 hours  
**Impact:** Delighters, not essentials

---

## 📝 Code Quality Notes

**Strengths:**
- Clean component separation
- TypeScript types defined (`types.ts`)
- Consistent naming conventions
- Good use of Tailwind utilities

**Areas for Improvement:**
- Hardcoded data in components (should be in hooks/API layer)
- Missing prop types documentation (JSDoc)
- No unit tests visible
- Magic numbers (1500, pb-20) should be constants

---

## ✅ Recommended Next Steps

1. **Immediate (today):**
   - Replace `sampleTasks` with real API data
   - Add basic loading spinner to Dashboard

2. **This week:**
   - Implement error handling
   - Fix live memory truncation
   - Add horizontal scroll indicators

3. **Next week:**
   - Manual testing on real mobile device
   - Implement Phase 3 (accessibility)

---

**Reviewer:** Shuri  
**Self-Rating:** 4/5 (comprehensive analysis, actionable recommendations, prioritized by impact)  
**Lesson Learned:** When reviewing live dashboards, always check if "sample" data is used in production. It's a common development pattern that shouldn't ship.
