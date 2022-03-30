window.onload = function() {
    getAppointmentResults();
    getCountUpcoming();
};

// Cancel an upcoming appointment
function cancel(appointment) {
    let booked = window.localStorage.getItem('booked') || "";
    window.localStorage.setItem('booked', booked.replace(appointment[0] + ' ', ''));
    closeModal();
    // Update results
    getAppointmentResults();
    // Update Navbar
    getCountUpcoming();
}

// When the user clicks anywhere outside of the modal, close the modal
let modal = document.getElementById("appointments-modal");
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
    // Get current date
    let now = new Date();

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

    document.getElementById("modal-results").innerHTML = "";
    if (appointment[1].result && appointment[1].time < now) {
        document.getElementById("modal-results").innerHTML = 
            '<h5>Result:</h5><p class="small grey bold">' + 
            appointment[1].result + '</p>';
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

    // Cancel button
    if (appointment[1].time > now) {
        a = document.createElement('a');
        a.href="#";
        a.classList.add("button")
        a.appendChild(document.createTextNode("Cancel"));

        a.onclick = function() { cancel(appointment); }

        buttons.appendChild(a);
    }

    // Show modal
    modal.style.display = "flex";
}

// Get appointment results based on input and construct modal / page elements
function getAppointmentResults() {
    // Reset found appointments
    let upcomingAppointmentsList = document.getElementById("upcoming-appointments-list");
    upcomingAppointmentsList.innerHTML = "";
    let noUpcoming = document.createElement('p');
    noUpcoming.classList = "grey";
    noUpcoming.innerText = "No appointments";
    upcomingAppointmentsList.appendChild(noUpcoming);

    let pastAppointmentsList = document.getElementById("past-appointments-list");
    pastAppointmentsList.innerHTML = "";
    let noPast = document.createElement('p');
    noPast.classList = "grey";
    noPast.innerText = "No appointments";
    pastAppointmentsList.appendChild(noPast);

    let filteredAppointments = filterAppointments(appointments, "id", localStorage.getItem("booked") || "");
    
    // Iterate through each booked appointment
    Object.entries(filteredAppointments).forEach(appointment => {
        // Construct buttons
        let a = document.createElement('a');
        a.href="#";
        a.classList.add("button");
        a.classList.add("small");
        a.appendChild(document.createTextNode(
            appointment[1].type + 
            " " +
            parseTime(appointment[1].time)));

        a.onclick = function() { populateModal(appointment); }

        // Place button into correct section
        let now = new Date();
        if (appointment[1].time > now) {
            if (noUpcoming.parentElement === upcomingAppointmentsList) {
                upcomingAppointmentsList.removeChild(noUpcoming);
            }
            upcomingAppointmentsList.appendChild(a);
        }
        else {
            if (noPast.parentElement === pastAppointmentsList) {
                pastAppointmentsList.removeChild(noPast);
            }
            pastAppointmentsList.appendChild(a);
        }
    });
}