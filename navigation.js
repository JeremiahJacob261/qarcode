/**
 * Navigation System with Animated Slide Transitions
 * Handles all page navigation with directional sliding animations
 */

// Configuration for page navigation with direction info
const navigationMap = {
    // Home page icons
    'home-history-icon': { url: '/history', direction: 'right' },
    'home-card-scan': { url: '/scan', direction: 'right' },
    'home-card-generate': { url: '/generate', direction: 'right' },
    'home-nav-add': { url: '/generate', direction: 'right' },
    
    // Generate page icons
    'gen-history-icon': { url: '/history', direction: 'right' },
    'gen-primary-btn': { url: '/result', direction: 'right' },
    
    // History page back navigation
    'hist-logo': { url: '/home', direction: 'left' },
    
    // Result page back navigation
    'res-history-icon': { url: '/home', direction: 'left' },
    
    // Onboarding navigation
    'onb-primary-btn': { url: '/home', direction: 'right' },
    
    // Scan page back button
    'cam-back-btn': { url: '/home', direction: 'left' },
};

// Check if user is first time visitor
function isFirstTimeUser() {
    return !localStorage.getItem('qarcode_visited');
}

// Mark user as visited
function markUserAsVisited() {
    localStorage.setItem('qarcode_visited', 'true');
}

// Function to navigate with slide animation
function navigateWithAnimation(element, targetUrl, direction = 'right') {
    // Add animation to the clicked element
    if (element) {
        const animatedElement = element.closest('svg') || 
                               element.closest('button') || 
                               element.closest('[class*="card"]') ||
                               element;
        
        if (animatedElement) {
            animatedElement.classList.add('animated-icon');
        }
    }
    
    // Slide out page in the specified direction
    const slideClass = direction === 'right' ? 'page-exit-right' : 'page-exit-left';
    document.body.classList.add(slideClass);
    
    // Navigate after animation
    setTimeout(() => {
        window.location.href = targetUrl;
    }, 500);
}

// Initialize navigation
function initializeNavigation() {
    // Index page (splash) - auto-navigate after 3 seconds
    // Check if we're on index page
    if (document.querySelector('.splash-logo-container')) {
        window.addEventListener('load', function () {
            setTimeout(function () {
                let nextPage = isFirstTimeUser() ? '/onboarding' : '/home';
                markUserAsVisited();
                window.location.href = nextPage;
            }, 3000);
        });
        return; // Exit early for index page
    }
    
    // Home page - History icon
    const historyIcon = document.querySelector('.home-history-icon');
    if (historyIcon) {
        historyIcon.addEventListener('click', function() {
            navigateWithAnimation(historyIcon, '/history', 'right');
        });
        historyIcon.style.cursor = 'pointer';
    }
    
    // Home page - SCAN card (now goes to scan page, not onboarding)
    const scanCard = document.querySelector('.home-card-scan');
    if (scanCard) {
        scanCard.addEventListener('click', function() {
            navigateWithAnimation(scanCard, '/scan', 'right');
        });
        scanCard.style.cursor = 'pointer';
    }
    
    // Home page - GENERATE card
    const generateCard = document.querySelector('.home-card-generate');
    if (generateCard) {
        generateCard.addEventListener('click', function() {
            navigateWithAnimation(generateCard, '/generate', 'right');
        });
        generateCard.style.cursor = 'pointer';
    }
    
    // Home page - Add button (bottom nav)
    const navAdd = document.querySelector('.home-nav-add');
    if (navAdd) {
        navAdd.addEventListener('click', function() {
            navigateWithAnimation(navAdd, '/generate', 'right');
        });
        navAdd.style.cursor = 'pointer';
    }
    
    // Home page - QR Code button (bottom nav)
    const navActive = document.querySelector('.home-nav-active');
    if (navActive) {
        navActive.addEventListener('click', function() {
            navigateWithAnimation(navActive, '/scan', 'right');
        });
        navActive.style.cursor = 'pointer';
    }
    
    // Generate page - History icon
    const genHistoryIcon = document.querySelector('.gen-history-icon');
    if (genHistoryIcon) {
        genHistoryIcon.addEventListener('click', function() {
            navigateWithAnimation(genHistoryIcon, '/history', 'right');
        });
        genHistoryIcon.style.cursor = 'pointer';
    }
    
    // Generate page - Generate button
    const genPrimaryBtn = document.querySelector('.gen-primary-btn');
    if (genPrimaryBtn) {
        genPrimaryBtn.addEventListener('click', function() {
            navigateWithAnimation(genPrimaryBtn, '/result', 'right');
        });
    }
    
    // Onboarding - Next button
    const onbPrimaryBtn = document.querySelector('.onb-primary-btn');
    if (onbPrimaryBtn) {
        onbPrimaryBtn.addEventListener('click', function() {
            navigateWithAnimation(onbPrimaryBtn, '/home', 'right');
        });
    }
    
    // History page - Logo (back button)
    const histLogo = document.querySelector('.hist-logo');
    if (histLogo) {
        histLogo.style.cursor = 'pointer';
        histLogo.addEventListener('click', function() {
            navigateWithAnimation(histLogo, '/home', 'left');
        });
    }
    
    // Result page - History icon (back to home)
    const resHistoryIcon = document.querySelector('.res-history-icon');
    if (resHistoryIcon) {
        resHistoryIcon.addEventListener('click', function() {
            navigateWithAnimation(resHistoryIcon, '/home', 'left');
        });
        resHistoryIcon.style.cursor = 'pointer';
    }
    
    // Scan page - Back button
    const camBackBtn = document.querySelector('.cam-btn-large');
    if (camBackBtn) {
        camBackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigateWithAnimation(camBackBtn, '/home', 'left');
        });
    }
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNavigation);
} else {
    initializeNavigation();
}
