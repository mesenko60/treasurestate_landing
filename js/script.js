// Basic script to set the current year in the footer
document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = currentYear;
    }
});

// Waitlist Modal Interactivity for Google Form embed
const waitlistModal = document.getElementById('waitlist-modal');
const waitlistClose = document.getElementById('waitlist-modal-close');
const waitlistIframe = document.getElementById('waitlist-iframe');

function encodePlanner(planner) {
    return encodeURIComponent(planner);
}

Array.from(document.querySelectorAll('.waitlist-btn')).forEach(btn => {
    btn.addEventListener('click', function() {
        const planner = btn.getAttribute('data-planner');
        // Set the Google Form iframe src with pre-filled planner
        waitlistIframe.src = `https://docs.google.com/forms/d/e/1FAIpQLSdPTdHpiWtYrOk3bB10CoLFFtgtvWZTsZ2BVleAWIveISkDTQ/viewform?usp=pp_url&entry.13122347=${encodePlanner(planner)}`;
        waitlistModal.style.display = 'block';
    });
});
waitlistClose.addEventListener('click', function() {
    waitlistModal.style.display = 'none';
    waitlistIframe.src = '';
});
window.addEventListener('click', function(event) {
    if (event.target === waitlistModal) {
        waitlistModal.style.display = 'none';
        waitlistIframe.src = '';
    }
});

// Track clicks on waitlist buttons in GA4
if (window.gtag) {
  document.querySelectorAll('.waitlist-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      gtag('event', 'waitlist_click', {
        'event_category': 'engagement',
        'event_label': btn.textContent.trim(),
        'planner': btn.href.includes('entry.13122347=') 
          ? decodeURIComponent(btn.href.split('entry.13122347=')[1].replace(/\+/g, ' ')) 
          : ''
      });
    });
  });
}

// You can add more JavaScript for interactivity if needed in the future.
