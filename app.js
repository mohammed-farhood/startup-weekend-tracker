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
    const users = { 'MOHAMMED': '2003', 'EYAD': '2001', 'YUSUF': '2004' };
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

    let _fbSync = false;

    const saveEvents   = () => { localStorage.setItem('events',        JSON.stringify(events));   if (!_fbSync) db.ref('data/events').set(events); };
    const saveTasks    = () => { localStorage.setItem('tasks',         JSON.stringify(tasks));    if (!_fbSync) db.ref('data/tasks').set(tasks); };
    const saveDayTodos = () => { localStorage.setItem('dayTodos',      JSON.stringify(dayTodos)); if (!_fbSync) db.ref('data/dayTodos').set(dayTodos); };
    const saveProjects = () => { localStorage.setItem('savedProjects', JSON.stringify(projects)); if (!_fbSync) db.ref('data/savedProjects').set(projects); };

    // ── Firebase real-time sync (main page) ───────────────────────────────────
    (function attachMainSync() {
        function watch(fbKey, lsKey, assignFn, renderFn) {
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
            watch('savedProjects', 'savedProjects', v => { projects = v; }, renderProjects);
        }
    })();

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
                : `${months[s.getMonth()]} ${s.getDate()} – ${months[e.getMonth()]} ${e.getDate()}`;
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
                `<div class="week-mini-item ${item.type}">${item.text}</div>`
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
                <div class="event-item-info"><h4>${evt.title}</h4></div>
                <button class="delete-event-btn" data-id="${evt.id}">✖</button>`;
            item.querySelector('.delete-event-btn').addEventListener('click', () => {
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
        events.push({ id: Date.now(), title, date });
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
            if (c && c.style.display !== 'none') openSubtasks.add(parseInt(li.dataset.id));
        });
        todoList.innerHTML = '';
        tasks.forEach(task => {
            const completedSubs = (task.subtasks || []).filter(s => s.completed).length;
            const totalSubs     = (task.subtasks || []).length;
            const assigneeClass = task.assignee === 'Mohammed' ? 'tag-mohammed' : task.assignee === 'Yusuf' ? 'tag-yusuf' : 'tag-eyad';
            const proj = PROJECTS.find(p => p.id === (task.projectId || 'none'));
            const tagHtml = proj && proj.id !== 'none'
                ? `<span class="project-tag" style="background:${proj.color}1A;color:${proj.color};border:1px solid ${proj.color}33">${proj.name}</span>`
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
                            <span class="todo-text">${task.text}</span>
                        </label>
                        ${totalSubs > 0 ? `<span class="subtask-count">${completedSubs}/${totalSubs}</span>` : ''}
                    </div>
                    <div class="todo-right">
                        ${tagHtml}
                        <span class="assignee ${assigneeClass}">${task.assignee}</span>
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
            if (openSubtasks.has(task.id)) {
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
                    <span class="todo-text">${sub.text}</span>
                </label>
                <button class="task-action-btn" title="Delete">✖</button>`;
            sli.querySelector('.todo-checkbox').addEventListener('change', function () {
                sub.completed = this.checked;
                sli.classList.toggle('completed', this.checked);
                saveTasks(); renderTasks();
            });
            sli.querySelector('.task-action-btn').addEventListener('click', () => {
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
            const t = tasks.find(t => t.id === parseInt(editId));
            if (t) { t.text = text; t.assignee = assignee; t.projectId = projectId; }
        } else {
            tasks.push({ id: Date.now(), text, assignee, projectId, completed: false, subtasks: [] });
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
        const text   = subtaskTextInput.value.trim();
        const taskId = parseInt(subtaskParentId.value);
        if (!text) return;
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.subtasks.push({ id: Date.now(), text, completed: false });
            saveTasks(); renderTasks();
            const li = todoList?.querySelector(`[data-id="${taskId}"]`);
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
        const ds = currentDay;
        const todayEvents = events.filter(e => e.date === ds);
        dayEventsList.innerHTML = '';
        dayNoEvents.style.display = todayEvents.length ? 'none' : 'block';
        todayEvents.forEach(evt => {
            const item = document.createElement('div');
            item.className = 'day-event-item';
            item.innerHTML = `<span>${evt.title}</span><button class="task-action-btn" style="color:var(--color-text-muted)">✖</button>`;
            item.querySelector('button').addEventListener('click', () => {
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
                    <span class="todo-text">${todo.text}</span>
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
        events.push({ id: Date.now(), title, date: currentDay });
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
        dayTodos[currentDay].push({ id: Date.now(), text, completed: false });
        saveDayTodos(); renderAll();
        dayTodoInput.value = '';
        dayTodoAddRow.style.display = 'none';
        renderDayDetail();
    });
    dayTodoInput?.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('saveDayTodoBtn').click(); });

    // ── Projects (dashboard) ──────────────────────────────────────────────────
    const PROJECT_COLORS = ['#C2620E','#7C3AED','#059669','#2563EB','#E11D48'];
    let selectedProjectColor = PROJECT_COLORS[0];

    function renderProjects() {
        const list = document.getElementById('projectList');
        if (!list) return;
        list.innerHTML = '';
        if (projects.length === 0) {
            const p = document.createElement('p');
            p.style.cssText = 'color:var(--text-faint);font-size:0.875rem;font-style:italic;padding:16px 0;';
            p.textContent = 'No projects yet. Add one above.';
            list.appendChild(p);
            return;
        }
        projects.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <div class="project-card-top">
                    <span class="project-color-dot" style="background:${proj.color}"></span>
                    <div class="project-info">
                        <h3>${proj.name}</h3>
                        <p>Tap to manage tasks</p>
                    </div>
                    <button class="project-delete-btn" data-id="${proj.id}" title="Delete project">✕</button>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width:0%;background:${proj.color}"></div>
                </div>`;
            card.querySelector('.project-delete-btn').addEventListener('click', e => {
                e.preventDefault(); e.stopPropagation();
                if (!confirm(`Delete "${proj.name}"?`)) return;
                projects = projects.filter(p => p.id !== proj.id);
                saveProjects(); renderProjects();
            });
            card.addEventListener('click', e => {
                if (e.target.closest('.project-delete-btn')) return;
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
        document.querySelectorAll('.color-dot-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === 0);
        });
        addProjectModal.style.display = 'flex';
        setTimeout(() => projectNameInput.focus(), 50);
    });
    document.getElementById('cancelAddProjectBtn')?.addEventListener('click', () => { addProjectModal.style.display = 'none'; });
    document.getElementById('saveAddProjectBtn')?.addEventListener('click', () => {
        const name = projectNameInput.value.trim();
        if (!name) return;
        projects.push({ id: Date.now(), name, color: selectedProjectColor });
        saveProjects(); renderProjects();
        addProjectModal.style.display = 'none';
    });
    projectNameInput?.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('saveAddProjectBtn').click(); });
    addProjectModal?.addEventListener('click', e => { if (e.target === addProjectModal) addProjectModal.style.display = 'none'; });

    document.getElementById('projectColorPicker')?.addEventListener('click', e => {
        const btn = e.target.closest('.color-dot-btn');
        if (!btn) return;
        selectedProjectColor = btn.dataset.color;
        document.querySelectorAll('.color-dot-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });

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
    const projectTodoList = document.getElementById('projectTodoList');
    if (projectTodoList) {
        let projectTasks = JSON.parse(localStorage.getItem('projectTasks')) || [];
        const saveProjectTasks = () => {
            localStorage.setItem('projectTasks', JSON.stringify(projectTasks));
            if (!_fbSync) db.ref('data/projectTasks').set(projectTasks);
        };

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
            projectTasks.forEach(task => {
                const assigneeClass = task.assignee === 'Mohammed' ? 'tag-mohammed' : task.assignee === 'Yusuf' ? 'tag-yusuf' : 'tag-eyad';
                const li = document.createElement('li');
                li.className = 'todo-item managed' + (task.completed ? ' completed' : '');
                li.dataset.id = task.id;
                li.innerHTML = `
                    <div class="todo-main">
                        <div class="todo-left">
                            <label class="todo-label">
                                <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''}>
                                <span class="custom-checkbox"></span>
                                <span class="todo-text">${task.text}</span>
                            </label>
                        </div>
                        <div class="todo-right">
                            <span class="assignee ${assigneeClass}">${task.assignee}</span>
                            <span class="task-time-chip" id="task-time-${task.id}" style="display:none;"></span>
                            <button class="task-action-btn task-timer-btn" data-task-timer="${task.id}" title="Track time on this task">⏱</button>
                            <button class="notes-toggle-btn task-action-btn" title="Notes">${task.notes ? '📝' : '✎'} Notes</button>
                            <button class="task-action-btn task-edit-btn" title="Edit">Edit</button>
                            <button class="task-action-btn task-delete-btn" title="Delete">✖</button>
                        </div>
                    </div>
                    <div class="notes-container" style="display:none;">
                        <textarea class="notes-textarea" placeholder="Write notes for your team…">${task.notes || ''}</textarea>
                    </div>`;

                projectTodoList.appendChild(li);

                li.querySelector('.todo-checkbox').addEventListener('change', function () {
                    task.completed = this.checked;
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
                    task.notes = this.value;
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
            projectTaskAssignee.value = task ? task.assignee : 'Mohammed';
            projectTaskEditId.value   = task ? task.id       : '';
            projectTaskModal.style.display = 'flex';
            setTimeout(() => projectTaskText.focus(), 50);
        }

        document.getElementById('addProjectTaskBtn')?.addEventListener('click', () => openProjectTaskModal());
        document.getElementById('cancelProjectTaskBtn')?.addEventListener('click', () => { projectTaskModal.style.display = 'none'; });
        document.getElementById('saveProjectTaskBtn')?.addEventListener('click', () => {
            const text     = projectTaskText.value.trim();
            const assignee = projectTaskAssignee.value;
            const editId   = projectTaskEditId.value;
            if (!text) return;
            if (editId) {
                const t = projectTasks.find(t => t.id === parseInt(editId));
                if (t) { t.text = text; t.assignee = assignee; }
            } else {
                projectTasks.push({ id: Date.now(), text, assignee, completed: false, notes: '' });
            }
            saveProjectTasks(); renderProjectTasks();
            projectTaskModal.style.display = 'none';
        });
        projectTaskModal?.addEventListener('click', e => { if (e.target === projectTaskModal) projectTaskModal.style.display = 'none'; });
        projectTaskText?.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('saveProjectTaskBtn').click(); });

        _renderProjectTasks = renderProjectTasks; // expose to init()

        // ── Time Tracker ─────────────────────────────────────────────────────────
        const TIME_KEY = 'projectTimeData';

        function getCurrentUser() { return localStorage.getItem('currentUser'); }
        function getPartnerUser() {
            const u = getCurrentUser();
            return u === 'MOHAMMED' ? 'EYAD' : 'MOHAMMED';
        }

        function loadTimeData() {
            const raw = JSON.parse(localStorage.getItem(TIME_KEY));
            if (!raw) return { sessions: [], activeSessions: { MOHAMMED: null, EYAD: null } };
            if (!raw.activeSessions) raw.activeSessions = { MOHAMMED: null, EYAD: null };
            return raw;
        }
        function saveTimeData(d) {
            localStorage.setItem(TIME_KEY, JSON.stringify(d));
            if (!_fbSync) db.ref('data/projectTimeData').set(d);
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
            for (const u of ['MOHAMMED', 'EYAD']) {
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
            const dur = Math.floor((Date.now() - active.startTime) / 1000);
            if (dur > 0) d.sessions.push({ id: Date.now(), user, taskId: active.taskId, taskName: active.taskName, duration: dur });
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
                const dur = Math.floor((Date.now() - active.startTime) / 1000);
                if (dur > 0) d.sessions.push({ id: Date.now(), user, taskId: active.taskId, taskName: active.taskName, duration: dur });
            }
            const task = projectTasks.find(t => t.id == taskId);
            d.activeSessions[user] = { taskId, taskName: task ? task.text : null, startTime: Date.now() };
            saveTimeData(d);
            renderTimerUI();
        }

        function renderTimerUI() {
            const user   = getCurrentUser();
            const d      = loadTimeData();
            const active = user ? d.activeSessions[user] : null;

            const mSec = getUserTotal(d, 'MOHAMMED');
            const eSec = getUserTotal(d, 'EYAD');
            const tSec = mSec + eSec;
            const totalEl = document.getElementById('totalProjectTime');
            const mEl     = document.getElementById('mohammedTime');
            const eEl     = document.getElementById('eyadTime');
            if (totalEl) totalEl.textContent = tSec >= 1 ? fmtDuration(tSec) : '—';
            if (mEl)     mEl.textContent     = mSec >= 1 ? fmtDuration(mSec) : '—';
            if (eEl)     eEl.textContent     = eSec >= 1 ? fmtDuration(eSec) : '—';

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

            const partnerUser   = user ? getPartnerUser() : null;
            const partnerActive = partnerUser ? d.activeSessions[partnerUser] : null;
            const partnerEl     = document.getElementById('partnerStatus');
            const partnerTxtEl  = document.getElementById('partnerStatusText');
            if (partnerEl) {
                if (partnerActive) {
                    const pName   = partnerUser === 'MOHAMMED' ? 'Mohammed' : 'Eyad';
                    const elapsed = (Date.now() - partnerActive.startTime) / 1000;
                    const tPart   = partnerActive.taskName ? ` on "${partnerActive.taskName}"` : '';
                    if (partnerTxtEl) partnerTxtEl.textContent = `${pName} is working${tPart} · ${fmtDuration(elapsed)}`;
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
            const taskId = sel && sel.value ? parseInt(sel.value) : null;
            const task   = taskId ? projectTasks.find(t => t.id === taskId) : null;
            const d      = loadTimeData();
            d.activeSessions[user] = { taskId, taskName: task ? task.text : null, startTime: Date.now() };
            saveTimeData(d);
            renderTimerUI();
        });

        document.getElementById('stopTimerBtn')?.addEventListener('click', stopTimer);

        projectTodoList.addEventListener('click', e => {
            const btn = e.target.closest('.task-timer-btn');
            if (btn) trackTask(parseInt(btn.dataset.taskTimer));
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

        document.getElementById('logoutBtn')?.addEventListener('click', stopTimer, true);

        // ── Firebase real-time sync (project page) ────────────────────────────
        db.ref('data/projectTasks').on('value', snap => {
            const val = snap.val();
            if (val !== null) {
                _fbSync = true;
                projectTasks = val;
                localStorage.setItem('projectTasks', JSON.stringify(projectTasks));
                renderProjectTasks();
                _fbSync = false;
            } else if (projectTasks.length > 0) {
                db.ref('data/projectTasks').set(projectTasks);
            }
        });
        db.ref('data/projectTimeData').on('value', snap => {
            const val = snap.val();
            if (val !== null) {
                _fbSync = true;
                localStorage.setItem(TIME_KEY, JSON.stringify(val));
                renderTimerUI();
                _fbSync = false;
            } else {
                const local = JSON.parse(localStorage.getItem(TIME_KEY));
                if (local) db.ref('data/projectTimeData').set(local);
            }
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
        }
    }

    // ── Auth ──────────────────────────────────────────────────────────────────
    function checkAuth() {
        const user = localStorage.getItem('currentUser');
        if (user && users[user]) {
            loginOverlay.style.display = 'none';
            mainApp.style.display = 'block';
            document.querySelectorAll('.avatar').forEach(av => av.classList.remove('active-user'));
            if (user === 'MOHAMMED') document.querySelector('.avatar.mohammed')?.classList.add('active-user');
            if (user === 'EYAD')     document.querySelector('.avatar.eyad')?.classList.add('active-user');
            if (user === 'YUSUF')    document.querySelector('.avatar.yusuf')?.classList.add('active-user');
            init();
        } else {
            loginOverlay.style.display = 'flex';
            mainApp.style.display = 'none';
        }
    }

    const loginBtn     = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const loginError    = document.getElementById('loginError');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const user = usernameInput.value.trim().toUpperCase();
            const pass = passwordInput.value.trim();
            if (users[user] === pass) {
                localStorage.setItem('currentUser', user);
                loginError.style.display = 'none';
                checkAuth();
            } else {
                loginError.style.display = 'block';
            }
        });
        passwordInput.addEventListener('keydown', e => { if (e.key === 'Enter') loginBtn.click(); });
        usernameInput.addEventListener('keydown', e => { if (e.key === 'Enter') passwordInput.focus(); });
    }

    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        loginOverlay.style.display = 'flex';
        mainApp.style.display = 'none';
    });

    // ── Boot — called LAST so all consts are initialized ─────────────────────
    checkAuth();
});
