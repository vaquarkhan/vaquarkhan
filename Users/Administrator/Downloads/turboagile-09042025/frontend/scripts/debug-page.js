// Debug script to check what's happening
console.log('Debug script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Check if elements exist
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginButton = document.getElementById('login-button');
    
    console.log('Login container:', loginContainer ? 'EXISTS' : 'MISSING');
    console.log('Dashboard container:', dashboardContainer ? 'EXISTS' : 'MISSING');
    console.log('Login button:', loginButton ? 'EXISTS' : 'MISSING');
    
    // Check CSS files
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    console.log('CSS files loaded:', stylesheets.length);
    
    // Check if main CSS is loaded
    const mainCSS = document.querySelector('link[href*="index.css"]');
    console.log('Main CSS:', mainCSS ? 'LOADED' : 'MISSING');
    
    // Force show login container
    if (loginContainer) {
        loginContainer.style.display = 'flex';
        loginContainer.style.visibility = 'visible';
        console.log('Forced login container to show');
    }
    
    // Add click handler
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            console.log('Login button clicked via event listener');
            showDashboard();
        });
    }
});

function showDashboard() {
    console.log('showDashboard called');
    
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    
    if (loginContainer) {
        loginContainer.style.display = 'none';
        console.log('Login hidden');
    }
    
    if (dashboardContainer) {
        dashboardContainer.style.display = 'block';
        console.log('Dashboard shown');
    }
}

// Global function for onclick
window.showDashboardView = showDashboard;