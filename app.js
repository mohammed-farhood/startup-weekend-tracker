firebase.initializeApp({
    apiKey: "AIzaSyByoRgmpc3lrCQifZGwyNqQFuecKDZsUJk",
    authDomain: "startup-weekend-4e0a7.firebaseapp.com",
    databaseURL: "https://startup-weekend-4e0a7-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "startup-weekend-4e0a7",
    storageBucket: "startup-weekend-4e0a7.firebasestorage.app",
    messagingSenderId: "240995086945",
    appId: "1:240995086945:web:831aba1096f7cae9e0f020"
});
const db = firebase.database();

// ── Inline SVG icon system (Lucide/Feather aesthetic, stroke style) ───────────
const ICONS = {
    close:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    trash:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',
    edit:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    notes:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    timer:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="13" r="8"/><polyline points="12 9 12 13 14.5 15.5"/><path d="M5 3l4 2M19 3l-4 2M12 1v2"/></svg>',
    play:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    pause:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
    lock:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    check:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>',
    chevronLeft:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>',
    chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>',
    chevronDown:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="6 9 12 15 18 9"/></svg>',
    plus:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    spark:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    grip:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/></svg>',
    user:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    calendar:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    mapPin:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    users:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
};
function icon(name, cls) {
    return '<span class="ic' + (cls ? ' ' + cls : '') + '">' + (ICONS[name] || '') + '</span>';
}

document.addEventListener('DOMContentLoaded', () => {

    // ── Constants & element refs ──────────────────────────────────────────────
    const NAME  = { MOHAMMED: 'Mohammed', EYAD: 'Eyad', YUSUF: 'Yusuf' };
    const esc   = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const uid   = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
    const loginOverlay  = document.getElementById('loginOverlay');
    const mainApp       = document.getElementById('mainApp');

    const PROJECTS = [
        { id: 'mobile',    name: 'Mobile App',   color: '#D97706' },
        { id: 'marketing', name: 'Marketing',     color: '#7C3AED' },
        { id: 'none',      name: 'No Project',    color: '#9CA3AF' }
    ];

    // ── Data ──────────────────────────────────────────────────────────────────
    let events   = JSON.parse(localStorage.getItem('events'))   || [];
    let tasks    = JSON.parse(localStorage.getItem('tasks'))    || [];
    let dayTodos = JSON.parse(localStorage.getItem('dayTodos')) || {};
    let projects = JSON.parse(localStorage.getItem('savedProjects')) || [];
    let projectTasksByProject = {};
    let projectTimeByProject  = {};
    let projectRoadmapData    = {};
    let viewUser = null;

    let _fbSync = false;
    let fridayPlan = JSON.parse(localStorage.getItem('fridayPlan') || '{"idea":""}');

    const saveEvents   = () => { localStorage.setItem('events',        JSON.stringify(events));   if (!_fbSync) db.ref('data/events').set(events); };
    const saveTasks    = () => { localStorage.setItem('tasks',         JSON.stringify(tasks));    if (!_fbSync) db.ref('data/tasks').set(tasks); };
    const saveDayTodos = () => { localStorage.setItem('dayTodos',      JSON.stringify(dayTodos)); if (!_fbSync) db.ref('data/dayTodos').set(dayTodos); };
    const saveProjects = () => { localStorage.setItem('savedProjects', JSON.stringify(projects)); if (!_fbSync) db.ref('data/savedProjects').set(projects); };

    // ── Firebase real-time sync (main page) ───────────────────────────────────
    function attachMainSync() {
        function watch(fbKey, lsKey, assignFn, renderFn, emptyVal) {
            // `seeded` flips true once we've either received cloud data OR done the
            // one-time legacy localStorage→cloud migration. After that, a null
            // snapshot means "everything here was deleted" — we apply the empty
            // state and NEVER re-push, so a stale tab/device can't resurrect it.
            let seeded = false;
            const applyEmpty = () => {
                _fbSync = true;
                try {
                    assignFn(Array.isArray(emptyVal) ? [] : {});
                    localStorage.setItem(lsKey, JSON.stringify(emptyVal));
                    renderFn();
                } finally { _fbSync = false; }
            };
            db.ref('data/' + fbKey).off();
            db.ref('data/' + fbKey).on('value', snap => {
                const val = snap.val();
                if (val !== null) {
                    _fbSync = true;
                    try {
                        assignFn(val);
                        localStorage.setItem(lsKey, JSON.stringify(val));
                        renderFn();
                    } finally {
                        _fbSync = false;   // never let a render exception strand the write-lock
                    }
                    seeded = true;
                } else if (!seeded) {
                    // First-ever snapshot is empty: one-time seed of legacy local-only data.
                    seeded = true;
                    const local = JSON.parse(localStorage.getItem(lsKey) || 'null');
                    const hasData = local && (Array.isArray(local) ? local.length > 0 : Object.keys(local).length > 0);
                    if (hasData) db.ref('data/' + fbKey).set(local); // echoes back as non-null
                    else applyEmpty();
                } else {
                    // Cloud emptied after we had data → a real delete-all. Apply it.
                    applyEmpty();
                }
            });
        }
        if (!document.getElementById('projectTodoList')) {
            watch('events',        'events',        v => { events = v; },   renderAll, []);
            watch('tasks',         'tasks',         v => { tasks = v; },    () => { renderAll(); renderTasks(); }, []);
            watch('dayTodos',      'dayTodos',      v => { dayTodos = v; }, renderAll, {});
            watch('savedProjects', 'savedProjects', v => { projects = v; }, () => {
                renderProjects(); renderFridayTimeline(); renderCommandCenter(); renderPulse();
            }, []);
            // Friday plan sync
            db.ref('data/fridayPlan').off();
            db.ref('data/fridayPlan').on('value', snap => {
                _fbSync = true;
                try {
                    fridayPlan = snap.val() || { idea: '' };
                    localStorage.setItem('fridayPlan', JSON.stringify(fridayPlan));
                    renderFridayPlan();
                } finally { _fbSync = false; }
            });
            // Read-only listeners: written by project page, consumed here for cards + personal dashboard
            db.ref('data/projectTasksByProject').off();
            db.ref('data/projectTasksByProject').on('value', snap => {
                projectTasksByProject = snap.val() || {};
                renderProjects();
                renderYourWeek();
                renderCommandCenter();
                renderPulse();
            });
            db.ref('data/projectTimeByProject').off();
            db.ref('data/projectTimeByProject').on('value', snap => {
                projectTimeByProject = snap.val() || {};
                renderYourWeek();
                renderPulse();
            });
            db.ref('data/projectRoadmapByProject').off();
            db.ref('data/projectRoadmapByProject').on('value', snap => {
                _fbSync = true;
                try {
                    projectRoadmapData = snap.val() || {};
                    renderProjects();
                } finally {
                    _fbSync = false;
                }
            });
        }
    }

    function dateStr(y, m, d) {
        return `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    }

    // ── Week View ─────────────────────────────────────────────────────────────
    let weekOffset = 0;
    const weekStrip  = document.getElementById('weekStrip');
    const weekLabel  = document.getElementById('weekLabel');

    function getWeekDates() {
        const today = new Date(); today.setHours(0,0,0,0);
        // Sat-start week: (getDay()+1)%7 → Sat=0, Sun=1, ..., Fri=6
        const daysSinceSat = (today.getDay() + 1) % 7;
        const start = new Date(today);
        start.setDate(today.getDate() - daysSinceSat + weekOffset * 7);
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start); d.setDate(start.getDate() + i); return d;
        });
    }

    // ── Time-grid constants ───────────────────────────────────────────────────
    const WTG_HOUR_START = 6;
    const WTG_HOUR_END   = 24;  // midnight
    const WTG_HOUR_H     = 64;  // px per hour
    const WTG_HOURS      = Array.from({ length: WTG_HOUR_END - WTG_HOUR_START }, (_, i) => WTG_HOUR_START + i);
    const WTG_3H         = new Set([6, 9, 12, 15, 18, 21, 24]); // 3-hour block boundaries
    const WTG_SNAP       = 15;  // snap resolution in minutes

    function wtgFmtHour(h) {
        const h24 = h % 24;
        if (h24 === 0)  return '12 AM';
        if (h24 < 12)  return h24 + ' AM';
        if (h24 === 12) return '12 PM';
        return (h24 - 12) + ' PM';
    }

    function openEventModalPrefilled(ds, hour, mins, durMins) {
        if (eventTitleInput) eventTitleInput.value = '';
        if (eventDateInput)  eventDateInput.value  = ds;
        if (eventTimeInput)  eventTimeInput.value  = String(hour % 24).padStart(2,'0') + ':' + String(mins).padStart(2,'0');
        if (eventPlaceInput) eventPlaceInput.value = '';
        _pendingDuration = durMins || null;
        if (eventModal) eventModal.style.display = 'flex';
        setTimeout(() => { if (eventTitleInput) eventTitleInput.focus(); }, 50);
    }

    // ── Quick-create menu (Event | Task) ─────────────────────────────────────
    function showWtgQuickMenu(ds, h, m, clickX, clickY, durMins) {
        document.querySelectorAll('.wtg-quick-menu').forEach(el => el.remove());
        const dur = durMins || 180;
        const menu = document.createElement('div');
        menu.className = 'wtg-quick-menu';
        menu.style.cssText = `position:fixed;top:${clickY}px;left:${clickX}px;`;
        menu.innerHTML = `
            <button class="wtg-qm-btn wtg-qm-event">${icon('calendar','sm')} Event</button>
            <div class="wtg-qm-div"></div>
            <button class="wtg-qm-btn wtg-qm-task">${icon('check','sm')} Task</button>`;
        document.body.appendChild(menu);

        menu.querySelector('.wtg-qm-event').addEventListener('click', e => {
            e.stopPropagation(); menu.remove();
            openEventModalPrefilled(ds, h, m, dur);
        });

        menu.querySelector('.wtg-qm-task').addEventListener('click', e => {
            e.stopPropagation();
            const timeStr = String(h % 24).padStart(2,'0') + ':' + String(m).padStart(2,'0');
            // Switch menu to expanded task card
            menu.classList.add('wtg-task-card');
            // Clamp to viewport after layout reflow
            requestAnimationFrame(() => {
                const r = menu.getBoundingClientRect();
                if (r.right  > window.innerWidth  - 8) menu.style.left = (parseFloat(menu.style.left) - (r.right  - window.innerWidth  + 8)) + 'px';
                if (r.bottom > window.innerHeight - 8) menu.style.top  = (parseFloat(menu.style.top)  - (r.bottom - window.innerHeight + 8)) + 'px';
                if (r.left < 8) menu.style.left = (parseFloat(menu.style.left) + 8 - r.left) + 'px';
                if (r.top  < 8) menu.style.top  = (parseFloat(menu.style.top)  + 8 - r.top)  + 'px';
            });
            let tcAssignee = null, tcTs = false, tcPrio = null;
            menu.innerHTML = `
                <input class="wtg-tc-input" type="text" placeholder="Task name…" autocomplete="off">
                <div class="wtg-tc-row">
                    <span class="wtg-tc-label">Assign</span>
                    <button class="wtg-tc-av av-m" data-u="Mohammed">M</button>
                    <button class="wtg-tc-av av-e" data-u="Eyad">E</button>
                    <button class="wtg-tc-av av-y" data-u="Yusuf">Y</button>
                    <span style="margin-left:auto;font-size:0.65rem;color:var(--text-faint)">optional</span>
                </div>
                <div class="wtg-tc-row" style="padding-top:4px;">
                    <button class="wtg-tc-ts-btn">${icon('timer','sm')} Time-sensitive</button>
                </div>
                <div class="wtg-tc-deadline-row">
                    <input type="date" class="wtg-tc-date" placeholder="Deadline">
                    <div class="wtg-tc-prio-row">
                        <span class="task-prio-row-label" style="font-size:0.65rem;">Priority</span>
                        <button class="task-prio-btn" data-p="red"    title="High"></button>
                        <button class="task-prio-btn" data-p="yellow" title="Medium"></button>
                        <button class="task-prio-btn" data-p="green"  title="Low"></button>
                    </div>
                </div>
                <div class="wtg-tc-actions">
                    <button class="wtg-tc-cancel">Cancel</button>
                    <button class="wtg-qm-save" style="padding:5px 12px;">${icon('check','sm')}</button>
                </div>`;

            const inp = menu.querySelector('.wtg-tc-input');
            inp.focus();

            // Assignee avatars
            menu.querySelectorAll('.wtg-tc-av').forEach(btn => {
                btn.addEventListener('click', ev => {
                    ev.stopPropagation();
                    const pick = btn.dataset.u;
                    tcAssignee = (tcAssignee === pick) ? null : pick;
                    menu.querySelectorAll('.wtg-tc-av').forEach(b => b.classList.remove('active'));
                    if (tcAssignee) btn.classList.add('active');
                });
            });

            // Time-sensitive toggle
            menu.querySelector('.wtg-tc-ts-btn').addEventListener('click', ev => {
                ev.stopPropagation();
                tcTs = !tcTs;
                menu.querySelector('.wtg-tc-ts-btn').classList.toggle('ts-on', tcTs);
                menu.querySelector('.wtg-tc-deadline-row').classList.toggle('visible', tcTs);
                if (!tcTs) tcPrio = null;
            });

            // Priority flags
            menu.querySelectorAll('.task-prio-btn').forEach(btn => {
                btn.addEventListener('click', ev => {
                    ev.stopPropagation();
                    tcPrio = (tcPrio === btn.dataset.p) ? null : btn.dataset.p;
                    menu.querySelectorAll('.task-prio-btn').forEach(b => b.classList.toggle('active', b.dataset.p === tcPrio));
                });
            });

            const save = () => {
                const text = inp.value.trim(); if (!text) { menu.remove(); return; }
                const deadline = tcTs ? (menu.querySelector('.wtg-tc-date').value || null) : null;
                if (!dayTodos[ds]) dayTodos[ds] = [];
                dayTodos[ds].push({ id: uid(), text, completed: false, time: timeStr, duration: dur,
                    assignee: tcAssignee, timeSensitive: tcTs, deadline, priority: tcPrio });
                saveDayTodos(); renderWeekView(); renderCalendar(); menu.remove();
            };

            inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') save(); if (ev.key === 'Escape') menu.remove(); });
            menu.querySelector('.wtg-qm-save').addEventListener('click', save);
            menu.querySelector('.wtg-tc-cancel').addEventListener('click', () => menu.remove());
        });

        setTimeout(() => {
            document.addEventListener('click', function _close(ev) {
                if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('click', _close); }
            });
        }, 0);
    }

    // ── Drag + resize + draw state ───────────────────────────────────────────
    let _wtgDrag = null;
    let _wtgDraw = null;         // draw-to-create: click-drag to define a time range
    let _pendingDuration = null; // duration set by draw, consumed by saveNewEvent
    let _editingEventId  = null; // set when event modal is in edit (not create) mode
    let _touchJustHandled = false; // suppresses synthetic mouse events after touch

    // Shared pixel ↔ time helpers
    function wtgPxToAbsMins(px) {
        return (WTG_HOUR_START * 60) + Math.round(px / WTG_HOUR_H * 60 / WTG_SNAP) * WTG_SNAP;
    }
    function wtgPxToTimeStr(px) {
        const abs = wtgPxToAbsMins(px);
        return String(Math.floor(abs / 60) % 24).padStart(2,'0') + ':' + String(abs % 60).padStart(2,'0');
    }
    function wtgPxToDuration(px) {
        return Math.max(WTG_SNAP, Math.round(px / WTG_HOUR_H * 60 / WTG_SNAP) * WTG_SNAP);
    }
    function wtgMinsLabel(absMins) {
        const h = Math.floor(absMins / 60) % 24;
        const m = absMins % 60;
        const period = h < 12 ? 'AM' : 'PM';
        const h12 = h % 12 || 12;
        return m === 0 ? `${h12} ${period}` : `${h12}:${String(m).padStart(2,'0')} ${period}`;
    }

    document.addEventListener('mousemove', e => {
        // ── Move/resize existing blocks ──────────────────────────────────────
        if (_wtgDrag) {
            const dy      = e.clientY - _wtgDrag.startY;
            if (Math.abs(dy) > 6) _wtgDrag.moved = true; // mark as real drag
            const snapPx  = WTG_SNAP / 60 * WTG_HOUR_H;
            const snapped = Math.round(dy / snapPx) * snapPx;
            if (_wtgDrag.type === 'move') {
                const maxTop = (WTG_HOUR_END - WTG_HOUR_START) * WTG_HOUR_H - _wtgDrag.block.offsetHeight;
                _wtgDrag.block.style.top = Math.max(0, Math.min(_wtgDrag.origTop + snapped, maxTop)) + 'px';
            } else {
                _wtgDrag.block.style.height = Math.max(snapPx, _wtgDrag.origH + snapped) + 'px';
            }
            return;
        }
        // ── Draw-to-create: extend ghost ─────────────────────────────────────
        if (!_wtgDraw) return;
        if (!_wtgDraw.ghost) {
            // Commit draw only after intentional vertical movement
            if (Math.abs(e.clientY - _wtgDraw.startClientY) < 8) return;
            wtgCommitDraw(_wtgDraw.col, e.clientY);
        }
        if (!_wtgDraw) return;
        const snapPx = WTG_SNAP / 60 * WTG_HOUR_H;
        const rawPx  = e.clientY - _wtgDraw.col.getBoundingClientRect().top;
        _wtgDraw.endPx = Math.max(snapPx, Math.round(rawPx / snapPx) * snapPx);
        wtgUpdateDrawGhost();
    });

    document.addEventListener('mouseup', e => {
        // ── Finish draw-to-create ─────────────────────────────────────────────
        if (_wtgDraw) { wtgFinishDraw(e.clientX, e.clientY); return; }
        // ── Finish move/resize ────────────────────────────────────────────────
        if (!_wtgDrag) return;
        const { type, evId, todoId, block, startY, origTop, origH, ds, moved } = _wtgDrag;
        block.classList.remove('wtg-dragging');
        document.body.style.userSelect = '';
        document.body.style.cursor     = '';

        // Tap (no real drag) → open edit panel, restore block, skip saving
        if (!moved) {
            block.style.top    = origTop + 'px';
            block.style.height = origH   + 'px';
            _wtgDrag = null;
            if (evId) {
                const ev = events.find(x => x.id === evId);
                if (ev) showWtgEventPopover(ev, e.clientX, e.clientY);
            } else if (todoId) {
                const todo = (dayTodos[ds] || []).find(x => x.id === todoId);
                if (todo) showWtgTaskEditCard(todo, ds, e.clientX, e.clientY);
            }
            return;
        }

        const dy      = e.clientY - startY;
        const snapPx  = WTG_SNAP / 60 * WTG_HOUR_H;
        const snapped = Math.round(dy / snapPx) * snapPx;

        if (evId) {
            const ev = events.find(x => x.id === evId);
            if (ev) {
                if (type === 'move') ev.time = wtgPxToTimeStr(Math.max(0, origTop + snapped));
                else ev.duration = wtgPxToDuration(Math.max(snapPx, origH + snapped));
                saveEvents(); renderWeekView();
            }
        }
        if (todoId) {
            const todo = (dayTodos[ds] || []).find(x => x.id === todoId);
            if (todo) {
                if (type === 'move') todo.time = wtgPxToTimeStr(Math.max(0, origTop + snapped));
                else todo.duration = wtgPxToDuration(Math.max(snapPx, origH + snapped));
                saveDayTodos(); renderWeekView();
            }
        }
        _wtgDrag = null;
    });

    // Touch move — detect direction, extend ghost, prevent scroll while drawing
    document.addEventListener('touchmove', e => {
        if (!_wtgDraw) return;
        const t = e.touches[0];
        if (!_wtgDraw.ghost) {
            const dx = Math.abs(t.clientX - _wtgDraw.startClientX);
            const dy = Math.abs(t.clientY - _wtgDraw.startClientY);
            if (dy < 8 && dx < 8) return;
            if (dx > dy) { _wtgDraw = null; return; } // horizontal → let container scroll
            wtgCommitDraw(_wtgDraw.col, _wtgDraw.startClientY);
        }
        if (!_wtgDraw) return;
        e.preventDefault(); // block scroll now that draw is committed
        const snapPx = WTG_SNAP / 60 * WTG_HOUR_H;
        const rawPx  = t.clientY - _wtgDraw.col.getBoundingClientRect().top;
        _wtgDraw.endPx = Math.max(snapPx, Math.round(rawPx / snapPx) * snapPx);
        wtgUpdateDrawGhost();
    }, { passive: false });

    document.addEventListener('touchend', e => {
        if (!_wtgDraw) return;
        _touchJustHandled = true;
        setTimeout(() => { _touchJustHandled = false; }, 600); // block synthetic mouse events
        const t = e.changedTouches[0];
        wtgFinishDraw(t ? t.clientX : _wtgDraw.startClientX, t ? t.clientY : _wtgDraw.startClientY);
    });
    document.addEventListener('touchcancel', () => {
        if (_wtgDraw?.ghost) _wtgDraw.ghost.remove();
        _wtgDraw = null;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    });

    // ── Draw-to-create: commit & update ──────────────────────────────────────
    function wtgCommitDraw(col, anchorClientY) {
        if (!_wtgDraw || _wtgDraw.ghost) return;
        const snapPx  = WTG_SNAP / 60 * WTG_HOUR_H;
        const rawPx   = anchorClientY - col.getBoundingClientRect().top;
        const startPx = Math.max(0, Math.round(rawPx / snapPx) * snapPx);
        const ghost   = document.createElement('div');
        ghost.className = 'wtg-draw-ghost';
        const timeLabel = document.createElement('div');
        timeLabel.className = 'wtg-draw-time-label';
        ghost.appendChild(timeLabel);
        col.appendChild(ghost);
        _wtgDraw.startPx  = startPx;
        _wtgDraw.endPx    = startPx + snapPx;
        _wtgDraw.ghost    = ghost;
        _wtgDraw.timeLabel = timeLabel;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'ns-resize';
        wtgUpdateDrawGhost();
    }
    function wtgUpdateDrawGhost() {
        if (!_wtgDraw?.ghost) return;
        const { ghost, timeLabel, startPx, endPx } = _wtgDraw;
        const snapPx = WTG_SNAP / 60 * WTG_HOUR_H;
        const top    = Math.min(startPx, endPx);
        const h      = Math.max(snapPx, Math.abs(endPx - startPx));
        ghost.style.top    = top + 'px';
        ghost.style.height = h + 'px';
        const s = wtgPxToAbsMins(top);
        const en = wtgPxToAbsMins(top + h);
        if (timeLabel) timeLabel.textContent = `${wtgMinsLabel(s)} – ${wtgMinsLabel(en)}`;
    }
    function wtgFinishDraw(clientX, clientY) {
        if (!_wtgDraw) return;
        const { col, ds, ghost, startClientX, startClientY } = _wtgDraw;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';

        // Pure tap — no ghost was drawn
        if (!ghost) {
            _wtgDraw = null;
            const rawPx  = startClientY - col.getBoundingClientRect().top;
            const snapPx = WTG_SNAP / 60 * WTG_HOUR_H;
            const startPx = Math.max(0, Math.round(rawPx / snapPx) * snapPx);
            const startAbsMins = wtgPxToAbsMins(startPx);
            showWtgQuickMenu(ds, Math.floor(startAbsMins / 60) % 24, startAbsMins % 60,
                clientX, clientY, 180);
            return;
        }

        // Draw completed — read final ghost geometry
        const top = parseFloat(ghost.style.top);
        const h   = parseFloat(ghost.style.height);
        ghost.remove();
        _wtgDraw = null;

        const startAbsMins = wtgPxToAbsMins(top);
        let   durMins      = wtgPxToAbsMins(top + h) - startAbsMins;
        if (durMins < WTG_SNAP) durMins = 180; // safety: fallback to 3h

        const startH = Math.floor(startAbsMins / 60) % 24;
        const startM = startAbsMins % 60;

        // Menu appears at the release point, clamped to viewport
        const menuX = Math.min(clientX, window.innerWidth - 20);
        const menuY = Math.min(Math.max(clientY, 60), window.innerHeight - 60);
        showWtgQuickMenu(ds, startH, startM, menuX, menuY, durMins);
    }

    function wtgStartDrag(e, block, type, evId, todoId, ds) {
        e.preventDefault(); e.stopPropagation();
        _wtgDrag = { type, evId, todoId, block, ds, startY: e.clientY,
            origTop: parseFloat(block.style.top) || 0, origH: block.offsetHeight,
            moved: false };
        block.classList.add('wtg-dragging');
        document.body.style.userSelect = 'none';
        document.body.style.cursor = type === 'resize' ? 'ns-resize' : 'grabbing';
    }

    // ── WTG block edit: event popover ────────────────────────────────────────
    function showWtgEventPopover(ev, clientX, clientY) {
        document.querySelectorAll('.wtg-block-pop,.wtg-quick-menu').forEach(el => el.remove());
        const pop = document.createElement('div');
        pop.className = 'wtg-block-pop';
        pop.style.cssText = `position:fixed;top:${clientY}px;left:${clientX}px;`;
        pop.innerHTML = `
            <div class="wtg-bp-name">${esc(ev.title)}</div>
            ${ev.time ? `<div class="wtg-bp-meta">${icon('timer','sm')} ${time12h(ev.time)}${ev.place ? ' &middot; ' + esc(ev.place) : ''}</div>` : ''}
            <div class="wtg-bp-actions">
                <button class="wtg-bp-del">${icon('trash','sm')} Delete</button>
                <button class="wtg-bp-edit">${icon('edit','sm')} Edit</button>
            </div>`;
        document.body.appendChild(pop);
        requestAnimationFrame(() => {
            const r = pop.getBoundingClientRect();
            if (r.right  > window.innerWidth  - 8) pop.style.left = (clientX - r.width  - 6) + 'px';
            if (r.bottom > window.innerHeight - 8) pop.style.top  = (clientY - r.height - 6) + 'px';
        });
        pop.querySelector('.wtg-bp-edit').addEventListener('click', e => {
            e.stopPropagation(); pop.remove(); openEventEdit(ev);
        });
        pop.querySelector('.wtg-bp-del').addEventListener('click', e => {
            e.stopPropagation();
            events = events.filter(x => x.id !== ev.id);
            saveEvents(); renderWeekView(); renderCalendar(); pop.remove();
        });
        setTimeout(() => {
            document.addEventListener('click', function _c(e) {
                if (!pop.contains(e.target)) { pop.remove(); document.removeEventListener('click', _c); }
            });
        }, 0);
    }

    function openEventEdit(ev) {
        _editingEventId = ev.id;
        _pendingDuration = ev.duration || null;
        if (eventTitleInput) eventTitleInput.value = ev.title;
        if (eventDateInput)  eventDateInput.value  = ev.date;
        if (eventTimeInput)  eventTimeInput.value  = ev.time || '';
        if (eventPlaceInput) eventPlaceInput.value = ev.place || '';
        if (eventModal) eventModal.style.display = 'flex';
        setTimeout(() => { if (eventTitleInput) eventTitleInput.focus(); }, 50);
    }

    // ── WTG block edit: task card (pre-filled) ────────────────────────────────
    function showWtgTaskEditCard(todo, ds, clientX, clientY) {
        document.querySelectorAll('.wtg-quick-menu,.wtg-block-pop').forEach(el => el.remove());
        const menu = document.createElement('div');
        menu.className = 'wtg-quick-menu wtg-task-card';
        menu.style.cssText = `position:fixed;top:${clientY}px;left:${clientX}px;`;

        let tcAssignee = todo.assignee || null;
        let tcTs       = !!todo.timeSensitive;
        let tcPrio     = todo.priority || null;

        const avActive = u => (tcAssignee === u ? 'active' : '');
        menu.innerHTML = `
            <input class="wtg-tc-input" type="text" value="${esc(todo.text)}" autocomplete="off">
            <div class="wtg-tc-row">
                <span class="wtg-tc-label">Assign</span>
                <button class="wtg-tc-av av-m ${avActive('Mohammed')}" data-u="Mohammed">M</button>
                <button class="wtg-tc-av av-e ${avActive('Eyad')}"     data-u="Eyad">E</button>
                <button class="wtg-tc-av av-y ${avActive('Yusuf')}"    data-u="Yusuf">Y</button>
            </div>
            <div class="wtg-tc-row" style="padding-top:4px;">
                <button class="wtg-tc-ts-btn ${tcTs?'ts-on':''}">${icon('timer','sm')} Time-sensitive</button>
            </div>
            <div class="wtg-tc-deadline-row ${tcTs?'visible':''}">
                <input type="date" class="wtg-tc-date" value="${todo.deadline||''}">
                <div class="wtg-tc-prio-row">
                    <span class="task-prio-row-label" style="font-size:0.65rem;">Priority</span>
                    <button class="task-prio-btn ${tcPrio==='red'?'active':''}"    data-p="red"    title="High"></button>
                    <button class="task-prio-btn ${tcPrio==='yellow'?'active':''}" data-p="yellow" title="Medium"></button>
                    <button class="task-prio-btn ${tcPrio==='green'?'active':''}"  data-p="green"  title="Low"></button>
                </div>
            </div>
            <div class="wtg-tc-actions">
                <button class="wtg-tc-del-btn">${icon('trash','sm')}</button>
                <button class="wtg-tc-cancel">Cancel</button>
                <button class="wtg-qm-save" style="padding:5px 14px;">${icon('check','sm')} Save</button>
            </div>`;

        document.body.appendChild(menu);
        requestAnimationFrame(() => {
            const r = menu.getBoundingClientRect();
            if (r.right  > window.innerWidth  - 8) menu.style.left = (clientX - r.width  - 6) + 'px';
            if (r.bottom > window.innerHeight - 8) menu.style.top  = (clientY - r.height - 6) + 'px';
            if (r.left < 8) menu.style.left = '8px';
            if (r.top  < 8) menu.style.top  = '8px';
        });

        const inp = menu.querySelector('.wtg-tc-input');
        inp.focus(); inp.select();

        menu.querySelectorAll('.wtg-tc-av').forEach(btn => {
            btn.addEventListener('click', ev => {
                ev.stopPropagation();
                tcAssignee = (tcAssignee === btn.dataset.u) ? null : btn.dataset.u;
                menu.querySelectorAll('.wtg-tc-av').forEach(b => b.classList.remove('active'));
                if (tcAssignee) btn.classList.add('active');
            });
        });
        menu.querySelector('.wtg-tc-ts-btn').addEventListener('click', ev => {
            ev.stopPropagation();
            tcTs = !tcTs;
            menu.querySelector('.wtg-tc-ts-btn').classList.toggle('ts-on', tcTs);
            menu.querySelector('.wtg-tc-deadline-row').classList.toggle('visible', tcTs);
            if (!tcTs) tcPrio = null;
        });
        menu.querySelectorAll('.task-prio-btn').forEach(btn => {
            btn.addEventListener('click', ev => {
                ev.stopPropagation();
                tcPrio = (tcPrio === btn.dataset.p) ? null : btn.dataset.p;
                menu.querySelectorAll('.task-prio-btn').forEach(b => b.classList.toggle('active', b.dataset.p === tcPrio));
            });
        });
        menu.querySelector('.wtg-tc-del-btn').addEventListener('click', ev => {
            ev.stopPropagation();
            dayTodos[ds] = (dayTodos[ds] || []).filter(t => t.id !== todo.id);
            saveDayTodos(); renderWeekView(); renderCalendar(); menu.remove();
        });
        const save = () => {
            const text = inp.value.trim(); if (!text) { menu.remove(); return; }
            todo.text = text;
            todo.assignee = tcAssignee;
            todo.timeSensitive = tcTs;
            todo.deadline = tcTs ? (menu.querySelector('.wtg-tc-date').value || null) : null;
            todo.priority = tcPrio;
            saveDayTodos(); renderWeekView(); renderCalendar(); menu.remove();
        };
        inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') save(); if (ev.key === 'Escape') menu.remove(); });
        menu.querySelector('.wtg-qm-save').addEventListener('click', save);
        menu.querySelector('.wtg-tc-cancel').addEventListener('click', () => menu.remove());
        setTimeout(() => {
            document.addEventListener('click', function _c(e) {
                if (!menu.contains(e.target)) { menu.remove(); document.removeEventListener('click', _c); }
            });
        }, 0);
    }

    function renderWeekView() {
        if (!weekStrip) return;
        const days   = getWeekDates();
        const today  = new Date(); today.setHours(0,0,0,0);
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const s = days[0], e = days[6];
        if (weekLabel) {
            weekLabel.textContent = s.getMonth() === e.getMonth()
                ? `${months[s.getMonth()]} ${s.getDate()}–${e.getDate()}, ${s.getFullYear()}`
                : `${months[s.getMonth()]} ${s.getDate()} – ${months[e.getMonth()]} ${e.getDate()}, ${s.getFullYear()}`;
        }

        const dayNames = ['Sat','Sun','Mon','Tue','Wed','Thu','Fri'];
        const now = new Date();
        weekStrip.innerHTML = '';

        const container = document.createElement('div');
        container.className = 'wtg-container';

        // ── Header ──────────────────────────────────────────────────────────
        const header = document.createElement('div');
        header.className = 'wtg-header';
        header.appendChild(Object.assign(document.createElement('div'), { className: 'wtg-gutter-spacer' }));
        days.forEach((d, i) => {
            const ds      = dateStr(d.getFullYear(), d.getMonth(), d.getDate());
            const isToday = d.getTime() === today.getTime();
            const isFri   = d.getDay() === 5;
            const cell    = document.createElement('div');
            cell.className = 'wtg-day-head' + (isToday ? ' today' : '') + (isFri ? ' friday' : '');
            cell.innerHTML = `<span class="wtg-day-name">${dayNames[i]}</span><span class="wtg-day-num">${d.getDate()}</span>`;
            cell.addEventListener('click', () => openDayDetail(ds));
            header.appendChild(cell);
        });
        container.appendChild(header);

        // ── All-day row (untimed events + untimed todos) ─────────────────────
        const alldayRow = document.createElement('div');
        alldayRow.className = 'wtg-allday-row';
        const alldayLbl = document.createElement('div');
        alldayLbl.className = 'wtg-gutter-label';
        alldayLbl.textContent = 'all‑day';
        alldayRow.appendChild(alldayLbl);
        days.forEach(d => {
            const ds         = dateStr(d.getFullYear(), d.getMonth(), d.getDate());
            const untimedEvt = events.filter(ev => ev.date === ds && !ev.time);
            const untimedTdo = (dayTodos[ds] || []).filter(t => !t.completed && !t.time);
            const col        = document.createElement('div');
            col.className    = 'wtg-allday-col';
            untimedEvt.forEach(ev => {
                const c = document.createElement('div');
                c.className = 'wtg-allday-chip event'; c.textContent = ev.title; c.title = ev.title;
                c.addEventListener('click', () => openDayDetail(ds)); col.appendChild(c);
            });
            untimedTdo.slice(0, 3).forEach(t => {
                const c = document.createElement('div');
                c.className = 'wtg-allday-chip todo' + (t.timeSensitive ? ' ts' : '');
                c.textContent = t.text; c.title = t.text;
                c.addEventListener('click', () => openDayDetail(ds)); col.appendChild(c);
            });
            if (untimedTdo.length > 3) {
                const more = document.createElement('div');
                more.className = 'wtg-allday-chip todo'; more.style.opacity = '0.5';
                more.textContent = '+' + (untimedTdo.length - 3); col.appendChild(more);
            }
            alldayRow.appendChild(col);
        });
        container.appendChild(alldayRow);

        // ── Scrollable time grid ─────────────────────────────────────────────
        const scrollWrap = document.createElement('div');
        scrollWrap.className = 'wtg-scroll';
        const grid = document.createElement('div');
        grid.className = 'wtg-grid';

        // Gutter: show 3h boundary labels boldly, minor hours get empty label (just height)
        const gutter = document.createElement('div');
        gutter.className = 'wtg-gutter';
        WTG_HOURS.forEach(h => {
            const lbl = document.createElement('div');
            const is3h = WTG_3H.has(h);
            lbl.className = 'wtg-hour-label' + (is3h ? ' wtg-hl-3h' : ' wtg-hl-minor');
            lbl.textContent = is3h ? wtgFmtHour(h) : '';
            gutter.appendChild(lbl);
        });
        grid.appendChild(gutter);

        // Day columns
        const daysWrap = document.createElement('div');
        daysWrap.className = 'wtg-days';
        days.forEach(d => {
            const ds      = dateStr(d.getFullYear(), d.getMonth(), d.getDate());
            const isToday = d.getTime() === today.getTime();
            const col     = document.createElement('div');
            col.className = 'wtg-day-col';

            // Hour rows — 3h boundaries get a heavier top rule
            WTG_HOURS.forEach(h => {
                const row = document.createElement('div');
                row.className = 'wtg-hour-row' + (WTG_3H.has(h) ? ' wtg-row-3h' : '');
                row.innerHTML = '<div class="wtg-half-line"></div>';
                col.appendChild(row);
            });

            // Draw-to-create: mousedown / touchstart on the empty column space
            col.addEventListener('mousedown', e => {
                if (e.button !== 0) return;
                if (_touchJustHandled) return; // ignore synthetic mouse events after touch
                if (e.target.closest('.wtg-event-block,.wtg-task-block,.wtg-resize-handle,.wtg-quick-menu,.wtg-draw-ghost')) return;
                e.preventDefault();
                _wtgDraw = { col, ds, startClientX: e.clientX, startClientY: e.clientY, ghost: null };
            });
            col.addEventListener('touchstart', e => {
                if (e.target.closest('.wtg-event-block,.wtg-task-block,.wtg-resize-handle,.wtg-quick-menu,.wtg-draw-ghost')) return;
                const t = e.touches[0];
                _wtgDraw = { col, ds, startClientX: t.clientX, startClientY: t.clientY, ghost: null };
            }, { passive: true });

            // Event blocks (bold, amber) — draggable + resizable
            events.filter(ev => ev.date === ds && ev.time).forEach(ev => {
                const [evH, evM] = ev.time.split(':').map(Number);
                const topPx  = (evH - WTG_HOUR_START) * WTG_HOUR_H + (evM / 60) * WTG_HOUR_H;
                if (topPx < 0 || topPx >= WTG_HOURS.length * WTG_HOUR_H) return;
                const durMins  = ev.duration || 60;
                const heightPx = Math.max(24, durMins / 60 * WTG_HOUR_H - 3);
                const block    = document.createElement('div');
                block.className   = 'wtg-event-block';
                block.style.top   = topPx + 'px';
                block.style.height= heightPx + 'px';
                block.innerHTML   = `
                    <div class="wtg-event-title">${esc(ev.title)}</div>
                    <div class="wtg-event-sub">${time12h(ev.time)}${ev.place ? ' · ' + esc(ev.place) : ''}</div>
                    <div class="wtg-resize-handle"></div>`;
                block.addEventListener('mousedown', e => {
                    if (e.target.closest('.wtg-resize-handle')) return;
                    wtgStartDrag(e, block, 'move', ev.id, null, ds);
                });
                block.querySelector('.wtg-resize-handle').addEventListener('mousedown', e => {
                    wtgStartDrag(e, block, 'resize', ev.id, null, ds);
                });
                col.appendChild(block);
            });

            // Task blocks — timed dayTodos, colored by priority
            const PRIO_COLOR = { red: '#E11D48', yellow: '#D97706', green: '#16A34A' };
            (dayTodos[ds] || []).filter(t => !t.completed && t.time).forEach(todo => {
                const [tdH, tdM] = todo.time.split(':').map(Number);
                const topPx  = (tdH - WTG_HOUR_START) * WTG_HOUR_H + (tdM / 60) * WTG_HOUR_H;
                if (topPx < 0 || topPx >= WTG_HOURS.length * WTG_HOUR_H) return;
                const durMins  = todo.duration || 60;
                const heightPx = Math.max(24, durMins / 60 * WTG_HOUR_H - 3);
                const block    = document.createElement('div');
                const prioClr  = todo.priority ? PRIO_COLOR[todo.priority] : null;
                block.className   = 'wtg-task-block' + (todo.timeSensitive ? ' wtg-task-ts' : '');
                block.style.top   = topPx + 'px';
                block.style.height= heightPx + 'px';
                if (prioClr) {
                    block.style.borderLeftColor = prioClr;
                    block.style.background = prioClr.replace(')', ',0.08)').replace('rgb', 'rgba').replace('#E11D48','rgba(225,29,72,0.08)').replace('#D97706','rgba(217,119,6,0.08)').replace('#16A34A','rgba(22,101,52,0.08)');
                }
                const avClass = todo.assignee ? 'dt-av dt-av-' + todo.assignee.toLowerCase() : '';
                const avHtml  = todo.assignee ? `<span class="${avClass}">${todo.assignee[0]}</span>` : '';
                const dlHtml  = (todo.timeSensitive && todo.deadline) ? `<span style="font-size:9px;opacity:0.8">${deadlineChip(todo.deadline)}</span>` : '';
                block.innerHTML   = `
                    <div class="wtg-task-title">${esc(todo.text)}${avHtml}</div>
                    ${dlHtml}
                    <div class="wtg-resize-handle"></div>`;
                block.addEventListener('mousedown', e => {
                    if (e.target.closest('.wtg-resize-handle')) return;
                    wtgStartDrag(e, block, 'move', null, todo.id, ds);
                });
                block.querySelector('.wtg-resize-handle').addEventListener('mousedown', e => {
                    wtgStartDrag(e, block, 'resize', null, todo.id, ds);
                });
                col.appendChild(block);
            });

            // Current-time indicator
            if (isToday) {
                const nowH = now.getHours(), nowM = now.getMinutes();
                const nowTop = (nowH - WTG_HOUR_START) * WTG_HOUR_H + (nowM / 60) * WTG_HOUR_H;
                if (nowTop >= 0 && nowTop <= WTG_HOURS.length * WTG_HOUR_H) {
                    const line = document.createElement('div');
                    line.className = 'wtg-now-line';
                    line.style.top = nowTop + 'px';
                    line.innerHTML = '<div class="wtg-now-dot"></div>';
                    col.appendChild(line);
                }
            }

            daysWrap.appendChild(col);
        });

        grid.appendChild(daysWrap);
        scrollWrap.appendChild(grid);
        container.appendChild(scrollWrap);
        weekStrip.appendChild(container);

        // Auto-scroll to current hour; on mobile also scroll today into view horizontally
        if (!_wtgDrag && !_wtgDraw) {
            requestAnimationFrame(() => {
                const targetH  = Math.max(WTG_HOUR_START, now.getHours() - 1);
                const scrollPx = Math.max(0, (targetH - WTG_HOUR_START) * WTG_HOUR_H);
                if (window.innerWidth <= 700) {
                    container.scrollTop = scrollPx;
                    const todayIdx = days.findIndex(d => d.getTime() === today.getTime());
                    if (todayIdx >= 0) container.scrollLeft = Math.max(0, 36 + todayIdx * 128 - 20);
                } else {
                    scrollWrap.scrollTop = scrollPx;
                }
            });
        }
    }

    document.getElementById('prevWeekBtn')?.addEventListener('click', () => { weekOffset--; renderWeekView(); });
    document.getElementById('nextWeekBtn')?.addEventListener('click', () => { weekOffset++; renderWeekView(); });

    // ── Monthly Calendar ──────────────────────────────────────────────────────
    let calYear  = new Date().getFullYear();
    let calMonth = new Date().getMonth();
    const calendarGrid  = document.getElementById('calendarGrid');
    const calMonthLabel = document.getElementById('calMonthLabel');

    function renderCalendar() {
        if (!calendarGrid) return;
        calendarGrid.innerHTML = '';
        const today = new Date();
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        calMonthLabel.textContent = `${months[calMonth]} ${calYear}`;

        const firstDay    = new Date(calYear, calMonth, 1);
        const startIdx    = (firstDay.getDay() + 1) % 7;
        const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

        for (let i = 0; i < startIdx; i++) {
            const e = document.createElement('div');
            e.className = 'calendar-day empty';
            calendarGrid.appendChild(e);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const ds   = dateStr(calYear, calMonth, day);
            const cell = document.createElement('div');
            cell.className = 'calendar-day';
            cell.textContent = day;
            if (day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear())
                cell.classList.add('today');
            if (new Date(calYear, calMonth, day).getDay() === 5)
                cell.classList.add('highlighted');
            const hasEvent = events.some(e => e.date === ds);
            const hasTodo  = dayTodos[ds] && dayTodos[ds].length > 0;
            if (hasEvent || hasTodo) {
                const dots = document.createElement('div');
                dots.className = 'day-dots';
                if (hasEvent) { const dot = document.createElement('span'); dot.className = 'day-dot event-dot'; dots.appendChild(dot); }
                if (hasTodo)  { const dot = document.createElement('span'); dot.className = 'day-dot todo-dot';  dots.appendChild(dot); }
                cell.appendChild(dots);
            }
            cell.addEventListener('click', () => openDayDetail(ds));
            calendarGrid.appendChild(cell);
        }
    }

    document.getElementById('prevMonthBtn')?.addEventListener('click', () => {
        calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar();
    });
    document.getElementById('nextMonthBtn')?.addEventListener('click', () => {
        calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar();
    });

    // ── Events List ───────────────────────────────────────────────────────────
    const eventsList = document.getElementById('eventsList');

    function renderEventsList() {
        if (!eventsList) return;
        eventsList.innerHTML = '';
        const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
        if (sorted.length === 0) {
            const empty = document.createElement('p');
            empty.style.cssText = 'color:var(--color-text-muted);font-size:14px;font-style:italic;padding:8px 0;';
            empty.textContent = 'No upcoming events.';
            eventsList.appendChild(empty);
            return;
        }
        sorted.forEach(evt => {
            const [y, m, d] = evt.date.split('-').map(Number);
            const dt  = new Date(y, m - 1, d);
            const mon = dt.toLocaleDateString('en-US', { month: 'short' });
            const item = document.createElement('div');
            item.className = 'event-item';
            item.innerHTML = `
                <div class="event-date">${mon} ${d}</div>
                <div class="event-item-info">
                    <h4>${esc(evt.title)}</h4>
                    ${evt.place ? `<div class="event-place">${icon('mapPin','sm')} ${esc(evt.place)}</div>` : ''}
                    ${evt.time ? `<span class="event-time-chip">${icon('timer','sm')} ${time12h(evt.time)}</span>` : ''}
                </div>
                <button class="delete-event-btn" data-id="${evt.id}">${icon('trash')}</button>`;
            item.querySelector('.delete-event-btn').addEventListener('click', () => {
                if (!confirm(`Delete event "${evt.title}"?`)) return;
                events = events.filter(e => e.id !== evt.id);
                saveEvents(); renderAll();
                if (dayDetailModal?.style.display === 'flex') renderDayDetail();
            });
            eventsList.appendChild(item);
        });
    }

    function renderAll() {
        renderWeekView();
        renderCalendar();
        renderEventsList();
        renderFridayPlan();
    }

    // ── B4 Friday Planning Box ────────────────────────────────────────────────
    function renderFridayPlan() {
        const dateEl = document.getElementById('fridayPlanDate');
        const textEl = document.getElementById('fridayPlanText');
        const editBtn = document.getElementById('fridayPlanEditBtn');
        const createBtn = document.getElementById('fridayCreateEventBtn');
        if (!dateEl) return;

        // Compute next Friday
        const now = new Date();
        const dow = now.getDay(); // 0=Sun, 5=Fri
        const actualDays = (5 - dow + 7) % 7;
        const daysUntil = actualDays || 7;
        const friday = new Date(now);
        friday.setDate(now.getDate() + daysUntil);
        const isToday = actualDays === 0;
        const countdown = isToday ? 'Today!' : `in ${actualDays} day${actualDays === 1 ? '' : 's'}`;
        const fmtDate = friday.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        dateEl.textContent = fmtDate + ' — ' + countdown;

        if (textEl) {
            const idea = fridayPlan.idea || '';
            textEl.textContent = idea || 'What are we building?';
            if (idea) textEl.classList.remove('friday-plan-empty');
            else textEl.classList.add('friday-plan-empty');
        }

        // Icon content via JS (since we can't use icon() in static HTML)
        if (editBtn && !editBtn.innerHTML) editBtn.innerHTML = icon('edit', 'sm');
        if (createBtn && !createBtn.innerHTML) createBtn.innerHTML = icon('spark', 'sm') + ' Create Friday event';
    }

    document.getElementById('fridayPlanEditBtn')?.addEventListener('click', () => {
        const textEl = document.getElementById('fridayPlanText');
        if (!textEl) return;
        const idea = fridayPlan.idea || '';
        textEl.textContent = idea || '';
        textEl.contentEditable = 'true';
        textEl.classList.remove('friday-plan-empty');
        textEl.focus();
        // Place cursor at end
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(textEl);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    });

    document.getElementById('fridayPlanText')?.addEventListener('blur', () => {
        const textEl = document.getElementById('fridayPlanText');
        if (!textEl || textEl.contentEditable !== 'true') return;
        textEl.contentEditable = 'false';
        const idea = textEl.textContent.trim();
        fridayPlan.idea = idea;
        localStorage.setItem('fridayPlan', JSON.stringify(fridayPlan));
        if (!_fbSync) db.ref('data/fridayPlan').set({ idea, updatedAt: Date.now(), updatedBy: localStorage.getItem('currentUser') || '' });
        renderFridayPlan();
    });

    document.getElementById('fridayCreateEventBtn')?.addEventListener('click', () => {
        document.getElementById('fridaySessionBtn')?.click();
    });

    // ── Add Event Modal ───────────────────────────────────────────────────────
    const eventModal      = document.getElementById('eventModal');
    const eventTitleInput = document.getElementById('eventTitle');
    const eventPlaceInput = document.getElementById('eventPlace');
    const eventTimeInput  = document.getElementById('eventTime');
    const eventDateInput  = document.getElementById('eventDate');

    // ── Deadline countdown chip helper ────────────────────────────────────────
    function deadlineChip(deadline) {
        if (!deadline) return '';
        const today = new Date(); today.setHours(0,0,0,0);
        const due   = new Date(deadline + 'T00:00:00');
        const diff  = Math.round((due - today) / 86400000);
        let cls, label;
        if      (diff < 0)   { cls = 'dl-overdue'; label = 'overdue'; }
        else if (diff === 0) { cls = 'dl-overdue'; label = 'today'; }
        else if (diff <= 3)  { cls = 'dl-soon';    label = diff + 'd'; }
        else if (diff <= 14) { cls = 'dl-soon';    label = diff + 'd'; }
        else if (diff <= 60) { cls = 'dl-ok';      label = Math.round(diff / 7) + 'w'; }
        else                 { cls = 'dl-ok';       label = Math.round(diff / 30) + 'mo'; }
        return `<span class="task-deadline-chip ${cls}">${label}</span>`;
    }
    function prioDot(priority) {
        return priority ? `<span class="task-prio-dot prio-${priority}"></span>` : '';
    }

    document.getElementById('addEventBtn')?.addEventListener('click', () => {
        eventTitleInput.value = ''; eventDateInput.value = '';
        if (eventPlaceInput) eventPlaceInput.value = '';
        if (eventTimeInput)  eventTimeInput.value  = '';
        eventModal.style.display = 'flex';
    });
    document.getElementById('cancelEventBtn')?.addEventListener('click', () => {
        eventModal.style.display = 'none';
        if (eventPlaceInput) eventPlaceInput.value = '';
        if (eventTimeInput)  eventTimeInput.value  = '';
        _pendingDuration = null;
        _editingEventId  = null;
    });
    document.getElementById('saveEventBtn')?.addEventListener('click', saveNewEvent);
    eventDateInput?.addEventListener('keydown', e => { if (e.key === 'Enter') saveNewEvent(); });

    function time12h(t) {
        if (!t) return '';
        const [h, m] = t.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return h12 + ':' + String(m).padStart(2,'0') + ' ' + ampm;
    }

    function saveNewEvent() {
        const title = eventTitleInput.value.trim();
        const date  = eventDateInput.value;
        if (!title || !date) return;
        if (_editingEventId) {
            const ev = events.find(e => e.id === _editingEventId);
            if (ev) {
                ev.title = title; ev.date = date;
                ev.place = eventPlaceInput?.value.trim() || null;
                ev.time  = eventTimeInput?.value || null;
                if (_pendingDuration) ev.duration = _pendingDuration;
            }
            _editingEventId = null; _pendingDuration = null;
            saveEvents(); renderAll();
        } else {
            const ev = { id: uid(), title, date,
                place: (eventPlaceInput?.value.trim() || null),
                time:  (eventTimeInput?.value || null) };
            if (_pendingDuration) { ev.duration = _pendingDuration; _pendingDuration = null; }
            events.push(ev);
            saveEvents(); renderAll();
        }
        if (eventPlaceInput) eventPlaceInput.value = '';
        if (eventTimeInput)  eventTimeInput.value  = '';
        eventModal.style.display = 'none';
        if (dayDetailModal?.style.display === 'flex') renderDayDetail();
    }
    eventModal?.addEventListener('click', e => { if (e.target === eventModal) eventModal.style.display = 'none'; });

    // ── Tasks ─────────────────────────────────────────────────────────────────
    const todoList = document.getElementById('todoList');

    function renderTasks() {
        if (!todoList) return;
        const openSubtasks = new Set();
        todoList.querySelectorAll('[data-id]').forEach(li => {
            const c = li.querySelector('.subtasks-container');
            if (c && c.style.display !== 'none') openSubtasks.add(String(li.dataset.id));
        });
        todoList.innerHTML = '';
        tasks.forEach(task => {
            const completedSubs = (task.subtasks || []).filter(s => s.completed).length;
            const totalSubs     = (task.subtasks || []).length;
            const assigneeClass = task.assignee === 'Mohammed' ? 'tag-mohammed' : task.assignee === 'Yusuf' ? 'tag-yusuf' : 'tag-eyad';
            const proj = (task.projectId && task.projectId !== 'none')
                ? projects.find(p => String(p.id) === String(task.projectId))
                : null;
            const tagHtml = proj
                ? `<span class="project-tag" style="background:${proj.color}1A;color:${proj.color};border:1px solid ${proj.color}33">${esc(proj.name)}</span>`
                : '';

            const li = document.createElement('li');
            li.className = 'todo-item managed' + (task.completed ? ' completed' : '');
            li.dataset.id = task.id;
            const dlChip  = (task.timeSensitive && task.deadline) ? deadlineChip(task.deadline) : '';
            const tsIcon  = (task.timeSensitive && !task.deadline) ? `<span class="dt-ts-chip">${icon('timer','sm')}</span>` : '';
            const assigneeTag = task.assignee
                ? `<span class="assignee ${assigneeClass}">${esc(task.assignee)}</span>` : '';
            li.innerHTML = `
                <div class="todo-main">
                    <div class="todo-left">
                        ${prioDot(task.priority)}
                        <button class="subtask-toggle" title="Subtasks">${icon('chevronRight', 'sm')}</button>
                        <label class="todo-label">
                            <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''}>
                            <span class="custom-checkbox"></span>
                            <span class="todo-text">${esc(task.text)}</span>
                        </label>
                        ${totalSubs > 0 ? `<span class="subtask-count">${completedSubs}/${totalSubs}</span>` : ''}
                    </div>
                    <div class="todo-right">
                        ${dlChip}${tsIcon}
                        ${tagHtml}
                        ${assigneeTag}
                        <button class="task-action-btn task-edit-btn" title="Edit">${icon('edit', 'sm')}</button>
                        <button class="task-action-btn task-delete-btn" title="Delete">${icon('trash', 'sm')}</button>
                    </div>
                </div>
                <div class="subtasks-container" style="display:none;">
                    <ul class="subtask-list" id="subtasks-${task.id}"></ul>
                    <button class="add-subtask-btn">+ Add subtask</button>
                </div>`;

            todoList.appendChild(li);
            renderSubtasks(task, li);
            if (openSubtasks.has(String(task.id))) {
                li.querySelector('.subtasks-container').style.display = 'block';
                li.querySelector('.subtask-toggle').classList.add('open');
            }

            li.querySelector('.todo-checkbox').addEventListener('change', function () {
                task.completed = this.checked;
                li.classList.toggle('completed', this.checked);
                saveTasks();
            });
            li.querySelector('.subtask-toggle').addEventListener('click', () => {
                const cont   = li.querySelector('.subtasks-container');
                const toggle = li.querySelector('.subtask-toggle');
                const open   = cont.style.display !== 'none';
                cont.style.display = open ? 'none' : 'block';
                toggle.classList.toggle('open', !open);
            });
            li.querySelector('.task-edit-btn').addEventListener('click',   () => openTaskModal(task));
            li.querySelector('.task-delete-btn').addEventListener('click', () => {
                if (!confirm(`Delete task "${task.text}"?`)) return;
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks(); renderTasks();
            });
            li.querySelector('.add-subtask-btn').addEventListener('click', () => openSubtaskModal(task.id));
        });
        if (tasks.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'todo-item';
            empty.style.cssText = 'padding:20px 24px;color:var(--color-text-muted);font-size:14px;font-style:italic;';
            empty.textContent = 'No tasks yet. Add one above.';
            todoList.appendChild(empty);
        }
    }

    function renderSubtasks(task, li) {
        const subList = li.querySelector(`#subtasks-${task.id}`);
        if (!subList) return;
        subList.innerHTML = '';
        (task.subtasks || []).forEach(sub => {
            const sli = document.createElement('li');
            sli.className = 'subtask-item' + (sub.completed ? ' completed' : '');
            sli.innerHTML = `
                <label class="todo-label">
                    <input type="checkbox" class="todo-checkbox" ${sub.completed ? 'checked' : ''}>
                    <span class="custom-checkbox"></span>
                    <span class="todo-text">${esc(sub.text)}</span>
                </label>
                <button class="task-action-btn" title="Delete">${icon('trash', 'sm')}</button>`;
            sli.querySelector('.todo-checkbox').addEventListener('change', function () {
                sub.completed = this.checked;
                sli.classList.toggle('completed', this.checked);
                saveTasks(); renderTasks();
            });
            sli.querySelector('.task-action-btn').addEventListener('click', () => {
                if (!confirm(`Delete subtask "${sub.text}"?`)) return;
                task.subtasks = task.subtasks.filter(s => s.id !== sub.id);
                saveTasks(); renderTasks();
            });
            subList.appendChild(sli);
        });
    }

    // ── Task Modal ────────────────────────────────────────────────────────────
    const taskModal          = document.getElementById('taskModal');
    const taskModalTitle     = document.getElementById('taskModalTitle');
    const taskTextInput      = document.getElementById('taskTextInput');
    const taskAssigneeSelect = document.getElementById('taskAssigneeSelect');
    const taskProjectSelect  = document.getElementById('taskProjectSelect');
    const taskEditIdInput    = document.getElementById('taskEditId');

    // Task modal ts state
    let _taskModalTs = false;
    let _taskModalPrio = null;

    function taskModalSetTs(on) {
        _taskModalTs = on;
        const btn    = document.getElementById('taskTsBtn');
        const fields = document.getElementById('taskTsFields');
        if (btn)    btn.classList.toggle('ts-on', on);
        if (fields) fields.classList.toggle('visible', on);
    }
    function taskModalSetPrio(p) {
        _taskModalPrio = p;
        document.querySelectorAll('#taskTsFields .task-prio-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.p === p);
        });
    }

    document.getElementById('taskTsBtn')?.addEventListener('click', () => taskModalSetTs(!_taskModalTs));
    document.querySelectorAll('#taskTsFields .task-prio-btn').forEach(b => {
        b.addEventListener('click', () => taskModalSetPrio(_taskModalPrio === b.dataset.p ? null : b.dataset.p));
    });

    function openTaskModal(task = null) {
        taskModalTitle.textContent  = task ? 'Edit Task' : 'Add Task';
        taskTextInput.value         = task ? task.text    : '';
        taskAssigneeSelect.value    = task ? (task.assignee || '') : '';
        if (taskProjectSelect) taskProjectSelect.value = task ? (task.projectId || 'none') : 'none';
        taskEditIdInput.value       = task ? task.id : '';
        // ts / deadline / priority
        taskModalSetTs(task ? !!task.timeSensitive : false);
        taskModalSetPrio(task ? (task.priority || null) : null);
        const dlInput = document.getElementById('taskDeadlineInput');
        if (dlInput) dlInput.value = (task && task.deadline) ? task.deadline : '';
        taskModal.style.display = 'flex';
        setTimeout(() => taskTextInput.focus(), 50);
    }

    document.getElementById('addTaskBtn')?.addEventListener('click', () => openTaskModal());
    document.getElementById('cancelTaskBtn')?.addEventListener('click', () => { taskModal.style.display = 'none'; });
    document.getElementById('saveTaskBtn')?.addEventListener('click', () => {
        const text      = taskTextInput.value.trim();
        const assignee  = taskAssigneeSelect.value || null;
        const projectId = taskProjectSelect ? taskProjectSelect.value : 'none';
        const editId    = taskEditIdInput.value;
        const deadline  = _taskModalTs ? (document.getElementById('taskDeadlineInput')?.value || null) : null;
        if (!text) return;
        if (editId) {
            const t = tasks.find(t => t.id == editId);
            if (t) { t.text = text; t.assignee = assignee; t.projectId = projectId;
                     t.timeSensitive = _taskModalTs; t.deadline = deadline; t.priority = _taskModalPrio; }
        } else {
            tasks.push({ id: uid(), text, assignee, projectId, completed: false, subtasks: [],
                         timeSensitive: _taskModalTs, deadline, priority: _taskModalPrio });
        }
        saveTasks(); renderTasks();
        taskModal.style.display = 'none';
    });
    taskModal?.addEventListener('click', e => { if (e.target === taskModal) taskModal.style.display = 'none'; });
    taskTextInput?.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('saveTaskBtn').click(); });

    // ── Subtask Modal ─────────────────────────────────────────────────────────
    const subtaskModal     = document.getElementById('subtaskModal');
    const subtaskTextInput = document.getElementById('subtaskTextInput');
    const subtaskParentId  = document.getElementById('subtaskParentId');

    function openSubtaskModal(taskId) {
        subtaskParentId.value  = taskId;
        subtaskTextInput.value = '';
        subtaskModal.style.display = 'flex';
        setTimeout(() => subtaskTextInput.focus(), 50);
    }

    document.getElementById('cancelSubtaskBtn')?.addEventListener('click', () => { subtaskModal.style.display = 'none'; });
    document.getElementById('saveSubtaskBtn')?.addEventListener('click', () => {
        const text  = subtaskTextInput.value.trim();
        const rawId = subtaskParentId.value;
        if (!text) return;
        const task = tasks.find(t => t.id == rawId);
        if (task) {
            task.subtasks.push({ id: uid(), text, completed: false });
            saveTasks(); renderTasks();
            const li = todoList?.querySelector(`[data-id="${rawId}"]`);
            if (li) {
                li.querySelector('.subtasks-container').style.display = 'block';
                li.querySelector('.subtask-toggle').classList.add('open');
            }
        }
        subtaskModal.style.display = 'none';
    });
    subtaskModal?.addEventListener('click', e => { if (e.target === subtaskModal) subtaskModal.style.display = 'none'; });
    subtaskTextInput?.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('saveSubtaskBtn').click(); });

    // ── Day Detail ────────────────────────────────────────────────────────────
    const dayDetailModal = document.getElementById('dayDetailModal');
    const dayDetailTitle = document.getElementById('dayDetailTitle');
    const dayEventsList  = document.getElementById('dayEventsList');
    const dayNoEvents    = document.getElementById('dayNoEvents');
    const dayTodoList    = document.getElementById('dayTodoList');
    const dayNoTodos     = document.getElementById('dayNoTodos');
    let currentDay = null;

    function openDayDetail(ds) {
        currentDay = ds;
        const [y, m, d] = ds.split('-').map(Number);
        const dt = new Date(y, m - 1, d);
        const dayNames   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        dayDetailTitle.textContent = `${dayNames[dt.getDay()]}, ${monthNames[m-1]} ${d}`;
        document.getElementById('dayEventAddRow').style.display = 'none';
        document.getElementById('dayTodoAddRow').style.display  = 'none';
        // Populate project dropdown
        const projSel = document.getElementById('dayTodoProject');
        if (projSel) {
            projSel.innerHTML = '<option value="">No project</option>';
            projects.filter(p => p.status === 'active' || !p.status).forEach(p => {
                const o = document.createElement('option');
                o.value = p.id;
                o.textContent = p.name;
                projSel.appendChild(o);
            });
        }
        renderDayDetail();
        dayDetailModal.style.display = 'flex';
    }

    function renderDayDetail() {
        if (!currentDay) return;
        const ds = currentDay;
        const todayEvents = events.filter(e => e.date === ds);
        dayEventsList.innerHTML = '';
        dayNoEvents.style.display = todayEvents.length ? 'none' : 'block';
        todayEvents.forEach(evt => {
            const item = document.createElement('div');
            item.className = 'day-event-item';
            item.innerHTML = `
                <div style="flex:1;min-width:0;">
                    <span>${esc(evt.title)}</span>
                    ${evt.place ? `<div class="event-place">${icon('mapPin','sm')} ${esc(evt.place)}</div>` : ''}
                    ${evt.time ? `<span class="event-time-chip">${icon('timer','sm')} ${time12h(evt.time)}</span>` : ''}
                </div>
                <button class="task-action-btn" style="color:var(--color-text-muted)">${icon('trash', 'sm')}</button>`;
            item.querySelector('button').addEventListener('click', () => {
                if (!confirm(`Delete event "${evt.title}"?`)) return;
                events = events.filter(e => e.id !== evt.id);
                saveEvents(); renderAll(); renderDayDetail();
            });
            dayEventsList.appendChild(item);
        });

        if (!dayTodos[ds]) dayTodos[ds] = [];
        const todos = dayTodos[ds];
        dayTodoList.innerHTML = '';
        dayNoTodos.style.display = todos.length ? 'none' : 'block';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-item' + (todo.completed ? ' completed' : '');
            const proj = todo.projectId ? projects.find(p => p.id == todo.projectId) : null;
            const assigneeLow = (todo.assignee || '').toLowerCase();
            const assigneeInit = todo.assignee ? todo.assignee[0] : '';
            const dlChipDay = (todo.timeSensitive && todo.deadline) ? deadlineChip(todo.deadline) : '';
            const tsIconDay  = (todo.timeSensitive && !todo.deadline) ? `<span class="dt-ts-chip">${icon('timer','sm')}</span>` : '';
            const extraHtml = prioDot(todo.priority)
                + (proj ? `<span class="dt-proj-chip" style="background:${proj.color}22;color:${proj.color}">${esc(proj.name)}</span>` : '')
                + dlChipDay + tsIconDay
                + (todo.assignee ? `<span class="dt-av dt-av-${assigneeLow}" title="${esc(todo.assignee)}">${assigneeInit}</span>` : '');
            li.innerHTML = `
                <label class="todo-label">
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="custom-checkbox"></span>
                    <span class="todo-text">${esc(todo.text)}</span>
                    ${extraHtml}
                </label>
                <button class="task-action-btn" style="color:var(--color-text-muted)">${icon('trash', 'sm')}</button>`;
            li.querySelector('.todo-checkbox').addEventListener('change', function () {
                todo.completed = this.checked;
                li.classList.toggle('completed', this.checked);
                saveDayTodos(); renderWeekView();
            });
            li.querySelector('.task-action-btn').addEventListener('click', () => {
                dayTodos[ds] = dayTodos[ds].filter(t => t.id !== todo.id);
                saveDayTodos(); renderAll(); renderDayDetail();
            });
            dayTodoList.appendChild(li);
        });
    }

    document.getElementById('closeDayDetail')?.addEventListener('click',  () => { dayDetailModal.style.display = 'none'; });
    dayDetailModal?.addEventListener('click', e => { if (e.target === dayDetailModal) dayDetailModal.style.display = 'none'; });

    const dayEventAddRow = document.getElementById('dayEventAddRow');
    const dayEventInput  = document.getElementById('dayEventInput');
    document.getElementById('addDayEventBtn')?.addEventListener('click', () => {
        dayEventAddRow.style.display = dayEventAddRow.style.display === 'flex' ? 'none' : 'flex';
        if (dayEventAddRow.style.display === 'flex') dayEventInput.focus();
    });
    document.getElementById('saveDayEventBtn')?.addEventListener('click', () => {
        const title = dayEventInput.value.trim();
        if (!title) return;
        events.push({ id: uid(), title, date: currentDay });
        saveEvents(); renderAll();
        dayEventInput.value = '';
        dayEventAddRow.style.display = 'none';
        renderDayDetail();
    });
    dayEventInput?.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('saveDayEventBtn').click(); });

    let dayTodoTs = false;

    const dayTodoAddRow = document.getElementById('dayTodoAddRow');
    const dayTodoInput  = document.getElementById('dayTodoInput');
    document.getElementById('addDayTodoBtn')?.addEventListener('click', () => {
        const isShowing = dayTodoAddRow.style.display !== 'none' && dayTodoAddRow.style.display !== '';
        dayTodoAddRow.style.display = isShowing ? 'none' : 'flex';
        if (!isShowing) dayTodoInput.focus();
    });
    let _dayTodoPrio = null;
    document.getElementById('dayTodoTsBtn')?.addEventListener('click', function() {
        dayTodoTs = !dayTodoTs;
        this.classList.toggle('ts-on', dayTodoTs);
        const prioRow = document.getElementById('dayTodoPrioRow');
        if (prioRow) prioRow.classList.toggle('visible', dayTodoTs);
        if (!dayTodoTs) _dayTodoPrio = null;
    });
    document.querySelectorAll('#dayTodoPrioRow .task-prio-btn').forEach(b => {
        b.addEventListener('click', () => {
            _dayTodoPrio = (_dayTodoPrio === b.dataset.p) ? null : b.dataset.p;
            document.querySelectorAll('#dayTodoPrioRow .task-prio-btn').forEach(x =>
                x.classList.toggle('active', x.dataset.p === _dayTodoPrio));
        });
    });
    document.getElementById('saveDayTodoBtn')?.addEventListener('click', () => {
        const text = dayTodoInput.value.trim();
        if (!text) return;
        if (!dayTodos[currentDay]) dayTodos[currentDay] = [];
        dayTodos[currentDay].push({
            id: uid(), text, completed: false,
            projectId: document.getElementById('dayTodoProject')?.value || null,
            timeSensitive: dayTodoTs,
            deadline:  dayTodoTs ? (document.getElementById('dayTodoDeadline')?.value || null) : null,
            priority:  dayTodoTs ? _dayTodoPrio : null,
            assignee:  document.getElementById('dayTodoAssignee')?.value || null
        });
        saveDayTodos(); renderAll();
        dayTodoInput.value = '';
        // Reset meta fields
        dayTodoTs = false; _dayTodoPrio = null;
        const tsBtn = document.getElementById('dayTodoTsBtn');
        if (tsBtn) tsBtn.classList.remove('ts-on');
        const prioRow = document.getElementById('dayTodoPrioRow');
        if (prioRow) { prioRow.classList.remove('visible'); prioRow.querySelectorAll('.task-prio-btn').forEach(b => b.classList.remove('active')); }
        if (document.getElementById('dayTodoDeadline')) document.getElementById('dayTodoDeadline').value = '';
        if (document.getElementById('dayTodoAssignee')) document.getElementById('dayTodoAssignee').value = '';
        if (document.getElementById('dayTodoProject'))  document.getElementById('dayTodoProject').value  = '';
        dayTodoAddRow.style.display = 'none';
        renderDayDetail();
    });
    dayTodoInput?.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('saveDayTodoBtn').click(); });

    // ── Projects (dashboard) ──────────────────────────────────────────────────
    const PROJECT_COLORS = ['#C2620E','#7C3AED','#059669','#2563EB','#E11D48'];
    let selectedProjectColor = PROJECT_COLORS[0];
    let selectedProjectOwner = 'Mohammed';
    let fridayColor = PROJECT_COLORS[0];

    function rebuildTaskProjectSelect() {
        if (!taskProjectSelect) return;
        const cur = taskProjectSelect.value;
        taskProjectSelect.innerHTML = '<option value="none">No project</option>';
        projects.forEach(proj => {
            const opt = document.createElement('option');
            opt.value = String(proj.id);
            opt.textContent = proj.name;
            taskProjectSelect.appendChild(opt);
        });
        const valid = [...taskProjectSelect.options].some(o => o.value === cur);
        taskProjectSelect.value = valid ? cur : 'none';
    }

    function renderProjects() {
        const list = document.getElementById('projectList');
        if (!list) return;
        list.innerHTML = '';
        rebuildTaskProjectSelect();
        if (projects.length === 0) {
            const p = document.createElement('p');
            p.style.cssText = 'color:var(--text-faint);font-size:0.875rem;font-style:italic;padding:16px 0;';
            p.textContent = 'No projects yet. Add one above.';
            list.appendChild(p);
            return;
        }

        const BORN_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const active  = projects.filter(p => (p.status || 'active') === 'active');
        const passive = projects.filter(p => (p.status || 'active') === 'passive');

        [...active, ...passive].forEach(proj => {
            const isPassive = (proj.status || 'active') === 'passive';

            // Compute progress: roadmap-based when steps exist, else task-based
            const roadmapRaw = projectRoadmapData[String(proj.id)];
            const rmTiers = (roadmapRaw && Array.isArray(roadmapRaw.tiers)) ? roadmapRaw.tiers : [];
            const rmSteps = rmTiers.reduce((acc, t) => acc.concat(t.steps || []), []);
            let total, done, pct, progressText;
            if (rmSteps.length > 0) {
                total = rmSteps.length;
                done  = rmSteps.filter(s => s.done).length;
                pct   = Math.round(done / total * 100);
                progressText = `${done} of ${total} steps done`;
            } else {
                const rawTasks = projectTasksByProject[String(proj.id)];
                const projTasks = Array.isArray(rawTasks) ? rawTasks
                    : (rawTasks ? Object.values(rawTasks) : []);
                total = projTasks.length;
                done  = projTasks.filter(t => t.completed).length;
                pct   = total ? Math.round(done / total * 100) : 0;
                progressText = total === 0 ? 'No tasks yet' : `${done} of ${total} tasks done`;
            }

            // Owner badge
            const ownerClass = proj.owner === 'Mohammed' ? 'mohammed'
                : proj.owner === 'Yusuf' ? 'yusuf'
                : proj.owner === 'Eyad'  ? 'eyad' : '';
            const ownerHtml = proj.owner
                ? `<span class="proj-owner-badge ${ownerClass}" title="${esc(proj.owner)}">${esc(proj.owner[0].toUpperCase())}</span>`
                : '';

            // Born date
            let bornHtml = '';
            if (proj.createdAt) {
                const d = new Date(proj.createdAt);
                bornHtml = `<span class="proj-born">Born ${BORN_MONTHS[d.getMonth()]} ${d.getDate()}</span>`;
            }

            const menuId = 'pmenu-' + proj.id;
            const actionsHtml = `
                <div class="proj-card-actions">
                    ${ownerHtml}
                    <span class="proj-status-badge ${isPassive ? 'passive' : 'active'}">${isPassive ? 'Paused' : 'Active'}</span>
                    <div class="proj-menu-wrap" id="${menuId}-wrap">
                        <button class="proj-menu-btn" data-pid="${proj.id}" title="More options" aria-label="Project options">
                            <span class="proj-menu-dots">•••</span>
                        </button>
                        <div class="proj-dropdown" id="${menuId}-dd">
                            <button class="proj-dd-item proj-dd-toggle" data-pid="${proj.id}">
                                ${icon(isPassive ? 'play' : 'pause', 'sm')} ${isPassive ? 'Resume' : 'Pause'}
                            </button>
                            <div class="proj-dd-divider"></div>
                            <button class="proj-dd-item proj-dd-delete" data-pid="${proj.id}">
                                ${icon('trash', 'sm')} Delete project
                            </button>
                        </div>
                    </div>
                </div>`;

            const card = document.createElement('div');
            card.className = 'project-card' + (isPassive ? ' project-passive' : '');
            card.innerHTML = `
                <div class="project-card-top">
                    <span class="project-color-dot" style="background:${proj.color}"></span>
                    <div class="project-info">
                        <h3>${esc(proj.name)}</h3>
                        <div class="proj-meta-row">
                            ${bornHtml}
                            <span class="proj-progress-text">${progressText}</span>
                        </div>
                    </div>
                    ${actionsHtml}
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width:${pct}%;background:${proj.color}"></div>
                </div>`;

            // Three-dot menu toggle
            card.querySelector('.proj-menu-btn').addEventListener('click', e => {
                e.preventDefault(); e.stopPropagation();
                const dd = document.getElementById(menuId + '-dd');
                const isOpen = dd.classList.contains('open');
                document.querySelectorAll('.proj-dropdown.open').forEach(d => d.classList.remove('open'));
                if (!isOpen) dd.classList.add('open');
            });

            // Pause/Resume
            card.querySelector('.proj-dd-toggle').addEventListener('click', e => {
                e.preventDefault(); e.stopPropagation();
                proj.status = isPassive ? 'active' : 'passive';
                saveProjects(); renderProjects();
            });

            // Delete
            card.querySelector('.proj-dd-delete').addEventListener('click', e => {
                e.preventDefault(); e.stopPropagation();
                if (!confirm(`Delete "${proj.name}"?`)) return;
                projects = projects.filter(p => p.id !== proj.id);
                saveProjects(); renderProjects();
            });

            card.addEventListener('click', e => {
                if (e.target.closest('.proj-menu-wrap')) return;
                sessionStorage.setItem('activeProject', JSON.stringify(proj));
                window.location.href = 'project.html';
            });
            list.appendChild(card);
        });
    }

    const addProjectModal   = document.getElementById('addProjectModal');
    const projectNameInput  = document.getElementById('projectNameInput');

    document.getElementById('addProjectBtn')?.addEventListener('click', () => {
        projectNameInput.value = '';
        selectedProjectColor = PROJECT_COLORS[0];
        selectedProjectOwner = 'Mohammed';
        document.querySelectorAll('#projectColorPicker .color-dot-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === 0);
        });
        const ownerSel = document.getElementById('projectOwnerSelect');
        if (ownerSel) ownerSel.value = 'Mohammed';
        addProjectModal.style.display = 'flex';
        setTimeout(() => projectNameInput.focus(), 50);
    });
    document.getElementById('cancelAddProjectBtn')?.addEventListener('click', () => { addProjectModal.style.display = 'none'; });
    document.getElementById('saveAddProjectBtn')?.addEventListener('click', () => {
        const name = projectNameInput.value.trim();
        if (!name) return;
        const ts = Date.now();
        projects.push({ id: uid(), name, color: selectedProjectColor, owner: selectedProjectOwner, status: 'active', createdAt: ts });
        saveProjects(); renderProjects();
        addProjectModal.style.display = 'none';
    });
    projectNameInput?.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('saveAddProjectBtn').click(); });
    addProjectModal?.addEventListener('click', e => { if (e.target === addProjectModal) addProjectModal.style.display = 'none'; });

    document.getElementById('projectColorPicker')?.addEventListener('click', e => {
        const btn = e.target.closest('.color-dot-btn');
        if (!btn) return;
        selectedProjectColor = btn.dataset.color;
        document.querySelectorAll('#projectColorPicker .color-dot-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });

    document.getElementById('projectOwnerSelect')?.addEventListener('change', e => {
        selectedProjectOwner = e.target.value;
    });

    // B6: Close project dropdowns when clicking outside
    document.addEventListener('click', e => {
        if (!e.target.closest('.proj-menu-wrap')) {
            document.querySelectorAll('.proj-dropdown.open').forEach(d => d.classList.remove('open'));
        }
    });

    // ── Friday Session Modal ──────────────────────────────────────────────────
    document.getElementById('fridaySessionBtn')?.addEventListener('click', () => {
        const ideaInput  = document.getElementById('fridayIdeaInput');
        const pitcherSel = document.getElementById('fridayPitcherSelect');
        if (ideaInput)  ideaInput.value = '';
        if (pitcherSel) pitcherSel.value = 'Mohammed';
        fridayColor = PROJECT_COLORS[0];
        document.querySelectorAll('#fridayColorPicker .color-dot-btn').forEach((btn, i) => btn.classList.toggle('active', i === 0));
        document.getElementById('fridayModal').style.display = 'flex';
        setTimeout(() => ideaInput?.focus(), 50);
    });
    document.getElementById('cancelFridayBtn')?.addEventListener('click', () => {
        document.getElementById('fridayModal').style.display = 'none';
    });
    document.getElementById('fridayModal')?.addEventListener('click', e => {
        if (e.target === document.getElementById('fridayModal')) document.getElementById('fridayModal').style.display = 'none';
    });
    document.getElementById('fridayColorPicker')?.addEventListener('click', e => {
        const btn = e.target.closest('.color-dot-btn');
        if (!btn) return;
        fridayColor = btn.dataset.color;
        document.querySelectorAll('#fridayColorPicker .color-dot-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
    document.getElementById('saveFridayBtn')?.addEventListener('click', () => {
        const ideaInput  = document.getElementById('fridayIdeaInput');
        const pitcherSel = document.getElementById('fridayPitcherSelect');
        const idea = ideaInput ? ideaInput.value.trim() : '';
        if (!idea) return;
        const pitcher = pitcherSel ? pitcherSel.value : 'Mohammed';
        const now = new Date();
        const todayDateStr = dateStr(now.getFullYear(), now.getMonth(), now.getDate());
        const projId = uid();
        const proj = {
            id: projId,
            name: idea.length > 50 ? idea.slice(0, 47) + '…' : idea,
            color: fridayColor,
            owner: '',
            status: 'active',
            createdAt: Date.now(),
            idea,
            pitchedBy: pitcher
        };
        projects.push(proj);
        saveProjects();
        events.push({ id: uid(), title: 'Friday Session — ' + idea, date: todayDateStr, type: 'friday', projectId: projId });
        saveEvents();
        renderProjects();
        renderAll();
        renderFridayTimeline();
        document.getElementById('fridayModal').style.display = 'none';
    });

    // ── Personal & Team Dashboard ─────────────────────────────────────────────
    function getWeekStart() {
        const t = new Date(); t.setHours(0,0,0,0);
        t.setDate(t.getDate() - (t.getDay() + 1) % 7);
        return t;
    }

    function renderYourWeek() {
        const ywStats   = document.getElementById('ywStats');
        const teamStrip = document.getElementById('teamStrip');
        if (!ywStats) return;
        const user = viewUser || localStorage.getItem('currentUser') || 'MOHAMMED';
        const ALL_USERS  = ['MOHAMMED','EYAD','YUSUF'];
        const weekStart  = getWeekStart();
        const now        = new Date();
        const todayStr   = dateStr(now.getFullYear(), now.getMonth(), now.getDate());
        const weekEnd    = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        function getStatsFor(u) {
            const assigneeName = NAME[u];
            let assigned = 0, completed = 0, overdue = 0, weeklyCompleted = 0;
            Object.values(projectTasksByProject).forEach(rawTasks => {
                const ptasks = Array.isArray(rawTasks) ? rawTasks : Object.values(rawTasks || {});
                ptasks.forEach(t => {
                    if ((t.assignee || '') !== assigneeName) return;
                    assigned++;
                    if (t.completed) {
                        completed++;
                        if (t.completedAt) {
                            const cd = new Date(t.completedAt);
                            if (cd >= weekStart && cd <= weekEnd) weeklyCompleted++;
                        }
                    }
                    if (!t.completed && t.dueType === 'hard' && t.dueDate && t.dueDate < todayStr) overdue++;
                });
            });
            let weekSecs = 0;
            const activeDays = new Set();
            Object.values(projectTimeByProject).forEach(timeData => {
                if (!timeData || !Array.isArray(timeData.sessions)) return;
                timeData.sessions.forEach(s => {
                    if (s.user !== u || !s.endedAt) return;
                    const endDate = new Date(s.endedAt);
                    if (endDate >= weekStart && endDate <= weekEnd) weekSecs += (s.duration || 0);
                    activeDays.add(dateStr(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()));
                });
            });
            let streak = 0;
            for (let i = 0; i < 7; i++) {
                const d = new Date(now); d.setHours(0,0,0,0); d.setDate(d.getDate() - i);
                if (activeDays.has(dateStr(d.getFullYear(), d.getMonth(), d.getDate()))) streak++;
            }
            return { assigned, completed, overdue, weekSecs, streak, weeklyCompleted };
        }

        function fmtTime(sec) {
            if (sec < 60) return sec > 0 ? sec + 's' : '—';
            const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
            return h ? h + 'h ' + m + 'm' : m + 'm';
        }

        const s = getStatsFor(user);
        const isEmpty = s.assigned === 0 && s.weekSecs === 0 && s.weeklyCompleted === 0;
        const cr = s.assigned > 0 ? Math.round((s.completed / s.assigned) * 100) : null;
        const overdueLabel = s.overdue === 0 ? 'nothing overdue ' + icon('check', 'sm')
            : s.overdue === 1 ? '1 thing waiting on you'
            : s.overdue + ' things waiting on you';

        if (isEmpty) {
            ywStats.innerHTML = '<p class="yw-empty">Your week fills in as you log time and complete tasks.</p>';
        } else {
            ywStats.innerHTML = `
                <div class="yw-stat-row">
                    <div class="yw-stat">
                        <div class="yw-stat-value">${cr !== null ? cr + '%' : '—'}</div>
                        <div class="yw-stat-label">${s.assigned > 0 ? s.completed + '/' + s.assigned + ' done overall' : 'no tasks yet'}</div>
                    </div>
                    <div class="yw-stat">
                        <div class="yw-stat-value">${s.weeklyCompleted}</div>
                        <div class="yw-stat-label">finished this week</div>
                    </div>
                    <div class="yw-stat">
                        <div class="yw-stat-value${s.overdue > 0 ? ' yw-overdue' : ''}">${s.overdue > 0 ? s.overdue : '—'}</div>
                        <div class="yw-stat-label">${overdueLabel}</div>
                    </div>
                    <div class="yw-stat">
                        <div class="yw-stat-value">${fmtTime(s.weekSecs)}</div>
                        <div class="yw-stat-label">logged this week</div>
                    </div>
                </div>`;
        }

        if (teamStrip) {
            teamStrip.innerHTML = ALL_USERS.map(u => {
                const ts = getStatsFor(u);
                const tcr = ts.assigned > 0 ? Math.round((ts.completed / ts.assigned) * 100) : null;
                const cls = u === 'MOHAMMED' ? 'mohammed' : u === 'EYAD' ? 'eyad' : 'yusuf';
                return `<div class="team-row">
                    <span class="team-av ${cls}">${esc(NAME[u][0])}</span>
                    <span class="team-name">${esc(NAME[u])}</span>
                    <span class="team-cr">${tcr !== null ? tcr + '%' : '—'}</span>
                    <span class="team-lbl">overall</span>
                    <span class="team-cr">${ts.weeklyCompleted}</span>
                    <span class="team-lbl">done this week</span>
                </div>`;
            }).join('');
        }
    }

    document.getElementById('ywAvatarTabs')?.addEventListener('click', e => {
        const btn = e.target.closest('.yw-tab');
        if (!btn) return;
        viewUser = btn.dataset.user;
        document.querySelectorAll('.yw-tab').forEach(b => b.classList.toggle('active', b === btn));
        renderYourWeek();
    });

    // ── Command Center ("What Needs Me") ──────────────────────────────────────
    // ── Team Pulse — animated "what happened" review, derived from existing timestamps ──
    let _pulseSeen = false;
    function renderPulse() {
        const feedEl    = document.getElementById('pulseFeed');
        const insightEl = document.getElementById('pulseInsight');
        if (!feedEl) return;

        const projName = {};
        projects.forEach(p => { projName[String(p.id)] = p.name; });

        const fmtDur = sec => {
            sec = Math.floor(sec);
            if (sec < 3600) return Math.max(1, Math.round(sec / 60)) + 'm';
            const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
            return m ? h + 'h ' + m + 'm' : h + 'h';
        };
        const relTime = ms => {
            const min = Math.floor((Date.now() - ms) / 60000);
            if (min < 1)  return 'just now';
            if (min < 60) return min + 'm ago';
            const hr = Math.floor(min / 60);
            if (hr < 24)  return hr + 'h ago';
            const days = Math.floor(hr / 24);
            if (days === 1) return 'yesterday';
            if (days < 7)   return days + 'd ago';
            const d = new Date(ms);
            return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()] + ' ' + d.getDate();
        };

        // One gentle insight line, scoped to this (Saturday-start) week
        function computeInsight() {
            const weekStart = getWeekStart().getTime();
            let teamSecs = 0;
            const perProj = {};
            Object.entries(projectTimeByProject || {}).forEach(([pid, td]) => {
                if (!td || !Array.isArray(td.sessions)) return;
                td.sessions.forEach(s => {
                    if (!s.endedAt || s.endedAt < weekStart) return;
                    teamSecs += (s.duration || 0);
                    (perProj[pid] = perProj[pid] || {});
                    perProj[pid][s.user] = (perProj[pid][s.user] || 0) + (s.duration || 0);
                });
            });
            for (const pid in perProj) {
                const users = perProj[pid];
                const total = Object.values(users).reduce((a, b) => a + b, 0);
                if (total < 3600 || !projName[pid]) continue;
                const top = Object.entries(users).sort((a, b) => b[1] - a[1])[0];
                if (top && top[1] / total >= 0.9 && Object.keys(users).length >= 1)
                    return `${NAME[top[0]] || top[0]} has carried ${projName[pid]} solo this week — worth a hand?`;
            }
            if (teamSecs >= 3600) return `The team logged ${fmtDur(teamSecs)} this week ` + icon('spark', 'sm');
            if (teamSecs > 0)     return `${fmtDur(teamSecs)} logged this week — momentum building.`;
            return `A fresh week. The first log sets the pace.`;
        }

        const acts = [];
        Object.entries(projectTasksByProject || {}).forEach(([pid, raw]) => {
            const arr = Array.isArray(raw) ? raw : Object.values(raw || {});
            arr.forEach(t => {
                if (t.completed && t.completedAt)
                    acts.push({ t: t.completedAt, kind: 'done', who: t.assignee || '', what: t.text || '', proj: projName[pid] || '' });
            });
        });
        Object.entries(projectTimeByProject || {}).forEach(([pid, td]) => {
            if (!td || !Array.isArray(td.sessions)) return;
            td.sessions.forEach(s => {
                if (s.endedAt && (s.duration || 0) >= 300)
                    acts.push({ t: s.endedAt, kind: 'time', who: NAME[s.user] || '', what: s.taskName || '', dur: s.duration, proj: projName[pid] || '' });
            });
        });
        projects.forEach(p => {
            if (p.createdAt) acts.push({ t: p.createdAt, kind: 'born', who: p.pitchedBy || '', what: p.name || '', proj: '' });
        });
        acts.sort((a, b) => b.t - a.t);
        const top = acts.slice(0, 6);

        const insightHtml = computeInsight();
        if (insightEl) insightEl.innerHTML = insightHtml;

        if (top.length === 0) {
            feedEl.innerHTML = `<div class=”pulse-empty”>No moves yet — what the team does will show up here.</div>`;
            return;
        }

        const animate = !_pulseSeen;
        const ICON = { done: icon('check', 'sm'), time: icon('timer', 'sm'), born: icon('spark', 'sm') };
        feedEl.innerHTML = top.map((a, i) => {
            const cls   = animate ? 'pulse-item animate' : 'pulse-item static';
            const delay = animate ? ` style=”animation-delay:${i * 70}ms”` : '';
            let line;
            if (a.kind === 'done')
                line = `<b>${esc(a.who)}</b> finished “${esc(a.what)}”${a.proj ? ` · ${esc(a.proj)}` : ''}`;
            else if (a.kind === 'time')
                line = `<b>${esc(a.who)}</b> logged ${fmtDur(a.dur)}${a.what ? ` on “${esc(a.what)}”` : ''}${a.proj ? ` · ${esc(a.proj)}` : ''}`;
            else
                line = `<b>${esc(a.what)}</b> was born${a.who ? `, pitched by ${esc(a.who)}` : ''}`;
            return `<div class=”${cls}”${delay}>`
                 + `<span class=”pulse-ic pulse-ic-${a.kind}”>${ICON[a.kind]}</span>`
                 + `<span class=”pulse-txt”>${line}</span>`
                 + `<span class=”pulse-when”>${relTime(a.t)}</span></div>`;
        }).join('');
        if (animate) _pulseSeen = true;

        // B5: show daily intro overlay if not seen today (only on first render, when animate was true)
        const todayStr2 = new Date().toISOString().slice(0, 10);
        const lastSeen = localStorage.getItem('pulseLastSeen');
        if (animate && lastSeen !== todayStr2 && top.length > 0) {
            const introItems = top.map(a => ({
                kind: a.kind || 'done',
                iconHtml: ICON[a.kind] || '',
                text: (() => {
                    if (a.kind === 'done') return `<b>${esc(a.who)}</b> finished “${esc(a.what)}”${a.proj ? ` · ${esc(a.proj)}` : ''}`;
                    if (a.kind === 'time') return `<b>${esc(a.who)}</b> logged ${fmtDur(a.dur)}${a.what ? ` on “${esc(a.what)}”` : ''}${a.proj ? ` · ${esc(a.proj)}` : ''}`;
                    return `<b>${esc(a.what)}</b> was born${a.who ? `, pitched by ${esc(a.who)}` : ''}`;
                })()
            }));
            showPulseIntro(introItems, insightHtml);
        }
    }

    // B5: Pulse Intro Overlay functions
    function showPulseIntro(topItems, insightHtml) {
        const overlay = document.getElementById('pulseIntroOverlay');
        const feed = document.getElementById('pioFeed');
        const insightEl = document.getElementById('pioInsight');
        const dismissBtn = document.getElementById('pioDismissBtn');
        if (!overlay || !feed) return;

        insightEl.innerHTML = insightHtml || '';
        feed.innerHTML = '';
        overlay.style.display = 'flex';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 300ms';
        setTimeout(() => { overlay.style.opacity = '1'; }, 20);

        topItems.forEach((a, i) => {
            const el = document.createElement('div');
            el.className = 'pio-item';
            el.style.cssText = 'opacity:0;transform:translateY(18px);';
            el.innerHTML = `<span class=”pulse-ic pulse-ic-${a.kind}”>${a.iconHtml || ''}</span><span class=”pio-txt”>${a.text}</span>`;
            feed.appendChild(el);
            setTimeout(() => {
                el.style.transition = 'opacity 380ms var(--ease-out-expo,cubic-bezier(0.16,1,0.3,1)), transform 380ms var(--ease-out-expo,cubic-bezier(0.16,1,0.3,1))';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 320 + i * 480);
        });

        const showDismiss = 320 + topItems.length * 480 + 420;
        setTimeout(() => {
            dismissBtn.style.transition = 'opacity 320ms';
            dismissBtn.style.opacity = '1';
            dismissBtn.style.pointerEvents = '';
        }, showDismiss);
    }

    function dismissPulseIntro() {
        const overlay = document.getElementById('pulseIntroOverlay');
        if (!overlay) return;
        overlay.style.transition = 'opacity 360ms';
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.display = 'none'; overlay.style.opacity = ''; }, 380);
        localStorage.setItem('pulseLastSeen', new Date().toISOString().slice(0, 10));
        _pulseSeen = true;
    }

    document.getElementById('pioDismissBtn')?.addEventListener('click', dismissPulseIntro);
    document.getElementById('pulseIntroOverlay')?.addEventListener('click', e => {
        if (!e.target.closest('#pioInner')) dismissPulseIntro();
    });

    function renderCommandCenter() {
        const el = document.getElementById('commandCenter');
        if (!el) return;
        const user = localStorage.getItem('currentUser');
        if (!user) return;
        const assigneeName = NAME[user];
        const now = new Date();
        const todayStr = dateStr(now.getFullYear(), now.getMonth(), now.getDate());

        // Index all tasks for blocker lookup
        const allTasksById = {};
        Object.values(projectTasksByProject).forEach(rawTasks => {
            const ptasks = Array.isArray(rawTasks) ? rawTasks : Object.values(rawTasks || {});
            ptasks.forEach(t => { allTasksById[String(t.id)] = t; });
        });

        const mine = [], floating = [], blocked = [];
        Object.entries(projectTasksByProject).forEach(([projKey, rawTasks]) => {
            const proj = projects.find(p => String(p.id) === projKey);
            const ptasks = Array.isArray(rawTasks) ? rawTasks : Object.values(rawTasks || {});
            ptasks.forEach(t => {
                if (t.completed) return;
                const entry = { ...t, proj };
                const blocker = t.blockedBy ? allTasksById[String(t.blockedBy)] : null;
                if (blocker && !blocker.completed) {
                    blocked.push(entry);
                } else if ((t.assignee || '') === assigneeName) {
                    mine.push(entry);
                } else if (!t.assignee || t.assignee === '') {
                    floating.push(entry);
                }
            });
        });

        mine.sort((a, b) => {
            const ao = (a.dueType === 'hard' && a.dueDate && a.dueDate < todayStr) ? 1 : 0;
            const bo = (b.dueType === 'hard' && b.dueDate && b.dueDate < todayStr) ? 1 : 0;
            if (ao !== bo) return bo - ao;
            if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
            return a.dueDate ? -1 : b.dueDate ? 1 : 0;
        });

        function makeRow(t) {
            const overdue = t.dueType === 'hard' && t.dueDate && t.dueDate < todayStr;
            const dot  = t.proj ? `<span class="cc-dot" style="background:${t.proj.color}"></span>` : '';
            const due  = t.dueDate ? `<span class="cc-due${overdue ? ' cc-due-hard' : ''}">${esc(t.dueDate)}</span>` : '';
            const proj = t.proj ? `<span class="cc-proj">${esc(t.proj.name)}</span>` : '';
            const div  = document.createElement('div');
            div.className = 'cc-row' + (t.proj ? ' cc-clickable' : '');
            div.innerHTML = `${dot}<span class="cc-text">${esc(t.text)}</span>${due}${proj}`;
            if (t.proj) div.addEventListener('click', () => {
                sessionStorage.setItem('activeProject', JSON.stringify(t.proj));
                window.location.href = 'project.html';
            });
            return div;
        }

        function makeBlockedRow(t) {
            const blocker = allTasksById[String(t.blockedBy)];
            const label = blocker
                ? `waiting on: ${esc(blocker.text)}${blocker.assignee ? ' · ' + esc(blocker.assignee) : ''}`
                : 'waiting on a task';
            const dot  = t.proj ? `<span class="cc-dot" style="background:${t.proj.color}"></span>` : '';
            const proj = t.proj ? `<span class="cc-proj">${esc(t.proj.name)}</span>` : '';
            const div  = document.createElement('div');
            div.className = 'cc-row cc-row-blocked' + (t.proj ? ' cc-clickable' : '');
            div.innerHTML = `${dot}<div class="cc-blocked-info"><span class="cc-text">${esc(t.text)}</span><span class="cc-waiting">${label}</span></div>${proj}`;
            if (t.proj) div.addEventListener('click', () => {
                sessionStorage.setItem('activeProject', JSON.stringify(t.proj));
                window.location.href = 'project.html';
            });
            return div;
        }

        el.innerHTML = '';
        [
            { label: 'Mine',     tasks: mine,     empty: 'Nothing on your plate right now.' },
            { label: 'Floating', tasks: floating,  empty: 'No unassigned tasks.' },
            { label: 'Blocked',  tasks: blocked,   empty: 'Nothing blocked.', isBlocked: true },
        ].forEach(lane => {
            const sec = document.createElement('div');
            sec.className = 'cc-lane';
            const hdr = document.createElement('div');
            hdr.className = 'cc-lane-hdr';
            hdr.innerHTML = `<span class="cc-lane-title">${lane.label}</span>${lane.tasks.length ? `<span class="cc-lane-count">${lane.tasks.length}</span>` : ''}`;
            sec.appendChild(hdr);
            if (!lane.tasks.length) {
                const p = document.createElement('p');
                p.className = 'cc-empty';
                p.textContent = lane.empty;
                sec.appendChild(p);
            } else {
                lane.tasks.forEach(t => sec.appendChild(lane.isBlocked ? makeBlockedRow(t) : makeRow(t)));
            }
            el.appendChild(sec);
        });
    }

    // ── Friday Session Timeline ───────────────────────────────────────────────
    function renderFridayTimeline() {
        const el = document.getElementById('fridayTimeline');
        if (!el) return;
        const MONS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const sorted = [...projects].filter(p => p.createdAt).sort((a, b) => b.createdAt - a.createdAt);
        el.innerHTML = '';
        if (!sorted.length) {
            el.innerHTML = '<p class="empty-text" style="padding:12px 0;font-style:italic;">No sessions yet. Start your first Friday session!</p>';
            return;
        }
        sorted.forEach(proj => {
            const d = new Date(proj.createdAt);
            const dateLabel = `${DAYS[d.getDay()]} ${MONS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
            const isPassive = (proj.status || 'active') === 'passive';
            const ownerCls  = proj.owner === 'Mohammed' ? 'mohammed' : proj.owner === 'Eyad' ? 'eyad' : 'yusuf';
            const ownerBadge = proj.owner
                ? `<span class="proj-owner-badge ${ownerCls}" style="width:16px;height:16px;font-size:.55rem;display:inline-flex" title="${esc(proj.owner)}">${esc(proj.owner[0].toUpperCase())}</span>`
                : '';
            const row = document.createElement('div');
            row.className = 'fs-row' + (isPassive ? ' fs-passive' : '');
            row.innerHTML = `
                <div class="fs-date">${dateLabel}</div>
                <div class="fs-body">
                    <div class="fs-idea">${esc(proj.idea || proj.name)}</div>
                    <div class="fs-meta">
                        ${proj.pitchedBy ? `<span class="fs-pitched">Pitched by ${esc(proj.pitchedBy)}</span>` : ''}
                        ${ownerBadge}
                        <span class="proj-status-badge ${isPassive ? 'passive' : 'active'}">${isPassive ? 'Paused' : 'Active'}</span>
                    </div>
                </div>`;
            row.addEventListener('click', () => {
                sessionStorage.setItem('activeProject', JSON.stringify(proj));
                window.location.href = 'project.html';
            });
            el.appendChild(row);
        });
    }

    // ── Calendar Widget (collapse/expand) ─────────────────────────────────────
    const calendarContainer = document.getElementById('calendarContainer');
    const calendarExpand    = document.getElementById('calendarExpand');
    const calToggleBtn      = document.getElementById('calToggleBtn');
    let calOpen = localStorage.getItem('calOpen') === 'true';

    function updateCalendarToggle() {
        calendarContainer?.classList.toggle('cal-open', calOpen);
        if (calToggleBtn) calToggleBtn.title = calOpen ? 'Collapse calendar' : 'Expand calendar';
    }
    updateCalendarToggle();

    calToggleBtn?.addEventListener('click', () => {
        calOpen = !calOpen;
        localStorage.setItem('calOpen', calOpen);
        updateCalendarToggle();
    });
    document.getElementById('calMonthLabel')?.addEventListener('click', () => {
        calOpen = !calOpen;
        localStorage.setItem('calOpen', calOpen);
        updateCalendarToggle();
    });

    // ── Project Page ──────────────────────────────────────────────────────────
    let _renderProjectTasks = null; // hoisted reference so init() can call it
    let _attachProjectSync = null;  // attaches project-page Firebase listeners after auth
    let _projectStopTimer    = null; // set by project page; lets logout call stopTimer before clearing currentUser
    const projectTodoList = document.getElementById('projectTodoList');
    if (projectTodoList) {
        // Load active project info and set page title
        const activeProj = JSON.parse(sessionStorage.getItem('activeProject'));
        const projectId  = activeProj ? String(activeProj.id) : 'unknown';
        if (activeProj) {
            const h1 = document.querySelector('.project-header h1');
            if (h1) h1.textContent = activeProj.name;
            const bar = document.querySelector('.project-header .progress-bar');
            if (bar) bar.style.background = activeProj.color;
            document.title = activeProj.name + ' — Startup Weekend';
        }

        let projectTasks = JSON.parse(localStorage.getItem('projectTasks_' + projectId)) || [];
        let briefData = { files: [] };
        const saveProjectTasks = () => {
            localStorage.setItem('projectTasks_' + projectId, JSON.stringify(projectTasks));
            if (!_fbSync) db.ref('data/projectTasksByProject/' + projectId).set(projectTasks);
        };

        const escH = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        const uid  = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
        const MAX_SESSION_SEC = 8 * 3600;

        // ── Origin card ───────────────────────────────────────────────────────
        if (activeProj) {
            const originCard = document.getElementById('projectOriginCard');
            if (originCard) {
                let hasAny = false;
                if (activeProj.createdAt) {
                    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                    const d = new Date(activeProj.createdAt);
                    const bornEl = document.getElementById('originBorn');
                    if (bornEl) {
                        document.getElementById('originBornVal').textContent = `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
                        bornEl.style.display = '';
                        hasAny = true;
                    }
                }
                if (activeProj.pitchedBy) {
                    const el = document.getElementById('originPitched');
                    if (el) { document.getElementById('originPitchedVal').textContent = activeProj.pitchedBy; el.style.display = ''; hasAny = true; }
                }
                if (activeProj.owner) {
                    const el = document.getElementById('originOwner');
                    if (el) { document.getElementById('originOwnerVal').textContent = activeProj.owner; el.style.display = ''; hasAny = true; }
                }
                if (activeProj.idea) {
                    const el = document.getElementById('originIdea');
                    if (el) { document.getElementById('originIdeaVal').textContent = activeProj.idea; el.style.display = ''; hasAny = true; }
                }
                if (hasAny) originCard.style.display = '';
            }
        }

        // Delete whole project button — placed after projectTasks/saveProjectTasks to avoid temporal dead zone
        document.getElementById('deleteProjectBtn')?.addEventListener('click', () => {
            const proj = JSON.parse(sessionStorage.getItem('activeProject'));
            if (!proj) return;
            if (!confirm(`Delete "${proj.name}" and all its tasks?`)) return;
            projects = projects.filter(p => p.id !== proj.id);
            saveProjects();
            db.ref('data/projectTasksByProject/' + proj.id).remove();
            db.ref('data/projectTimeByProject/' + proj.id).remove();
            sessionStorage.removeItem('activeProject');
            window.location.href = 'index.html';
        });

        function updateProjectProgress() {
            const { total, done } = roadmapStats();
            const pct = total ? Math.round(done / total * 100) : 0;
            const bar      = document.querySelector('.progress-bar');
            const pctLabel = document.querySelector('.progress-labels span:last-child');
            const meta     = document.querySelector('.project-meta');
            if (bar)      bar.style.width = pct + '%';
            if (pctLabel) pctLabel.textContent = pct + '%';
            if (meta)     meta.textContent = total === 0
                ? 'No roadmap steps yet'
                : `${done} of ${total} roadmap steps complete`;
        }

        function renderProjectTasks() {
            projectTodoList.innerHTML = '';
            if (projectTasks.length === 0) {
                const empty = document.createElement('li');
                empty.className = 'todo-item';
                empty.style.cssText = 'padding:20px 24px;color:var(--color-text-muted);font-size:14px;font-style:italic;';
                empty.textContent = 'No tasks yet. Add one above.';
                projectTodoList.appendChild(empty);
                updateProjectProgress();
                return;
            }
            const todayStr = new Date().toISOString().slice(0, 10);
            projectTasks.forEach(task => {
                const assigneeClass = task.assignee === 'Mohammed' ? 'tag-mohammed'
                    : task.assignee === 'Yusuf' ? 'tag-yusuf'
                    : task.assignee === 'Eyad' ? 'tag-eyad'
                    : 'tag-floating';
                const assigneeLabel = task.assignee || 'Floating';
                let blockedChip = '';
                if (task.blockedBy) {
                    const blocker = projectTasks.find(b => b.id == task.blockedBy);
                    if (blocker && !blocker.completed) {
                        blockedChip = `<span class="blocked-chip">${icon('lock', 'sm')} blocked by ${escH(blocker.text)}</span>`;
                    }
                }
                let dueDateChip = '';
                if (task.dueDate) {
                    const overdue = task.dueDate < todayStr && !task.completed;
                    if (task.dueType === 'loose') {
                        dueDateChip = `<span class="due-chip due-loose">${escH(task.dueDate)}</span>`;
                    } else {
                        dueDateChip = `<span class="due-chip due-hard${overdue ? ' due-overdue' : ''}">${escH(task.dueDate)}</span>`;
                    }
                }
                const li = document.createElement('li');
                li.className = 'todo-item managed' + (task.completed ? ' completed' : '');
                li.dataset.id = task.id;
                li.innerHTML = `
                    <div class="todo-main">
                        <div class="todo-left">
                            <label class="todo-label">
                                <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''}>
                                <span class="custom-checkbox"></span>
                                <span class="todo-text">${escH(task.text)}</span>
                            </label>
                        </div>
                        <div class="todo-right">
                            ${blockedChip}
                            ${dueDateChip}
                            <span class="assignee ${assigneeClass}">${escH(assigneeLabel)}</span>
                            <span class="task-time-chip" id="task-time-${task.id}" style="display:none;"></span>
                            <button class="task-action-btn task-timer-btn" data-task-timer="${task.id}" title="Track time on this task">${icon('timer', 'sm')}</button>
                            <button class="notes-toggle-btn task-action-btn" title="Notes">${task.notes ? icon('notes', 'sm') : icon('edit', 'sm')} Notes</button>
                            <button class="task-action-btn task-edit-btn" title="Edit">Edit</button>
                            <button class="task-action-btn task-delete-btn" title="Delete">${icon('trash', 'sm')}</button>
                        </div>
                    </div>
                    <div class="notes-container" style="display:none;">
                        <textarea class="notes-textarea" placeholder="Write notes for your team…">${escH(task.notes || '')}</textarea>
                    </div>`;

                projectTodoList.appendChild(li);

                li.querySelector('.todo-checkbox').addEventListener('change', function () {
                    const liveTask = projectTasks.find(x => x.id == task.id) || task;
                    liveTask.completed = this.checked;
                    liveTask.completedAt = this.checked ? Date.now() : null;
                    li.classList.toggle('completed', this.checked);
                    saveProjectTasks(); updateProjectProgress();
                });
                li.querySelector('.notes-toggle-btn').addEventListener('click', () => {
                    const nc     = li.querySelector('.notes-container');
                    const isOpen = nc.style.display !== 'none';
                    nc.style.display = isOpen ? 'none' : 'block';
                    if (!isOpen) setTimeout(() => li.querySelector('.notes-textarea').focus(), 50);
                });
                li.querySelector('.task-edit-btn').addEventListener('click', () => openProjectTaskModal(task));
                li.querySelector('.task-delete-btn').addEventListener('click', () => {
                    if (!confirm(`Delete "${task.text}"?`)) return;
                    projectTasks = projectTasks.filter(t => t.id !== task.id);
                    saveProjectTasks(); renderProjectTasks();
                });
                li.querySelector('.notes-textarea').addEventListener('input', function () {
                    const liveTask = projectTasks.find(x => x.id == task.id) || task;
                    liveTask.notes = this.value;
                    li.querySelector('.notes-toggle-btn').innerHTML = (this.value.trim() ? icon('notes', 'sm') : icon('edit', 'sm')) + ' Notes';
                    saveProjectTasks();
                });
            });
            updateProjectProgress();
        }

        const projectTaskModal    = document.getElementById('projectTaskModal');
        const projectTaskText     = document.getElementById('projectTaskText');
        const projectTaskAssignee = document.getElementById('projectTaskAssignee');
        const projectTaskEditId   = document.getElementById('projectTaskEditId');

        function openProjectTaskModal(task = null) {
            document.getElementById('projectTaskModalTitle').textContent = task ? 'Edit Task' : 'Add Task';
            projectTaskText.value     = task ? task.text     : '';
            projectTaskAssignee.value = task ? (task.assignee ?? 'Mohammed') : 'Mohammed';
            projectTaskEditId.value   = task ? task.id       : '';
            document.getElementById('projectTaskDueDate').value = task ? (task.dueDate || '') : '';
            document.getElementById('projectTaskDueType').value = task ? (task.dueType || 'hard') : 'hard';
            const blockedSel = document.getElementById('projectTaskBlockedBy');
            if (blockedSel) {
                blockedSel.innerHTML = '<option value="">None</option>';
                projectTasks.forEach(t => {
                    if (task && t.id == task.id) return;
                    const o = document.createElement('option');
                    o.value = t.id;
                    o.textContent = t.text.length > 45 ? t.text.slice(0, 45) + '…' : t.text;
                    blockedSel.appendChild(o);
                });
                blockedSel.value = task ? (task.blockedBy || '') : '';
            }
            projectTaskModal.style.display = 'flex';
            setTimeout(() => projectTaskText.focus(), 50);
        }

        document.getElementById('addProjectTaskBtn')?.addEventListener('click', () => openProjectTaskModal());
        document.getElementById('cancelProjectTaskBtn')?.addEventListener('click', () => { projectTaskModal.style.display = 'none'; });
        document.getElementById('saveProjectTaskBtn')?.addEventListener('click', () => {
            const text      = projectTaskText.value.trim();
            const assignee  = projectTaskAssignee.value;
            const editId    = projectTaskEditId.value;
            const dueDate   = document.getElementById('projectTaskDueDate').value || null;
            const dueType   = document.getElementById('projectTaskDueType').value || null;
            const blockedBy = document.getElementById('projectTaskBlockedBy')?.value || null;
            if (!text) return;
            if (editId) {
                const t = projectTasks.find(t => t.id == editId);
                if (t) { t.text = text; t.assignee = assignee; t.dueDate = dueDate; t.dueType = dueDate ? dueType : null; t.blockedBy = blockedBy; }
            } else {
                projectTasks.push({ id: uid(), text, assignee, completed: false, completedAt: null, notes: '', dueDate, dueType: dueDate ? dueType : null, blockedBy });
            }
            saveProjectTasks(); renderProjectTasks();
            projectTaskModal.style.display = 'none';
        });
        projectTaskModal?.addEventListener('click', e => { if (e.target === projectTaskModal) projectTaskModal.style.display = 'none'; });
        projectTaskText?.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('saveProjectTaskBtn').click(); });

        _renderProjectTasks = renderProjectTasks; // expose to init()

        // ── Time Tracker ─────────────────────────────────────────────────────────
        const TIME_KEY = 'projectTime_' + projectId;
        let editingTimeUser = null;   // user whose time block is being inline-edited (don't let render clobber it)

        function getCurrentUser() { return localStorage.getItem('currentUser'); }
        const ALL_USERS = ['MOHAMMED', 'EYAD', 'YUSUF'];

        function getOtherUsers() {
            const u = getCurrentUser();
            return ALL_USERS.filter(x => x !== u);
        }

        function loadTimeData() {
            const raw = JSON.parse(localStorage.getItem(TIME_KEY));
            if (!raw) return { sessions: [], activeSessions: { MOHAMMED: null, EYAD: null, YUSUF: null } };
            if (!Array.isArray(raw.sessions)) raw.sessions = [];
            if (!raw.activeSessions) raw.activeSessions = { MOHAMMED: null, EYAD: null, YUSUF: null };
            if (!raw.activeSessions.YUSUF) raw.activeSessions.YUSUF = null;
            return raw;
        }
        function saveTimeData(d) {
            localStorage.setItem(TIME_KEY, JSON.stringify(d));
            if (!_fbSync) db.ref('data/projectTimeByProject/' + projectId).set(d);
        }

        function fmtDuration(sec) {
            sec = Math.floor(sec);
            if (sec < 60) return `${sec}s`;
            const h = Math.floor(sec / 3600);
            const m = Math.floor((sec % 3600) / 60);
            return h ? `${h}h ${m}m` : `${m}m`;
        }
        function fmtClock(sec) {
            sec = Math.floor(sec);
            const h = Math.floor(sec / 3600);
            const m = Math.floor((sec % 3600) / 60);
            const s = sec % 60;
            return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        }

        function getUserTotal(d, user) {
            const done = d.sessions.filter(s => s.user === user).reduce((a, s) => a + s.duration, 0);
            const act  = d.activeSessions[user];
            return done + (act ? (Date.now() - act.startTime) / 1000 : 0);
        }
        function getTaskTotal(d, taskId) {
            const done = d.sessions.filter(s => s.taskId == taskId).reduce((a, s) => a + s.duration, 0);
            let act = 0;
            for (const u of ALL_USERS) {
                const a = d.activeSessions[u];
                if (a && a.taskId == taskId) act += (Date.now() - a.startTime) / 1000;
            }
            return done + act;
        }

        function populateTimerSelect() {
            const sel = document.getElementById('timerTaskSelect');
            if (!sel) return;
            const cur = sel.value;
            sel.innerHTML = '<option value="">No specific task</option>';

            // Roadmap steps (per tier, only undone)
            const hasTiers = projectRoadmap && projectRoadmap.tiers && projectRoadmap.tiers.length > 0;
            if (hasTiers) {
                projectRoadmap.tiers.forEach((tier, ti) => {
                    const undone = (tier.steps || []).filter(s => !s.done);
                    if (!undone.length) return;
                    const grp = document.createElement('optgroup');
                    grp.label = 'Tier ' + (ti + 1) + ' — ' + tier.title;
                    undone.forEach(s => {
                        const o = document.createElement('option');
                        o.value = 'rm:' + s.id;
                        o.textContent = s.title;
                        grp.appendChild(o);
                    });
                    sel.appendChild(grp);
                });
            }

            // Regular project tasks (only undone)
            const undone = projectTasks.filter(t => !t.completed);
            if (undone.length) {
                const taskGrp = hasTiers ? document.createElement('optgroup') : null;
                if (taskGrp) { taskGrp.label = 'Tasks'; sel.appendChild(taskGrp); }
                undone.forEach(t => {
                    const o = document.createElement('option');
                    o.value = t.id;
                    o.textContent = t.text;
                    (taskGrp || sel).appendChild(o);
                });
            }

            if (cur) sel.value = cur;
        }

        function stopTimer() {
            const user = getCurrentUser(); if (!user) return;
            const d = loadTimeData();
            const active = d.activeSessions[user];
            if (!active) return;
            const dur = Math.min(Math.floor((Date.now() - active.startTime) / 1000), MAX_SESSION_SEC);
            if (dur > 0) d.sessions.push({ id: uid(), user, taskId: active.taskId, taskName: active.taskName, duration: dur, endedAt: Date.now() });
            d.activeSessions[user] = null;
            saveTimeData(d);
            renderTimerUI();
        }

        function trackTask(taskId) {
            const user = getCurrentUser(); if (!user) return;
            const d = loadTimeData();
            const active = d.activeSessions[user];
            if (active && active.taskId == taskId) { stopTimer(); return; }
            if (active) {
                const dur = Math.min(Math.floor((Date.now() - active.startTime) / 1000), MAX_SESSION_SEC);
                if (dur > 0) d.sessions.push({ id: uid(), user, taskId: active.taskId, taskName: active.taskName, duration: dur, endedAt: Date.now() });
            }
            const task = projectTasks.find(t => t.id == taskId);
            d.activeSessions[user] = { taskId, taskName: task ? task.text : null, startTime: Date.now(), lastTick: Date.now() };
            saveTimeData(d);
            renderTimerUI();
        }

        function renderTimerUI() {
            const user = getCurrentUser();
            const d    = loadTimeData();
            const ABANDON_MS = 90 * 1000;   // no heartbeat this long ⇒ app was closed; don't count the gap
            const FB_BEAT_MS = 30 * 1000;   // how often a live session pings Firebase so other devices see it
            if (user && d.activeSessions[user]) {
                const act    = d.activeSessions[user];
                const last   = act.lastTick || act.startTime;            // last moment the page was provably open
                const openSec = Math.floor((last - act.startTime) / 1000); // time actually spent with page open
                if (Date.now() - last > ABANDON_MS) {
                    // Timer was left running while the app was closed / navigated away.
                    // Commit only the time the page was actually open, then stop — never the closed gap.
                    const dur = Math.min(Math.max(openSec, 0), MAX_SESSION_SEC);
                    if (dur > 0) d.sessions.push({ id: uid(), user, taskId: act.taskId, taskName: act.taskName, duration: dur, endedAt: last });
                    d.activeSessions[user] = null;
                    saveTimeData(d);
                } else if (openSec >= MAX_SESSION_SEC) {
                    // Ran continuously past the 8h cap.
                    d.sessions.push({ id: uid(), user, taskId: act.taskId, taskName: act.taskName, duration: MAX_SESSION_SEC, endedAt: Date.now() });
                    d.activeSessions[user] = null;
                    saveTimeData(d);
                } else {
                    // Alive: heartbeat. localStorage every tick (cheap); Firebase every ~30s (liveness for peers).
                    act.lastTick = Date.now();
                    if (Date.now() - (act.fbBeat || 0) > FB_BEAT_MS) {
                        act.fbBeat = Date.now();
                        saveTimeData(d);
                    } else {
                        localStorage.setItem(TIME_KEY, JSON.stringify(d));
                    }
                }
            }
            const active = user ? d.activeSessions[user] : null;

            const mSec = getUserTotal(d, 'MOHAMMED');
            const eSec = getUserTotal(d, 'EYAD');
            const ySec = getUserTotal(d, 'YUSUF');
            const tSec = mSec + eSec + ySec;
            const totalEl = document.getElementById('totalProjectTime');
            const mEl     = document.getElementById('mohammedTime');
            const eEl     = document.getElementById('eyadTime');
            const yEl     = document.getElementById('yusufTime');
            if (totalEl) totalEl.textContent = tSec >= 1 ? fmtDuration(tSec) : '—';
            [['MOHAMMED', mEl, mSec], ['EYAD', eEl, eSec], ['YUSUF', yEl, ySec]].forEach(([u, el, sec]) => {
                if (!el || editingTimeUser === u) return;   // don't overwrite an in-progress inline edit
                el.textContent = sec >= 1 ? fmtDuration(sec) : '—';
            });

            const idlePanel = document.getElementById('timerIdlePanel');
            const runPanel  = document.getElementById('timerRunningPanel');
            if (active) {
                if (idlePanel) idlePanel.style.display = 'none';
                if (runPanel)  runPanel.style.display  = 'flex';
                const elapsed = (Date.now() - active.startTime) / 1000;
                const clockEl = document.getElementById('timerClock');
                const taskEl  = document.getElementById('timerRunningTask');
                if (clockEl) clockEl.textContent = fmtClock(elapsed);
                if (taskEl)  taskEl.textContent  = active.taskName ? `Working on: "${active.taskName}"` : 'No task selected';
            } else {
                if (idlePanel) idlePanel.style.display = 'flex';
                if (runPanel)  runPanel.style.display  = 'none';
                populateTimerSelect();
            }

            const nameMap = { MOHAMMED: 'Mohammed', EYAD: 'Eyad', YUSUF: 'Yusuf' };
            const partnerEl    = document.getElementById('partnerStatus');
            const partnerTxtEl = document.getElementById('partnerStatusText');
            if (partnerEl) {
                const activeOthers = user ? getOtherUsers()
                    .map(u => ({ u, a: d.activeSessions[u] }))
                    .filter(x => x.a) : [];
                if (activeOthers.length > 0) {
                    partnerTxtEl.textContent = activeOthers.map(({ u, a }) => {
                        const elapsed = (Date.now() - a.startTime) / 1000;
                        const tPart = a.taskName ? ` on "${a.taskName}"` : '';
                        return `${nameMap[u]} is working${tPart} · ${fmtDuration(elapsed)}`;
                    }).join('  ·  ');
                    partnerEl.style.display = 'flex';
                } else {
                    partnerEl.style.display = 'none';
                }
            }

            projectTasks.forEach(t => {
                const chip = document.getElementById(`task-time-${t.id}`);
                const btn  = document.querySelector(`[data-task-timer="${t.id}"]`);
                const sec  = getTaskTotal(d, t.id);
                if (chip) {
                    if (sec >= 60) { chip.textContent = fmtDuration(sec); chip.style.display = 'inline-flex'; }
                    else { chip.style.display = 'none'; }
                }
                if (btn) {
                    const tracking = active && active.taskId == t.id;
                    btn.classList.toggle('tracking', tracking);
                    btn.title = tracking ? 'Stop tracking this task' : 'Track time on this task';
                }
            });
        }

        // ── Inline time editing: tap a person's total, type the corrected value ────
        function committedUserTotal(d, user) {
            return d.sessions.filter(s => s.user === user).reduce((a, s) => a + (s.duration || 0), 0);
        }
        function fmtHM(sec) {
            sec = Math.max(0, Math.floor(sec));
            const h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60);
            if (h && m) return `${h}h ${m}m`;
            if (h)      return `${h}h`;
            return `${m}m`;
        }
        // Accepts "2h 30m", "2h", "45m", "1.5h", or a bare number (= minutes). Returns seconds, or null if unparseable.
        function parseTimeInput(str) {
            if (str == null) return null;
            str = String(str).trim().toLowerCase();
            if (!str) return null;
            const hM = str.match(/(\d+(?:\.\d+)?)\s*h/);
            const mM = str.match(/(\d+(?:\.\d+)?)\s*m/);
            let sec = 0, matched = false;
            if (hM) { sec += parseFloat(hM[1]) * 3600; matched = true; }
            if (mM) { sec += parseFloat(mM[1]) * 60;   matched = true; }
            if (!matched) {
                const n = parseFloat(str);
                if (isNaN(n)) return null;
                sec = n * 60;   // bare number = minutes
            }
            return Math.max(0, Math.round(sec));
        }
        function commitTimeEdit(user, raw) {
            const target = parseTimeInput(raw);
            editingTimeUser = null;
            if (target == null) { renderTimerUI(); return; }   // unparseable → leave as-is
            const d = loadTimeData();
            const delta = target - committedUserTotal(d, user);
            if (delta !== 0) {
                d.sessions.push({ id: uid(), user, taskId: null, taskName: 'Manual adjustment', duration: delta, endedAt: Date.now(), manual: true });
            }
            saveTimeData(d);
            renderTimerUI();
        }
        function beginEditTime(user, el) {
            if (!el || editingTimeUser) return;
            editingTimeUser = user;
            const cur = getUserTotal(loadTimeData(), user);
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'time-edit-input';
            input.value = fmtHM(cur);
            el.textContent = '';
            el.appendChild(input);
            input.focus();
            input.select();
            let done = false;
            const finish = save => {
                if (done) return; done = true;
                if (save) commitTimeEdit(user, input.value);
                else { editingTimeUser = null; renderTimerUI(); }
            };
            input.addEventListener('keydown', e => {
                if (e.key === 'Enter')  { e.preventDefault(); finish(true); }
                if (e.key === 'Escape') { e.preventDefault(); finish(false); }
            });
            input.addEventListener('blur', () => finish(true));
        }
        function setupTimeEditing() {
            [['MOHAMMED', 'mohammedTime'], ['EYAD', 'eyadTime'], ['YUSUF', 'yusufTime']].forEach(([user, id]) => {
                const el = document.getElementById(id);
                if (!el || el.dataset.editWired) return;
                el.dataset.editWired = '1';
                el.classList.add('time-editable');
                el.title = `Click to edit ${user[0]}${user.slice(1).toLowerCase()}'s time`;
                el.addEventListener('click', () => beginEditTime(user, el));
            });
        }

        document.getElementById('startTimerBtn')?.addEventListener('click', () => {
            const user = getCurrentUser(); if (!user) return;
            const sel    = document.getElementById('timerTaskSelect');
            const selVal = sel && sel.value ? sel.value : null;
            let taskId = selVal, taskName = null;
            if (selVal && selVal.startsWith('rm:')) {
                const stepId = selVal.slice(3);
                let foundStep = null;
                (projectRoadmap.tiers || []).forEach(t => {
                    const s = (t.steps||[]).find(x => x.id === stepId);
                    if (s) foundStep = s;
                });
                taskName = foundStep ? foundStep.title : selVal;
            } else if (selVal) {
                const task = projectTasks.find(t => t.id == selVal);
                taskName = task ? task.text : null;
            }
            const d      = loadTimeData();
            const existing = d.activeSessions[user];
            if (existing) {
                const dur = Math.min(Math.floor((Date.now() - existing.startTime) / 1000), MAX_SESSION_SEC);
                if (dur > 0) d.sessions.push({ id: uid(), user, taskId: existing.taskId, taskName: existing.taskName, duration: dur, endedAt: Date.now() });
            }
            d.activeSessions[user] = { taskId, taskName, startTime: Date.now(), lastTick: Date.now() };
            saveTimeData(d);
            renderTimerUI();
        });

        document.getElementById('stopTimerBtn')?.addEventListener('click', stopTimer);

        projectTodoList.addEventListener('click', e => {
            const btn = e.target.closest('.task-timer-btn');
            if (btn) trackTask(btn.dataset.taskTimer);
        });

        document.getElementById('timerCollapseBtn')?.addEventListener('click', () => {
            const body = document.getElementById('timerBody');
            const btn  = document.getElementById('timerCollapseBtn');
            if (!body) return;
            const hiding = body.style.display !== 'none';
            body.style.display = hiding ? 'none' : 'block';
            if (btn) btn.textContent = hiding ? 'show' : 'hide';
            localStorage.setItem('timerCollapsed', hiding);
        });

        if (localStorage.getItem('timerCollapsed') === 'true') {
            const body = document.getElementById('timerBody');
            const btn  = document.getElementById('timerCollapseBtn');
            if (body) { body.style.display = 'none'; if (btn) btn.textContent = 'show'; }
        }

        _projectStopTimer = stopTimer;

        // Leaving the project page stamps the moment we left so a forgotten timer,
        // on reopen, stops and counts only up to here — never the time spent away/closed.
        window.addEventListener('pagehide', () => {
            const user = getCurrentUser(); if (!user) return;
            const d = loadTimeData();
            const act = d.activeSessions[user];
            if (!act) return;
            act.lastTick = Date.now();
            localStorage.setItem(TIME_KEY, JSON.stringify(d));
            try { db.ref('data/projectTimeByProject/' + projectId).set(d); } catch (e) {}
        });

        // ── Firebase real-time sync (project page) — attached after auth ───────
        function attachProjectSync() {
            let ptSeeded = false;
            db.ref('data/projectTasksByProject/' + projectId).off();
            db.ref('data/projectTasksByProject/' + projectId).on('value', snap => {
                const val = snap.val();
                if (val !== null) {
                    _fbSync = true;
                    try {
                        projectTasks = val;
                        localStorage.setItem('projectTasks_' + projectId, JSON.stringify(projectTasks));
                        const ae = document.activeElement;
                        if (!ae || !ae.classList.contains('notes-textarea')) renderProjectTasks();
                    } finally {
                        _fbSync = false;
                    }
                    ptSeeded = true;
                } else if (!ptSeeded) {
                    // First-ever snapshot is empty: one-time seed of legacy local-only tasks.
                    ptSeeded = true;
                    if (projectTasks.length > 0) db.ref('data/projectTasksByProject/' + projectId).set(projectTasks);
                } else {
                    // Cloud emptied after we had data → a real delete-all. Apply it, never resurrect.
                    _fbSync = true;
                    try {
                        projectTasks = [];
                        localStorage.setItem('projectTasks_' + projectId, JSON.stringify(projectTasks));
                        const ae = document.activeElement;
                        if (!ae || !ae.classList.contains('notes-textarea')) renderProjectTasks();
                    } finally {
                        _fbSync = false;
                    }
                }
            });
            db.ref('data/projectTimeByProject/' + projectId).off();
            db.ref('data/projectTimeByProject/' + projectId).on('value', snap => {
                const val = snap.val();
                if (val !== null) {
                    _fbSync = true;
                    localStorage.setItem(TIME_KEY, JSON.stringify(val));
                    try { renderTimerUI(); } finally { _fbSync = false; }
                } else {
                    const local = JSON.parse(localStorage.getItem(TIME_KEY));
                    if (local) db.ref('data/projectTimeByProject/' + projectId).set(local);
                }
            });
            db.ref('data/projectBriefByProject/' + projectId).off();
            db.ref('data/projectBriefByProject/' + projectId).on('value', snap => {
                const raw = snap.val();
                if (!raw) {
                    briefData = { files: [] };
                } else if (raw.html !== undefined) {
                    // Legacy format — normalize in memory, don't rewrite Firebase
                    briefData = { files: [{ id: 'legacy', html: raw.html, filename: raw.filename || 'brief.html', uploadedAt: raw.updatedAt || Date.now(), uploadedBy: raw.updatedBy || '' }] };
                } else {
                    briefData = raw;
                    if (!Array.isArray(briefData.files)) briefData.files = [];
                }
                renderBrief();
            });
            db.ref('data/projectRoadmapByProject/' + projectId).off();
            db.ref('data/projectRoadmapByProject/' + projectId).on('value', snap => {
                const val = snap.val();
                if (val) {
                    _fbSync = true;
                    try {
                        projectRoadmap = val;
                        if (!Array.isArray(projectRoadmap.tiers)) projectRoadmap.tiers = [];
                        localStorage.setItem('roadmap_' + projectId, JSON.stringify(projectRoadmap));
                        renderRoadmap();
                    } finally { _fbSync = false; }
                }
            });
        }
        _attachProjectSync = attachProjectSync;

        // ── Project Roadmap (tiers → steps journey map) ───────────────────────
        let projectRoadmap = JSON.parse(localStorage.getItem('roadmap_' + projectId)) || { tiers: [] };
        if (!Array.isArray(projectRoadmap.tiers)) projectRoadmap.tiers = [];
        const saveRoadmap = () => {
            localStorage.setItem('roadmap_' + projectId, JSON.stringify(projectRoadmap));
            if (!_fbSync) db.ref('data/projectRoadmapByProject/' + projectId).set(projectRoadmap);
        };

        function roadmapStats() {
            let total = 0, done = 0;
            projectRoadmap.tiers.forEach(t => (t.steps || []).forEach(s => {
                total++;
                if (s.done) done++;
            }));
            return { total, done };
        }

        function formatShortDate(iso) {
            const [y,m,day] = iso.split('-');
            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            return months[parseInt(m)-1] + ' ' + parseInt(day);
        }

        function renderRoadmap() {
            const wrap = document.getElementById('roadmap');
            if (!wrap) return;
            const { total, done } = roadmapStats();
            const metaEl = document.getElementById('roadmapMeta');
            if (metaEl) metaEl.textContent = total ? `${done} / ${total} steps` : '';

            // A3: compute incoming tier IDs (tiers that are targets of a connection)
            const incomingTierIds = new Set();
            projectRoadmap.tiers.forEach(t => (t.steps||[]).forEach(s => {
                if (s.connectsToTierId) incomingTierIds.add(s.connectsToTierId);
            }));

            let html = '';
            if (projectRoadmap.tiers.length === 0) {
                html += `<div class="rm-empty">No roadmap yet. Add a <b>tier</b> — a major milestone on the way to the full vision — then break it into <b>steps</b>. You'll see exactly where you are on the path.</div>`;
            } else {
                projectRoadmap.tiers.forEach((tier, ti) => {
                    const steps = tier.steps || [];
                    const tierDone    = steps.length > 0 && steps.every(s => s.done);
                    const tierStarted = !!tier.started;
                    const tierActive  = tierStarted && !tierDone;
                    const tierLocked  = !tierStarted && !tierDone;
                    // per-active-tier "you are here" step
                    const currentStepId = tierActive
                        ? (steps.find(s => !s.done) || {}).id || null
                        : null;
                    let tierClass = 'rm-tier';
                    if (tierDone)   tierClass += ' rm-tier-done';
                    if (tierActive) tierClass += ' rm-tier-active';
                    if (tierLocked) tierClass += ' rm-tier-locked';
                    if (incomingTierIds.has(tier.id)) tierClass += ' rm-tier-incoming';

                    // A2: deadline chip
                    const today = new Date().toISOString().slice(0,10);
                    const dlState = !tier.deadline ? 'rm-tier-deadline-empty'
                        : (!tierDone && tier.deadline < today) ? 'rm-tier-deadline-overdue'
                        : 'rm-tier-deadline-set';
                    const dlLabel = tier.deadline
                        ? (tier.timeSensitive ? '<span class="rm-urgent-dot"></span>' : '') + formatShortDate(tier.deadline)
                        : 'deadline';
                    const dlChip = `<button class="rm-tier-deadline ${dlState}" data-tier="${tier.id}" title="Set deadline">${icon('calendar','sm')} ${dlLabel}</button>`;

                    let startBtn = '';
                    if (tierLocked) {
                        startBtn = `<button class="rm-start-btn" data-tier="${tier.id}" title="Start this tier">${icon('play','sm')} Start</button>`;
                    }

                    let stepsHtmlParts = [];
                    steps.forEach(s => {
                        let state;
                        if (s.done) {
                            state = 'done';
                        } else if (tierLocked) {
                            state = 'future';
                        } else if (s.id === currentStepId) {
                            state = 'current';
                        } else {
                            state = 'future';
                        }
                        const hereTag = (state === 'current') ? '<span class="rm-here">you are here</span>' : '';
                        // Assignee avatar or assign button (A1)
                        let assigneeEl = '';
                        if (s.assignee) {
                            const initial = s.assignee.charAt(0).toUpperCase();
                            assigneeEl = `<span class="rm-step-av rm-step-av-${escH(s.assignee.toLowerCase())}" data-tier="${tier.id}" data-step="${s.id}">${initial}</span>`;
                        } else {
                            assigneeEl = `<button class="rm-step-assign-btn" data-tier="${tier.id}" data-step="${s.id}" title="Assign">${icon('user','sm')}</button>`;
                        }
                        // Connect button (A3)
                        const connActive = !!s.connectsToTierId;
                        const connTarget = connActive ? projectRoadmap.tiers.findIndex(t => t.id === s.connectsToTierId) + 1 : null;
                        const connBtn = `<button class="rm-connect-btn${connActive ? ' rm-connect-active' : ''}" data-tier="${tier.id}" data-step="${s.id}" title="Connect to tier">${connActive ? '<span class="rm-conn-badge">→T' + connTarget + '</span>' : icon('chevronRight','sm')}</button>`;
                        let stepRowHtml = `<div class="rm-step ${state}" data-tier="${tier.id}" data-step="${s.id}">
                            <span class="rm-node" data-tier="${tier.id}" data-step="${s.id}"></span>
                            <span class="rm-step-title" data-tier="${tier.id}" data-step="${s.id}">${escH(s.title)}</span>
                            ${hereTag}
                            <button class="rm-del rm-del-step" data-tier="${tier.id}" data-step="${s.id}" title="Delete step">${icon('close', 'sm')}</button>
                            ${assigneeEl}
                            ${connBtn}
                        </div>`;
                        // Crossover connector (A3)
                        if (s.connectsToTierId) {
                            const targetIdx = projectRoadmap.tiers.findIndex(t => t.id === s.connectsToTierId) + 1;
                            stepRowHtml += `<div class="rm-crossover-connector"><div class="rm-xover-line"></div><span class="rm-xover-label">→ Tier ${targetIdx}</span></div>`;
                        }
                        stepsHtmlParts.push(stepRowHtml);
                    });
                    const stepsHtml = stepsHtmlParts.join('');
                    const ghostStep = `<div class="rm-add-ghost rm-add-ghost-step" data-tier="${tier.id}">${icon('plus','sm')} add step</div>`;

                    html += `<div class="${tierClass}" data-tier-id="${tier.id}">
                        <div class="rm-tier-head">
                            <span class="rm-tier-badge">${tierDone ? icon('check', 'sm') : (ti + 1)}</span>
                            <span class="rm-tier-title" data-tier="${tier.id}">${escH(tier.title)}</span>
                            ${dlChip}
                            ${startBtn}
                            <button class="rm-del rm-del-tier" data-tier="${tier.id}" title="Delete tier">${icon('trash', 'sm')}</button>
                        </div>
                        <div class="rm-steps">${stepsHtml}${ghostStep}</div>
                    </div>`;
                });
            }
            // Ghost "add tier" card at bottom
            html += `<div class="rm-add-ghost rm-add-ghost-tier">${icon('plus','sm')} add tier</div>`;
            wrap.innerHTML = html;
            updateProjectProgress();
            populateTimerSelect();
        }

        // Helper: swap an element to an inline input, call onCommit(value) on Enter/blur-save, cancel on Esc/blur-empty
        function rmInlineEdit(container, inputClass, placeholder, initialValue, onCommit) {
            const inp = document.createElement('input');
            inp.type = 'text';
            inp.className = inputClass;
            inp.placeholder = placeholder;
            if (initialValue) inp.value = initialValue;
            container.innerHTML = '';
            container.appendChild(inp);
            inp.focus();
            if (initialValue) { inp.select(); }
            let committed = false;
            const commit = () => {
                if (committed) return;
                committed = true;
                const v = inp.value.trim();
                if (v) onCommit(v);
                else renderRoadmap();
            };
            const cancel = () => {
                if (committed) return;
                committed = true;
                renderRoadmap();
            };
            inp.addEventListener('keydown', ev => {
                if (ev.key === 'Enter') { ev.preventDefault(); commit(); }
                else if (ev.key === 'Escape') { ev.preventDefault(); cancel(); }
            });
            inp.addEventListener('blur', () => {
                if (!committed) {
                    const v = inp.value.trim();
                    if (v) commit(); else cancel();
                }
            });
        }

        // A1: Quick-assign bar shown after adding a new step
        function showQuickAssign(stepId) {
            const stepEl = document.querySelector(`.rm-step[data-step="${stepId}"]`);
            if (!stepEl) return;
            const qa = document.createElement('div');
            qa.className = 'rm-step-quick-assign';
            qa.dataset.step = stepId;
            qa.innerHTML = `<span class="rm-qa-label">Assign:</span>
                <button class="rm-qav rm-qav-m" data-step="${stepId}" data-assignee="Mohammed" title="Mohammed">M</button>
                <button class="rm-qav rm-qav-e" data-step="${stepId}" data-assignee="Eyad" title="Eyad">E</button>
                <button class="rm-qav rm-qav-y" data-step="${stepId}" data-assignee="Yusuf" title="Yusuf">Y</button>
                <button class="rm-qav rm-qav-skip" data-step="${stepId}" data-assignee="" title="Skip">·</button>`;
            stepEl.insertAdjacentElement('afterend', qa);

            // Auto-dismiss after 4 seconds
            const t = setTimeout(() => qa.remove(), 4000);
            qa.querySelectorAll('.rm-qav').forEach(btn => {
                btn.addEventListener('click', () => {
                    clearTimeout(t);
                    const tierId = projectRoadmap.tiers.find(tier =>
                        (tier.steps||[]).find(s => s.id === stepId))?.id;
                    const tier = projectRoadmap.tiers.find(t => t.id === tierId);
                    const step = tier && (tier.steps||[]).find(s => s.id === stepId);
                    if (step) { step.assignee = btn.dataset.assignee; saveRoadmap(); }
                    qa.remove();
                    renderRoadmap();
                });
            });
        }

        document.getElementById('addTierBtn')?.addEventListener('click', () => {
            const wrap = document.getElementById('roadmap');
            if (!wrap) return;
            const ghost = wrap.querySelector('.rm-add-ghost-tier');
            if (ghost) ghost.click();
        });

        document.getElementById('roadmap')?.addEventListener('click', e => {
            // Inline rename: tier title
            const tierTitleEl = e.target.closest('.rm-tier-title[data-tier]');
            if (tierTitleEl && !tierTitleEl.querySelector('input')) {
                e.stopPropagation();
                const tierId = tierTitleEl.dataset.tier;
                const tier = projectRoadmap.tiers.find(t => t.id === tierId);
                if (!tier) return;
                rmInlineEdit(tierTitleEl, 'rm-tier-title-input', 'Tier name…', tier.title, v => {
                    tier.title = v; saveRoadmap(); renderRoadmap();
                });
                return;
            }

            // Inline rename: step title
            const stepTitleEl = e.target.closest('.rm-step-title[data-tier]');
            if (stepTitleEl && !stepTitleEl.querySelector('input')) {
                e.stopPropagation();
                const tierId = stepTitleEl.dataset.tier;
                const stepId = stepTitleEl.dataset.step;
                const tier = projectRoadmap.tiers.find(t => t.id === tierId);
                const step = tier && (tier.steps || []).find(s => s.id === stepId);
                if (!step) return;
                rmInlineEdit(stepTitleEl, 'rm-inline-input', 'Step name…', step.title, v => {
                    step.title = v; saveRoadmap(); renderRoadmap();
                });
                return;
            }

            // Toggle done: click on the node dot only
            const nodeEl = e.target.closest('.rm-node[data-tier]');
            if (nodeEl) {
                e.stopPropagation();
                const tier = projectRoadmap.tiers.find(t => t.id === nodeEl.dataset.tier);
                const step = tier && (tier.steps || []).find(s => s.id === nodeEl.dataset.step);
                if (step) { step.done = !step.done; saveRoadmap(); renderRoadmap(); }
                return;
            }

            // Delete tier
            const delTier = e.target.closest('.rm-del-tier');
            if (delTier) {
                const tier = projectRoadmap.tiers.find(t => t.id === delTier.dataset.tier);
                if (tier && confirm(`Delete tier "${tier.title}" and its steps?`)) {
                    projectRoadmap.tiers = projectRoadmap.tiers.filter(t => t.id !== delTier.dataset.tier);
                    saveRoadmap(); renderRoadmap();
                }
                return;
            }

            // Delete step
            const delStep = e.target.closest('.rm-del-step');
            if (delStep) {
                const tier = projectRoadmap.tiers.find(t => t.id === delStep.dataset.tier);
                if (tier) {
                    tier.steps = (tier.steps || []).filter(s => s.id !== delStep.dataset.step);
                    saveRoadmap(); renderRoadmap();
                }
                return;
            }

            // Start tier
            const startBtn = e.target.closest('.rm-start-btn');
            if (startBtn) {
                const tier = projectRoadmap.tiers.find(t => t.id === startBtn.dataset.tier);
                if (tier) { tier.started = true; saveRoadmap(); renderRoadmap(); }
                return;
            }

            // A1: Click assigned avatar → cycle: Mohammed→Eyad→Yusuf→''→Mohammed
            const stepAv = e.target.closest('.rm-step-av');
            if (stepAv) {
                const tier = projectRoadmap.tiers.find(t => t.id === stepAv.dataset.tier);
                const step = tier && (tier.steps || []).find(s => s.id === stepAv.dataset.step);
                if (step) {
                    const cycle = ['Mohammed','Eyad','Yusuf',''];
                    const idx = cycle.indexOf(step.assignee || '');
                    step.assignee = cycle[(idx + 1) % cycle.length];
                    saveRoadmap(); renderRoadmap();
                }
                return;
            }
            // A1: Click unassigned btn → cycle to Mohammed first
            const assignBtn = e.target.closest('.rm-step-assign-btn');
            if (assignBtn) {
                const tier = projectRoadmap.tiers.find(t => t.id === assignBtn.dataset.tier);
                const step = tier && (tier.steps || []).find(s => s.id === assignBtn.dataset.step);
                if (step) { step.assignee = 'Mohammed'; saveRoadmap(); renderRoadmap(); }
                return;
            }

            // A2: Deadline chip → show popover
            const dlBtn = e.target.closest('.rm-tier-deadline');
            if (dlBtn && !dlBtn.closest('.rm-deadline-popover')) {
                e.stopPropagation();
                // Close any existing popover
                document.querySelectorAll('.rm-deadline-popover').forEach(p => p.remove());
                const tierId = dlBtn.dataset.tier;
                const tier = projectRoadmap.tiers.find(t => t.id === tierId);
                if (!tier) return;
                const pop = document.createElement('div');
                pop.className = 'rm-deadline-popover';
                pop.innerHTML = `
                    <label class="rm-dl-label">Deadline
                      <input type="date" class="rm-deadline-input" value="${tier.deadline || ''}">
                    </label>
                    <label class="rm-ts-label">
                      <input type="checkbox" class="rm-ts-check" ${tier.timeSensitive ? 'checked' : ''}> Time-sensitive
                    </label>
                    <div class="rm-dl-actions">
                      <button class="rm-dl-save">Save</button>
                      <button class="rm-dl-clear">Clear</button>
                    </div>`;
                dlBtn.parentElement.appendChild(pop);
                // Position popover below the button
                pop.style.position = 'absolute';
                pop.style.top = (dlBtn.offsetTop + dlBtn.offsetHeight + 4) + 'px';
                pop.style.left = dlBtn.offsetLeft + 'px';

                pop.querySelector('.rm-dl-save').addEventListener('click', () => {
                    const dateVal = pop.querySelector('.rm-deadline-input').value;
                    const tsVal = pop.querySelector('.rm-ts-check').checked;
                    tier.deadline = dateVal || null;
                    tier.timeSensitive = tsVal && !!dateVal;
                    saveRoadmap(); pop.remove(); renderRoadmap();
                });
                pop.querySelector('.rm-dl-clear').addEventListener('click', () => {
                    tier.deadline = null; tier.timeSensitive = false;
                    saveRoadmap(); pop.remove(); renderRoadmap();
                });
                const closePopover = (ev) => {
                    if (!ev.target.closest('.rm-deadline-popover') && !ev.target.closest('.rm-tier-deadline')) {
                        document.querySelectorAll('.rm-deadline-popover').forEach(p => p.remove());
                        document.removeEventListener('click', closePopover);
                    }
                };
                setTimeout(() => document.addEventListener('click', closePopover), 0);
                return;
            }

            // A3: Connect button → show popover
            const connBtn = e.target.closest('.rm-connect-btn');
            if (connBtn) {
                e.stopPropagation();
                document.querySelectorAll('.rm-connect-popover').forEach(p => p.remove());
                const tierId = connBtn.dataset.tier;
                const stepId = connBtn.dataset.step;
                const tier = projectRoadmap.tiers.find(t => t.id === tierId);
                const step = tier && (tier.steps||[]).find(s => s.id === stepId);
                if (!step) return;

                const otherTiers = projectRoadmap.tiers.filter(t => t.id !== tierId);
                if (!otherTiers.length) return;

                const pop = document.createElement('div');
                pop.className = 'rm-connect-popover';
                pop.innerHTML = `<div class="rm-conn-pop-label">Connect to tier:</div>
                    <select class="rm-connect-select">
                        <option value="">None</option>
                        ${otherTiers.map((t) => {
                            const idx = projectRoadmap.tiers.indexOf(t) + 1;
                            return `<option value="${t.id}" ${step.connectsToTierId === t.id ? 'selected' : ''}>Tier ${idx} — ${escH(t.title)}</option>`;
                        }).join('')}
                    </select>
                    <button class="rm-conn-save">Save</button>`;
                connBtn.parentElement.appendChild(pop);
                pop.style.cssText = 'position:absolute;right:0;top:' + (connBtn.offsetTop + connBtn.offsetHeight + 4) + 'px;';

                pop.querySelector('.rm-conn-save').addEventListener('click', () => {
                    step.connectsToTierId = pop.querySelector('.rm-connect-select').value || null;
                    saveRoadmap(); pop.remove(); renderRoadmap();
                });
                setTimeout(() => {
                    const close = (ev) => {
                        if (!ev.target.closest('.rm-connect-popover') && !ev.target.closest('.rm-connect-btn')) {
                            pop.remove(); document.removeEventListener('click', close);
                        }
                    };
                    document.addEventListener('click', close);
                }, 0);
                return;
            }

            // Ghost "add step" row
            const ghostStep = e.target.closest('.rm-add-ghost-step');
            if (ghostStep && !ghostStep.querySelector('input')) {
                const tierId = ghostStep.dataset.tier;
                const tier = projectRoadmap.tiers.find(t => t.id === tierId);
                if (!tier) return;
                rmInlineEdit(ghostStep, 'rm-inline-input', 'New step…', '', v => {
                    const newStepId = uid();
                    (tier.steps = tier.steps || []).push({ id: newStepId, title: v, done: false });
                    saveRoadmap(); renderRoadmap();
                    showQuickAssign(newStepId);
                });
                return;
            }

            // Ghost "add tier" card
            const ghostTier = e.target.closest('.rm-add-ghost-tier');
            if (ghostTier && !ghostTier.querySelector('input')) {
                rmInlineEdit(ghostTier, 'rm-tier-title-input', 'New tier name…', '', v => {
                    projectRoadmap.tiers.push({ id: uid(), title: v, steps: [], started: false });
                    saveRoadmap(); renderRoadmap();
                });
                return;
            }
        });

        // ── Project Brief (A5: multi-file) ───────────────────────────────────
        function renderBrief() {
            const list = document.getElementById('briefFileList');
            const addLabel = document.getElementById('briefAddLabel');
            if (!list) return;

            if (!briefData.files || briefData.files.length === 0) {
                list.innerHTML = '<div class="brief-empty-state"><label for="briefAddInput" class="brief-upload-label">' + icon('plus','sm') + ' Upload brief (.html)</label></div>';
                if (addLabel) addLabel.style.display = 'none';
                return;
            }

            if (addLabel) addLabel.style.display = '';

            list.innerHTML = briefData.files.map(f => {
                const d = new Date(f.uploadedAt || Date.now());
                const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const uploaderName = f.uploadedBy ? (f.uploadedBy.charAt(0) + f.uploadedBy.slice(1).toLowerCase()) : 'Unknown';
                return `<div class="brief-file-card" data-id="${f.id}">
                    <div class="brief-file-info">
                        <div class="brief-file-icon">${icon('notes')}</div>
                        <div>
                            <div class="brief-file-name">${escH(f.filename || 'brief.html')}</div>
                            <div class="brief-file-meta">${escH(uploaderName)} · ${dateStr}</div>
                        </div>
                    </div>
                    <div class="brief-file-actions">
                        <button class="primary-btn brief-view-btn" data-id="${f.id}" style="padding:6px 12px;font-size:0.8rem;">View</button>
                        <button class="text-btn brief-del-btn" data-id="${f.id}" style="font-size:0.8rem;color:var(--color-text-muted);">Remove</button>
                    </div>
                </div>`;
            }).join('');
        }

        document.getElementById('briefFileList')?.addEventListener('click', e => {
            const viewBtn = e.target.closest('.brief-view-btn');
            const delBtn = e.target.closest('.brief-del-btn');
            if (viewBtn) {
                const f = briefData.files.find(x => x.id === viewBtn.dataset.id);
                if (!f) return;
                const overlay = document.getElementById('briefOverlay');
                const iframe = document.getElementById('briefIframe');
                const titleEl = document.getElementById('briefOverlayTitle');
                if (titleEl) titleEl.textContent = f.filename || 'Brief';
                if (iframe) iframe.srcdoc = f.html;
                if (overlay) overlay.style.display = 'flex';
            }
            if (delBtn) {
                const f = briefData.files.find(x => x.id === delBtn.dataset.id);
                if (!f || !confirm('Remove "' + (f.filename || 'this brief') + '"?')) return;
                briefData.files = briefData.files.filter(x => x.id !== delBtn.dataset.id);
                if (!_fbSync) db.ref('data/projectBriefByProject/' + projectId).set(briefData.files.length ? briefData : null);
                renderBrief();
            }
        });

        // TODO: move briefs to Firebase Storage to avoid bloating the Realtime DB node
        function handleBriefUpload(file) {
            if (!file) return;
            if (file.size > 800 * 1024) {
                alert('This file is too large (' + Math.round(file.size/1024) + ' KB). Please use a brief under 800 KB.');
                return;
            }
            const reader = new FileReader();
            reader.onload = ev => {
                if (!Array.isArray(briefData.files)) briefData.files = [];
                briefData.files.push({ id: uid(), html: ev.target.result, filename: file.name, uploadedAt: Date.now(), uploadedBy: getCurrentUser() || '' });
                if (!_fbSync) db.ref('data/projectBriefByProject/' + projectId).set(briefData);
                renderBrief();
            };
            reader.readAsText(file);
        }

        document.getElementById('briefAddInput')?.addEventListener('change', function() {
            Array.from(this.files).forEach(f => handleBriefUpload(f));
            this.value = '';
        });

        document.getElementById('briefCloseBtn')?.addEventListener('click', () => {
            const overlay = document.getElementById('briefOverlay');
            if (overlay) { overlay.style.display = 'none'; }
            const iframe = document.getElementById('briefIframe');
            if (iframe) iframe.srcdoc = '';
        });

        setInterval(renderTimerUI, 1000);
        populateTimerSelect();
        setupTimeEditing();
        renderTimerUI();
        renderRoadmap();
    }

    // ── Init ──────────────────────────────────────────────────────────────────
    function init() {
        if (projectTodoList) {
            _renderProjectTasks && _renderProjectTasks();
        } else {
            renderAll();
            renderTasks();
            renderProjects();
            renderYourWeek();
            renderCommandCenter();
            renderFridayTimeline();
            renderPulse();
        }
    }

    // ── Auth ──────────────────────────────────────────────────────────────────
    const EMAIL_MAP = {
        MOHAMMED: 'mohammed@startupweekend.app',
        EYAD:     'eyad@startupweekend.app',
        YUSUF:    'yusuf@startupweekend.app'
    };
    const EMAIL_TO_USER = Object.fromEntries(
        Object.entries(EMAIL_MAP).map(([k, v]) => [v, k])
    );

    function showApp(upperUser) {
        viewUser = upperUser;
        loginOverlay.style.display = 'none';
        mainApp.style.display = 'block';
        document.querySelectorAll('.avatar').forEach(av => av.classList.remove('active-user'));
        if (upperUser === 'MOHAMMED') document.querySelector('.avatar.mohammed')?.classList.add('active-user');
        if (upperUser === 'EYAD')     document.querySelector('.avatar.eyad')?.classList.add('active-user');
        if (upperUser === 'YUSUF')    document.querySelector('.avatar.yusuf')?.classList.add('active-user');
        document.querySelectorAll('.yw-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.user === upperUser);
        });
        init();
    }

    // ── Boot — driven by Firebase Auth state (fires on page load + after sign-in/out)
    firebase.auth().onAuthStateChanged(fbUser => {
        if (fbUser) {
            const upperUser = EMAIL_TO_USER[fbUser.email];
            if (upperUser) {
                localStorage.setItem('currentUser', upperUser);
                attachMainSync();
                if (_attachProjectSync) _attachProjectSync();
                showApp(upperUser);
            } else {
                firebase.auth().signOut();
            }
        } else {
            localStorage.removeItem('currentUser');
            loginOverlay.style.display = 'flex';
            mainApp.style.display = 'none';
        }
    });

    const loginBtn      = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const loginError    = document.getElementById('loginError');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const user  = usernameInput.value.trim().toUpperCase();
            const pass  = passwordInput.value.trim();
            const email = EMAIL_MAP[user];
            if (!email) { loginError.style.display = 'block'; return; }
            firebase.auth().signInWithEmailAndPassword(email, pass)
                .then(() => { loginError.style.display = 'none'; })
                .catch(() => { loginError.style.display = 'block'; });
        });
        passwordInput.addEventListener('keydown', e => { if (e.key === 'Enter') loginBtn.click(); });
        usernameInput.addEventListener('keydown', e => { if (e.key === 'Enter') passwordInput.focus(); });
    }

    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        if (_projectStopTimer) _projectStopTimer();
        firebase.auth().signOut();
        localStorage.removeItem('currentUser');
        loginOverlay.style.display = 'flex';
        mainApp.style.display = 'none';
    });
});
