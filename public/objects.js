// Show booked in navbar
function getCountUpcoming() {
  let notification = document.getElementById("count-upcoming");
  let count = window.localStorage.getItem("booked") || "";
  count = count.split(" ").length - 1;

  notification.innerHTML = count;
}

// Helpful constructor for date objects
function constructDate(daysIntoFuture, hour, minute) {
  let date = new Date();
  date.setDate(date.getDate() + daysIntoFuture);
  date.setHours(hour, minute, 0)

  return date;
}

// Helper function for Date objects
function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

// Helper function to extract full date without time
function parseFullDate(date) {
  return date.toLocaleDateString([], {day: "numeric", month: "short", year: "numeric"});
}

// Extract time from date
function parseTime(date) {
  return date.toLocaleTimeString([], {timeStyle: "short"})
}

function parseFullDateWithTime(date) {
  return parseFullDate(date) + ", " + parseTime(date);
}

// Helper function to group appointments
function groupAppointments(apptList, attr) {
  switch (attr) {
    // Group appointments by day
    case "day":
      return Object.entries(apptList).reduce((res, element) => {
          let date = parseFullDate(element[1].time);
          res[date] = res[date] || [];
          res[date].push(element);
          return res;
      }, {});
  }
}

// Helper function to filter appointments
function filterAppointments(apptList, attr, val) {
  switch (attr) {
    // Return appointments of same type
    case "type":
      return Object.entries(apptList).reduce((res, element) => {
          if (element[1].type == val) res[element[0]] = element[1]
          return res
      }, {});
    // Return appointments of same day or within next seven days
    case "nextSevenDays":
      return Object.entries(apptList).reduce((res, element) => {
          let selectedDate = val;

          let weekAfterSelectedDate = new Date();
          weekAfterSelectedDate.setDate(val.getDate() + 7);

          if (parseFullDate(element[1].time) >= parseFullDate(selectedDate) && 
              parseFullDate(element[1].time) < parseFullDate(weekAfterSelectedDate)) res[element[0]] = element[1]
          return res
      }, {});
    // Return appointments that match given ids
    case "id":
      return Object.entries(apptList).reduce((res, element) => {
          if (val && val.includes(element[0])) res[element[0]] = element[1]
          return res
      }, {});
    // Return appointments that match given ids
    case "notId":
      return Object.entries(apptList).reduce((res, element) => {
          console.log(val);
          console.log(element[0]);
          if (!val || !val.includes(element[0])) res[element[0]] = element[1]
          return res
      }, {});
  }
}

// All available appointments
let appointments = {
  "appointment_1": {
    "type": "Vaccine",
    "time": constructDate(1, 12, 30),
    "location": "East Campus Garage",
    "vaccine_type": "Moderna",
    "preexisting_conditions": null,
    "result": null
  },
  "appointment_2": {
    "type": "Vaccine",
    "time": constructDate(1, 12, 30),
    "location": "East Campus Garage",
    "vaccine_type": "Pfizer",
    "preexisting_conditions": null,
    "result": null
  },
  "appointment_3": {
    "type": "Vaccine",
    "time": constructDate(1, 13, 30),
    "location": "East Campus Garage",
    "vaccine_type": "Moderna",
    "preexisting_conditions": null,
    "result": null
  },
  "appointment_4": {
    "type": "Vaccine",
    "time": constructDate(1, 14, 00),
    "location": "East Campus Garage",
    "vaccine_type": "Moderna",
    "preexisting_conditions": null,
    "result": null
  },
  "appointment_5": {
    "type": "Vaccine",
    "time": constructDate(1, 14, 30),
    "location": "East Campus Garage",
    "vaccine_type": "Moderna",
    "preexisting_conditions": null,
    "result": null
  },
  "appointment_6": {
    "type": "Vaccine",
    "time": constructDate(2, 12, 0),
    "location": "East Campus Garage",
    "vaccine_type": "Moderna",
    "preexisting_conditions": null,
    "result": null
  },
  "appointment_7": {
    "type": "Vaccine",
    "time": constructDate(-1, 12, 0),
    "location": "East Campus Garage",
    "vaccine_type": "Moderna",
    "preexisting_conditions": null,
    "result": null
  },
  
  "appointment_8": {
    "type": "PCR Test",
    "time": constructDate(-1, 12, 0),
    "location": "East Campus Garage",
    "vaccine_type": null,
    "preexisting_conditions": null,
    "result": "Not detected"
  },
  "appointment_9": {
    "type": "PCR Test",
    "time": constructDate(-1, 13, 0),
    "location": "East Campus Garage",
    "vaccine_type": null,
    "preexisting_conditions": null,
    "result": "Detected"
  },
  "appointment_10": {
    "type": "PCR Test",
    "time": constructDate(1, 12, 0),
    "location": "East Campus Garage",
    "vaccine_type": null,
    "preexisting_conditions": null,
    "result": "Detected"
  },
  "appointment_11": {
    "type": "PCR Test",
    "time": constructDate(1, 13, 0),
    "location": "East Campus Garage",
    "vaccine_type": null,
    "preexisting_conditions": null,
    "result": "Detected"
  }
  
}
