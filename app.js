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
    let viewUser = null;

    let _fbSync = false;

    const saveEvents   = () => { localStorage.setItem('events',        JSON.stringify(events));   if (!_fbSync) db.ref('data/events').set(events); };
    const saveTasks    = () => { localStorage.setItem('tasks',         JSON.stringify(tasks));    if (!_fbSync) db.ref('data/tasks').set(tasks); };
    const saveDayTodos = () => { localStorage.setItem('dayTodos',      JSON.stringify(dayTodos)); if (!_fbSync) db.ref('data/dayTodos').set(dayTodos); };
    const saveProjects = () => { localStorage.setItem('savedProjects', JSON.stringify(projects)); if (!_fbSync) db.ref('data/savedProjects').set(projects); };

    // ── Firebase real-time sync (main page) ───────────────────────────────────
    function attachMainSync() {
        function watch(fbKey, lsKey, assignFn, renderFn) {
            db.ref('data/' + fbKey).off();
            db.ref('data/' + fbKey).on('value', snap => {
                const val = snap.val();
                if (val !== null) {
                    _fbSync = true;
                    assignFn(val);
                    localStorage.setItem(lsKey, JSON.stringify(val));
                    renderFn();
                    _fbSync = false;
                } else {
                    const local = JSON.parse(localStorage.getItem(lsKey));
                    const hasData = local && (Array.isArray(local) ? local.length > 0 : Object.keys(local).length > 0);
                    if (hasData) db.ref('data/' + fbKey).set(local);
                }
            });
        }
        if (!document.getElementById('projectTodoList')) {
            watch('events',        'events',        v => { events = v; },   renderAll);
            watch('tasks',         'tasks',         v => { tasks = v; },    () => { renderAll(); renderTasks(); });
            watch('dayTodos',      'dayTodos',      v => { dayTodos = v; }, renderAll);
            watch('savedProjects', 'savedProjects', v => { projects = v; }, () => {
                renderProjects(); renderFridayTimeline(); renderCommandCenter(); renderPulse();
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

    function renderWeekView() {
        if (!weekStrip) return;
        const days = getWeekDates();
        const today = new Date(); today.setHours(0,0,0,0);
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const s = days[0], e = days[6];
        if (weekLabel) {
            weekLabel.textContent = s.getMonth() === e.getMonth()
                ? `${months[s.getMonth()]} ${s.getDate()}–${e.getDate()}, ${s.getFullYear()}`
                : `${months[s.getMonth()]} ${s.getDate()} – ${months[e.getMonth()]} ${e.getDate()}, ${s.getFullYear()}`;
        }

        const dayNames = ['Sat','Sun','Mon','Tue','Wed','Thu','Fri'];
        weekStrip.innerHTML = '';
        days.forEach((d, i) => {
            const ds = dateStr(d.getFullYear(), d.getMonth(), d.getDate());
            const isToday = d.getTime() === today.getTime();
            const isFri   = d.getDay() === 5;

            const dayEvts = events.filter(e => e.date === ds);
            const dayTds  = (dayTodos[ds] || []).filter(t => !t.completed);
            const allItems = [
                ...dayEvts.map(e => ({ type: 'event', text: e.title })),
                ...dayTds.map(t => ({ type: 'todo',  text: t.text  }))
            ];

            const card = document.createElement('div');
            card.className = 'week-day-card' + (isToday ? ' today' : '') + (isFri ? ' friday' : '');

            let itemsHtml = allItems.slice(0, 8).map(item =>
                `<div class="week-mini-item ${item.type}">${esc(item.text)}</div>`
            ).join('');
            if (allItems.length > 8) itemsHtml += `<div class="week-more">+${allItems.length - 8} more</div>`;

            card.innerHTML = `
                <div class="week-day-header">
                    <span class="week-day-name">${dayNames[i]}</span>
                    <span class="week-day-num">${d.getDate()}</span>
                </div>
                <div class="week-day-body">${itemsHtml}</div>`;
            card.addEventListener('click', () => openDayDetail(ds));
            weekStrip.appendChild(card);
        });
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
                <div class="event-item-info"><h4>${esc(evt.title)}</h4></div>
                <button class="delete-event-btn" data-id="${evt.id}">✖</button>`;
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
    }

    // ── Add Event Modal ───────────────────────────────────────────────────────
    const eventModal      = document.getElementById('eventModal');
    const eventTitleInput = document.getElementById('eventTitle');
    const eventDateInput  = document.getElementById('eventDate');

    document.getElementById('addEventBtn')?.addEventListener('click', () => {
        eventTitleInput.value = ''; eventDateInput.value = '';
        eventModal.style.display = 'flex';
    });
    document.getElementById('cancelEventBtn')?.addEventListener('click', () => { eventModal.style.display = 'none'; });
    document.getElementById('saveEventBtn')?.addEventListener('click', saveNewEvent);
    eventDateInput?.addEventListener('keydown', e => { if (e.key === 'Enter') saveNewEvent(); });

    function saveNewEvent() {
        const title = eventTitleInput.value.trim();
        const date  = eventDateInput.value;
        if (!title || !date) return;
        events.push({ id: uid(), title, date });
        saveEvents(); renderAll();
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
            li.innerHTML = `
                <div class="todo-main">
                    <div class="todo-left">
                        <button class="subtask-toggle" title="Subtasks">▶</button>
                        <label class="todo-label">
                            <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''}>
                            <span class="custom-checkbox"></span>
                            <span class="todo-text">${esc(task.text)}</span>
                        </label>
                        ${totalSubs > 0 ? `<span class="subtask-count">${completedSubs}/${totalSubs}</span>` : ''}
                    </div>
                    <div class="todo-right">
                        ${tagHtml}
                        <span class="assignee ${assigneeClass}">${esc(task.assignee)}</span>
                        <button class="task-action-btn task-edit-btn" title="Edit">✎</button>
                        <button class="task-action-btn task-delete-btn" title="Delete">✖</button>
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
                <button class="task-action-btn" title="Delete">✖</button>`;
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

    function openTaskModal(task = null) {
        taskModalTitle.textContent  = task ? 'Edit Task' : 'Add Task';
        taskTextInput.value         = task ? task.text    : '';
        taskAssigneeSelect.value    = task ? task.assignee : 'Mohammed';
        if (taskProjectSelect) taskProjectSelect.value = task ? (task.projectId || 'none') : 'none';
        taskEditIdInput.value       = task ? task.id : '';
        taskModal.style.display = 'flex';
        setTimeout(() => taskTextInput.focus(), 50);
    }

    document.getElementById('addTaskBtn')?.addEventListener('click', () => openTaskModal());
    document.getElementById('cancelTaskBtn')?.addEventListener('click', () => { taskModal.style.display = 'none'; });
    document.getElementById('saveTaskBtn')?.addEventListener('click', () => {
        const text      = taskTextInput.value.trim();
        const assignee  = taskAssigneeSelect.value;
        const projectId = taskProjectSelect ? taskProjectSelect.value : 'none';
        const editId    = taskEditIdInput.value;
        if (!text) return;
        if (editId) {
            const t = tasks.find(t => t.id == editId);
            if (t) { t.text = text; t.assignee = assignee; t.projectId = projectId; }
        } else {
            tasks.push({ id: uid(), text, assignee, projectId, completed: false, subtasks: [] });
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
            item.innerHTML = `<span>${esc(evt.title)}</span><button class="task-action-btn" style="color:var(--color-text-muted)">✖</button>`;
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
            li.innerHTML = `
                <label class="todo-label">
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="custom-checkbox"></span>
                    <span class="todo-text">${esc(todo.text)}</span>
                </label>
                <button class="task-action-btn" style="color:var(--color-text-muted)">✖</button>`;
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

    const dayTodoAddRow = document.getElementById('dayTodoAddRow');
    const dayTodoInput  = document.getElementById('dayTodoInput');
    document.getElementById('addDayTodoBtn')?.addEventListener('click', () => {
        dayTodoAddRow.style.display = dayTodoAddRow.style.display === 'flex' ? 'none' : 'flex';
        if (dayTodoAddRow.style.display === 'flex') dayTodoInput.focus();
    });
    document.getElementById('saveDayTodoBtn')?.addEventListener('click', () => {
        const text = dayTodoInput.value.trim();
        if (!text) return;
        if (!dayTodos[currentDay]) dayTodos[currentDay] = [];
        dayTodos[currentDay].push({ id: uid(), text, completed: false });
        saveDayTodos(); renderAll();
        dayTodoInput.value = '';
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

            // Compute real progress from Agent A's data
            const rawTasks = projectTasksByProject[String(proj.id)];
            const projTasks = Array.isArray(rawTasks) ? rawTasks
                : (rawTasks ? Object.values(rawTasks) : []);
            const total = projTasks.length;
            const done  = projTasks.filter(t => t.completed).length;
            const pct   = total ? Math.round((done / total) * 100) : 0;
            const progressText = total === 0 ? 'No tasks yet' : `${done} of ${total} tasks done`;

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
                    <div class="proj-card-actions">
                        ${ownerHtml}
                        <span class="proj-status-badge ${isPassive ? 'passive' : 'active'}">${isPassive ? 'Paused' : 'Active'}</span>
                        <button class="proj-status-toggle" title="${isPassive ? 'Resume project' : 'Pause project'}">${isPassive ? '▶' : '⏸'}</button>
                        <button class="project-delete-btn" title="Delete project">✕</button>
                    </div>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width:${pct}%;background:${proj.color}"></div>
                </div>`;

            card.querySelector('.proj-status-toggle').addEventListener('click', e => {
                e.preventDefault(); e.stopPropagation();
                proj.status = isPassive ? 'active' : 'passive';
                saveProjects(); renderProjects();
            });
            card.querySelector('.project-delete-btn').addEventListener('click', e => {
                e.preventDefault(); e.stopPropagation();
                if (!confirm(`Delete "${proj.name}"?`)) return;
                projects = projects.filter(p => p.id !== proj.id);
                saveProjects(); renderProjects();
            });
            card.addEventListener('click', e => {
                if (e.target.closest('.project-delete-btn') || e.target.closest('.proj-status-toggle')) return;
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
        const overdueLabel = s.overdue === 0 ? 'nothing overdue ✓'
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
            if (teamSecs >= 3600) return `The team logged ${fmtDur(teamSecs)} this week 🔥`;
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

        if (insightEl) insightEl.textContent = computeInsight();

        if (top.length === 0) {
            feedEl.innerHTML = `<div class="pulse-empty">No moves yet — what the team does will show up here.</div>`;
            return;
        }

        const animate = !_pulseSeen;
        const ICON = { done: '✓', time: '⏱', born: '⚡' };
        feedEl.innerHTML = top.map((a, i) => {
            const cls   = animate ? 'pulse-item animate' : 'pulse-item static';
            const delay = animate ? ` style="animation-delay:${i * 70}ms"` : '';
            let line;
            if (a.kind === 'done')
                line = `<b>${esc(a.who)}</b> finished “${esc(a.what)}”${a.proj ? ` · ${esc(a.proj)}` : ''}`;
            else if (a.kind === 'time')
                line = `<b>${esc(a.who)}</b> logged ${fmtDur(a.dur)}${a.what ? ` on “${esc(a.what)}”` : ''}${a.proj ? ` · ${esc(a.proj)}` : ''}`;
            else
                line = `<b>${esc(a.what)}</b> was born${a.who ? `, pitched by ${esc(a.who)}` : ''}`;
            return `<div class="${cls}"${delay}>`
                 + `<span class="pulse-ic pulse-ic-${a.kind}">${ICON[a.kind]}</span>`
                 + `<span class="pulse-txt">${line}</span>`
                 + `<span class="pulse-when">${relTime(a.t)}</span></div>`;
        }).join('');
        if (animate) _pulseSeen = true;
    }

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
            const total = projectTasks.length;
            const done  = projectTasks.filter(t => t.completed).length;
            const pct   = total ? Math.round((done / total) * 100) : 0;
            const bar      = document.querySelector('.progress-bar');
            const pctLabel = document.querySelector('.progress-labels span:last-child');
            const meta     = document.querySelector('.project-meta');
            if (bar)      bar.style.width = pct + '%';
            if (pctLabel) pctLabel.textContent = pct + '%';
            if (meta)     meta.textContent = `${done} of ${total} tasks complete`;
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
                        blockedChip = `<span class="blocked-chip">🔒 blocked by ${escH(blocker.text)}</span>`;
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
                            <button class="task-action-btn task-timer-btn" data-task-timer="${task.id}" title="Track time on this task">⏱</button>
                            <button class="notes-toggle-btn task-action-btn" title="Notes">${task.notes ? '📝' : '✎'} Notes</button>
                            <button class="task-action-btn task-edit-btn" title="Edit">Edit</button>
                            <button class="task-action-btn task-delete-btn" title="Delete">✖</button>
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
                    li.querySelector('.notes-toggle-btn').innerHTML = this.value.trim() ? '📝 Notes' : '✎ Notes';
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
            projectTasks.forEach(t => {
                const o = document.createElement('option');
                o.value = t.id; o.textContent = t.text;
                sel.appendChild(o);
            });
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
            d.activeSessions[user] = { taskId, taskName: task ? task.text : null, startTime: Date.now() };
            saveTimeData(d);
            renderTimerUI();
        }

        function renderTimerUI() {
            const user = getCurrentUser();
            const d    = loadTimeData();
            if (user && d.activeSessions[user]) {
                const stale = (Date.now() - d.activeSessions[user].startTime) / 1000;
                if (stale > MAX_SESSION_SEC) {
                    const act = d.activeSessions[user];
                    d.sessions.push({ id: uid(), user, taskId: act.taskId, taskName: act.taskName, duration: MAX_SESSION_SEC, endedAt: Date.now() });
                    d.activeSessions[user] = null;
                    saveTimeData(d);
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
            if (mEl)     mEl.textContent     = mSec >= 1 ? fmtDuration(mSec) : '—';
            if (eEl)     eEl.textContent     = eSec >= 1 ? fmtDuration(eSec) : '—';
            if (yEl)     yEl.textContent     = ySec >= 1 ? fmtDuration(ySec) : '—';

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

        document.getElementById('startTimerBtn')?.addEventListener('click', () => {
            const user = getCurrentUser(); if (!user) return;
            const sel    = document.getElementById('timerTaskSelect');
            const taskId = sel && sel.value ? sel.value : null;
            const task   = taskId ? projectTasks.find(t => t.id == taskId) : null;
            const d      = loadTimeData();
            const existing = d.activeSessions[user];
            if (existing) {
                const dur = Math.min(Math.floor((Date.now() - existing.startTime) / 1000), MAX_SESSION_SEC);
                if (dur > 0) d.sessions.push({ id: uid(), user, taskId: existing.taskId, taskName: existing.taskName, duration: dur, endedAt: Date.now() });
            }
            d.activeSessions[user] = { taskId, taskName: task ? task.text : null, startTime: Date.now() };
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

        // ── Firebase real-time sync (project page) — attached after auth ───────
        function attachProjectSync() {
            db.ref('data/projectTasksByProject/' + projectId).off();
            db.ref('data/projectTasksByProject/' + projectId).on('value', snap => {
                const val = snap.val();
                if (val !== null) {
                    _fbSync = true;
                    projectTasks = val;
                    localStorage.setItem('projectTasks_' + projectId, JSON.stringify(projectTasks));
                    const ae = document.activeElement;
                    if (!ae || !ae.classList.contains('notes-textarea')) renderProjectTasks();
                    _fbSync = false;
                } else if (projectTasks.length > 0) {
                    db.ref('data/projectTasksByProject/' + projectId).set(projectTasks);
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
                renderBrief(snap.val());
            });
        }
        _attachProjectSync = attachProjectSync;

        // ── Project Brief ─────────────────────────────────────────────────────
        function renderBrief(data) {
            const emptyEl  = document.getElementById('briefEmpty');
            const existsEl = document.getElementById('briefExists');
            if (!data) {
                if (emptyEl)  emptyEl.style.display  = 'block';
                if (existsEl) existsEl.style.display = 'none';
            } else {
                if (emptyEl)  emptyEl.style.display  = 'none';
                if (existsEl) existsEl.style.display = 'block';
                const fnEl = document.getElementById('briefFilename');
                const ubEl = document.getElementById('briefUpdatedBy');
                if (fnEl) fnEl.textContent = data.filename || 'brief.html';
                if (ubEl) ubEl.textContent = data.updatedBy ? `Updated by ${data.updatedBy}` : '';
            }
        }

        // TODO: move briefs to Firebase Storage to avoid bloating the Realtime DB node
        function handleBriefUpload(file) {
            if (!file) return;
            if (file.size > 800 * 1024) {
                alert('This file is too large (' + Math.round(file.size / 1024) + ' KB). Please use a brief under 800 KB — remove embedded images or link them externally instead.');
                return;
            }
            const reader = new FileReader();
            reader.onload = e => {
                db.ref('data/projectBriefByProject/' + projectId).set({
                    html: e.target.result,
                    filename: file.name,
                    updatedAt: Date.now(),
                    updatedBy: getCurrentUser()
                });
            };
            reader.readAsText(file);
        }

        document.getElementById('briefUploadInput')?.addEventListener('change', function () {
            handleBriefUpload(this.files[0]); this.value = '';
        });
        document.getElementById('briefReplaceInput')?.addEventListener('change', function () {
            handleBriefUpload(this.files[0]); this.value = '';
        });
        document.getElementById('briefViewBtn')?.addEventListener('click', () => {
            db.ref('data/projectBriefByProject/' + projectId).once('value', snap => {
                const data = snap.val(); if (!data) return;
                const overlay = document.getElementById('briefOverlay');
                const iframe  = document.getElementById('briefIframe');
                const title   = document.getElementById('briefOverlayTitle');
                if (title)   title.textContent = data.filename || 'Brief';
                if (iframe)  iframe.srcdoc = data.html;
                if (overlay) overlay.style.display = 'flex';
            });
        });
        document.getElementById('briefCloseBtn')?.addEventListener('click', () => {
            const overlay = document.getElementById('briefOverlay');
            if (overlay) { overlay.style.display = 'none'; }
            const iframe = document.getElementById('briefIframe');
            if (iframe) iframe.srcdoc = '';
        });
        document.getElementById('briefRemoveBtn')?.addEventListener('click', () => {
            if (!confirm('Remove this brief?')) return;
            db.ref('data/projectBriefByProject/' + projectId).remove();
        });

        setInterval(renderTimerUI, 1000);
        populateTimerSelect();
        renderTimerUI();
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
