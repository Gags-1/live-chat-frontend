function register(event) {
    event.preventDefault();  // Prevent form from reloading the page

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Create the user data to send to the backend
    const userData = {
        username: username,
        email: email,
        password: password
    };

    // Send the user data to the FastAPI endpoint
    fetch('http://127.0.0.1:8000/users/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Registration failed');
        }
        return response.json();
    })
    .then(data => {
        alert('User registered successfully! You can now login.');
        // Optionally, redirect to login page after registration
        window.location.href = 'login.html';
    })
    .catch(error => {
        alert('Error: Could not register user');
    });
}
