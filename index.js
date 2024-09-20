// Prompt the user to enter a username
var client_id = prompt("Enter a username");

// Display the username on the webpage
document.querySelector("#ws-id").textContent = client_id;

// Establish WebSocket connection using the username as the client ID
var ws = new WebSocket(`ws://live-chat-frontend-j8b3.onrender.com/ws/${client_id}`);
var statusElement = document.getElementById('status');
var userList = document.getElementById('userList');

// Store online users
var onlineUsers = {};

// Handle incoming messages from the server
ws.onmessage = function(event) {
    var message = event.data;

    if (message.startsWith("online_users:")) {
        // Handle the online users list
        const users = message.replace("online_users:", "").split(",");
        onlineUsers = {}; // Clear the existing list
        users.forEach(user => {
            if (user) {
                const userId = user.split('#')[1];
                onlineUsers[userId] = true;
            }
        });
        updateOnlineUsers();
    } else {
        // Add message to chat
        addMessageToChat(message);
    }
};

// Function to add a message to the chat area
function addMessageToChat(message) {
    var messages = document.getElementById('messages');
    var messageElement = document.createElement('li');
    var content = document.createTextNode(message);
    messageElement.appendChild(content);
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight; // Auto-scroll to the bottom
}

// Function to update the online users list
function updateOnlineUsers() {
    // Clear the existing list
    userList.innerHTML = '';

    // Add each online user to the list
    for (var id in onlineUsers) {
        var userElement = document.createElement('li');
        userElement.innerHTML = `<span class="online-dot"></span> Client #${id}`;
        userList.appendChild(userElement);
    }
}

// Function to send a message
function sendMessage(event) {
    var input = document.getElementById("messageText");
    if (input.value.trim() !== '') {
        ws.send(input.value);
        input.value = '';
    }
    event.preventDefault();
}

// Function to disconnect the WebSocket
function disconnect() {
    if (ws) {
        ws.close();
        statusElement.textContent = "You have disconnected.";
        document.getElementById('disconnectBtn').disabled = true;
    }
}

// Handle WebSocket close event
ws.onclose = function() {
    statusElement.textContent = "Connection closed.";
    document.getElementById('disconnectBtn').disabled = true;

    // Remove the current client from online users
    delete onlineUsers[client_id];
    updateOnlineUsers();
};
