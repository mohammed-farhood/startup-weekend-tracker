# Handoff — Startup Weekend Tracker (for the next brain)

You are taking over an ongoing build. Read this top to bottom before touching anything.
Also read `vision.md` (the "why") and `REPORT.md` (the original audit). The user treats
you as **the brain/architect** — they want you to design well and drive; they run the muscle.

---

## 0. CRITICAL ENVIRONMENT FACTS (don't trip on these)

- **Real project dir:** `/Users/farhood/Desktop/codes/startup weekend ` — **note the TRAILING SPACE.**
  There is a decoy sibling `/Users/farhood/Desktop/codes/startup weekend` (no space) that contains
  only a stray `styles.css` and is **not a git repo**. Always quote the path. Working in the wrong
  folder silently does nothing.
- **Stack:** plain static `index.html` + `project.html` + `app.js` + `styles.css`. No build step.
  Firebase Realtime Database (compat SDK) for sync + Firebase Auth for login. Deployed on Vercel.
- **It's a 3-person team OS** (Mohammed, Eyad, Yusuf) for running many projects + a weekly Friday
  "build something A→Z" ritual. Tone must be encouraging, never punishing (see vision.md).
- **Design system:** "Editorial Amber." Tokens in `styles.css :root`: `--bg #FAF7F2`,
  `--surface #F0E9DD`, `--accent #C2620E`, `--accent-deep #9B4E0B`, `--accent-glow`, `--border`,
  `--color-text-muted`, `--ease-out-expo: cubic-bezier(0.16,1,0.3,1)`. Fonts: Cormorant Garamond
  (display, italic) + Instrument Sans (body). Flat at rest, shadow only on hover, no left-border
  color stripes. New UI must look native to this.

## 1. DEPLOY + LOGINS

- **Deploy to prod (same URL every time):** from the project dir run `vercel --prod --yes`.
  Stable alias: **https://startup-weekend-pied.vercel.app**. CLI is already authed (mohammed-farhood),
  project linked in `.vercel/`. `node --check app.js` before every commit/deploy.
- **Logins** (username box is case-insensitive; it maps name → `<name>@startupweekend.app` Firebase Auth):
  - `MOHAMMED` / `mohammed2003`
  - `EYAD` / `eyad2001`
  - `YUSUF` / `yusuf2004`
- Firebase Auth accounts + RTDB rules (`auth != null`) are already set up in the console.
  Rules file: `database.rules.json`. Setup notes: `SECURITY_SETUP.md`.

## 2. DATA MODEL / FROZEN SCHEMA (Firebase RTDB under `data/`)

Main page (`index.html`):
- `data/events` (array), `data/tasks` (array, "Quick Tasks"), `data/dayTodos` (object keyed by date),
  `data/savedProjects` (array). localStorage mirrors each.
- `savedProjects` item: `{ id, name, color, status:'active'|'passive', owner, createdAt, idea, pitchedBy }`.

Per-project (written by `project.html`, READ on dashboard for cards/dashboards) — keyed by `String(project.id)`:
- `data/projectTasksByProject/<pid>` = array of
  `{ id, text, assignee:'Mohammed'|'Eyad'|'Yusuf'|''(floating), completed, completedAt:<ms>|null,
     notes, dueDate:'YYYY-MM-DD'|null, dueType:'hard'|'loose'|null, blockedBy:<taskId>|null }`
- `data/projectTimeByProject/<pid>` = `{ sessions:[{id,user,taskId,taskName,duration,endedAt}],
     activeSessions:{MOHAMMED,EYAD,YUSUF} }`
- `data/projectBriefByProject/<pid>` = `{ html, filename, updatedAt, updatedBy }` (HTML stored as string;
  capped at 800KB; `// TODO: move to Firebase Storage`).
- `data/projectRoadmapByProject/<pid>` = `{ tiers:[ { id, title, steps:[ { id, title, done } ] } ] }`.
  localStorage `roadmap_<pid>`. **This is the active feature area — see §4.**
- Legacy un-namespaced `data/projectTasks` / `data/projectTimeData` were intentionally NOT migrated;
  left in place, recoverable. New per-project nodes start empty.

## 3. INVARIANTS / GOTCHAS (violate these and you create bugs)

1. **`_fbSync` write-lock + try/finally.** Saves do `if (!_fbSync) db.ref(...).set(...)`. Firebase
   listeners set `_fbSync=true` before applying remote data so the echo isn't re-written. EVERY
   `_fbSync=true … render … _fbSync=false` window MUST be wrapped in `try/finally` (it now is, in 3
   places). A render throwing inside an unguarded window strands `_fbSync=true` → ALL writes silently
   stop → "deletes come back like never done." If you add a new listener that flips `_fbSync`, guard it.
2. **Listeners gated behind auth.** With `auth != null` rules, attaching a `data/*` listener before
   sign-in gets permission-denied AND cancelled (won't recover). So `attachMainSync()` and
   `attachProjectSync()` (project page) are called only from `firebase.auth().onAuthStateChanged`,
   and each uses `.off()` before `.on()` so logout→login re-subscribes. Don't attach `data/*` listeners
   at top level.
3. **`currentUser` contract.** Everything reads `localStorage.getItem('currentUser')` as UPPERCASE.
   Auth sets it on sign-in, clears on sign-out. Never break this.
4. **IDs are strings** (`uid()` = base36 time+random). Compare with `==`, never `parseInt`.
5. **Escape user text** into innerHTML: `esc()` (main scope) / `escH()` (project block). Always.
6. **No top-level Firebase reads/writes besides via the gated attach functions.**

## 4. OPEN TASKS (priority order) — what the user wants next

### TASK A — Make the Roadmap directly interactive (THE BIG ONE the user just asked for)
Current state (just shipped, works but basic): `project.html` has a Roadmap section; `app.js` project
block has `renderRoadmap()`, `saveRoadmap()`, `roadmapStats()`, an `#addTierBtn` handler, and a
delegated `#roadmap` click handler. Adding a tier/step currently uses **`prompt()`** dialogs — the user
finds this clunky and wants **direct manipulation on the map itself**:
- "I can add NOT from the plus. I can press on the LINE and add things." → Clicking on the journey
  path/rail (or a hover-revealed "+" affordance along the line / at the end of a tier's steps) should
  **insert a step inline at that position** with an in-place text input (no popup).
- Adding a tier should likewise be inline (e.g. a ghost "add tier" node at the bottom of the map, or
  clicking the rail), not a separate round button + prompt.
- **Inline rename:** click a tier/step title to edit it in place (input swap or contenteditable),
  blur/Enter to save, Esc to cancel.
- Keep it a beautiful journey "map" (tiers = numbered milestone stations, steps = nodes on a vertical
  rail; done = amber-filled ✓, first-unfinished = pulsing "you are here", future = muted). The visual
  is already styled in `project.html`'s `<style>` (classes `rm-tier`, `rm-tier-badge`, `rm-steps`,
  `rm-node`, `rm-step.done/current/future`, `rm-here`). Build the interactivity ON this.
- Data model stays the same (`{tiers:[{id,title,steps:[{id,title,done}]}]}`). Only the editing UX changes.
- Persist via `saveRoadmap()` (already write-lock-safe). Re-render via `renderRoadmap()`.
- The `+ Tier` button (now `.roadmap-add-btn`, layout fixed) can stay as a secondary affordance or be
  removed once inline-add exists — user's call; lean toward inline-first.
- **Design note:** the "press on the line to add" affordance should feel discoverable but quiet — e.g.
  a thin insertion indicator + "+" that appears on hover over the rail between nodes, and a persistent
  faint "add step" ghost node at the end of each tier's list.

### TASK B — Quick wins / known debt
- Roadmap add inputs were `prompt()` — replaced by Task A's inline forms (supersedes this).
- `projectBriefByProject` stores HTML in RTDB (800KB cap). Eventually move to Firebase Storage
  (`// TODO` is in `handleBriefUpload`). Storage rules needed if so.
- The Team Pulse, command center, Your Week, Friday engine were built against the schema but only
  lightly browser-tested. If the user reports oddities, verify: completion/overdue math, weekly
  `endedAt` windows (Saturday-start week via `getWeekStart()`), Friday event landing on right day.

### TASK C — Deferred "ambient" feature ideas the user liked (offer, don't assume)
Pick with the user. Highest beauty-to-effort first:
1. **Live presence on dashboard** — soft glow on an avatar when that person's timer is running now
   (data already in `activeSessions`).
2. Per-person 7-dot week heatmap in the Team strip.
3. Project-card "temperature" — cards warm with recent activity, cool when quiet.
4. Friday anticipation line ("Next Friday session in N days"); Pulse blooms into a week-in-review on Fri.
- The user also likes Anthropic's **MCQ-style question UI** and wants to use it eventually (idea: a
  guided Friday-session setup wizard). Parked for now — raise it when relevant.

## 5. HOW WORK HAS BEEN DONE (workflow that worked well)
Big changes were split across **parallel git worktrees** (one agent per surface, coding to the frozen
schema so merges stay clean), then merged to `master`:
- Agent A = project page (`project.html` + the `if (projectTodoList){…}` block of app.js).
- Agent B = dashboard (`index.html` + `styles.css` + app.js main code, NOT the auth region).
- Security = auth region + rules files.
Worktrees were created with `git worktree add -b agent/<name> /Users/farhood/Desktop/codes/sw-agent-<name> master`,
agents committed on their branch, then `git merge --no-edit agent/<name>` × N, `git worktree remove …`,
`git branch -d …`. The user dislikes leftover `sw-agent-*` folders — always clean them up after merging.
For a single-surface task like the roadmap redesign (all project-page), you can just edit `master`
directly (recent small fixes were done that way) — no worktree needed.

## 6. CURRENT GIT STATE
On `master`, deployed. Recent commits: write-lock try/finally fix, Blocked-by explanation, Project
Roadmap v1, Team Pulse, Firebase Auth + listener gating. Working tree may have untracked `*.backup`
and `mcp_payload.json` — ignore them. Commit message footer the user uses:
`Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
