// Banner Loader - Handles loading and initialization of third-party affiliate banners
// Enhanced Expedia Affiliate Banner Loader
console.log('Banner loader script loaded');

// Track initialization state
let isInitializing = false;
let isScriptLoaded = false;

// Function to initialize the banners
function initializeExpediaBanners() {
    try {
        // Prevent multiple initializations
        if (isInitializing) {
            console.log('Banner initialization already in progress');
            return;
        }
        
        isInitializing = true;
        console.log('Initializing Expedia banners...');
        
        // Check if the banner container exists
        const bannerContainers = document.querySelectorAll('.eg-affiliate-banners');
        if (bannerContainers.length === 0) {
            console.warn('No banner containers found with class "eg-affiliate-banners"');
            isInitializing = false;
            return;
        }
        
        console.log(`Found ${bannerContainers.length} banner container(s)`);
        
        // Check if the Expedia banner script is already loaded
        if (typeof window.egAffiliateBanners === 'function') {
            console.log('egAffiliateBanners function found, initializing...');
            try {
                window.egAffiliateBanners();
                console.log('Expedia banners initialized successfully');
            } catch (e) {
                console.error('Error calling egAffiliateBanners:', e);
                showBannerError('Error initializing hotel deals. Please try refreshing the page.');
            }
            isInitializing = false;
        } else if (!isScriptLoaded) {
            console.warn('egAffiliateBanners function not found, loading script...');
            loadExpediaScript();
        } else {
            console.log('Script is already loaded but egAffiliateBanners is not available');
            showBannerError('Failed to load hotel deals. Please try refreshing the page.');
            isInitializing = false;
        }
    } catch (error) {
        console.error('Error initializing Expedia banners:', error);
        showBannerError('Error loading hotel deals. Please try refreshing the page.');
        isInitializing = false;
    }
}

// Function to load the Expedia script
function loadExpediaScript() {
    // Check if script is already in the DOM
    if (document.querySelector('script[src*="eg-affiliate-banners.js"]')) {
        console.log('Expedia banner script already loading...');
        return;
    }
    
    console.log('Loading Expedia banner script...');
    isScriptLoaded = true;
    
    const script = document.createElement('script');
    script.src = 'https://affiliates.expediagroup.com/products/banners/assets/eg-affiliate-banners.js';
    script.className = 'eg-affiliate-banners-script';
    script.async = true;
    
    // Set a timeout to check if the script loaded
    const loadTimeout = setTimeout(() => {
        if (!window.egAffiliateBanners) {
            console.warn('Expedia banner script load timed out');
            showBannerError('Hotel deals are taking longer than expected to load.');
            isInitializing = false;
        }
    }, 10000); // 10 second timeout
    
    script.onload = function() {
        clearTimeout(loadTimeout);
        console.log('Expedia banner script loaded');
        
        // Multiple attempts to initialize as the script might need time to set up
        let attempts = 0;
        const maxAttempts = 10;
        const checkInterval = setInterval(() => {
            attempts++;
            if (typeof window.egAffiliateBanners === 'function') {
                clearInterval(checkInterval);
                console.log('egAffiliateBanners function found after', attempts, 'attempts');
                try {
                    window.egAffiliateBanners();
                    console.log('Expedia banners initialized after script load');
                } catch (e) {
                    console.error('Error initializing banners after load:', e);
                    showBannerError('Error initializing hotel deals.');
                }
                isInitializing = false;
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.error('egAffiliateBanners function not found after', maxAttempts, 'attempts');
                showBannerError('Failed to load hotel deals. Please try again later.');
                isInitializing = false;
            }
        }, 200); // Check every 200ms
    };
    
    script.onerror = function() {
        clearTimeout(loadTimeout);
        console.error('Failed to load Expedia banner script');
        showBannerError('Failed to load hotel deals. Please check your connection and refresh the page.');
        isInitializing = false;
        isScriptLoaded = false;
    };
    
    // Add the script to the head instead of body
    (document.head || document.getElementsByTagName('head')[0]).appendChild(script);
}

// Function to show an error message in the banner container
function showBannerError(message) {
    const bannerContainers = document.querySelectorAll('.eg-affiliate-banners');
    if (bannerContainers.length > 0) {
        bannerContainers.forEach(container => {
            container.innerHTML = `
                <div style="
                    padding: 20px;
                    background: #fff3cd;
                    border: 1px solid #ffeeba;
                    border-radius: 4px;
                    color: #856404;
                    text-align: center;
                ">
                    <p style="margin: 0 0 10px 0;">${message}</p>
                    <button onclick="window.location.reload()" style="
                        background: #f8d7da;
                        border: 1px solid #f5c6cb;
                        color: #721c24;
                        padding: 5px 15px;
                        border-radius: 4px;
                        cursor: pointer;
                    ">
                        Refresh Page
                    </button>
                </div>`;
        });
    }
}

// Initialize when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM fully loaded, initializing banners...');
        setTimeout(initializeExpediaBanners, 300);
    });
} else {
    // DOMContentLoaded has already fired
    console.log('DOM already loaded, initializing banners immediately...');
    setTimeout(initializeExpediaBanners, 300);
}

// Also try to initialize if the script is loaded after DOMContentLoaded
setTimeout(initializeExpediaBanners, 1000);

// Manual initialization function for testing
window.manualInitBanners = function() {
    console.log('Manually initializing banners...');
    isInitializing = false;
    isScriptLoaded = false;
    initializeExpediaBanners();
    return 'Banner initialization triggered. Check console for details.';
};

// Export for testing
console.log('Banner loader initialized. Call manualInitBanners() to manually trigger banner loading.');
