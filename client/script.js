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

let userOfThisSocket = new User(username, fontColor, 0);

socket.on('connect', () => {
    userOfThisSocket.socketId = socket.id;
})

socket.emit("new user", userOfThisSocket);

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
        listItem.classList.add('person');
        listItem.textContent = user.username;
        listItem.style.color = user.fontColor;
        document.getElementById('users').appendChild(listItem);
    })
})

document.getElementById("sendToAll").addEventListener("click", () => {
    let message = document.getElementById("message").value;
    document.getElementById("message").value = "";
    socket.emit('send message to everyone', userOfThisSocket, message);
});

document.getElementById("sendToMyself").addEventListener("click", () => {
    let message = document.getElementById("message").value;
    document.getElementById("message").value = "";
    socket.emit('send message to myself', userOfThisSocket, message);
});

document.getElementById("sendPrivateMessage").addEventListener("click", () => {
    let message = document.getElementById("privateMessage").value;
    let receiverName = document.getElementById("receiver").value;
    socket.emit('send private message', userOfThisSocket.username, receiverName, message);
});

socket.on('display message', (user, message) => {

    console.log(userOfThisSocket.username)
    console.log('message from '+user.username);

    // creating our list element and divs inside of it
    let listItem = document.createElement('li');
    let userDiv = document.createElement('div');
    let nameDiv = document.createElement('div');
    let avatar = document.createElement('img');
    let messageDiv = document.createElement('div');

    //filling our divs with the right content and classes
    userDiv.classList.add('chat-avatar');
    nameDiv.textContent = user.username;
    nameDiv.classList.add('chat-name');
    avatar.src = "";
    messageDiv.textContent = message;
    messageDiv.classList.add('chat-text');

    // attaching our elements to our messagebox and giving it the right or left class
    userDiv.appendChild(avatar);
    userDiv.appendChild(nameDiv);

    if(user.username === userOfThisSocket.username) {
        listItem.classList.add('chat-right');
        listItem.appendChild(messageDiv);
        listItem.appendChild(userDiv);
    }
    else {
        listItem.classList.add('chat-left');
        listItem.appendChild(userDiv);
        listItem.appendChild(messageDiv);
    }

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
