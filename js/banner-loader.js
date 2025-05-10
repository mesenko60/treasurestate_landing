// Banner Loader - Handles loading and initialization of third-party affiliate banners
document.addEventListener('DOMContentLoaded', function() {
    // Function to load the Expedia Affiliate Banner script
    function loadExpediaBanner() {
        // Only proceed if banner containers exist
        const bannerContainers = document.querySelectorAll('.eg-affiliate-banners');
        if (bannerContainers.length === 0) return;
        
        // console.log('Found Expedia banner containers:', bannerContainers.length);
        
        // Check if script is already loaded
        if (document.querySelector('script[src*="eg-affiliate-banners.js"]')) {
            // console.log('Expedia banner script already loaded.');
            return;
        }
        
        // Create and append the script
        const script = document.createElement('script');
        script.src = 'https://affiliates.expediagroup.com/products/banners/assets/eg-affiliate-banners.js';
        script.className = 'eg-affiliate-banners-script';
        script.onload = function() {
            // console.log('Expedia banner script loaded successfully.');
        };
        script.onerror = function() {
            console.error('Failed to load Expedia banner script.');
        };
        
        document.body.appendChild(script);
    }
    
    // Load banner with a slight delay to ensure DOM is fully processed
    setTimeout(loadExpediaBanner, 300);
});
