window.onload = function() {
    getAppointmentResults();
    getCountUpcoming();
};

// Book an appointment
function book(appointment) {
    let booked = window.localStorage.getItem('booked') || "";
    if (!booked.includes(appointment[0])) {
        window.localStorage.setItem('booked', booked += appointment[0] +  " ");
    }
    closeModal();
    // Update results
    getAppointmentResults();
    // Update Navbar
    getCountUpcoming();
}

// Change the results based on the appointment type selected
function filterByType(appts) {
    let appointmentTypeSelectBox = document.getElementById("appointment-type");
    let appointmentTypeSelectBoxValue = appointmentTypeSelectBox.options[appointmentTypeSelectBox.selectedIndex].value;

    return filterAppointments(appts, "type", appointmentTypeSelectBoxValue);
}

function getSelectedDate() {
    let appointmentDateSelectBox = document.getElementById("appointment-date");
    let appointmentDateSelectBoxValue = appointmentDateSelectBox.value;
    if (appointmentDateSelectBoxValue == "") return null;
    // Convert to local timezone
    return new Date(appointmentDateSelectBoxValue + "T00:00");
}

// Change the results based on the appointment date selected
function filterByNextSevenDays(appts) {
    let appointmentDateSelectBoxValue = getSelectedDate();

    return filterAppointments(appts, "nextSevenDays", appointmentDateSelectBoxValue)    
}

// When the user clicks anywhere outside of the modal, close the modal
let modal = document.getElementById("book-modal");
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
} 

// Close the modal
function closeModal() {
    modal.style.display = "none";
}

function populateModal(appointment) {
    document.getElementById("modal-date").innerHTML = 
        '<h1>' + 
        parseFullDateWithTime(appointment[1].time) +
        '</h1>';

    document.getElementById("modal-type").innerHTML = 
        '<h2>' + appointment[1].type + ' Appointment</h2>';

    document.getElementById("modal-time").innerHTML = 
        '<h4>' + appointment[1].location + '</h4>' +
        '<h4>' + appointment[1].time.toLocaleTimeString([], {timeStyle: "short"}) + '</h4><br/>';

    document.getElementById("modal-vaccine-type").innerHTML = "";
    if(appointment[1].vaccine_type) {
        document.getElementById("modal-vaccine-type").innerHTML = 
            '<h5>Vaccine Type:</h5><p class="small grey bold">' + 
            appointment[1].vaccine_type + '</p>';
    }

    document.getElementById("modal-preexisting-conditions").innerHTML = "";
    if (appointment[1].preexisting_conditions) {
        document.getElementById("modal-preexisting-conditions").innerHTML = 
            '<h5>Pre-Existing Conditions:</h5><p class="small grey bold">' + 
            appointment[1].preexisting_conditions + '</p>';
    }

    // Bottom buttons
    let buttons = document.getElementById("modal-buttons")

    // Back button
    buttons.innerHTML = "";
    let a = document.createElement('a');
    a.href="#";
    a.classList.add("link");
    a.classList.add("close");
    a.appendChild(document.createTextNode("Back"));

    a.onclick = function() { closeModal(); }

    buttons.appendChild(a);

    // Book button
    a = document.createElement('a');
    a.href="#";
    a.classList.add("button")
    a.appendChild(document.createTextNode("Book"));

    a.onclick = function() { book(appointment); }

    buttons.appendChild(a);

    // Show modal
    modal.style.display = "flex";
}

// Get appointment results based on input and construct modal / page elements
function getAppointmentResults() {
    // Reset found appointments
    let availableAppointmentList = document.getElementById("available-appointments-list");
    availableAppointmentList.innerHTML = "";

    if (getSelectedDate() == null) return;

    let filteredAppointments = filterByType(appointments);
    filteredAppointments = filterByNextSevenDays(filteredAppointments);
    filteredAppointments = filterAppointments(filteredAppointments, "notId", localStorage.getItem("booked") || "");

    let groupedAppointments = groupAppointments(filteredAppointments, "day")

    // Iterate through next seven days
    for (var i = 0; i <= 7; i++) {
        let appointmentDateSelectBoxValue = getSelectedDate();
        appointmentDateSelectBoxValue.setDate(appointmentDateSelectBoxValue.getDate() + i);

        // Construct section for that day
        let header = document.createElement("h3");
        header.textContent = parseFullDate(appointmentDateSelectBoxValue);
        availableAppointmentList.appendChild(header);

        let list = document.createElement("div");
        availableAppointmentList.appendChild(list);

        // Iterate through each appointment for that day, if they exist
        if (groupedAppointments[parseFullDate(appointmentDateSelectBoxValue)]) {
            groupedAppointments[parseFullDate(appointmentDateSelectBoxValue)].forEach(appointment => {
                // Check if booked
                if (window.localStorage.getItem("booked") &&
                    window.localStorage.getItem("booked").includes(appointment[0])) return;

                // Construct buttons
                let a = document.createElement('a');
                a.href="#";
                a.classList.add("button");
                a.classList.add("small");
                a.appendChild(document.createTextNode(parseTime(appointment[1].time)));

                a.onclick = function() { populateModal(appointment); }

                list.appendChild(a);
            })
        }
        else {
            let p = document.createElement('p');
            p.classList += "grey";
            p.innerText = "No appointments available";

            list.appendChild(p);
        }
    };
}