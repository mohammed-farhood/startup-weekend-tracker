document.addEventListener('DOMContentLoaded', () => {
    // Authentication
    const users = {
        'MOHAMMED': '2003',
        'EYAD': '2001'
    };
    
    const loginOverlay = document.getElementById('loginOverlay');
    const mainApp = document.getElementById('mainApp');
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const loginError = document.getElementById('loginError');

    function checkAuth() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser && users[currentUser]) {
            if (loginOverlay) loginOverlay.style.display = 'none';
            if (mainApp) mainApp.style.display = 'block';
            initCalendar();
        } else {
            if (loginOverlay) loginOverlay.style.display = 'flex';
            if (mainApp) mainApp.style.display = 'none';
        }
    }

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
    }

    checkAuth();

    // Checkbox toggling (Todo List)
    const checkboxes = document.querySelectorAll('.todo-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const listItem = this.closest('.todo-item');
            if (this.checked) {
                listItem.classList.add('completed');
            } else {
                listItem.classList.remove('completed');
            }
        });
    });

    // Calendar & Events Logic
    let events = JSON.parse(localStorage.getItem('events')) || [
        { id: 1, title: 'Startup Weekend Prep', date: new Date().toISOString().split('T')[0] }
    ];

    const calendarGrid = document.getElementById('calendarGrid');
    const eventsList = document.getElementById('eventsList');
    const addEventBtn = document.getElementById('addEventBtn');
    const eventModal = document.getElementById('eventModal');
    const cancelEventBtn = document.getElementById('cancelEventBtn');
    const saveEventBtn = document.getElementById('saveEventBtn');
    const eventTitleInput = document.getElementById('eventTitle');
    const eventDateInput = document.getElementById('eventDate');

    function saveEvents() {
        localStorage.setItem('events', JSON.stringify(events));
        renderEvents();
        renderCalendar();
    }

    function initCalendar() {
        if (!calendarGrid) return;
        renderCalendar();
        renderEvents();
    }

    function renderCalendar() {
        calendarGrid.innerHTML = '';
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();

        // Get the first day of the month
        const firstDayOfMonth = new Date(year, month, 1);
        
        // JS days: 0 (Sun) to 6 (Sat). We want week to start on Sat (index 0).
        let startDayIndex = (firstDayOfMonth.getDay() + 1) % 7;

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Pad start with empty cells
        for (let i = 0; i < startDayIndex; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-day';
            cell.innerText = day;
            
            const cellDate = new Date(year, month, day);
            // Timezone offset fix for consistent dates
            const dateStr = new Date(cellDate.getTime() - (cellDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                cell.classList.add('today');
            }

            // Highlight Friday (JS day 5)
            if (cellDate.getDay() === 5) {
                cell.classList.add('highlighted');
            }

            // Check for events
            if (events.some(e => e.date === dateStr)) {
                cell.classList.add('has-event');
            }

            calendarGrid.appendChild(cell);
        }
    }

    function renderEvents() {
        if (!eventsList) return;
        eventsList.innerHTML = '';
        
        // Sort by date
        const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

        sortedEvents.forEach(evt => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            
            const d = new Date(evt.date);
            // Handle timezone so dates don't shift by a day
            const adjustedDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
            const dateDisplay = adjustedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

            eventItem.innerHTML = `
                <div class="event-item-info">
                    <h4>${evt.title}</h4>
                    <p>${dateDisplay}</p>
                </div>
                <button class="delete-event-btn" data-id="${evt.id}">✖</button>
            `;
            eventsList.appendChild(eventItem);
        });

        document.querySelectorAll('.delete-event-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                events = events.filter(ev => ev.id !== id);
                saveEvents();
            });
        });
    }

    if (addEventBtn) {
        addEventBtn.addEventListener('click', () => {
            eventModal.style.display = 'flex';
        });
    }

    if (cancelEventBtn) {
        cancelEventBtn.addEventListener('click', () => {
            eventModal.style.display = 'none';
            eventTitleInput.value = '';
            eventDateInput.value = '';
        });
    }

    if (saveEventBtn) {
        saveEventBtn.addEventListener('click', () => {
            const title = eventTitleInput.value.trim();
            const date = eventDateInput.value;
            if (title && date) {
                events.push({
                    id: Date.now(),
                    title,
                    date
                });
                saveEvents();
                eventModal.style.display = 'none';
                eventTitleInput.value = '';
                eventDateInput.value = '';
            }
        });
    }
});