// ===============================
// CALENDAR
// ===============================

const calendarDays = document.getElementById("calendar-days");
const monthYear = document.getElementById("month-year");

const previousButton = document.getElementById("previous-month");
const nextButton = document.getElementById("next-month");

// Start calendar on today's date
let currentDate = new Date();


// ===============================
// CREATE CALENDAR
// ===============================

function createCalendar() {

    // Clear the existing calendar
    calendarDays.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get the name of the month
    const monthName = currentDate.toLocaleString("default", {
        month: "long"
    });

    // Display month and year
    monthYear.textContent = `${monthName} ${year}`;


    // ===============================
    // FIRST AND LAST DAY OF MONTH
    // ===============================

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // JavaScript normally starts the week on Sunday.
    // This changes it so Monday is first.
    let startingDay = firstDay.getDay() - 1;

    if (startingDay === -1) {
        startingDay = 6;
    }


    // ===============================
    // EMPTY DAYS BEFORE MONTH STARTS
    // ===============================

    for (let i = 0; i < startingDay; i++) {

        const emptyDay = document.createElement("div");

        calendarDays.appendChild(emptyDay);
    }


    // ===============================
    // CREATE DAYS
    // ===============================

    for (let day = 1; day <= lastDay.getDate(); day++) {

        const dayElement = document.createElement("div");

        dayElement.classList.add("calendar-day");


        // Create day number
        const dayNumber = document.createElement("span");

        dayNumber.textContent = day;

        dayElement.appendChild(dayNumber);


        // ===============================
        // CLICK DAY TO ADD EVENT
        // ===============================

        dayElement.addEventListener("click", function () {

            const eventName = prompt(
                `Add an event for ${day} ${monthName} ${year}:`
            );

            // Make sure something was entered
            if (eventName !== null && eventName.trim() !== "") {

                const eventElement = document.createElement("p");

                eventElement.classList.add("calendar-event");

                eventElement.textContent = eventName;

                dayElement.appendChild(eventElement);
            }
        });


        calendarDays.appendChild(dayElement);
    }
}


// ===============================
// PREVIOUS MONTH BUTTON
// ===============================

previousButton.addEventListener("click", function () {

    currentDate.setMonth(currentDate.getMonth() - 1);

    createCalendar();
});


// ===============================
// NEXT MONTH BUTTON
// ===============================

nextButton.addEventListener("click", function () {

    currentDate.setMonth(currentDate.getMonth() + 1);

    createCalendar();
});


// ===============================
// DISPLAY TODAY'S DATE
// ===============================

const dateDisplay = document.getElementById("current-date");

const today = new Date();

dateDisplay.textContent = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});


// ===============================
// LOAD CALENDAR
// ===============================

createCalendar();
