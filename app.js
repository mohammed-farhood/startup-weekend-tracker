document.addEventListener('DOMContentLoaded', () => {

    // ── Auth ──────────────────────────────────────────────────────────────────
    const users = { 'MOHAMMED': '2003', 'EYAD': '2001' };
    const loginOverlay = document.getElementById('loginOverlay');
    const mainApp = document.getElementById('mainApp');

    function checkAuth() {
        const user = localStorage.getItem('currentUser');
        if (user && users[user]) {
            loginOverlay.style.display = 'none';
            mainApp.style.display = 'block';
            init();
        } else {
            loginOverlay.style.display = 'flex';
            mainApp.style.display = 'none';
        }
    }

    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const loginError = document.getElementById('loginError');

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
    }

    checkAuth();

    // ── Data ──────────────────────────────────────────────────────────────────
    let events = JSON.parse(localStorage.getItem('events')) || [
        { id: 1, title: 'Startup Weekend Prep', date: new Date().toISOString().split('T')[0] }
    ];

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [
        { id: 1, text: 'Draft email copy', assignee: 'Mohammed', completed: false, subtasks: [] },
        { id: 2, text: 'Buy domain name', assignee: 'Eyad', completed: false, subtasks: [] }
    ];

    // Per-day todos keyed by "YYYY-MM-DD"
    let dayTodos = JSON.parse(localStorage.getItem('dayTodos')) || {};

    const saveEvents  = () => localStorage.setItem('events', JSON.stringify(events));
    const saveTasks   = () => localStorage.setItem('tasks', JSON.stringify(tasks));
    const saveDayTodos = () => localStorage.setItem('dayTodos', JSON.stringify(dayTodos));

    // ── Calendar ──────────────────────────────────────────────────────────────
    let calYear  = new Date().getFullYear();
    let calMonth = new Date().getMonth();

    const calendarGrid  = document.getElementById('calendarGrid');
    const calMonthLabel = document.getElementById('calMonthLabel');

    document.getElementById('prevMonthBtn')?.addEventListener('click', () => {
        calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar();
    });
    document.getElementById('nextMonthBtn')?.addEventListener('click', () => {
        calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar();
    });

    function dateStr(y, m, d) {
        return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }

    function renderCalendar() {
        if (!calendarGrid) return;
        calendarGrid.innerHTML = '';
        const today = new Date();
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        calMonthLabel.textContent = `${months[calMonth]} ${calYear}`;

        const firstDay = new Date(calYear, calMonth, 1);
        const startIdx = (firstDay.getDay() + 1) % 7; // week starts Saturday
        const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

        for (let i = 0; i < startIdx; i++) {
            const e = document.createElement('div');
            e.className = 'calendar-day empty';
            calendarGrid.appendChild(e);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const ds = dateStr(calYear, calMonth, day);
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
                if (hasEvent) { const d = document.createElement('span'); d.className = 'day-dot event-dot'; dots.appendChild(d); }
                if (hasTodo)  { const d = document.createElement('span'); d.className = 'day-dot todo-dot';  dots.appendChild(d); }
                cell.appendChild(dots);
            }

            cell.addEventListener('click', () => openDayDetail(ds));
            calendarGrid.appendChild(cell);
        }
    }

    // ── Events List ───────────────────────────────────────────────────────────
    const eventsList = document.getElementById('eventsList');

    function renderEvents() {
        if (!eventsList) return;
        eventsList.innerHTML = '';
        [...events].sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(evt => {
            const [y, m, d] = evt.date.split('-').map(Number);
            const dt = new Date(y, m - 1, d);
            const mon = dt.toLocaleDateString('en-US', { month: 'short' });
            const item = document.createElement('div');
            item.className = 'event-item';
            item.innerHTML = `
                <div class="event-date">${mon} ${d}</div>
                <div class="event-item-info"><h4>${evt.title}</h4></div>
                <button class="delete-event-btn" data-id="${evt.id}">✖</button>`;
            item.querySelector('.delete-event-btn').addEventListener('click', () => {
                events = events.filter(e => e.id !== evt.id);
                saveEvents(); renderEvents(); renderCalendar();
            });
            eventsList.appendChild(item);
        });
    }

    // Add Event Modal
    const eventModal      = document.getElementById('eventModal');
    const eventTitleInput = document.getElementById('eventTitle');
    const eventDateInput  = document.getElementById('eventDate');

    document.getElementById('addEventBtn')?.addEventListener('click', () => {
        eventTitleInput.value = ''; eventDateInput.value = '';
        eventModal.style.display = 'flex';
    });
    document.getElementById('cancelEventBtn')?.addEventListener('click', () => { eventModal.style.display = 'none'; });
    document.getElementById('saveEventBtn')?.addEventListener('click', saveNewEvent);

    function saveNewEvent() {
        const title = eventTitleInput.value.trim();
        const date  = eventDateInput.value;
        if (!title || !date) return;
        events.push({ id: Date.now(), title, date });
        saveEvents(); renderEvents(); renderCalendar();
        eventModal.style.display = 'none';
        // Re-render day detail if it's open and matches
        if (dayDetailModal.style.display === 'flex') renderDayDetail();
    }

    eventModal?.addEventListener('click', e => { if (e.target === eventModal) eventModal.style.display = 'none'; });

    // ── Tasks ─────────────────────────────────────────────────────────────────
    const todoList = document.getElementById('todoList');

    function renderTasks() {
        if (!todoList) return;
        todoList.innerHTML = '';
        tasks.forEach(task => {
            const completedSubs = (task.subtasks || []).filter(s => s.completed).length;
            const totalSubs = (task.subtasks || []).length;
            const assigneeClass = task.assignee === 'Mohammed' ? 'tag-mohammed' : 'tag-eyad';

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

            // Checkbox
            li.querySelector('.todo-checkbox').addEventListener('change', function () {
                task.completed = this.checked;
                li.classList.toggle('completed', this.checked);
                saveTasks();
            });

            // Toggle subtasks
            li.querySelector('.subtask-toggle').addEventListener('click', () => {
                const container = li.querySelector('.subtasks-container');
                const toggle    = li.querySelector('.subtask-toggle');
                const open = container.style.display !== 'none';
                container.style.display = open ? 'none' : 'block';
                toggle.classList.toggle('open', !open);
            });

            // Edit
            li.querySelector('.task-edit-btn').addEventListener('click', () => openTaskModal(task));

            // Delete
            li.querySelector('.task-delete-btn').addEventListener('click', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks(); renderTasks();
            });

            // Add subtask
            li.querySelector('.add-subtask-btn').addEventListener('click', () => openSubtaskModal(task.id));
        });
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

    // Task Modal
    const taskModal          = document.getElementById('taskModal');
    const taskModalTitle     = document.getElementById('taskModalTitle');
    const taskTextInput      = document.getElementById('taskTextInput');
    const taskAssigneeSelect = document.getElementById('taskAssigneeSelect');
    const taskEditIdInput    = document.getElementById('taskEditId');

    function openTaskModal(task = null) {
        taskModalTitle.textContent    = task ? 'Edit Task' : 'Add Task';
        taskTextInput.value           = task ? task.text : '';
        taskAssigneeSelect.value      = task ? task.assignee : 'Mohammed';
        taskEditIdInput.value         = task ? task.id : '';
        taskModal.style.display = 'flex';
        setTimeout(() => taskTextInput.focus(), 50);
    }

    document.getElementById('addTaskBtn')?.addEventListener('click', () => openTaskModal());
    document.getElementById('cancelTaskBtn')?.addEventListener('click', () => { taskModal.style.display = 'none'; });
    document.getElementById('saveTaskBtn')?.addEventListener('click', () => {
        const text     = taskTextInput.value.trim();
        const assignee = taskAssigneeSelect.value;
        const editId   = taskEditIdInput.value;
        if (!text) return;
        if (editId) {
            const t = tasks.find(t => t.id === parseInt(editId));
            if (t) { t.text = text; t.assignee = assignee; }
        } else {
            tasks.push({ id: Date.now(), text, assignee, completed: false, subtasks: [] });
        }
        saveTasks(); renderTasks();
        taskModal.style.display = 'none';
    });
    taskModal?.addEventListener('click', e => { if (e.target === taskModal) taskModal.style.display = 'none'; });
    taskTextInput?.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('saveTaskBtn').click(); });

    // Subtask Modal
    const subtaskModal     = document.getElementById('subtaskModal');
    const subtaskTextInput = document.getElementById('subtaskTextInput');
    const subtaskParentId  = document.getElementById('subtaskParentId');

    function openSubtaskModal(taskId) {
        subtaskParentId.value = taskId;
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
            // Auto-open the subtasks panel
            const li = todoList.querySelector(`[data-id="${taskId}"]`);
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
    const dayDetailModal  = document.getElementById('dayDetailModal');
    const dayDetailTitle  = document.getElementById('dayDetailTitle');
    const dayEventsList   = document.getElementById('dayEventsList');
    const dayNoEvents     = document.getElementById('dayNoEvents');
    const dayTodoList     = document.getElementById('dayTodoList');
    const dayNoTodos      = document.getElementById('dayNoTodos');

    let currentDay = null;

    function openDayDetail(ds) {
        currentDay = ds;
        const [y, m, d] = ds.split('-').map(Number);
        const dt = new Date(y, m - 1, d);
        const dayNames   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        dayDetailTitle.textContent = `${dayNames[dt.getDay()]}, ${monthNames[m - 1]} ${d}`;
        // Hide inline forms
        document.getElementById('dayEventAddRow').style.display = 'none';
        document.getElementById('dayTodoAddRow').style.display = 'none';
        renderDayDetail();
        dayDetailModal.style.display = 'flex';
    }

    function renderDayDetail() {
        const ds = currentDay;

        // Events
        const todayEvents = events.filter(e => e.date === ds);
        dayEventsList.innerHTML = '';
        dayNoEvents.style.display = todayEvents.length ? 'none' : 'block';
        todayEvents.forEach(evt => {
            const item = document.createElement('div');
            item.className = 'day-event-item';
            item.innerHTML = `<span>${evt.title}</span><button class="task-action-btn" style="color:var(--color-text-muted)">✖</button>`;
            item.querySelector('button').addEventListener('click', () => {
                events = events.filter(e => e.id !== evt.id);
                saveEvents(); renderEvents(); renderCalendar(); renderDayDetail();
            });
            dayEventsList.appendChild(item);
        });

        // Day todos
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
                saveDayTodos();
            });
            li.querySelector('.task-action-btn').addEventListener('click', () => {
                dayTodos[ds] = dayTodos[ds].filter(t => t.id !== todo.id);
                saveDayTodos(); renderCalendar(); renderDayDetail();
            });
            dayTodoList.appendChild(li);
        });
    }

    document.getElementById('closeDayDetail')?.addEventListener('click', () => { dayDetailModal.style.display = 'none'; });
    dayDetailModal?.addEventListener('click', e => { if (e.target === dayDetailModal) dayDetailModal.style.display = 'none'; });

    // Add event from day detail (inline)
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
        saveEvents(); renderEvents(); renderCalendar();
        dayEventInput.value = '';
        dayEventAddRow.style.display = 'none';
        renderDayDetail();
    });
    dayEventInput?.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('saveDayEventBtn').click(); });

    // Add todo from day detail (inline)
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
        saveDayTodos(); renderCalendar();
        dayTodoInput.value = '';
        dayTodoAddRow.style.display = 'none';
        renderDayDetail();
    });
    dayTodoInput?.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('saveDayTodoBtn').click(); });

    // ── Init ──────────────────────────────────────────────────────────────────
    function init() {
        renderCalendar();
        renderEvents();
        renderTasks();
    }
});
