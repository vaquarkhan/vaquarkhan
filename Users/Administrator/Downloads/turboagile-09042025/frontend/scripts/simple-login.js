// Simple login function
function showDashboardView() {
    console.log('Login button clicked');
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email === 'demo@turboagile.ai' && password === 'password') {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('dashboard-container').style.display = 'block';
        console.log('Dashboard shown');
    } else {
        alert('Invalid credentials. Use: demo@turboagile.ai / password');
    }
}