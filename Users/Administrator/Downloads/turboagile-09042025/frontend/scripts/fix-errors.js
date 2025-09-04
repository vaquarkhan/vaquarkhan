// Fix JavaScript errors and force login to work
console.log('Fixing errors...');

// Remove problematic scripts
const scripts = document.querySelectorAll('script[src*="main.ts"], script[src*="monaco"]');
scripts.forEach(script => script.remove());

// Force show login
document.addEventListener('DOMContentLoaded', function() {
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    
    if (loginContainer) {
        loginContainer.style.display = 'flex';
        loginContainer.style.visibility = 'visible';
        loginContainer.style.opacity = '1';
    }
    
    if (dashboardContainer) {
        dashboardContainer.style.display = 'none';
    }
});

// Simple login function
window.showDashboardView = function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email === 'demo@turboagile.ai' && password === 'password') {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('dashboard-container').style.display = 'block';
    } else {
        alert('Use: demo@turboagile.ai / password');
    }
};