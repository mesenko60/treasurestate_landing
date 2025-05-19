// Basic script to set the current year in the footer
document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = currentYear;
    }
});

// Robust includeHTML: waits for target element before inserting HTML
function includeHTML(id, file) {
    fetch(file)
      .then(response => response.text())
      .then(data => {
        waitForElement('#' + id, 3000).then(el => {
          el.innerHTML = data;
        });
      });
}

// Helper: Wait for an element to exist in the DOM
function waitForElement(selector, timeout = 2000) {
    return new Promise((resolve, reject) => {
        const interval = 50;
        let elapsed = 0;
        const check = () => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);
            elapsed += interval;
            if (elapsed >= timeout) return reject();
            setTimeout(check, interval);
        };
        check();
    });
}

// Run scripts inside a dynamically included element
function runScriptsInElement(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const scripts = el.querySelectorAll('script');
    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        if (oldScript.src) {
            newScript.src = oldScript.src;
        } else {
            newScript.textContent = oldScript.textContent;
        }
        // Copy attributes
        for (const attr of oldScript.attributes) {
            newScript.setAttribute(attr.name, attr.value);
        }
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

// Set hero content after include loads
function setHeroContent(options) {
    return new Promise((resolve) => {
        const hero = document.querySelector('#site-hero .hero-section');
        if (hero) {
            updateHeroContent(hero, options);
            resolve();
        } else {
            waitForElement('#site-hero .hero-section').then(hero => {
                updateHeroContent(hero, options);
                resolve();
            }).catch(() => {
                console.warn('Hero section not found after timeout');
                resolve();
            });
        }
    });
}

// Helper function to update hero content
function updateHeroContent(hero, options) {
    if (!hero) return;
    
    const h1 = hero.querySelector('h1');
    const p = hero.querySelector('p');
    const img = hero.querySelector('img');
    
    // Only update if the element exists and the option is provided
    if (h1 && options.title) h1.textContent = options.title;
    if (p && options.subtitle) p.textContent = options.subtitle;
    
    // For the image, we'll use a new Image() to preload it
    if (img && (options.image || options.alt)) {
        // If we have a new image to load, preload it first
        if (options.image) {
            const newImg = new Image();
            newImg.onload = function() {
                // Only update the src once the image is loaded
                img.src = options.image;
                if (options.alt) img.alt = options.alt;
            };
            newImg.src = options.image;
        } else if (options.alt) {
            // If only the alt text is being updated
            img.alt = options.alt;
        }
    }
}


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
