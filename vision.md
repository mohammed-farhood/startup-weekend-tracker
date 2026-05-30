# Vision — Team Project Tracker

## What This Is

This started as a startup weekend coordination tool. It is no longer that — but it kept the name because the spirit is preserved.

It is now the **shared operating system for a three-person team** (Mohammed, Eyad, Yusuf) working on multiple projects simultaneously, long-term, with no fixed end date.

The name "Startup Weekend" is still alive as a **weekly tradition**: every Friday the team meets, picks an idea, and builds it from A to Z in a single session. At the end, one person is assigned to own and continue the project from there. This is how most projects are born. The app is both the tool they use to run that session and the system that manages what comes after it.

---

## The Core Problem

We have a lot going on at once:
- **Active projects** being built right now
- **Passive projects** that are half-built and paused, not abandoned — they will resume
- **Mixed types of work**: software, design, content, business, anything

The challenge is that without a shared view, the work fragments. People lose track of what they own, what's blocked, what others are doing, and which projects have momentum. We need one place that makes all of this visible, without adding bureaucratic overhead.

---

## The Primary Use Cases

### 1. "How am I doing?"
When Mohammed (or Eyad or Yusuf) opens the app, they should be able to immediately feel the state of their work. This is not just data — it needs to feel **safe and encouraging**, not punishing or guilt-inducing. The right UI here is one that motivates you to act, not one that makes you feel behind.

The metrics that matter:
- **Completion rate** — what fraction of my tasks are done?
- **Overdue tasks** — what did I commit to that hasn't happened yet?
- **Time logged** — how much have I actually put in recently?
- **Daily activity streak** — am I showing up consistently?

All four matter together. Someone logging lots of time but completing nothing needs a different nudge than someone with a great streak but a few overdue tasks.

### 2. "How are my teammates doing?"
Same view, but for Eyad and Yusuf. Transparency here is not surveillance — it's alignment. If Eyad is overwhelmed, Mohammed can pick up tasks. If Yusuf has stalled on something, the team can unblock him. Visibility is how a small team stays integrated.

### 3. "What is this project about?"
Every project has an **HTML brief file** — a beautiful, designed document explaining the project: its purpose, direction, current state. These already exist for many projects. The app needs a place in each project's page where you can:
- **View** the HTML brief (open it in-place or full screen)
- **Replace** it (upload a new HTML file if the brief changes)
- **Delete** it (if the brief is outdated and a new one isn't ready yet)

Each team member can do this. There's no single owner of the brief — the project's understanding evolves, and anyone can update it.

### 4. "Who is working on what, and how much?"
Per project, you should be able to see which team members are contributing, how much time they've logged, and what tasks they own. This enables natural load balancing — if one person is carrying a project alone, that becomes visible.

---

## Project Lifecycle

### Origin: The Friday Session
Most projects are born on a Friday. The team meets, picks an idea, and builds it from zero in one session — A to Z. By the end of Friday, something exists: a working prototype, a design, a deployed page, something real. Then one person is assigned as the **project owner** and takes it from there.

This means every project has a birth moment with a story behind it. The app should eventually surface this — what Friday it came from, who built it, what the original idea was.

### Active
Currently being worked on post-Friday. The assigned owner is pushing it forward. Tasks are being added, time is being logged, there's momentum.

### Passive (Paused)
Half-built. Not dead — will resume. These should still be visible but clearly deprioritized. The brief file is especially important here: it's the "what we were doing" record for when we come back to it.

There is no "archived" or "deleted" in the typical sense — we don't delete projects, we pause them.

---

## Task Model

Tasks exist at the project level. They can be:
- **Assigned to one person** with a clear owner
- **Picked up by anyone** when floating/unassigned
- **Dependent on another task** — some work is blocked until something else is done

Due dates are a mix:
- Some are **hard** — missing them has real consequences
- Some are **loose** — directional, not strict

The interface needs to respect this distinction: hard-deadline overdue tasks should feel urgent; loose-date tasks should not.

Subtasks exist and matter — a task is often not a single action but a small tree of steps.

---

## Collaboration Model

Work is integrated. "Helping each other" means:
- Someone finishes their part and hands off to the next person (dependency)
- Someone picks up a floating task because they have bandwidth
- Someone reviews or contributes to another person's work

Every project has a designated **owner** (assigned at the end of the Friday session or later). The owner is responsible for the project's direction and progress. But ownership doesn't mean exclusivity — anyone can work on any project. The owner is the accountable person, not the only person.

In the future: formally surface the owner in the UI, and allow the team to reassign ownership when a project changes hands.

---

## Device & Usage Context

Used equally on **phone and laptop**. Mobile use tends to be quick glances and status checks. Laptop use tends to be actual task management and time logging. Both must work well — no feature should be desktop-only.

---

## Tone & Feel

This is not a corporate PM tool. It's a personal team tool for three people who know each other well and are building real things together.

The UI should feel:
- **Encouraging, not punishing** — progress shown in a way that motivates
- **Clear, not cluttered** — every number visible means something
- **Trustworthy** — data is always in sync (Firebase) and nothing is lost
- **Crafted** — we care about how things look; this tool represents us

The Editorial Amber design system already captures this. New features follow those principles.

---

## Why Understanding This Matters for Bugs

Bugs in this app are not just broken code. They break trust:
- A task marked complete but still showing as overdue = someone feels misrepresented
- Time not syncing = a team member's effort is invisible
- Wrong progress percentage = someone feels more behind than they are

Every bug should be evaluated against: **does this make someone feel unfairly behind, or make someone's work invisible?** If yes, it's high priority regardless of technical severity.

---

## Features Roadmap (Not Yet Built)

- Project brief HTML viewer / uploader / replacer per project
- Per-person contribution view inside each project
- Formal project assignment / ownership
- Dependency linking between tasks across team members
- Dashboard "health" view across all active projects at once
- Notifications or nudges for overdue tasks (gentle, not alarming)
