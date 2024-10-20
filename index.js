let ws;  // Defining the WebSocket globally so it's accessible across functions

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    } else {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const username = payload.username;

            document.querySelector("#ws-id").textContent = username;

            // Initialize WebSocket globally
            ws = new WebSocket(`https://live-chat-app-backend-au8y.onrender.com/ws?token=${token}`);
            const statusElement = document.getElementById('status');
            const userList = document.getElementById('userList');
            const friendList = document.getElementById('friendList'); // Get the friend list element
            let onlineUsers = {};

            // Handle incoming WebSocket messages
            ws.onmessage = function(event) {
                const message = event.data;
                if (message.startsWith("online_users:")) {
                    const users = message.replace("online_users:", "").split(",");
                    onlineUsers = {};
                    users.forEach(user => {
                        if (user) {
                            const userId = user.split('#')[1];
                            onlineUsers[userId] = true;
                        }
                    });
                    updateOnlineUsers();
                } else {
                    addMessageToChat(message);
                }
            };

            // Function to update online users
            function updateOnlineUsers() {
                userList.innerHTML = '';
                for (const id in onlineUsers) {
                    const userElement = document.createElement('li');
                    userElement.innerHTML = `<span class="online-dot"></span> Client #${id}`;
                    userList.appendChild(userElement);
                }
            }

            // Function to add message to chat area
            function addMessageToChat(message) {
                const messages = document.getElementById('messages');
                const messageElement = document.createElement('li');
                messageElement.appendChild(document.createTextNode(message));
                messages.appendChild(messageElement);
                messages.scrollTop = messages.scrollHeight;
            }

            // Function to send a message
            function sendMessage(event) {
                event.preventDefault();
                const input = document.getElementById("messageText");
                if (input.value.trim() !== '') {
                    ws.send(input.value);
                    input.value = '';
                }
            }

            // Attach the sendMessage function to the form submission
            document.querySelector('.chat-form').addEventListener('submit', sendMessage);

            // Fetch and display friends list
            fetchAndDisplayFriendsList();

        } catch (error) {
            // If token is invalid or parsing fails, redirect to login page
            window.location.href = 'login.html';
        }
    }
});

// Function to fetch friends list and update the UI
async function fetchAndDisplayFriendsList() {
    try {
        const response = await fetch("https://live-chat-app-backend-au8y.onrender.com/friends", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching friends: ${response.status} ${response.statusText}`);
        }

        const friends = await response.json();
        const friendList = document.getElementById("friendList");

        // Clear the friend list before adding new content
        friendList.innerHTML = '';

        // Check if friends list is empty
        if (friends.length === 0) {
            friendList.innerHTML = '<li>No friends found.</li>';
            return;
        }

        // Append each friend to the friend list
        friends.forEach(friend => {
            const friendElement = document.createElement('li');
            friendElement.innerHTML = `👤 ${friend.username}`;  // Display friend username
            friendList.appendChild(friendElement);
        });

    } catch (error) {
        console.error("Failed to fetch the friends list:", error);
    }
}

// Function to disconnect the WebSocket
function disconnect() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close(1000, "User disconnected");    
        document.getElementById('status').textContent = "You have disconnected.";
        document.getElementById('disconnectBtn').disabled = true;
    }
}
