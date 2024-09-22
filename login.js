function login(event) {
    event.preventDefault();  // Prevent form from reloading the page

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    // Fetching from FastAPI login endpoint
    fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        const token = data.access_token;
        // Store the token in localStorage
        localStorage.setItem('token', token);

        // Redirect to the index page after successful login
        window.location.href = 'index.html';
    })
    .catch(error => {
        alert('Invalid username or password');
    });
}
