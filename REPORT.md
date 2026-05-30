# Full Audit Report — Startup Weekend Tracker
**Date:** May 30, 2026  
**Scope:** Bug audit + feature/enhancement audit across all files (app.js, index.html, project.html, styles.css)

---

## Executive Summary

The app has a **critical architectural flaw** that must be fixed before anything else: all projects share the same task list and the same time-tracking data. This means data is cross-contaminating between projects right now. Every other bug and feature request is secondary to this.

Beyond that, there are 3 more critical bugs, 8 high-severity bugs, 10 medium bugs, and 7 low bugs. On the feature side, 10 things from the vision are entirely absent, 9 UX gaps make the tool feel incomplete, and 3 design improvements would sharpen the experience significantly.

**Counts:**
| Severity | Bugs |
|----------|------|
| Critical | 4 |
| High | 8 |
| Medium | 10 |
| Low | 7 |
| **Total** | **29** |

| Category | Feature Findings |
|----------|-----------------|
| Missing Features | 10 |
| UX Gaps | 9 |
| Design Improvements | 3 |
| **Total** | **22** |

---

---

# PART 1 — BUGS

---

## Critical

---

### C-1 — All projects share one task list (data corruption)
**File:** `app.js` lines 653–983  
**What happens:** Every project stores its tasks in one Firebase path (`data/projectTasks`) and one localStorage key (`projectTasks`). Opening any project card loads the same global task list. Adding tasks to Project A and opening Project B shows Project A's tasks. Deleting a project via the "Delete Project" button clears this shared list, destroying every other project's tasks simultaneously.  
**Root cause:** `projectTasks` and all read/write paths use a fixed key with no project ID. The `activeProject` stored in `sessionStorage` is only used to set the title and color — it is never used to filter tasks.  
**Impact:** Data loss. All projects overwrite each other's tasks.

---

### C-2 — All projects share one time-tracking pool (data corruption)
**File:** `app.js` lines 773, 791–793  
**What happens:** `TIME_KEY` is the constant string `'projectTimeData'` — shared by every project. All projects accumulate time in the same Firebase node. Totals shown on Project A include time logged on Projects B and C.  
**Root cause:** `TIME_KEY` has no project ID suffix and `db.ref('data/projectTimeData')` is likewise a single Firebase node.  
**Impact:** All time-tracking data is cross-contaminated across projects — the central metric of "who worked how much on what" is meaningless.

---

### C-3 — Active timer session never cleared in Firebase on logout
**File:** `app.js` lines 969, 1050–1054  
**What happens:** On logout, `stopTimer()` is supposed to close the active session before `localStorage.removeItem('currentUser')` fires. But `stopTimer()` calls `getCurrentUser()` which reads from localStorage — if the logout handler's `removeItem` runs first, `getCurrentUser()` returns null and `stopTimer()` silently does nothing. The Firebase `activeSessions[user]` node is never cleared. Other team members see "Mohammed is working…" in the Partner Status panel indefinitely after he logs out.  
**Root cause:** Two event listeners on the same button (one for stop, one for logout) — their execution order depends on capture/bubble phase and is not guaranteed.  
**Impact:** Stale "partner is working" indicators permanently mislead teammates. Timer data keeps growing.

---

### C-4 — Firebase sync listener may fire before `projectTasks` is declared (crash on load)
**File:** `app.js` lines 641–653  
**What happens:** The Firebase `.on('value')` listener is registered at line ~972, but `projectTasks` is declared with `let` at line 653 — later in the same block. Because `let` is not hoisted, if the Firebase snapshot arrives (from cache) before JS execution reaches line 653, `projectTasks` is in the temporal dead zone and throws `ReferenceError`. The same issue affects the "Delete Project" button handler, which references `projectTasks` and `saveProjectTasks()` before they are declared.  
**Root cause:** Firebase async callbacks fire faster than expected on cached data; `let`/`const` temporal dead zone.  
**Impact:** Crash on project page load. Delete Project button always throws.

---

## High

---

### H-1 — `_fbSync` flag doesn't prevent re-entrant sync loops
**File:** `app.js` lines 44–54, 975–989  
**What happens:** `_fbSync` is set to `true` before a render, then immediately set back to `false` — all synchronously. If a second Firebase `.on('value')` callback fires while the first is still executing, the second resets `_fbSync = false` before the first is done, causing the first to write back to Firebase, which triggers another callback — a potential infinite write loop. Separately, if any render function triggers a user interaction that calls `save*()`, the save is silently dropped because `_fbSync` is `true`.  
**Root cause:** Single shared boolean used to guard multiple concurrent async data streams.

---

### H-2 — Starting a new timer silently discards the previous running session
**File:** `app.js` lines 935–944  
**What happens:** Clicking "Start Timer" unconditionally overwrites `activeSessions[user]` with a new session object. If the user already has a running session (e.g., they changed the task dropdown and clicked Start again), the previous session's elapsed time is permanently discarded — no completed session entry is saved.  
**Root cause:** The `startTimerBtn` handler writes directly to `activeSessions[user]` without first checking and saving an existing active session.  
**Impact:** Time logged in the first session is lost.

---

### H-3 — Quick Task project selector is hardcoded, never populated from real projects
**File:** `index.html` lines 74–78; `app.js` lines 363–388  
**What happens:** The task modal shows a static dropdown with only "Mobile App Alpha" and "Marketing Site." Projects created dynamically via the "+" button never appear here. Any task linked to a dynamic project ID (a timestamp) cannot be assigned via this dropdown.  
**Root cause:** `taskProjectSelect` is never rebuilt from the live `projects` array.  
**Impact:** Project linking for Quick Tasks is permanently broken for any project the team actually creates.

---

### H-4 — Progress bars on project cards are always 0% (feature entirely non-functional)
**File:** `app.js` lines 543–570  
**What happens:** `renderProjects()` hardcodes `width: 0%` in the progress bar template. Nothing ever updates it. Even if it tried, the underlying task data is global (C-1), so the calculation would be wrong.  
**Root cause:** `renderProjects()` never computes completion ratios from `projectTasks`.

---

### H-5 — Wrong project tasks appear live on another user's screen via Firebase sync
**File:** `app.js` lines 972–983  
**What happens:** The `data/projectTasks` Firebase listener fires for any change by any user on any project. When User A edits tasks for Project X and User B is viewing Project Y, User B's `projectTasks` is overwritten with Project X's data and the page re-renders showing the wrong project.  
**Root cause:** Direct consequence of C-1 — amplified by real-time sync.

---

### H-6 — `renderAll()` causes calendar and events list to re-render on every task change
**File:** `app.js` line 58  
**What happens:** The `watch('tasks', ...)` callback calls `renderAll()` (which redraws the week strip, monthly calendar, and events list) then calls `renderTasks()` again on top. The calendar has nothing to do with task changes — this causes visible flicker on the calendar every time a task is toggled anywhere in the app.  
**Root cause:** Over-broad render trigger.

---

### H-7 — `currentDay` is null on load; any code path reaching `renderDayDetail()` early writes `dayTodos["null"]` to Firebase
**File:** `app.js` lines 432, 457–459  
**What happens:** `currentDay` starts as `null`. Multiple event handlers call `renderDayDetail()` regardless of modal visibility. When called with `currentDay = null`, the function executes `dayTodos[null] = []` which creates a `"null"` key in `dayTodos` — and this gets persisted to both localStorage and Firebase.  
**Root cause:** No guard checking `if (!currentDay) return` at the top of `renderDayDetail()`.  
**Impact:** Pollutes the shared Firebase data store with a phantom `"null"` key that affects every team member's dayTodos object.

---

### H-8 — Duplicate `<option value="Yusuf">` in project task assignee dropdown
**File:** `project.html` lines 39–40  
**What happens:** Yusuf appears twice in the assignee dropdown on every project page. Simple HTML copy-paste error.  
**Impact:** Visible to all three users on every task they create or edit.

---

## Medium

---

### M-1 — Quick Tasks with due dates or project tags never appear on the week calendar
**File:** `app.js` lines 103–108  
**What happens:** The week strip only consults `events` and `dayTodos`. The `tasks` array (Quick Tasks) is never shown on the calendar, regardless of any date or project association.

---

### M-2 — Week label omits the year when the week spans two months
**File:** `app.js` lines 91–94  
**What happens:** A week crossing a month boundary (e.g., May 30 – Jun 5) renders as "May 30 – Jun 5" with no year. Same-month weeks correctly include the year.  
**Root cause:** The cross-month ternary branch does not append `s.getFullYear()`.

---

### M-3 — Input text from a previous day's add-form leaks into the next day's modal
**File:** `app.js` lines 441–444  
**What happens:** `openDayDetail()` resets the add-row `display` but does not clear the `value` of `dayEventInput` or `dayTodoInput`. If a user typed something and dismissed the modal without saving, that text reappears the next time they open a different day's detail.

---

### M-4 — Both add-rows (event + todo) can be open simultaneously inside the day modal
**File:** `app.js` lines 499–507, 516–525  
**What happens:** Opening the "add event" row and then the "add todo" row leaves both visible at once. Saving an event does not close the todo add-row, and vice versa.

---

### M-5 — Timer button state is wrong when "No specific task" is selected
**File:** `app.js` lines 816–824, 938  
**What happens:** When the task selector is empty, `parseInt("")` returns `NaN`. The active session is stored with `taskId: NaN`. `getTaskTotal(d, NaN)` evaluates `NaN == NaN` which is always `false`. The "tracking" highlight class is never applied to any task button, so there's no visual confirmation the timer is running.

---

### M-6 — `calOpen` and `timerCollapsed` localStorage keys are not user-specific
**File:** `app.js` lines 608, 953–967  
**What happens:** Calendar expanded/collapsed state and timer panel state are stored in localStorage without a user prefix. Switching users on the same device inherits the previous user's UI state.

---

### M-7 — Completed tasks accumulate in-place with no sorting, filtering, or separation
**File:** `app.js` lines 258–318  
**What happens:** Completed tasks stay in their original position with strikethrough styling. They are never moved to the bottom, hidden, or separated from active tasks. As tasks complete, the active work becomes visually buried.

---

### M-8 — Day todos have no owner — on a shared team calendar, nobody knows whose task is whose
**File:** `app.js`, `dayTodos` data model  
**What happens:** Day todos are stored as `{ id, text, completed }` with no `createdBy` field. When all three team members use the shared calendar, nobody can tell who added what to a given day.

---

### M-9 — `eventModal` inputs are not cleared when the modal is dismissed via backdrop click
**File:** `app.js` lines 236–244  
**What happens:** Backdrop click closes the modal without clearing `eventTitleInput.value` or `eventDateInput.value`. Partial text from a cancelled entry persists into the next modal open (if opened via backdrop re-click vs. the `addEventBtn` which does clear them).

---

### M-10 — Firebase sync registers before authentication check — renders data before login completes
**File:** `app.js` lines 39–61  
**What happens:** `attachMainSync()` runs immediately on `DOMContentLoaded`, before `checkAuth()`. Firebase listeners fire and call `renderAll()`, `renderTasks()`, and `renderProjects()` while the login overlay may still be showing. Benign today (main app `div` has `display:none`), but a minor security gap if the overlay is ever removed early.

---

## Low

---

### L-1 — Delete button on project cards is invisible on mobile (hover-only reveal)
**File:** `styles.css` lines 1409–1432  
**What happens:** `.project-delete-btn { color: transparent }` hides the ✕ glyph until the parent card is hovered. Touch screens have no hover state — the delete button is permanently invisible on mobile.

---

### L-2 — `--font-sans` CSS variable is used but never defined in `:root`
**File:** `styles.css` line 1033  
**What happens:** `font-family: var(--font-sans)` silently falls back to system sans-serif. Visual inconsistency.

---

### L-3 — `project.html` flashes "Mobile App Alpha" before JS overwrites the title
**File:** `project.html` line 68; `app.js` lines 633–636  
**What happens:** The static placeholder "Mobile App Alpha" is visible for a brief flash on load before `DOMContentLoaded` fires and JS replaces it with the real project name.

---

### L-4 — "0 of 0 tasks complete" shows on empty projects — no zero state
**File:** `project.html` line 71; `app.js` lines 665–669  
**What happens:** `updateProjectProgress()` renders "0 of 0 tasks complete" when there are no tasks. Should say something like "No tasks yet" instead.

---

### L-5 — `project.html` browser tab always shows "Startup Weekend Tracker"
**File:** `project.html` `<title>` tag  
**What happens:** The tab title never changes to the actual project name. On desktop with multiple tabs open, there's no way to distinguish them.  
**Fix:** One line — `document.title = activeProj.name + ' — Startup Weekend'` after loading `activeProj` from sessionStorage.

---

### L-6 — Event inputs not cleared after a partial failed save
**File:** `app.js` lines 236–244  
**What happens:** If the user enters a title but no date, `saveNewEvent()` returns early without clearing the title input. The stale text stays if the modal is opened again via the backdrop path.

---

### L-7 — `renderAll()` is called by Firebase sync before login state is verified
**File:** `app.js` lines 56–61  
**What happens:** Same as M-10. Wasted render cycles on load; minor security concern if auth state changes.

---

---

# PART 2 — FEATURES & ENHANCEMENTS

---

## Missing Features (Not Built Yet)

---

### F-1 — Project HTML Brief viewer / uploader / replacer
**Current state:** Completely absent. No file panel, no upload input, no iframe, nothing.  
**What it should do:** Each project's detail page needs a "Brief" section. If no brief is attached: show an upload button. If one exists: show View (render HTML full-screen in an iframe), Replace (upload new file), and Remove buttons. Store HTML content in Firebase Storage or as a blob URL in Realtime DB per project ID.  
**Why it matters:** This is the team's institutional memory. Passive projects are just names without their brief — there's no way to remember what was built on that Friday or where to pick up.  
**Complexity:** Medium (one day)

---

### F-2 — Personal "How am I doing" dashboard
**Current state:** Absent. No personal health summary exists anywhere.  
**What it should do:** A compact "Your Week" panel on the main page, personalized to the logged-in user. Show: completion rate (tasks done / assigned this week), overdue count (framed gently — "2 things waiting on you"), time logged this week across all projects, daily activity streak ("Active 4 of the last 7 days"). Tone must be encouraging, not punishing — progress shown as achievement, not deficit.  
**Why it matters:** This is the first and most important use case in the vision. Without it, the app is a project organizer, not a personal work health tool.  
**Complexity:** Medium (one day)

---

### F-3 — Teammate progress visibility
**Current state:** The M, E, Y avatars in the header are purely decorative — clicking them does nothing.  
**What it should do:** Clicking an avatar switches the dashboard to that person's view — their assigned tasks across all projects, their time logged, their completion rate. Or, a "Team" section on the main page showing all three people's stats side by side at a glance (one row per person).  
**Why it matters:** Visibility enables load balancing. "If Eyad is overwhelmed, Mohammed can pick up tasks" — this is impossible without a way to see Eyad's state.  
**Complexity:** Medium (one day)

---

### F-4 — Project ownership / assigned owner
**Current state:** No `owner` field exists on the project data model. Projects have only `id`, `name`, `color`.  
**What it should do:** Add an `owner` field. Show the owner's avatar badge on the project card and in the project header. Allow reassigning ownership from the project page. Ownership is accountability, not exclusivity — anyone can still work on any project.  
**Why it matters:** Without ownership, when a project stalls there's no designated person responsible. The Friday session tradition ends by assigning an owner — the app should capture this.  
**Complexity:** Simple (hours)

---

### F-5 — Friday session origin / "born on" date
**Current state:** No `createdAt` or origin tracking on projects. Data model is `{ id, name, color }` — nothing else.  
**What it should do:** Store `createdAt: Date.now()` when a project is created (one line). Display the creation date on the project card ("Born May 30") and in the project header. Optionally, mark it as a "Friday Session" origin if created on a Friday.  
**Why it matters:** The Friday session is the origin story of every project. "What Friday did this come from?" is a real question the team asks. It also distinguishes old passive projects from recent ones at a glance.  
**Complexity:** Simple (hours)

---

### F-6 — Active vs. passive project status
**Current state:** No `status` field on projects. All projects look identical. The dashboard header says "Active Projects" but includes everything.  
**What it should do:** Add a `status` field (`active` / `passive`). On the dashboard, group passive projects below active ones with reduced opacity and a "Paused" badge. A quick toggle on the project card or project page switches status.  
**Why it matters:** With many Friday-born projects accumulating, the dashboard becomes undifferentiated noise. Active work gets buried. The team explicitly does not delete paused projects — they need a visual distinction.  
**Complexity:** Simple (hours)

---

### F-7 — Task due dates (hard and loose)
**Current state:** No due date field on tasks anywhere. The task model is `{ id, text, assignee, projectId, completed, subtasks }` — no date field.  
**What it should do:** Tasks should optionally have a due date and a type: hard (flagged visually with a red date chip, surfaces in overdue count) or loose (shown as a muted date label, no alarm). Hard overdue tasks should feel urgent; loose overdue tasks should not.  
**Why it matters:** Without due dates, "overdue" is not computable — one of the four personal health metrics (overdue tasks) cannot exist. A task list without time commitment is just a backlog with no accountability.  
**Complexity:** Medium (one day)

---

### F-8 — Task assignment visible across the team
**Current state:** The `assignee` field exists on project tasks but is never surfaced in the team view or personal dashboard. There's no way to see "tasks assigned to Eyad" across projects.  
**What it should do:** Once the personal dashboard and teammate views exist (F-2, F-3), tasks should be filterable/viewable by assignee across all projects. This is the backbone of load balancing.  
**Why it matters:** Cross-project task assignment visibility is what turns three people working in parallel into an integrated team.  
**Complexity:** Simple (hours) — dependent on F-2 and F-3 being built first.

---

### F-9 — Task dependencies / blockers
**Current state:** No dependency model. No way to mark a task as blocked by another.  
**What it should do:** Allow a task to be marked "blocked by" another task (by ID). Show a visual lock/chain indicator on blocked tasks. Surface blocker information in the teammate view — "Eyad is blocked waiting on Mohammed's task."  
**Why it matters:** The team does integrated work with real hand-offs. Blockers found in conversation instead of the tool means coordination overhead.  
**Complexity:** Complex (days)

---

### F-10 — Friday session event type on the calendar
**Current state:** Fridays are styled with an amber date number (a nice touch). But there's no special event type for the weekly build session itself.  
**What it should do:** A "Friday Session" recurring event type that appears automatically on every Friday in the calendar. When clicked, shows what was built that Friday (linking to the project born that day). Makes the team's ritual visible in the tool.  
**Why it matters:** The Friday session is the heartbeat of the team. Making it visible reinforces identity and connects the calendar to the project lifecycle.  
**Complexity:** Medium (one day)

---

## UX Gaps

---

### U-1 — Progress bars on project cards are always 0%
**Current state:** Hardcoded at `width: 0%` — the most visible indicator of project health on the dashboard shows nothing.  
**What it should do:** Compute completion ratio from the project's tasks and animate the bar to the real value.  
**Note:** Requires C-1 to be fixed first (tasks must be per-project).  
**Complexity:** Simple (hours) — once C-1 is done, this is two lines.

---

### U-2 — Quick Task project selector is hardcoded and broken
**Current state:** The task modal shows only "Mobile App Alpha" and "Marketing Site" — static values that do not match real Firebase projects.  
**What it should do:** Rebuild the project dropdown dynamically from the `projects` array after data loads, the same way the time tracker populates its task list.  
**Complexity:** Simple (hours)

---

### U-3 — Day todos have no assignee — shared calendar is anonymous
**Current state:** Day todos are `{ id, text, completed }` — no `createdBy` field.  
**What it should do:** Auto-stamp `createdBy: getCurrentUser()` on creation. Display a small assignee tag in the day detail view.  
**Complexity:** Simple (hours)

---

### U-4 — Logout may not stop the timer (race condition)
**Current state:** Two event listeners on the logout button (stop timer + clear auth) — their order is not guaranteed. If auth clears first, `getCurrentUser()` returns null and the timer session stays open in Firebase forever.  
**What it should do:** The logout handler should call `stopTimer()` synchronously before clearing `currentUser` from localStorage.  
**Complexity:** Simple (hours)

---

### U-5 — Mobile: project task row overflows on small screens
**Current state:** The task row's right side can contain up to 6 elements (assignee tag, time chip, timer, notes, edit, delete) — this overflows at 375px with no wrapping.  
**What it should do:** On mobile, hide or collapse secondary actions (edit, notes) behind a tap-to-reveal interaction, or wrap them to a second line. Assignee and time chip are primary; action buttons are secondary.  
**Complexity:** Simple (hours)

---

### U-6 — Delete button on project cards is invisible on mobile
**Current state:** `color: transparent` makes the ✕ invisible until CSS `:hover` — which never fires on touch screens.  
**What it should do:** On touch devices, the delete button should be always-visible (perhaps at reduced opacity) or revealed by a long-press / swipe interaction.  
**Complexity:** Simple (hours)

---

### U-7 — Timer contribution totals show raw numbers with no visual comparison
**Current state:** Mohammed: 2h 30m, Eyad: 45m, Yusuf: — shown as isolated numbers with no relative sense.  
**What it should do:** A small proportional bar under or alongside the totals showing each person's share of total project time. One visual that replaces three isolated numbers with a ratio.  
**Why it matters:** The vision says "if one person is carrying a project alone, that becomes visible." Numbers don't make imbalance viscerally obvious — a visual bar does.  
**Complexity:** Simple (hours)

---

### U-8 — Project cards show almost no useful information
**Current state:** Color dot, name, "Tap to manage tasks" (generic), 0% progress bar. Nothing actionable at a glance.  
**What it should do:** Once underlying data is fixed: task count (e.g., "4 of 9 tasks done"), owner avatar, status badge (Active/Paused), creation date. The card should be a status view, not just a navigation button.  
**Note:** Requires C-1, F-4, F-5, F-6 first.  
**Complexity:** Medium (one day) — dependent on architecture fixes

---

### U-9 — No empty state / onboarding for first-time use
**Current state:** Empty projects list shows only a small italic "No projects yet." — no explanation of what the app does or what to do first.  
**What it should do:** A richer empty state: "Your Friday projects live here. Create your first one." — with a visual placeholder and possibly a brief hint about the workflow.  
**Complexity:** Simple (hours)

---

## Design Improvements

---

### D-1 — Duplicate Yusuf in project task assignee dropdown
**File:** `project.html` lines 39–40  
**What it is:** Yusuf appears twice in the assignee `<select>`. Simple copy-paste error. One line to delete.  
**Complexity:** Simple (minutes)

---

### D-2 — `project.html` browser tab title never updates
**File:** `project.html` `<title>` tag  
**What it is:** The tab always shows "Startup Weekend Tracker" regardless of which project is open. Confusing with multiple tabs.  
**Fix:** `document.title = activeProj.name + ' — Startup Weekend'` — one line.  
**Complexity:** Simple (minutes)

---

### D-3 — Completed tasks stay in-place, burying active work
**Current state:** No sorting, filtering, or separation. Completed tasks accumulate with strikethrough exactly where they were created.  
**What it should do:** Completed tasks should either move to the bottom of the list automatically, or be togglable to hide/show via a filter toggle.  
**Complexity:** Simple (hours)

---

---

# PART 3 — RECOMMENDED ACTION ORDER

The bugs and features are not independent — fixing the architecture unlocks everything else.

## Phase 1 — Architecture (do first, everything depends on this)
| # | Item | Why now |
|---|------|---------|
| C-1 | Scope project tasks per project ID | All task features are broken until this is done |
| C-2 | Scope time data per project ID | All time features are broken until this is done |
| C-4 | Fix temporal dead zone crash on project page | App crashes on load |
| H-8 | Add guard `if (!currentDay) return` to `renderDayDetail()` | Corrupts shared Firebase data |

## Phase 2 — Critical UX correctness (do before adding any new features)
| # | Item |
|---|------|
| C-3 | Fix logout not stopping timer |
| H-2 | Fix start timer discarding previous session |
| H-3 | Populate Quick Task project dropdown dynamically |
| H-4 | Fix progress bars (flows from C-1 being done) |
| U-4 | Fix logout race condition (same as C-3) |
| D-1 | Remove duplicate Yusuf option |
| D-2 | Update project page tab title |

## Phase 3 — Vision features (build in this order)
| # | Item | Why this order |
|---|------|---------------|
| F-6 | Active / passive project status | Needed before everything else — changes what renders |
| F-5 | Friday session origin / createdAt date | One line, massive value |
| F-4 | Project ownership | One field, enables accountability |
| U-1 | Progress bars (now works after C-1) | Instant visual payoff |
| U-8 | Rich project cards | Pulls in F-4, F-5, F-6 |
| F-2 | Personal dashboard ("how am I doing") | Core use case #1 |
| F-3 | Teammate visibility | Core use case #2 |
| F-7 | Task due dates (hard + loose) | Enables overdue detection for F-2 |
| F-1 | Project HTML brief viewer / uploader | Core use case #3 |
| F-8 | Task assignment visibility across projects | Depends on F-2/F-3 |

## Phase 4 — Polish and future
| # | Item |
|---|------|
| U-5, U-6 | Mobile layout fixes |
| U-7 | Timer contribution bar |
| D-3 | Sort/filter completed tasks |
| U-3 | Day todos with assignee |
| F-10 | Friday session calendar event type |
| M-2 | Week label year fix |
| F-9 | Task dependencies (complex — plan separately) |
| All remaining M/L bugs | Background cleanup |

---

*This report was generated by two independent agents — one focused exclusively on bugs, one on features — then synthesized. The vision.md file in this directory should be read alongside this report to understand the "why" behind every priority.*
