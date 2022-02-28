var modal = document.getElementById("appointments-modal");

document.getElementById("appointments-modal-button").onclick = function() {
    modal.style.display = "flex";
}
document.getElementsByClassName("close")[0].onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "flex";
    }
} 