document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    // Basic validation rules
    if (username === '' || password === '') {
        errorMessage.textContent = 'Please enter both username and password.';
        return;
    }

    // Example of existing users (stored in localStorage for simplicity)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        errorMessage.style.color = 'green';
        errorMessage.textContent = 'Login successful!';

        // Save login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUser', JSON.stringify(user)); // Store logged-in user data

        // Show logout button and hide login form
        document.getElementById('logoutBtn').style.display = 'block';
        document.getElementById('loginForm').style.display = 'none';

        // Redirect to dashboard after 1 second
        setTimeout(() => {
            window.location.href = 'index.html'; // Redirect to your dashboard or old page
        }, 1000);
    } else {
        errorMessage.textContent = 'Invalid username or password.';
    }
});

// Handle Sign Up
document.getElementById('signupBtn').addEventListener('click', function() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    if (username === '' || password === '') {
        errorMessage.textContent = 'Please enter both username and password to sign up.';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if the username already exists
    if (users.some(u => u.username === username)) {
        errorMessage.textContent = 'Username already exists. Please choose a different one.';
        return;
    }

    // Add new user to the list
    users.push({ username, password });

    // Save the new list to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Provide feedback
    errorMessage.style.color = 'green';
    errorMessage.textContent = 'Sign Up successful! You can now log in.';
});

// Handle Logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    // Clear login state
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUser');

    // Hide logout button and show login form again
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';

    // Redirect to login page after logout
    window.location.href = 'index.html'; // Ensure this matches the login page URL
});

// Check if the user is already logged in and show logout button if needed
if (localStorage.getItem('isLoggedIn')) {
    // User is logged in, hide the login form and show logout button
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'block';
}
