const calendarDays = document.getElementById("calendar-days");
const monthYear = document.getElementById("month-year");

const previousButton = document.getElementById("previous-month");
const nextButton = document.getElementById("next-month");

let currentDate = new Date();

function createCalendar() {

    calendarDays.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Display month and year
    const monthName = currentDate.toLocaleString("default", {
        month: "long"
    });

    monthYear.textContent = `${monthName} ${year}`;

    // First and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Convert Sunday = 0 format to Monday = 0
    let startingDay = firstDay.getDay() - 1;

    if (startingDay === -1) {
        startingDay = 6;
    }

    // Empty spaces before first day
    for (let i = 0; i < startingDay; i++) {

        const emptyDay = document.createElement("div");

        calendarDays.appendChild(emptyDay);
    }

    // Create days
    for (let day = 1; day <= lastDay.getDate(); day++) {

        const dayElement = document.createElement("div");

        dayElement.textContent = day;

        calendarDays.appendChild(dayElement);
    }
}

previousButton.addEventListener("click", function() {

    currentDate.setMonth(currentDate.getMonth() - 1);

    createCalendar();
});

nextButton.addEventListener("click", function() {

    currentDate.setMonth(currentDate.getMonth() + 1);

    createCalendar();
});

createCalendar();

const dateDisplay = document.getElementById("current-date");

const today = new Date();

dateDisplay.textContent = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});
