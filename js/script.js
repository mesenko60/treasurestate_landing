// Basic script to set the current year in the footer
document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = currentYear;
    }
});

// Waitlist Modal Interactivity
const waitlistModal = document.getElementById('waitlist-modal');
const waitlistClose = document.getElementById('waitlist-modal-close');
const waitlistForm = document.getElementById('waitlist-form');
const waitlistSuccess = document.getElementById('waitlist-success');
const waitlistEmail = document.getElementById('waitlist-email');
const waitlistPlanner = document.getElementById('waitlist-planner');

// Open modal
Array.from(document.querySelectorAll('.waitlist-btn')).forEach(btn => {
    btn.addEventListener('click', function() {
        waitlistModal.style.display = 'block';
        waitlistPlanner.value = btn.getAttribute('data-planner');
        waitlistSuccess.style.display = 'none';
        waitlistForm.style.display = 'block';
        waitlistEmail.value = '';
        waitlistEmail.focus();
    });
});
// Close modal on X
waitlistClose.addEventListener('click', function() {
    waitlistModal.style.display = 'none';
});
// Close modal on outside click
window.addEventListener('click', function(event) {
    if (event.target === waitlistModal) {
        waitlistModal.style.display = 'none';
    }
});
// Handle form submission
waitlistForm.addEventListener('submit', function(e) {
    e.preventDefault();
    waitlistForm.style.display = 'none';
    waitlistSuccess.style.display = 'block';
    // You can add analytics/event tracking here
});

// You can add more JavaScript for interactivity if needed in the future.
