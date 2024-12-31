document.addEventListener('DOMContentLoaded', () => {
    const createEventForm = document.getElementById('createEventForm');
    const eventList = document.getElementById('eventList');
    const editOverlay = document.getElementById('editOverlay');
    const closeOverlayBtn = document.getElementById('closeOverlay');
    const saveEditBtn = document.getElementById('saveEdit');

    // Load events from localStorage
    const loadEvents = () => {
        const savedEvents = JSON.parse(localStorage.getItem('events')) || [];
        savedEvents.forEach(event => addEventCard(event));
    };

    // Save events to localStorage
    const saveToLocalStorage = () => {
        const events = [];
        document.querySelectorAll('.event-card').forEach(card => {
            const event = {
                eventName: card.querySelector('h2').textContent,
                eventDate: card.querySelector('.date').textContent,
                eventTime: card.querySelector('.time').textContent,
                eventLocation: card.querySelector('.location').textContent,
                attending: parseInt(card.querySelector('.attending').textContent.split(': ')[1]),
                declined: parseInt(card.querySelector('.declined').textContent.split(': ')[1]),
                pending: parseInt(card.querySelector('.pending').textContent.split(': ')[1])
            };
            events.push(event);
        });
        localStorage.setItem('events', JSON.stringify(events));
    };

    // Add event card to the DOM
    const addEventCard = (event) => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';

        eventCard.innerHTML = `
            <h2>${event.eventName}</h2>
            <p><strong>Date:</strong> <span class="date">${event.eventDate}</span></p>
            <p><strong>Time:</strong> <span class="time">${event.eventTime}</span></p>
            <p><strong>Location:</strong> <span class="location">${event.eventLocation}</span></p>
            <div class="rsvp-buttons">
                <button class="attending">Attending: ${event.attending}</button>
                <button class="declined">Declined: ${event.declined}</button>
                <button class="pending">Pending: ${event.pending}</button>
            </div>
            <div class="action-buttons">
                <button class="invite">Invite</button>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;

        const attendingBtn = eventCard.querySelector('.attending');
        const declinedBtn = eventCard.querySelector('.declined');
        const pendingBtn = eventCard.querySelector('.pending');
        const inviteBtn = eventCard.querySelector('.invite');
        const editBtn = eventCard.querySelector('.edit');
        const deleteBtn = eventCard.querySelector('.delete');

        attendingBtn.addEventListener('click', () => {
            event.attending++;
            attendingBtn.textContent = `Attending: ${event.attending}`;
            saveToLocalStorage();
        });

        declinedBtn.addEventListener('click', () => {
            event.declined--;
            declinedBtn.textContent = `Declined: ${event.declined}`;
            saveToLocalStorage();
        });

        pendingBtn.addEventListener('click', () => {
            event.pending++;
            pendingBtn.textContent = `Pending: ${event.pending}`;
            Swal.fire({
                title: 'Event Status Updated!',
                text: 'One event has been marked as pending.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            saveToLocalStorage();
        });

        inviteBtn.addEventListener('click', () => {
            Swal.fire({
                title: 'Invite Sent!',
                text: 'New guests have been invited.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            event.attending++;
            attendingBtn.textContent = `Attending: ${event.attending}`;
            saveToLocalStorage();
        });

        editBtn.addEventListener('click', () => {
            showEditOverlay(event, eventCard);
        });

        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this event?')) {
                eventCard.remove();
                saveToLocalStorage();
            }
        });

        eventList.appendChild(eventCard);
    };

    // Show edit overlay
    const showEditOverlay = (event, eventCard) => {
        
        editOverlay.style.display= 'flex';

        document.getElementById('editEventName').value = event.eventName;
        document.getElementById('editEventDate').value = event.eventDate;
        document.getElementById('editEventTime').value = event.eventTime;
        document.getElementById('editEventLocation').value = event.eventLocation;


        saveEditBtn.onclick = () => {
            event.eventName = document.getElementById('editEventName').value;
            event.eventDate = document.getElementById('editEventDate').value;
            event.eventTime = document.getElementById('editEventTime').value;
            event.eventLocation = document.getElementById('editEventLocation').value;

            eventCard.querySelector('h2').textContent = event.eventName;
            eventCard.querySelector('.date').textContent = event.eventDate;
            eventCard.querySelector('.time').textContent = event.eventTime;
            eventCard.querySelector('.location').textContent = event.eventLocation;

            saveToLocalStorage();
            editOverlay.style.display= 'none';
        };
    };

    closeOverlayBtn.addEventListener('click', () => {
        editOverlay.style.display= 'none';
    });

    // Add new event
    createEventForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const eventName = document.getElementById('eventName').value.trim();
        const eventDate = document.getElementById('eventDate').value;
        const eventTime = document.getElementById('eventTime').value;
        const eventLocation = document.getElementById('eventLocation').value.trim();

        if (!eventName || !eventDate || !eventTime || !eventLocation) {
            alert('Please fill out all fields.');
            return;
        }

        const event = { eventName, eventDate, eventTime, eventLocation, attending: 0, declined: 0, pending: 0 };

        addEventCard(event);

        const savedEvents = JSON.parse(localStorage.getItem('events')) || [];
        savedEvents.push(event);
        localStorage.setItem('events', JSON.stringify(savedEvents));

        createEventForm.reset();
    });

    loadEvents();
});

