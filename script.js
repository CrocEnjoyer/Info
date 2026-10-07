// ========================================
// PAGE ELEMENTS
// ========================================

const calendarDays = document.getElementById("calendar-days");
const monthYear = document.getElementById("month-year");

const previousButton = document.getElementById("previous-month");
const nextButton = document.getElementById("next-month");

const dateDisplay = document.getElementById("current-date");


// EVENT POPUP

const eventModal = document.getElementById("event-modal");
const closeModalButton = document.getElementById("close-modal");

const selectedDateDisplay = document.getElementById("selected-date");
const eventNameInput = document.getElementById("event-name");

const saveEventButton = document.getElementById("save-event");


// TO-DO LIST

const todoInput = document.getElementById("todo-input");
const addTaskButton = document.getElementById("add-task");

const todoList = document.getElementById("todo-list");

const emptyTasks = document.getElementById("empty-tasks");
const taskCount = document.getElementById("task-count");


// ========================================
// DATES
// ========================================

const today = new Date();

let currentDate = new Date();

let selectedDate = null;


// ========================================
// LOAD SAVED DATA
// ========================================

let events =
    JSON.parse(localStorage.getItem("calendarEvents")) || {};

let tasks =
    JSON.parse(localStorage.getItem("todoTasks")) || [];


// ========================================
// TODAY'S DATE
// ========================================

dateDisplay.textContent =
    today.toLocaleDateString("en-GB", {

        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"

    });


// ========================================
// CREATE DATE KEY
// ========================================

function createDateKey(year, month, day) {

    const monthNumber =
        String(month + 1).padStart(2, "0");

    const dayNumber =
        String(day).padStart(2, "0");

    return `${year}-${monthNumber}-${dayNumber}`;
}


// ========================================
// CREATE CALENDAR
// ========================================

function createCalendar() {

    calendarDays.innerHTML = "";


    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    const monthName =
        currentDate.toLocaleString(
            "en-GB",
            {
                month: "long"
            }
        );


    monthYear.textContent =
        `${monthName} ${year}`;


    // First and last days

    const firstDay =
        new Date(year, month, 1);

    const lastDay =
        new Date(year, month + 1, 0);


    // Make Monday the first day

    let startingDay =
        firstDay.getDay() - 1;


    if (startingDay === -1) {

        startingDay = 6;

    }


    // ========================================
    // EMPTY CALENDAR SPACES
    // ========================================

    for (
        let i = 0;
        i < startingDay;
        i++
    ) {

        const emptyDay =
            document.createElement("div");

        emptyDay.classList.add(
            "calendar-empty"
        );

        calendarDays.appendChild(
            emptyDay
        );

    }


    // ========================================
    // CREATE DAYS
    // ========================================

    for (
        let day = 1;
        day <= lastDay.getDate();
        day++
    ) {

        const dayElement =
            document.createElement("div");


        dayElement.classList.add(
            "calendar-day"
        );


        // DAY NUMBER

        const dayNumber =
            document.createElement("span");


        dayNumber.classList.add(
            "day-number"
        );


        dayNumber.textContent = day;


        dayElement.appendChild(
            dayNumber
        );


        // ========================================
        // TODAY
        // ========================================

        if (

            day === today.getDate() &&

            month === today.getMonth() &&

            year === today.getFullYear()

        ) {

            dayElement.classList.add(
                "today"
            );

        }


        // ========================================
        // DATE KEY
        // ========================================

        const dateKey =
            createDateKey(
                year,
                month,
                day
            );


        // ========================================
        // SHOW EVENTS
        // ========================================

        if (events[dateKey]) {

            events[dateKey].forEach(

                function (
                    eventName,
                    eventIndex
                ) {

                    const eventElement =
                        document.createElement(
                            "div"
                        );


                    eventElement.classList.add(
                        "calendar-event"
                    );


                    // EVENT NAME

                    const eventText =
                        document.createElement(
                            "span"
                        );


                    eventText.classList.add(
                        "event-text"
                    );


                    eventText.textContent =
                        eventName;


                    // DELETE EVENT

                    const deleteButton =
                        document.createElement(
                            "button"
                        );


                    deleteButton.classList.add(
                        "delete-event"
                    );


                    deleteButton.textContent =
                        "×";


                    deleteButton.addEventListener(

                        "click",

                        function (event) {

                            event.stopPropagation();

                            deleteCalendarEvent(
                                dateKey,
                                eventIndex
                            );

                        }

                    );


                    eventElement.appendChild(
                        eventText
                    );


                    eventElement.appendChild(
                        deleteButton
                    );


                    dayElement.appendChild(
                        eventElement
                    );

                }

            );

        }


        // ========================================
        // CLICK DAY
        // ========================================

        dayElement.addEventListener(

            "click",

            function () {

                openEventModal(
                    year,
                    month,
                    day
                );

            }

        );


        calendarDays.appendChild(
            dayElement
        );

    }

}


// ========================================
// CHANGE MONTH
// ========================================

previousButton.addEventListener(

    "click",

    function () {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        createCalendar();

    }

);


nextButton.addEventListener(

    "click",

    function () {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        createCalendar();

    }

);


// ========================================
// OPEN EVENT POPUP
// ========================================

function openEventModal(
    year,
    month,
    day
) {

    selectedDate =
        createDateKey(
            year,
            month,
            day
        );


    const displayDate =
        new Date(
            year,
            month,
            day
        );


    selectedDateDisplay.textContent =
        displayDate.toLocaleDateString(
            "en-GB",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    eventNameInput.value = "";


    eventModal.classList.add(
        "show"
    );


    setTimeout(
        function () {

            eventNameInput.focus();

        },
        100
    );

}


// ========================================
// CLOSE EVENT POPUP
// ========================================

function closeEventModal() {

    eventModal.classList.remove(
        "show"
    );


    eventNameInput.value = "";

    selectedDate = null;

}


closeModalButton.addEventListener(
    "click",
    closeEventModal
);


// Close when clicking background

eventModal.addEventListener(

    "click",

    function (event) {

        if (
            event.target === eventModal
        ) {

            closeEventModal();

        }

    }

);


// ESC closes popup

document.addEventListener(

    "keydown",

    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeEventModal();

        }

    }

);


// ========================================
// SAVE EVENT
// ========================================

function saveEvent() {

    const eventName =
        eventNameInput.value.trim();


    if (
        eventName === "" ||
        selectedDate === null
    ) {

        return;

    }


    if (!events[selectedDate]) {

        events[selectedDate] = [];

    }


    events[selectedDate].push(
        eventName
    );


    saveEvents();


    closeEventModal();

    createCalendar();

}


saveEventButton.addEventListener(
    "click",
    saveEvent
);


// ENTER SAVES EVENT

eventNameInput.addEventListener(

    "keydown",

    function (event) {

        if (
            event.key === "Enter"
        ) {

            saveEvent();

        }

    }

);


// ========================================
// SAVE EVENTS
// ========================================

function saveEvents() {

    localStorage.setItem(

        "calendarEvents",

        JSON.stringify(events)

    );

}


// ========================================
// DELETE EVENT
// ========================================

function deleteCalendarEvent(
    dateKey,
    eventIndex
) {

    events[dateKey].splice(
        eventIndex,
        1
    );


    if (
        events[dateKey].length === 0
    ) {

        delete events[dateKey];

    }


    saveEvents();

    createCalendar();

}


// ========================================
// DISPLAY TASKS
// ========================================

function displayTasks() {

    todoList.innerHTML = "";


    if (tasks.length === 0) {

        emptyTasks.style.display =
            "block";

    } else {

        emptyTasks.style.display =
            "none";

    }


    tasks.forEach(

        function (task, index) {

            const listItem =
                document.createElement(
                    "li"
                );


            listItem.classList.add(
                "todo-item"
            );


            if (task.completed) {

                listItem.classList.add(
                    "completed"
                );

            }


            // CHECKBOX

            const checkbox =
                document.createElement(
                    "input"
                );


            checkbox.type =
                "checkbox";


            checkbox.checked =
                task.completed;


            checkbox.addEventListener(

                "change",

                function () {

                    toggleTask(index);

                }

            );


            // TASK TEXT

            const taskText =
                document.createElement(
                    "span"
                );


            taskText.classList.add(
                "task-text"
            );


            taskText.textContent =
                task.text;


            // DELETE BUTTON

            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.classList.add(
                "delete-task"
            );


            deleteButton.textContent =
                "×";


            deleteButton.addEventListener(

                "click",

                function () {

                    deleteTask(index);

                }

            );


            listItem.appendChild(
                checkbox
            );


            listItem.appendChild(
                taskText
            );


            listItem.appendChild(
                deleteButton
            );


            todoList.appendChild(
                listItem
            );

        }

    );


    updateTaskCount();

}


// ========================================
// ADD TASK
// ========================================

function addTask() {

    const taskText =
        todoInput.value.trim();


    if (taskText === "") {

        return;

    }


    tasks.push({

        text: taskText,

        completed: false

    });


    saveTasks();


    todoInput.value = "";


    displayTasks();


    todoInput.focus();

}


addTaskButton.addEventListener(
    "click",
    addTask
);


// ENTER ADDS TASK

todoInput.addEventListener(

    "keydown",

    function (event) {

        if (
            event.key === "Enter"
        ) {

            addTask();

        }

    }

);


// ========================================
// COMPLETE TASK
// ========================================

function toggleTask(index) {

    tasks[index].completed =
        !tasks[index].completed;


    saveTasks();

    displayTasks();

}


// ========================================
// DELETE TASK
// ========================================

function deleteTask(index) {

    tasks.splice(
        index,
        1
    );


    saveTasks();

    displayTasks();

}


// ========================================
// SAVE TASKS
// ========================================

function saveTasks() {

    localStorage.setItem(

        "todoTasks",

        JSON.stringify(tasks)

    );

}


// ========================================
// TASK COUNT
// ========================================

function updateTaskCount() {

    const remainingTasks =
        tasks.filter(

            function (task) {

                return !task.completed;

            }

        ).length;


    if (remainingTasks === 1) {

        taskCount.textContent =
            "1 task remaining";

    } else {

        taskCount.textContent =
            `${remainingTasks} tasks remaining`;

    }

}


// ========================================
// START
// ========================================

createCalendar();

displayTasks();

// ========================================
// DASHBOARD OVERVIEW
// ========================================

function updateDashboardOverview() {

    updateOverviewTasks();

    updateOverviewPayments();

    updateOverviewEvent();

    updateOverviewSpotify();

}


// ========================================
// TASK OVERVIEW
// ========================================

function updateOverviewTasks() {

    const remaining =
        tasks.filter(
            function(task) {

                return !task.completed;

            }
        ).length;


    const display =
        document.getElementById(
            "overview-task-count"
        );


    if (remaining === 1) {

        display.textContent =
            "1 remaining";

    } else {

        display.textContent =
            `${remaining} remaining`;

    }

}


// ========================================
// PAYMENT OVERVIEW
// ========================================

function updateOverviewPayments() {

    const savedPayments =
        JSON.parse(
            localStorage.getItem(
                "monthlyPayments"
            )
        ) || [];


    const monthly =
        savedPayments.reduce(
            function(total, payment) {

                return total +
                    Number(payment.amount);

            },
            0
        );


    const yearly =
        monthly * 12;


    const formatter =
        new Intl.NumberFormat(
            "en-GB",
            {
                style: "currency",
                currency: "GBP"
            }
        );


    document.getElementById(
        "overview-monthly"
    ).textContent =
        `${formatter.format(monthly)} / month`;


    document.getElementById(
        "overview-yearly"
    ).textContent =
        `${formatter.format(yearly)} / year`;

}


// ========================================
// NEXT CALENDAR EVENT
// ========================================

function updateOverviewEvent() {

    const eventName =
        document.getElementById(
            "overview-event-name"
        );


    const eventDate =
        document.getElementById(
            "overview-event-date"
        );


    const todayStart =
        new Date();


    todayStart.setHours(
        0,
        0,
        0,
        0
    );


    let upcomingEvents = [];


    Object.keys(events).forEach(
        function(dateKey) {

            const dateParts =
                dateKey.split("-");


            const eventDay =
                new Date(
                    Number(dateParts[0]),
                    Number(dateParts[1]) - 1,
                    Number(dateParts[2])
                );


            if (eventDay >= todayStart) {

                events[dateKey].forEach(
                    function(name) {

                        upcomingEvents.push({

                            name: name,

                            date: eventDay

                        });

                    }
                );

            }

        }
    );


    upcomingEvents.sort(
        function(a, b) {

            return a.date - b.date;

        }
    );


    if (upcomingEvents.length === 0) {

        eventName.textContent =
            "Nothing planned";


        eventDate.textContent =
            "Your calendar is clear";


        return;

    }


    const nextEvent =
        upcomingEvents[0];


    eventName.textContent =
        nextEvent.name;


    eventDate.textContent =
        nextEvent.date.toLocaleDateString(
            "en-GB",
            {
                weekday: "short",
                day: "numeric",
                month: "long"
            }
        );

}


// ========================================
// SPOTIFY OVERVIEW
// ========================================

function updateOverviewSpotify() {

    const history =
        JSON.parse(
            localStorage.getItem(
                "spotifyListeningHistory"
            )
        ) || {};


    const plays =
        Object.values(history);


    if (plays.length === 0) {

        return;

    }


    plays.sort(
        function(a, b) {

            return new Date(b.playedAt) -
                   new Date(a.playedAt);

        }
    );


    const latest =
        plays[0];


    document.getElementById(
        "overview-track-name"
    ).textContent =
        latest.track;


    document.getElementById(
        "overview-track-artist"
    ).textContent =
        latest.artist;

}


// ========================================
// REFRESH OVERVIEW
// ========================================

updateDashboardOverview();
