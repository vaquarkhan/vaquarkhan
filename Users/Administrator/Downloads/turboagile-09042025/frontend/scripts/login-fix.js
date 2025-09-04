// Simple login fix
document.addEventListener('DOMContentLoaded', function() {
    console.log('Login fix loaded');
    
    // Ensure login form works
    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('login-button');
    
    if (loginForm) {
        console.log('Login form found');
        
        // Add backup event listener
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Login form submitted via backup handler');
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            console.log('Credentials:', email, password ? '***' : 'empty');
            
            if (email === 'demo@turboagile.ai' && password === 'password') {
                console.log('Login successful - showing dashboard');
                
                // Hide login, show dashboard
                document.getElementById('login-container').style.display = 'none';
                document.getElementById('dashboard-container').style.display = 'block';
            } else {
                alert('Invalid credentials. Use: demo@turboagile.ai / password');
            }
        });
    } else {
        console.error('Login form not found');
    }
    
    // Also add click handler to login button
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            console.log('Login button clicked');
            // Form submit will handle the rest
        });
    }
});