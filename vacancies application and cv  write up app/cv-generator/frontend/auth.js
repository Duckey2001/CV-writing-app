// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Tab switching for login/register
document.querySelectorAll('.login-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab + 'Form').classList.add('active');
        document.getElementById('loginStatus').textContent = '';
        document.getElementById('loginStatus').className = 'status';
    });
});

// Login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const statusDiv = document.getElementById('loginStatus');
    
    statusDiv.className = 'status';
    statusDiv.textContent = 'Logging in...';
    statusDiv.style.display = 'block';
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            localStorage.setItem('token', result.access_token);
            localStorage.setItem('user', JSON.stringify(result.user));
            
            statusDiv.className = 'status success';
            statusDiv.textContent = 'Login successful! Redirecting...';
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            statusDiv.className = 'status error';
            statusDiv.textContent = 'Login failed. Please check your credentials.';
        }
    } catch (error) {
        console.error('Login error:', error);
        statusDiv.className = 'status error';
        statusDiv.textContent = 'Login failed: ' + error.message;
    }
});

// Register form submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const statusDiv = document.getElementById('loginStatus');
    
    if (password !== confirmPassword) {
        statusDiv.className = 'status error';
        statusDiv.textContent = 'Passwords do not match.';
        statusDiv.style.display = 'block';
        return;
    }
    
    if (password.length < 6) {
        statusDiv.className = 'status error';
        statusDiv.textContent = 'Password must be at least 6 characters.';
        statusDiv.style.display = 'block';
        return;
    }
    
    statusDiv.className = 'status';
    statusDiv.textContent = 'Creating account...';
    statusDiv.style.display = 'block';
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            statusDiv.className = 'status success';
            statusDiv.textContent = 'Registration successful! Please login.';
            
            // Switch to login tab
            document.querySelector('[data-tab="login"]').click();
            
            // Pre-fill username
            document.getElementById('loginUsername').value = username;
        } else {
            statusDiv.className = 'status error';
            statusDiv.textContent = result.detail || 'Registration failed.';
        }
    } catch (error) {
        console.error('Registration error:', error);
        statusDiv.className = 'status error';
        statusDiv.textContent = 'Registration failed: ' + error.message;
    }
});
