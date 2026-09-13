import "./style.css";

const themeToggle = document.querySelector("#theme-toggle");
const themeLabel = document.querySelector("#theme-label");

const calendarTab = document.querySelector("#calendar-tab");
const scheduleTab = document.querySelector("#schedule-tab");

const calendarSection = document.querySelector("#calendar-section");
const scheduleSection = document.querySelector("#schedule-section");

const dayViewButton = document.querySelector("#day-view");
const weekViewButton = document.querySelector("#week-view");
const monthViewButton = document.querySelector("#month-view");

const calendarTitle = document.querySelector("#calendar-title");
const calendar = document.querySelector("#calendar");

const prevButton = document.querySelector("#prev-button");
const todayButton = document.querySelector("#today-button");
const nextButton = document.querySelector("#next-button");

const newEventButton = document.querySelector("#new-event-button");

const eventModal = document.querySelector("#event-modal");

const closeEventModal = document.querySelector("#close-event-modal");

const cancelEvent = document.querySelector("#cancel-event");

const eventForm = document.querySelector("#event-form");
const eventSubmitButton = eventForm.querySelector('button[type="submit"]');

const eventAllDay = document.querySelector("#event-all-day");

const eventStart = document.querySelector("#event-start");

const eventFinish = document.querySelector("#event-finish");

const eventLabels = document.querySelectorAll(".event-label");

const eventLabelInput = document.querySelector("#event-label");

const eventDetailsModal = document.querySelector("#event-details-modal");

const closeEventDetails = document.querySelector("#close-event-details");

const editEventButton = document.querySelector("#edit-event-button");

const deleteEventButton = document.querySelector("#delete-event-button");

const eventDetailsTitle = document.querySelector("#event-details-title");

const eventDetailsDate = document.querySelector("#event-details-date");

const eventDetailsPeople = document.querySelector("#event-details-people");

const eventDetailsMeet = document.querySelector("#event-details-meet");

const eventDetailsLocation = document.querySelector("#event-details-location");

const eventPeopleList = document.querySelector("#event-people-list");

const eventPeopleInput = document.querySelector("#event-people-input");

const addEventPersonButton = document.querySelector("#add-event-person");

let eventPeople = [];

const eventDetailsLabelBar = document.querySelector("#event-details-label-bar");

const eventDetailsDescription = document.querySelector(
  "#event-details-description",
);

const eventDetailsDrive = document.querySelector("#event-details-drive");

let selectedEventId = null;

function updateAllDayFields() {
  if (eventAllDay.checked) {
    eventStart.type = "date";
    eventFinish.type = "date";
  } else {
    eventStart.type = "datetime-local";
    eventFinish.type = "datetime-local";
  }
}

eventAllDay.addEventListener("change", updateAllDayFields);

function renderEventPeople() {
  eventPeopleList.innerHTML = "";

  eventPeople.forEach((email, index) => {
    const person = document.createElement("div");

    person.className = "flex items-center gap-1 rounded-full px-3 py-1 text-xs";

    person.style.backgroundColor = "var(--color-bg)";

    person.style.border = "1px solid var(--color-border)";

    person.style.color = "var(--color-text)";

    const emailText = document.createElement("span");

    emailText.textContent = email;

    const removeButton = document.createElement("button");

    removeButton.type = "button";

    removeButton.className = "ml-1 leading-none";

    removeButton.style.color = "var(--color-text-muted)";

    removeButton.textContent = "×";

    removeButton.addEventListener("click", () => {
      eventPeople.splice(index, 1);
      renderEventPeople();
    });

    person.appendChild(emailText);
    person.appendChild(removeButton);

    eventPeopleList.appendChild(person);
  });
}

function addEventPerson() {
  const email = eventPeopleInput.value.trim();

  if (!email) {
    return;
  }

  if (!eventPeople.includes(email)) {
    eventPeople.push(email);
  }

  eventPeopleInput.value = "";

  renderEventPeople();

  eventPeopleInput.focus();
}

addEventPersonButton.addEventListener("click", addEventPerson);

eventPeopleInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addEventPerson();
  }
});

function openEventDetails(eventId) {
  const selectedEvent = events.find((event) => event.id === eventId);

  if (!selectedEvent) {
    return;
  }

  selectedEventId = eventId;

  eventDetailsTitle.textContent = selectedEvent.title || "Untitled Event";

  if (selectedEvent.allDay) {
    eventDetailsDate.textContent = `${selectedEvent.startDate} · All day`;
  } else {
    eventDetailsDate.textContent = `${selectedEvent.startDate} → ${selectedEvent.finishDate}`;
  }

  eventDetailsPeople.textContent = selectedEvent.people.length
    ? selectedEvent.people.join(", ")
    : "—";

  eventDetailsMeet.innerHTML = "";

  if (selectedEvent.meet) {
    eventDetailsMeet.appendChild(
      createLinkButton("Join Meeting", selectedEvent.meet),
    );
  } else {
    eventDetailsMeet.textContent = "—";
  }

  eventDetailsLocation.innerHTML = "";

  if (selectedEvent.location) {
    eventDetailsLocation.appendChild(
      createLinkButton("Open Location", selectedEvent.location),
    );
  } else {
    eventDetailsLocation.textContent = "—";
  }

  eventDetailsLabelBar.style.backgroundColor = getLabelColor(
    selectedEvent.label,
  );

  eventDetailsDescription.textContent = selectedEvent.description || "—";

  eventDetailsDrive.innerHTML = "";

  if (selectedEvent.drive) {
    eventDetailsDrive.appendChild(
      createLinkButton("Open Drive", selectedEvent.drive),
    );
  } else {
    eventDetailsDrive.textContent = "—";
  }

  eventDetailsModal.classList.remove("hidden");
  eventDetailsModal.classList.add("flex");
}

function closeEventDetailsModal() {
  eventDetailsModal.classList.add("hidden");
  eventDetailsModal.classList.remove("flex");
  selectedEventId = null;
}

closeEventDetails.addEventListener("click", closeEventDetailsModal);

function openEventModal() {
  delete eventForm.dataset.editingId;
  eventSubmitButton.textContent = "Create Event";
  eventModal.classList.remove("hidden");
  eventModal.classList.add("flex");
}

function closeEventModalWindow() {
  eventModal.classList.add("hidden");
  eventModal.classList.remove("flex");
}

function editSelectedEvent() {
  const selectedEvent = events.find((event) => event.id === selectedEventId);

  if (!selectedEvent) {
    return;
  }

  eventDetailsModal.classList.add("hidden");
  eventDetailsModal.classList.remove("flex");

  document.querySelector("#event-title").value = selectedEvent.title;

  document.querySelector("#event-all-day").checked = selectedEvent.allDay;

  eventStart.value = selectedEvent.startDate;

  eventFinish.value = selectedEvent.finishDate;

  document.querySelector("#event-repetition").value = selectedEvent.repetition;

  eventPeople = [...selectedEvent.people];
  renderEventPeople();

  document.querySelector("#event-meet").value = selectedEvent.meet;

  document.querySelector("#event-location").value = selectedEvent.location;

  eventLabelInput.value = selectedEvent.label;

  eventLabels.forEach((button) => {
    button.style.borderColor =
      button.dataset.label === selectedEvent.label
        ? "var(--color-text)"
        : "transparent";
  });

  document.querySelector("#event-description").value =
    selectedEvent.description;

  document.querySelector("#event-drive").value = selectedEvent.drive;

  updateAllDayFields();

  eventSubmitButton.textContent = "Update Event";

  eventForm.dataset.editingId = selectedEvent.id;

  eventModal.classList.remove("hidden");
  eventModal.classList.add("flex");
}

editEventButton.addEventListener("click", editSelectedEvent);

newEventButton.addEventListener("click", openEventModal);

closeEventModal.addEventListener("click", closeEventModalWindow);

cancelEvent.addEventListener("click", closeEventModalWindow);

function deleteSelectedEvent() {
  if (!selectedEventId) {
    return;
  }

  const confirmed = window.confirm("Delete this event?");

  if (!confirmed) {
    return;
  }

  const eventIndex = events.findIndex((event) => event.id === selectedEventId);

  if (eventIndex === -1) {
    return;
  }

  events.splice(eventIndex, 1);

  saveEvents();
  renderCalendar();

  closeEventDetailsModal();
}

deleteEventButton.addEventListener("click", deleteSelectedEvent);

eventForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const editingId = eventForm.dataset.editingId;

  const eventData = {
    title: document.querySelector("#event-title").value.trim(),

    allDay: document.querySelector("#event-all-day").checked,

    startDate: eventStart.value,

    finishDate: eventFinish.value,

    repetition: document.querySelector("#event-repetition").value,

    people: [...eventPeople],

    meet: document.querySelector("#event-meet").value.trim(),

    location: document.querySelector("#event-location").value.trim(),

    label: eventLabelInput.value,

    description: document.querySelector("#event-description").value.trim(),

    drive: document.querySelector("#event-drive").value.trim(),
  };

  if (editingId) {
    const eventIndex = events.findIndex((event) => event.id === editingId);

    if (eventIndex !== -1) {
      events[eventIndex] = {
        ...events[eventIndex],
        ...eventData,
      };
    }

    delete eventForm.dataset.editingId;
  } else {
    events.push(createEvent(eventData));
  }

  saveEvents();
  renderCalendar();

  eventForm.reset();

  eventPeople = [];
  renderEventPeople();

  eventLabels.forEach((button) => {
    button.style.borderColor = "transparent";
  });

  eventLabels[0].style.borderColor = "var(--color-text)";

  eventLabelInput.value = "blue";

  eventSubmitButton.textContent = "Create Event";

  closeEventModalWindow();
});

eventLabels.forEach((labelButton) => {
  labelButton.addEventListener("click", () => {
    eventLabels.forEach((button) => {
      button.style.borderColor = "transparent";
    });

    labelButton.style.borderColor = "var(--color-text)";

    eventLabelInput.value = labelButton.dataset.label;
  });
});

const THEME_KEY = "meeting-hub-theme";

const themes = ["light", "dark", "system"];

const EVENTS_KEY = "meeting-hub-events";

let events = loadEvents();

function loadEvents() {
  const storedEvents = localStorage.getItem(EVENTS_KEY);

  if (!storedEvents) {
    return [];
  }

  try {
    return JSON.parse(storedEvents);
  } catch {
    return [];
  }
}

function saveEvents() {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

function getEventOccurrences(event, rangeStart, rangeEnd) {
  const occurrences = [];

  if (!event.startDate) {
    return occurrences;
  }

  const start = new Date(event.startDate);

  if (Number.isNaN(start.getTime())) {
    return occurrences;
  }

  const finish = event.finishDate
    ? new Date(event.finishDate)
    : new Date(start.getTime() + 60 * 60 * 1000);

  const duration = Math.max(0, finish.getTime() - start.getTime());

  // No repetition
  if (!event.repetition) {
    if (start >= rangeStart && start < rangeEnd) {
      occurrences.push({
        ...event,
        occurrenceStart: new Date(start),
        occurrenceFinish: new Date(start.getTime() + duration),
      });
    }

    return occurrences;
  }

  const current = new Date(start);

  while (current < rangeEnd) {
    const occurrenceStart = new Date(current);
    const occurrenceFinish = new Date(occurrenceStart.getTime() + duration);

    if (occurrenceStart >= rangeStart && occurrenceStart < rangeEnd) {
      occurrences.push({
        ...event,
        occurrenceStart,
        occurrenceFinish,
      });
    }

    switch (event.repetition) {
      case "daily":
        current.setDate(current.getDate() + 1);
        break;

      case "weekly":
        current.setDate(current.getDate() + 7);
        break;

      case "monthly":
        current.setMonth(current.getMonth() + 1);
        break;

      case "yearly":
        current.setFullYear(current.getFullYear() + 1);
        break;

      default:
        return occurrences;
    }
  }

  return occurrences;
}

function createEvent({
  title = "",
  allDay = false,
  startDate = "",
  finishDate = "",
  repetition = "",
  people = [],
  meet = "",
  location = "",
  label = "",
  description = "",
  drive = "",
} = {}) {
  return {
    id: crypto.randomUUID(),
    type: "event",
    title,
    allDay,
    startDate,
    finishDate,
    repetition,
    people,
    meet,
    location,
    label,
    description,
    drive,
  };
}

let currentView = "month";
let currentDate = new Date();

// --------------------
// Theme
// --------------------

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || "system";
}

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  const actualTheme = theme === "system" ? getSystemTheme() : theme;

  document.documentElement.classList.toggle("dark", actualTheme === "dark");

  themeLabel.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
}

function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

function cycleTheme() {
  const currentTheme = getStoredTheme();
  const currentIndex = themes.indexOf(currentTheme);

  const nextTheme = themes[(currentIndex + 1) % themes.length];

  setTheme(nextTheme);
}

themeToggle.addEventListener("click", cycleTheme);

applyTheme(getStoredTheme());

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

mediaQuery.addEventListener("change", () => {
  if (getStoredTheme() === "system") {
    applyTheme("system");
  }
});

// --------------------
// Tabs
// --------------------

function showCalendar() {
  calendarSection.classList.remove("hidden");
  scheduleSection.classList.add("hidden");

  calendarTab.style.borderColor = "var(--color-accent)";

  calendarTab.style.color = "var(--color-accent)";

  scheduleTab.style.borderColor = "transparent";

  scheduleTab.style.color = "var(--color-text-muted)";
}

function showSchedule() {
  calendarSection.classList.add("hidden");
  scheduleSection.classList.remove("hidden");

  scheduleTab.style.borderColor = "var(--color-accent)";

  scheduleTab.style.color = "var(--color-accent)";

  calendarTab.style.borderColor = "transparent";

  calendarTab.style.color = "var(--color-text-muted)";

  renderSchedule();
}

function renderSchedule() {
  const scheduleList = document.querySelector("#schedule-list");

  if (!scheduleList) {
    return;
  }

  scheduleList.innerHTML = "";

  const now = new Date();

  const scheduleStart = new Date(now);
  scheduleStart.setHours(0, 0, 0, 0);

  const scheduleEnd = new Date(scheduleStart);
  scheduleEnd.setDate(scheduleEnd.getDate() + 30);

  const scheduledOccurrences = events.flatMap((event) => {
    return getEventOccurrences(event, scheduleStart, scheduleEnd);
  });

  const upcomingOccurrences = scheduledOccurrences
    .filter((event) => event.occurrenceStart >= now)
    .sort((a, b) => a.occurrenceStart - b.occurrenceStart);

  if (upcomingOccurrences.length === 0) {
    const emptyState = document.createElement("div");

    emptyState.className =
      "flex min-h-40 items-center justify-center rounded-lg border border-dashed";

    emptyState.style.borderColor = "var(--color-border)";
    emptyState.style.color = "var(--color-text-muted)";

    emptyState.textContent = "No events yet";

    scheduleList.appendChild(emptyState);
    return;
  }

  upcomingOccurrences.forEach((event) => {
    const eventElement = document.createElement("div");

    eventElement.className =
      "cursor-pointer rounded-lg border p-4 transition-shadow hover:shadow-sm";

    eventElement.classList.add("cursor-pointer");

    const labelBar = document.createElement("div");

    labelBar.className = "mb-3 h-1.5 w-full rounded-full";

    labelBar.style.backgroundColor = getLabelColor(event.label);

    eventElement.appendChild(labelBar);

    eventElement.addEventListener("click", () => {
      openEventDetails(event.id);
    });

    eventElement.style.borderColor = "var(--color-border)";
    eventElement.style.backgroundColor = "var(--color-surface)";

    const title = document.createElement("div");

    title.className = "font-medium";
    title.textContent = event.title || "Untitled Event";

    const date = document.createElement("div");

    date.className = "mt-1 text-sm";
    date.style.color = "var(--color-text-muted)";

    if (event.startDate) {
      const eventDate = new Date(event.occurrenceStart);

      date.textContent = eventDate.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } else {
      date.textContent = "No date";
    }

    const time = document.createElement("div");

    time.className = "mt-1 text-sm";
    time.style.color = "var(--color-text-muted)";

    if (event.startDate) {
      const eventDate = new Date(event.occurrenceStart);

      time.textContent = event.allDay
        ? "All day"
        : eventDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
    } else {
      time.textContent = "";
    }

    if (event.people && event.people.length > 0) {
      const people = document.createElement("div");

      people.className = "mt-3 flex flex-wrap gap-2";

      event.people.forEach((person) => {
        const chip = document.createElement("span");

        chip.className = "rounded-full border px-2.5 py-1 text-xs";

        chip.style.borderColor = "var(--color-border)";
        chip.style.color = "var(--color-text-muted)";

        chip.textContent = person;

        people.appendChild(chip);
      });

      eventElement.appendChild(people);
    }

    if (event.meet || event.location) {
      const details = document.createElement("div");

      details.className = "mt-3 space-y-1 text-sm";
      details.style.color = "var(--color-text-muted)";

      if (event.meet) {
        const meet = createLinkButton("Join Meeting", event.meet);

        details.appendChild(meet);
      }

      if (event.location) {
        const location = createLinkButton("Open Location", event.location);

        details.appendChild(location);
      }

      eventElement.appendChild(details);
    }

    if (event.description) {
      const description = document.createElement("div");

      description.className = "mt-3 text-sm leading-6";
      description.style.color = "var(--color-text-muted)";

      description.textContent = event.description;

      eventElement.appendChild(description);
    }

    eventElement.appendChild(time);

    eventElement.appendChild(title);
    eventElement.appendChild(date);

    scheduleList.appendChild(eventElement);
  });
}

calendarTab.addEventListener("click", showCalendar);
scheduleTab.addEventListener("click", showSchedule);

// --------------------
// Calendar View Buttons
// --------------------

function updateViewButtons() {
  const buttons = [
    {
      name: "day",
      element: dayViewButton,
    },
    {
      name: "week",
      element: weekViewButton,
    },
    {
      name: "month",
      element: monthViewButton,
    },
  ];

  buttons.forEach(({ name, element }) => {
    if (name === currentView) {
      element.style.backgroundColor = "var(--color-accent)";

      element.style.color = "white";
    } else {
      element.style.backgroundColor = "transparent";

      element.style.color = "var(--color-text-muted)";
    }
  });
}

// --------------------
// Week Helpers
// --------------------

function getWeekStart(date) {
  const result = new Date(date);

  const day = result.getDay();

  const daysSinceSaturday = (day + 1) % 7;

  result.setDate(result.getDate() - daysSinceSaturday);

  result.setHours(0, 0, 0, 0);

  return result;
}

function getWeekDates(date) {
  const start = getWeekStart(date);

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);

    day.setDate(start.getDate() + index);

    return day;
  });
}

// --------------------
// Calendar Title
// --------------------

function updateCalendarTitle() {
  if (currentView === "month") {
    calendarTitle.textContent = currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    return;
  }

  if (currentView === "week") {
    const weekStart = getWeekStart(currentDate);

    const weekEnd = new Date(weekStart);

    weekEnd.setDate(weekStart.getDate() + 6);

    const startText = weekStart.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const endText = weekEnd.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    calendarTitle.textContent = `${startText} – ${endText}`;

    return;
  }

  if (currentView === "day") {
    calendarTitle.textContent = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
}

// --------------------
// Set View
// --------------------

function setView(view) {
  currentView = view;

  updateViewButtons();
  updateCalendarTitle();
  renderCalendar();
}

// --------------------
// Month View
// --------------------

function getLabelColor(label) {
  const colors = {
    blue: "#3b82f6",
    purple: "#8b5cf6",
    pink: "#ec4899",
    red: "#ef4444",
    orange: "#f97316",
    yellow: "#eab308",
    green: "#22c55e",
    gray: "#6b7280",
  };

  return colors[label] || colors.blue;
}

function renderTimedEvent(event, container, hour) {
  if (!event.startDate || event.allDay) {
    return;
  }

  const start = new Date(event.startDate);
  const finish = event.finishDate
    ? new Date(event.finishDate)
    : new Date(start.getTime() + 60 * 60 * 1000);

  const startHour = start.getHours();
  const startMinutes = start.getMinutes();

  if (startHour !== hour) {
    return;
  }

  const durationMinutes = Math.max(
    30,
    (finish.getTime() - start.getTime()) / 60000,
  );

  const eventElement = document.createElement("div");

  eventElement.className =
    "absolute left-1 right-1 top-1 z-10 overflow-hidden rounded-md px-2 py-1 text-xs";

  eventElement.style.backgroundColor = getLabelColor(event.label);
  eventElement.style.color = "white";
  eventElement.style.height = `${Math.max(
    32,
    (durationMinutes / 60) * 64 - 8,
  )}px`;
  eventElement.style.cursor = "pointer";

  const title = document.createElement("div");

  title.className = "truncate font-medium";
  title.textContent = event.title || "Untitled Event";

  const time = document.createElement("div");

  time.className = "truncate text-[10px] opacity-80";

  time.textContent =
    `${String(start.getHours()).padStart(2, "0")}:` +
    `${String(start.getMinutes()).padStart(2, "0")}`;

  eventElement.appendChild(title);
  eventElement.appendChild(time);

  eventElement.addEventListener("click", (clickEvent) => {
    clickEvent.stopPropagation();
    openEventDetails(event.id);
  });

  container.appendChild(eventElement);
}

function renderMonth() {
  calendar.innerHTML = "";

  calendar.className = "grid grid-cols-7 overflow-hidden border-l border-t";

  calendar.style.borderColor = "var(--color-border)";

  const weekdays = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  weekdays.forEach((day) => {
    const header = document.createElement("div");

    header.className =
      "min-h-10 border-b border-r p-2 text-xs font-medium sm:p-3 sm:text-sm";

    header.style.borderColor = "var(--color-border)";

    header.style.color = "var(--color-text-muted)";

    header.textContent = day;

    calendar.appendChild(header);
  });

  const year = currentDate.getFullYear();

  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);

  const firstDayIndex = (firstDay.getDay() + 1) % 7;

  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

  const daysInPreviousMonth = new Date(year, month, 0).getDate();

  const totalCells = 42;
  const today = new Date();

  for (let index = 0; index < totalCells; index++) {
    const cell = document.createElement("div");

    cell.className = "min-h-20 border-b border-r p-2 sm:min-h-28 sm:p-3";

    cell.style.borderColor = "var(--color-border)";

    cell.style.backgroundColor = "var(--color-surface)";

    let dayNumber;
    let cellMonth = month;
    let cellYear = year;
    let isCurrentMonth = true;

    if (index < firstDayIndex) {
      dayNumber = daysInPreviousMonth - firstDayIndex + index + 1;

      cellMonth = month - 1;
      isCurrentMonth = false;

      if (cellMonth < 0) {
        cellMonth = 11;
        cellYear = year - 1;
      }
    } else if (index >= firstDayIndex + daysInCurrentMonth) {
      dayNumber = index - firstDayIndex - daysInCurrentMonth + 1;

      cellMonth = month + 1;
      isCurrentMonth = false;

      if (cellMonth > 11) {
        cellMonth = 0;
        cellYear = year + 1;
      }
    } else {
      dayNumber = index - firstDayIndex + 1;
    }

    const dayNumberElement = document.createElement("div");

    dayNumberElement.className =
      "flex h-7 w-7 items-center justify-center rounded-full text-sm";

    dayNumberElement.textContent = dayNumber;

    if (!isCurrentMonth) {
      dayNumberElement.style.color = "var(--color-text-muted)";

      dayNumberElement.style.opacity = "0.45";
    } else {
      dayNumberElement.style.color = "var(--color-text)";
    }

    const isToday =
      dayNumber === today.getDate() &&
      cellMonth === today.getMonth() &&
      cellYear === today.getFullYear();

    if (isToday) {
      dayNumberElement.style.backgroundColor = "var(--color-accent)";

      dayNumberElement.style.color = "white";
    }

    cell.appendChild(dayNumberElement);

    // Events
    const cellDate = new Date(cellYear, cellMonth, dayNumber);
    cellDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(cellDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const dayEvents = events.flatMap((event) => {
      return getEventOccurrences(event, cellDate, nextDay);
    });

    const eventsContainer = document.createElement("div");

    eventsContainer.className = "mt-2 space-y-1";

    dayEvents.forEach((event) => {
      const eventElement = document.createElement("div");

      eventElement.style.cursor = "pointer";

      eventElement.addEventListener("click", () => {
        openEventDetails(event.id);
      });

      eventElement.className =
        "flex items-center gap-1 truncate rounded-md px-1.5 py-1 text-xs";

      eventElement.style.backgroundColor = getLabelColor(event.label);

      eventElement.style.color = "white";

      const dot = document.createElement("span");

      dot.className = "h-1.5 w-1.5 shrink-0 rounded-full bg-white";

      const title = document.createElement("span");

      title.className = "truncate";

      title.textContent = event.title || "Untitled Event";

      eventElement.appendChild(dot);
      eventElement.appendChild(title);

      eventsContainer.appendChild(eventElement);
    });

    cell.appendChild(eventsContainer);

    calendar.appendChild(cell);
  }
}

// --------------------
// Week View
// --------------------

function renderWeek() {
  calendar.innerHTML = "";

  const weekStart = new Date(currentDate);
  const dayOfWeek = weekStart.getDay();

  const daysFromSaturday = (dayOfWeek + 1) % 7;

  weekStart.setDate(weekStart.getDate() - daysFromSaturday);

  weekStart.setHours(0, 0, 0, 0);

  const weekDates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    weekDates.push(date);
  }

  const wrapper = document.createElement("div");

  wrapper.className = "w-full";

  const headerGrid = document.createElement("div");

  headerGrid.className = "grid w-full grid-cols-[64px_repeat(7,minmax(0,1fr))]";

  const emptyHeader = document.createElement("div");

  emptyHeader.className = "border-b border-r";

  emptyHeader.style.borderColor = "var(--color-border)";

  headerGrid.appendChild(emptyHeader);

  weekDates.forEach((date) => {
    const dayHeader = document.createElement("div");

    dayHeader.className = "border-b border-r p-3 text-center";

    dayHeader.style.borderColor = "var(--color-border)";

    dayHeader.style.backgroundColor = "var(--color-surface)";

    dayHeader.innerHTML = `
      <div
        class="text-xs"
        style="color: var(--color-text-muted);"
      >
        ${date.toLocaleDateString("en-US", {
          weekday: "short",
        })}
      </div>

      <div
        class="mt-1 text-sm font-medium"
        style="color: var(--color-text);"
      >
        ${date.getDate()}
      </div>
    `;

    headerGrid.appendChild(dayHeader);
  });

  wrapper.appendChild(headerGrid);

  const body = document.createElement("div");

  body.className = "grid w-full grid-cols-[64px_repeat(7,minmax(0,1fr))]";

  /*
   * Time column
   */
  const timeColumn = document.createElement("div");

  timeColumn.className = "border-r";

  timeColumn.style.borderColor = "var(--color-border)";

  for (let hour = 0; hour < 24; hour++) {
    const timeCell = document.createElement("div");

    timeCell.className = "h-16 border-b px-1 text-right text-[10px]";

    timeCell.style.borderColor = "var(--color-border)";

    timeCell.style.color = "var(--color-text-muted)";

    timeCell.style.paddingTop = "4px";

    timeCell.textContent = `${String(hour).padStart(2, "0")}:00`;

    timeColumn.appendChild(timeCell);
  }

  body.appendChild(timeColumn);

  /*
   * Day columns
   */
  weekDates.forEach((date) => {
    const dayColumn = document.createElement("div");

    dayColumn.className = "relative h-[1536px] border-r";

    dayColumn.style.borderColor = "var(--color-border)";

    dayColumn.style.backgroundColor = "var(--color-surface)";

    /*
     * Hour lines
     */
    for (let hour = 0; hour < 24; hour++) {
      const hourLine = document.createElement("div");

      hourLine.className = "h-16 border-b";

      hourLine.style.borderColor = "var(--color-border)";

      dayColumn.appendChild(hourLine);
    }

    /*
     * Events overlay
     */
    const eventLayer = document.createElement("div");

    eventLayer.className = "absolute inset-0";

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const dayEvents = events.flatMap((event) => {
      if (event.allDay) {
        return [];
      }

      return getEventOccurrences(event, date, nextDate);
    });

    dayEvents.sort((a, b) => a.occurrenceStart - b.occurrenceStart);

    const eventItems = dayEvents.map((event) => {
      const start = new Date(event.occurrenceStart);
      const finish = new Date(event.occurrenceFinish);

      return {
        event,
        start,
        finish,
        column: 0,
        columns: 1,
      };
    });

    /*
     * Find overlapping groups
     */
    const groups = [];

    eventItems.forEach((item) => {
      let group = null;

      for (const existingGroup of groups) {
        const overlaps = existingGroup.some(
          (other) => item.start < other.finish && item.finish > other.start,
        );

        if (overlaps) {
          group = existingGroup;
          break;
        }
      }

      if (group) {
        group.push(item);
      } else {
        groups.push([item]);
      }
    });

    /*
     * Assign columns inside each overlap group
     */
    groups.forEach((group) => {
      const columns = [];

      group.forEach((item) => {
        let column = 0;

        while (columns[column] && item.start < columns[column]) {
          column++;
        }

        columns[column] = item.finish;
        item.column = column;
      });

      const columnCount = columns.length;

      group.forEach((item) => {
        item.columns = columnCount;
      });
    });

    /*
     * Render events
     */
    eventItems.forEach((item) => {
      const startMinutes = item.start.getHours() * 60 + item.start.getMinutes();

      const durationMinutes = Math.max(
        30,
        (item.finish.getTime() - item.start.getTime()) / 60000,
      );

      const top = (startMinutes / 60) * 64;

      const height = Math.max(32, (durationMinutes / 60) * 64 - 8);

      const gap = 4;

      const width = 100 / item.columns;

      const left = item.column * width;

      const eventElement = document.createElement("div");

      eventElement.className =
        "absolute overflow-hidden rounded-md px-2 py-1 text-xs";

      eventElement.style.top = `${top + gap}px`;

      eventElement.style.height = `${height}px`;

      eventElement.style.left = `calc(${left}% + ${gap}px)`;

      eventElement.style.width = `calc(${width}% - ${gap * 2}px)`;

      eventElement.style.backgroundColor = getLabelColor(item.event.label);

      eventElement.style.color = "white";

      eventElement.style.cursor = "pointer";

      const title = document.createElement("div");

      title.className = "truncate font-medium";

      title.textContent = item.event.title || "Untitled Event";

      const time = document.createElement("div");

      time.className = "truncate text-[10px] opacity-80";

      time.textContent =
        `${String(item.start.getHours()).padStart(2, "0")}:` +
        `${String(item.start.getMinutes()).padStart(2, "0")}`;

      eventElement.appendChild(title);
      eventElement.appendChild(time);

      eventElement.addEventListener("click", (clickEvent) => {
        clickEvent.stopPropagation();

        openEventDetails(item.event.id);
      });

      eventLayer.appendChild(eventElement);
    });

    dayColumn.appendChild(eventLayer);

    body.appendChild(dayColumn);
  });

  wrapper.appendChild(body);

  calendar.className = "w-full";

  calendar.appendChild(wrapper);
}

// --------------------
// Day View
// --------------------

function renderDay() {
  calendar.innerHTML = "";

  const dayColumn = document.createElement("div");

  dayColumn.className = "relative min-w-0 h-[1536px]";

  /*
   * Hour lines
   */
  for (let hour = 0; hour < 24; hour++) {
    const hourCell = document.createElement("div");

    hourCell.className = "h-16 border-b";

    hourCell.style.borderColor = "var(--color-border)";

    hourCell.style.backgroundColor = "var(--color-surface)";

    dayColumn.appendChild(hourCell);
  }

  /*
   * Time labels
   */
  const timeColumn = document.createElement("div");

  timeColumn.className = "w-16";

  for (let hour = 0; hour < 24; hour++) {
    const timeLabel = document.createElement("div");

    timeLabel.className = "h-16 border-b pr-2 pt-1 text-right text-[10px]";

    timeLabel.style.borderColor = "var(--color-border)";

    timeLabel.style.color = "var(--color-text-muted)";

    timeLabel.textContent = `${String(hour).padStart(2, "0")}:00`;

    timeColumn.appendChild(timeLabel);
  }

  /*
   * Event area
   */
  const eventArea = document.createElement("div");

  eventArea.className = "absolute inset-0 h-[1536px]";

  eventArea.style.backgroundColor = "transparent";

  const dayStart = new Date(currentDate);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const dayEvents = events.flatMap((event) => {
    if (event.allDay) {
      return [];
    }

    return getEventOccurrences(event, dayStart, dayEnd);
  });

  dayEvents.sort((a, b) => a.occurrenceStart - b.occurrenceStart);

  const eventItems = dayEvents.map((event) => {
    const start = new Date(event.occurrenceStart);
    const finish = new Date(event.occurrenceFinish);

    return {
      event,
      start,
      finish,
      column: 0,
      columns: 1,
    };
  });

  /*
   * Find overlapping groups
   */
  const groups = [];

  eventItems.forEach((item) => {
    let group = null;

    for (const existingGroup of groups) {
      const overlaps = existingGroup.some(
        (other) => item.start < other.finish && item.finish > other.start,
      );

      if (overlaps) {
        group = existingGroup;
        break;
      }
    }

    if (group) {
      group.push(item);
    } else {
      groups.push([item]);
    }
  });

  /*
   * Assign columns
   */
  groups.forEach((group) => {
    const columns = [];

    group.forEach((item) => {
      let column = 0;

      while (columns[column] && item.start < columns[column]) {
        column++;
      }

      columns[column] = item.finish;
      item.column = column;
    });

    const columnCount = columns.length;

    group.forEach((item) => {
      item.columns = columnCount;
    });
  });

  /*
   * Render events
   */
  eventItems.forEach((item) => {
    const startMinutes = item.start.getHours() * 60 + item.start.getMinutes();

    const durationMinutes = Math.max(
      30,
      (item.finish.getTime() - item.start.getTime()) / 60000,
    );

    const top = (startMinutes / 60) * 64;

    const height = Math.max(32, (durationMinutes / 60) * 64 - 8);

    const gap = 4;

    const width = 100 / item.columns;

    const left = item.column * width;

    const eventElement = document.createElement("div");

    eventElement.className =
      "absolute overflow-hidden rounded-md px-2 py-1 text-xs";

    eventElement.style.top = `${top + gap}px`;

    eventElement.style.height = `${height}px`;

    eventElement.style.left = `calc(${left}% + ${gap}px)`;

    eventElement.style.width = `calc(${width}% - ${gap * 2}px)`;

    eventElement.style.backgroundColor = getLabelColor(item.event.label);

    eventElement.style.color = "white";

    eventElement.style.cursor = "pointer";

    const title = document.createElement("div");

    title.className = "truncate font-medium";

    title.textContent = item.event.title || "Untitled Event";

    const time = document.createElement("div");

    time.className = "truncate text-[10px] opacity-80";

    time.textContent =
      `${String(item.start.getHours()).padStart(2, "0")}:` +
      `${String(item.start.getMinutes()).padStart(2, "0")}`;

    eventElement.appendChild(title);
    eventElement.appendChild(time);

    eventElement.addEventListener("click", (clickEvent) => {
      clickEvent.stopPropagation();

      openEventDetails(item.event.id);
    });

    eventArea.appendChild(eventElement);
  });

  /*
   * Main layout
   */
  const layout = document.createElement("div");

  layout.className = "grid w-full grid-cols-[64px_minmax(0,1fr)]";

  layout.style.width = "100%";

  layout.appendChild(timeColumn);
  layout.appendChild(dayColumn);
  /*
   * Put events above the day column
   */
  dayColumn.appendChild(eventArea);

  calendar.className = "w-full";

  calendar.appendChild(layout);
}

// --------------------
// Calendar Rendering
// --------------------

function renderCalendar() {
  if (currentView === "month") {
    renderMonth();
    return;
  }

  if (currentView === "week") {
    renderWeek();
    return;
  }

  if (currentView === "day") {
    renderDay();
    return;
  }
}

// --------------------
// Calendar Navigation
// --------------------

function goPrevious() {
  if (currentView === "day") {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  if (currentView === "week") {
    currentDate.setDate(currentDate.getDate() - 7);
  }

  if (currentView === "month") {
    currentDate.setMonth(currentDate.getMonth() - 1);
  }

  updateCalendarTitle();
  renderCalendar();
}

function goNext() {
  if (currentView === "day") {
    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (currentView === "week") {
    currentDate.setDate(currentDate.getDate() + 7);
  }

  if (currentView === "month") {
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  updateCalendarTitle();
  renderCalendar();
}

function goToday() {
  currentDate = new Date();

  updateCalendarTitle();
  renderCalendar();
}

// --------------------
// Event Listeners
// --------------------

prevButton.addEventListener("click", goPrevious);

todayButton.addEventListener("click", goToday);

nextButton.addEventListener("click", goNext);

dayViewButton.addEventListener("click", () => {
  setView("day");
});

weekViewButton.addEventListener("click", () => {
  setView("week");
});

monthViewButton.addEventListener("click", () => {
  setView("month");
});

// --------------------
// Initial State
// --------------------

setView("month");

function createLinkButton(label, url) {
  const link = document.createElement("a");

  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  link.className =
    "inline-flex items-center rounded-md border px-3 py-1.5 text-sm transition-opacity hover:opacity-70";

  link.style.borderColor = "var(--color-border)";
  link.style.color = "var(--color-text)";

  link.textContent = label;

  link.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  return link;
}
