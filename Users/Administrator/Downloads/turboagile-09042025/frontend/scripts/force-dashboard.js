// Force dashboard to show properly
console.log('Force dashboard script loaded');

window.showDashboardView = function() {
    console.log('=== FORCE DASHBOARD ===');
    
    // Hide login
    const loginContainer = document.getElementById('login-container');
    if (loginContainer) {
        loginContainer.style.display = 'none';
        console.log('Login hidden');
    }
    
    // Show dashboard with force
    const dashboardContainer = document.getElementById('dashboard-container');
    if (dashboardContainer) {
        dashboardContainer.style.display = 'block';
        dashboardContainer.style.visibility = 'visible';
        dashboardContainer.style.opacity = '1';
        dashboardContainer.style.position = 'relative';
        dashboardContainer.style.zIndex = '1';
        console.log('Dashboard forced visible');
        
        // Force main content to show
        const main = dashboardContainer.querySelector('main');
        if (main) {
            main.style.display = 'grid';
            main.style.visibility = 'visible';
            main.style.opacity = '1';
            console.log('Main content forced visible');
        }
        
        // Force all sections to show
        const sections = dashboardContainer.querySelectorAll('.input-section, .connectors-section, .sales-pitch-section, .usp-section');
        sections.forEach((section, index) => {
            section.style.display = 'block';
            section.style.visibility = 'visible';
            section.style.opacity = '1';
            console.log(`Section ${index + 1} forced visible`);
        });
    }
    
    console.log('=== DASHBOARD FORCED ===');
};