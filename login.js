function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    fetch('wss://live-chat-app-backend-au8y.onrender.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
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

        // Redirect to admin panel
        window.location.href = 'admin_panel.html';
    })
    .catch(error => {
        alert('Invalid username or password');
    });
}
