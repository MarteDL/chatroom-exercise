class User {
    constructor(username, fontColor, socketId) {
        this.username = username;
        this.fontColor = fontColor;
        this.socketId = socketId;
    }
}

let socket = io.connect();
let username = prompt("What is your username?");
let fontColor = prompt("Which font-color do you want to use?");

let user = new User(username, fontColor, 0);

socket.on('connect', () => {
    user.socketId = socket.id;
})

socket.emit("new user", user);

socket.on("user list", users => {
    document.getElementById('users').innerHTML = "";
    document.getElementById('receiver').innerHTML = "";

    users.forEach(user => {
        // dropdown of users to select for a private message
        let option = document.createElement('option');
        option.value = user.username;
        option.textContent = user.username;
        document.getElementById('receiver').appendChild(option);

        // list of online users
        let listItem = document.createElement('li');
        listItem.id = user.username;
        listItem.classList.add('user');
        listItem.textContent = user.username;
        listItem.style.color = user.fontColor;
        document.getElementById('users').appendChild(listItem);
    })
})

document.getElementById("sendToAll").addEventListener("click", () => {
    let message = document.getElementById("message").value;
    socket.emit('send message to everyone', user, message);
});

document.getElementById("sendToMyself").addEventListener("click", () => {
    let message = document.getElementById("message").value;
    socket.emit('send message to myself', user, message);
});

document.getElementById("sendPrivateMessage").addEventListener("click", () => {
    let message = document.getElementById("privateMessage").value;
    let receiverName = document.getElementById("receiver").value;
    socket.emit('send private message', user.username, receiverName, message);
});

socket.on('display message', (user, message) => {
    let listItem = document.createElement('li');
    listItem.textContent = user.username + ": " + message;
    listItem.style.color = user.fontColor;
    document.getElementById("target").appendChild(listItem);
});

socket.on('display private message of friend', (senderName, message) => {
    document.getElementById('receiver').value = senderName;
    let paragraph = document.createElement('p');
    paragraph.classList.add('messageReceived');
    paragraph.textContent = message;
    document.getElementById("thePrivateMessages").appendChild(paragraph);
})

socket.on('display private message of myself', (senderName, message) => {
    let paragraph = document.createElement('p');
    paragraph.classList.add('messageSent');
    paragraph.textContent = message;
    document.getElementById("thePrivateMessages").appendChild(paragraph);
    document.getElementById('privateMessage').value = "";
})
