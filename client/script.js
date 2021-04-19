let socket = io.connect();

document.getElementById("sendToAll").addEventListener("click", () => {
    let message = document.getElementById("message").value;
    socket.emit('send message to everyone', message);
});

socket.on('display message', message => {
    let listItem = document.createElement('li');
    listItem.textContent = message;
    document.getElementById("target").appendChild(listItem);
});

document.getElementById("sendToMyself").addEventListener("click", () => {
    let message = document.getElementById("message").value;
    socket.emit('send message to myself', message);
});
